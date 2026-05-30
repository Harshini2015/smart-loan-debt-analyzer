const mongoose = require('mongoose');

const GoalTimelineSchema = new mongoose.Schema({
  userId:                  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalName:                { type: String, required: true, trim: true },
  targetAmount:            { type: Number, required: true, min: 1 },
  currentSaved:            { type: Number, default: 0, min: 0 },
  monthlySavingCapacity:   { type: Number, default: 0, min: 0 },
  targetDate:              { type: Date },
  linkedExpenseCategories: [{ type: String }],
  emoji:                   { type: String, default: '🎯' },
  category: {
    type: String,
    enum: ['vehicle', 'travel', 'gadget', 'education', 'emergency', 'home', 'health', 'other'],
    default: 'other',
  },
  isCompleted:  { type: Boolean, default: false },
  completedAt:  { type: Date },
}, { timestamps: true });

GoalTimelineSchema.index({ userId: 1 });

module.exports = mongoose.model('GoalTimeline', GoalTimelineSchema);
