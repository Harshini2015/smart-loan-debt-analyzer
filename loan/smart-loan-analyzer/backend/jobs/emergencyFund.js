const cron = require('node-cron');
const EmergencyWallet = require('../models/EmergencyWallet');
const TransactionHistory = require('../models/TransactionHistory');
const User = require('../models/User');
const { calculateRoundupSaving } = require('../utils/fundBuilder');

const runEmergencyFundJob = async () => {
  const { askGroq } = require('../services/groqService');
  try {
    const wallets = await EmergencyWallet.find({ isActive: true });
    for (const wallet of wallets) {
      const user = await User.findById(wallet.userId);
      if (!user) continue;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const transactions = await TransactionHistory.find({
        userId: wallet.userId,
        timestamp: { $gte: startOfDay, $lt: new Date() },
      });

      const todaySaving = transactions.reduce((sum, tx) => {
        const { saving } = calculateRoundupSaving(tx.amount, wallet.savingMode);
        return sum + saving;
      }, 0);

      const spendingPattern = transactions
        .map((tx) => `${tx.category}: ₹${tx.amount}`)
        .join(', ');
      const balance = wallet.balance;
      const income = user.monthlyIncome || 20000;
      const prompt = `Given this user's income, spending pattern, and balance, what is a safe micro-transfer amount to move to emergency savings today without the user noticing? Return only a number in INR.`;
      let estimated = todaySaving;
      const groq = await askGroq({
        system: 'You are a concise financial assistant. Return only a number in INR.',
        user: `${prompt}

Income: ₹${income}
Balance: ₹${balance}
Today spending pattern: ${spendingPattern || 'none'}`,
        maxTokens: 80,
      });
      if (groq.ok) {
        const numericMatch = String(groq.text).match(/\d+(?:\.\d+)?/);
        if (numericMatch) {
          estimated = Math.max(0, Number(numericMatch[0]));
        }
      } else {
        console.warn('[EmergencyFund] Groq job skipped AI estimate:', groq.error);
      }

      const transferAmount = Math.min(estimated, todaySaving || estimated);
      if (transferAmount <= 0) continue;

      wallet.balance += transferAmount;
      wallet.totalSaved += transferAmount;
      wallet.transactions.push({
        amount: transferAmount,
        type: 'credit',
        reason: 'Auto roundup emergency fund transfer',
        date: new Date(),
      });
      await wallet.save();
    }
  } catch (error) {
    console.error('Emergency fund cron job failed:', error);
  }
};

cron.schedule('0 2 * * *', () => {
  console.log('[EmergencyFund] Running nightly roundup job');
  runEmergencyFundJob();
});

module.exports = { runEmergencyFundJob };
