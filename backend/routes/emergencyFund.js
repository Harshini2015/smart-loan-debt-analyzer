const express = require('express');
const protect = require('../middleware/authMiddleware');
const EmergencyWallet = require('../models/EmergencyWallet');
const User = require('../models/User');
const { askGroq } = require('../services/groqService');

const router = express.Router();

// ─── Helper: auto-create or fetch wallet seeded from user profile ──────────────
async function getOrCreateWallet(userId) {
  let wallet = await EmergencyWallet.findOne({ userId });
  if (!wallet) {
    const user = await User.findById(userId).select('monthlyIncome monthlyExpenses savings');
    const monthlyExpenses = Number(user?.monthlyExpenses || 0);
    const monthlyIncome   = Number(user?.monthlyIncome   || 0);
    const currentSavings  = Number(user?.savings         || 0);

    wallet = await EmergencyWallet.create({
      userId,
      balance: currentSavings,
      totalSaved: currentSavings,
      targetAmount: monthlyExpenses * 6,   // 6-month emergency fund rule
      monthlyExpenses,
      monthlyIncome,
      savingMode: 'gentle',
      isActive: true,
      transactions: currentSavings > 0
        ? [{ amount: currentSavings, type: 'credit', reason: 'Initial savings transfer' }]
        : [],
    });
  }
  return wallet;
}

// ─── GET /status ──────────────────────────────────────────────────────────────
// Auto-creates wallet if not found. Returns enriched status object.
router.get('/status', protect, async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    const monthlyExpenses = wallet.monthlyExpenses || 1;
    const runwayMonths = wallet.balance > 0
      ? parseFloat((wallet.balance / monthlyExpenses).toFixed(1))
      : 0;
    const percentage = wallet.targetAmount > 0
      ? Math.min(100, Math.round((wallet.balance / wallet.targetAmount) * 100))
      : 0;

    return res.json({
      wallet,
      runwayMonths,
      percentage,
    });
  } catch (error) {
    console.error('Emergency fund status error:', error);
    return res.status(500).json({ message: 'Unable to fetch emergency fund status' });
  }
});

// ─── POST /setup ──────────────────────────────────────────────────────────────
// Configure monthly income, expenses, savings and saving mode.
// Also syncs these values back to the User profile.
router.post('/setup', protect, async (req, res) => {
  try {
    const { monthlyIncome, monthlyExpenses, currentSavings, savingMode } = req.body;

    // Derive target: 6-month emergency fund
    const expenses     = Number(monthlyExpenses || 0);
    const income       = Number(monthlyIncome   || 0);
    const savings      = Number(currentSavings  || 0);
    const targetAmount = expenses * 6;

    // Update User profile so other modules stay consistent
    if (income > 0 || expenses > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(income   > 0 && { monthlyIncome:   income }),
        ...(expenses > 0 && { monthlyExpenses: expenses }),
        ...(savings  > 0 && { savings:         savings }),
      });
    }

    const wallet = await EmergencyWallet.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        targetAmount,
        monthlyExpenses: expenses,
        monthlyIncome:   income,
        savingMode: savingMode || 'gentle',
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Seed balance from currentSavings only if wallet was just created (balance still 0)
    if (wallet.balance === 0 && savings > 0) {
      wallet.balance    = savings;
      wallet.totalSaved = savings;
      wallet.transactions.push({ amount: savings, type: 'credit', reason: 'Initial savings transfer' });
      await wallet.save();
    }

    const runwayMonths = expenses > 0
      ? parseFloat((wallet.balance / expenses).toFixed(1))
      : 0;
    const percentage = targetAmount > 0
      ? Math.min(100, Math.round((wallet.balance / targetAmount) * 100))
      : 0;

    window?.dispatchEvent; // no-op in Node; notifications fired on FE
    return res.json({ wallet, runwayMonths, percentage });
  } catch (error) {
    console.error('Emergency fund setup error:', error);
    return res.status(500).json({ message: 'Unable to set up emergency fund' });
  }
});

