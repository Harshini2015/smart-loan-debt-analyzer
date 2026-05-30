const mongoose = require('mongoose');

const GroupTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  reason: String,
  date: { type: Date, default: Date.now },
});

const GoalSchema = new mongoose.Schema({
  name: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  deadline: Date,
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const FamilyMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['parent', 'child', 'elder'], default: 'child' },
  nickname: String,
  monthlyLimit: { type: Number, default: 0 },
});

const FamilyGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [FamilyMemberSchema],
  sharedWallet: {
    balance: { type: Number, default: 0 },
    transactions: [GroupTransactionSchema],
    requests: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        reason: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        requestedAt: { type: Date, default: Date.now },
        resolvedAt: Date,
      },
    ],
  },
  goals: [GoalSchema],
  createdAt: { type: Date, default: Date.now },
});

FamilyGroupSchema.index({ 'members.userId': 1 });
FamilyGroupSchema.index({ adminUserId: 1 });

module.exports = mongoose.model('FamilyGroup', FamilyGroupSchema);
