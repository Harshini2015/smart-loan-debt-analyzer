const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const EmergencyWalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  targetAmount: { type: Number, default: 0 },
  // Cached from User profile so runway can be calculated without an extra lookup
  monthlyExpenses: { type: Number, default: 0 },
  monthlyIncome: { type: Number, default: 0 },
  transactions: [WalletTransactionSchema],
  isActive: { type: Boolean, default: true },
  savingMode: { type: String, enum: ['aggressive', 'moderate', 'gentle'], default: 'gentle' },
  totalSaved: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyWallet', EmergencyWalletSchema);
