const mongoose = require('mongoose');

const TransactionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  merchant: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: { type: String },
  deviceId: { type: String },
  flagged: { type: Boolean, default: false },
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
});

TransactionHistorySchema.index({ userId: 1, timestamp: -1 });
TransactionHistorySchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('TransactionHistory', TransactionHistorySchema);
