const User = require('../models/User');
const Loan = require('../models/Loan');
const EmergencyWallet = require('../models/EmergencyWallet');
const { emi } = require('../utils/finance');

// GET /api/dashboard (protected)
// Returns complete financial snapshot from MongoDB
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch all ACTIVE loans for this user
    const loans = await Loan.find({ userId, status: { $in: ['ACTIVE', 'Active', 'active'] } })
      .sort({ createdAt: -1 })
      .lean();

    // Get financial data from user profile
    const monthlyIncome = Number(user.monthlyIncome || 0);
    const monthlyExpenses = Number(user.monthlyExpenses || user.monthlyExpense || 0);
    const disposableIncome = Math.max(0, monthlyIncome - monthlyExpenses);

    // Calculate EMI for each loan using standard EMI formula
    const loansWithEmi = loans.map(l => ({
      ...l,
      _emi: emi(
        Number(l.amount || 0),
        Number(l.interestRate || 0),
        Number(l.tenureMonths || l.duration || 0)
      )
    }));

    // Total EMI = sum of all individual loan EMIs
    const totalEMI = Number(
      loansWithEmi.reduce((sum, l) => sum + (l._emi || 0), 0).toFixed(2)
    );

    // ─────────────────────────────────────────────────────────
    //  DEBT STRESS SCORE — DTI (Debt-to-Income) based formula
    //  Formula: debtStress = (totalEMI / monthlyIncome) × 100
    //
    //  Risk Categories:
    //    0–20%   → Healthy
    //    20–35%  → Moderate
    //    35–50%  → High
    //    >50%    → Critical
    // ─────────────────────────────────────────────────────────
    const dtiPercent = monthlyIncome > 0
      ? parseFloat(((totalEMI / monthlyIncome) * 100).toFixed(2))
      : 0;

    let stressCategory;
    if (dtiPercent <= 20) stressCategory = 'Healthy';
    else if (dtiPercent <= 35) stressCategory = 'Moderate';
    else if (dtiPercent <= 50) stressCategory = 'High';
    else stressCategory = 'Critical';

    // Debug logs to verify calculation pipeline
    console.log('─────────────── Dashboard DTI Calculation ───────────────');
    console.log(`[DTI] Monthly Income     : ₹${monthlyIncome.toLocaleString('en-IN')}`);
    console.log(`[DTI] Monthly Expenses   : ₹${monthlyExpenses.toLocaleString('en-IN')}`);
    console.log(`[DTI] Disposable Income  : ₹${disposableIncome.toLocaleString('en-IN')}`);
    console.log(`[DTI] Active Loans Count : ${loans.length}`);
    console.log(`[DTI] Total EMI          : ₹${totalEMI.toLocaleString('en-IN')}`);
    console.log(`[DTI] DTI %              : ${dtiPercent}%`);
    console.log(`[DTI] Stress Category    : ${stressCategory}`);
    console.log('──────────────────────────────────────────────────────────');

    // Format recent loans for display
    const recentLoans = loans.slice(0, 5).map(l => ({
      id: l._id,
      loanType: l.type || l.name || 'Loan',
      type: l.type || l.name || 'Loan',
      amount: l.amount,
      interestRate: l.interestRate,
      tenureMonths: l.tenureMonths || l.duration || 0,
      emi: emi(
        Number(l.amount || 0),
        Number(l.interestRate || 0),
        Number(l.tenureMonths || l.duration || 0)
      ),
      createdAt: l.createdAt,
      status: l.status || 'ACTIVE'
    }));

    // Stress trend: DTI % per month (same formula, consistent units)
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const stressTrend = months.map(month => ({
      month,
      stress: dtiPercent  // All months show current DTI until historical data exists
    }));

    // ─── Emergency Fund health summary ───────────────────────────────────────
    let emergencyFund = null;
    try {
      const wallet = await EmergencyWallet.findOne({ userId });
      if (wallet) {
        const efExpenses = wallet.monthlyExpenses || monthlyExpenses || 1;
        const runwayMonths = wallet.balance > 0
          ? parseFloat((wallet.balance / efExpenses).toFixed(1))
          : 0;
        const percentage = wallet.targetAmount > 0
          ? Math.min(100, Math.round((wallet.balance / wallet.targetAmount) * 100))
          : 0;
        emergencyFund = {
          balance:      wallet.balance,
          targetAmount: wallet.targetAmount,
          runwayMonths,
          percentage,
          savingMode:   wallet.savingMode,
        };
      }
    } catch (efErr) {
      console.warn('[Dashboard] Emergency fund fetch skipped:', efErr.message);
    }

    // Return single source of truth
    return res.json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpenses,
        disposableIncome,
        totalEMI,
        dtiPercent,
        stressScore: dtiPercent,          // DTI % (0–100 scale, real value)
        stressCategory,                   // Healthy / Moderate / High / Critical
        emiRatio: monthlyIncome > 0
          ? parseFloat((totalEMI / monthlyIncome).toFixed(4))
          : 0,
        recentLoans,
        stressTrend,
        loansCount: loans.length,
        onboardingCompleted: user.onboardingCompleted || false,
        emergencyFund,
      }
    });
  } catch (e) {
    console.error('Dashboard controller error:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Alias for getDashboard
exports.getDashboardData = exports.getDashboard;

// PUT /api/dashboard/financial-info
exports.updateFinancialInfo = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { monthlyIncome, monthlyExpenses } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { monthlyIncome, monthlyExpenses },
      { new: true }
    ).select('-password');

    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /api/dashboard/simulation
exports.updateSimulation = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Simulation updated' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
