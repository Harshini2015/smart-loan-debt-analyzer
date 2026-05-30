const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyGroup', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['parent', 'child', 'elder'], required: true },
  nickname: { type: String },
  monthlyLimit: { type: Number, default: 0 },
});

FamilyMemberSchema.index({ userId: 1, groupId: 1 });

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