// ─── POST /deposit ────────────────────────────────────────────────────────────
// Add money to the emergency fund. NEW endpoint.
router.post('/deposit', protect, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid deposit amount' });
    }

    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance    += depositAmount;
    wallet.totalSaved += depositAmount;
    wallet.transactions.push({
      amount: depositAmount,
      type: 'credit',
      reason: reason || 'Manual deposit',
      date: new Date(),
    });
    await wallet.save();

    const monthlyExpenses = wallet.monthlyExpenses || 1;
    const runwayMonths = parseFloat((wallet.balance / monthlyExpenses).toFixed(1));
    const percentage   = wallet.targetAmount > 0
      ? Math.min(100, Math.round((wallet.balance / wallet.targetAmount) * 100))
      : 0;

    return res.json({ wallet, runwayMonths, percentage });
  } catch (error) {
    console.error('Emergency fund deposit error:', error);
    return res.status(500).json({ message: 'Unable to deposit to emergency fund' });
  }
});

// ─── POST /withdraw ───────────────────────────────────────────────────────────
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid withdrawal amount' });
    }

    const wallet = await EmergencyWallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Emergency wallet not found. Please set up your fund first.' });
    }
    if (wallet.balance < withdrawAmount) {
      return res.status(400).json({ message: `Insufficient balance. Available: ₹${wallet.balance.toLocaleString('en-IN')}` });
    }

    wallet.balance -= withdrawAmount;
    wallet.transactions.push({
      amount: withdrawAmount,
      type: 'debit',
      reason: reason || 'Emergency withdrawal',
      date: new Date(),
    });
    await wallet.save();

    const monthlyExpenses = wallet.monthlyExpenses || 1;
    const runwayMonths = wallet.balance > 0
      ? parseFloat((wallet.balance / monthlyExpenses).toFixed(1))
      : 0;
    const percentage = wallet.targetAmount > 0
      ? Math.min(100, Math.round((wallet.balance / wallet.targetAmount) * 100))
      : 0;

    return res.json({ wallet, runwayMonths, percentage });
  } catch (error) {
    console.error('Emergency fund withdraw error:', error);
    return res.status(500).json({ message: 'Unable to withdraw from emergency fund' });
  }
});

// ─── GET /transactions ────────────────────────────────────────────────────────
// Returns paginated transaction history (most recent first)
router.get('/transactions', protect, async (req, res) => {
  try {
    const wallet = await EmergencyWallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.json({ transactions: [] });
    }

    const limit  = parseInt(req.query.limit)  || 20;
    const offset = parseInt(req.query.offset) || 0;

    const all         = [...wallet.transactions].reverse(); // newest first
    const paginated   = all.slice(offset, offset + limit);
    const totalCount  = all.length;

    return res.json({ transactions: paginated, totalCount });
  } catch (error) {
    console.error('Emergency fund transactions error:', error);
    return res.status(500).json({ message: 'Unable to fetch transaction history' });
  }
});

// ─── POST /calculate-savings (Groq AI based suggestion) ─────────────────
router.post('/calculate-savings', protect, async (req, res) => {
  try {
    const { income, spendingPattern, balance } = req.body;
    if (!income || !spendingPattern || balance === undefined) {
      return res.status(400).json({ message: 'Income, spending pattern, and balance are required' });
    }

    const prompt = `Given this user's income of ₹${income}, spending pattern of "${spendingPattern}", and current balance of ₹${balance}, what is a safe micro-transfer amount to move to emergency savings today without the user noticing? Return only a number in INR.`;

    const groq = await askGroq({
      system: 'You are a financial AI assistant. Always respond in the exact format requested.',
      user: prompt,
      maxTokens: 50,
    });

    if (!groq.ok) {
      console.error('[Fund] Groq calculate-savings failed:', groq.error, groq.details);
      return res.status(503).json({
        message: 'AI savings suggestion is temporarily unavailable. Please try again later.',
        error: groq.error,
      });
    }

    const parsedAmount = parseInt(String(groq.text).trim(), 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(502).json({ message: 'AI returned an invalid savings amount. Please try again.' });
    }

    return res.json({ suggestedAmount: parsedAmount });
  } catch (error) {
    console.error('Calculate savings error:', error);
    return res.status(500).json({ message: 'Unable to calculate suggested savings amount' });
  }
});

module.exports = router;
