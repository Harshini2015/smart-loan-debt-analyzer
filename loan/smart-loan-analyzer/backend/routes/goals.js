const express = require('express');
const protect = require('../middleware/authMiddleware');
const GoalTimeline = require('../models/GoalTimeline');

const router = express.Router();

// ─── Helper: derive estimated completion date ─────────────────────────────────
function calcCompletionDate(targetAmount, currentSaved, monthlyContrib) {
  const remaining = Math.max(0, targetAmount - currentSaved);
  if (!monthlyContrib || monthlyContrib <= 0) return null;
  const monthsNeeded = Math.ceil(remaining / monthlyContrib);
  const date = new Date();
  date.setMonth(date.getMonth() + monthsNeeded);
  return date;
}

// ─── POST /create ─────────────────────────────────────────────────────────────
router.post('/create', protect, async (req, res) => {
  try {
    const {
      goalName, targetAmount, monthlySavingCapacity, currentSaved,
      targetDate, category, emoji,
    } = req.body;

    if (!goalName || !goalName.trim()) {
      return res.status(400).json({ success: false, message: 'Goal name is required' });
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      return res.status(400).json({ success: false, message: 'Target amount must be greater than 0' });
    }
    if (!monthlySavingCapacity || Number(monthlySavingCapacity) <= 0) {
      return res.status(400).json({ success: false, message: 'Monthly contribution must be greater than 0' });
    }

    const saved     = Number(currentSaved)          || 0;
    const contrib   = Number(monthlySavingCapacity);
    const target    = Number(targetAmount);

    const estimatedCompletion = calcCompletionDate(target, saved, contrib);

    const goal = await GoalTimeline.create({
      userId:                req.user._id,
      goalName:              goalName.trim(),
      targetAmount:          target,
      currentSaved:          saved,
      monthlySavingCapacity: contrib,
      targetDate:            targetDate ? new Date(targetDate) : estimatedCompletion,
      category:              category || 'other',
      emoji:                 emoji    || '🎯',
    });

    console.log(`[Goals] Created goal "${goal.goalName}" for user ${req.user._id}`);
    return res.status(201).json({ success: true, goal });
  } catch (error) {
    console.error('[Goals] Create error:', error);
    return res.status(500).json({ success: false, message: 'Unable to create goal' });
  }
});

// ─── GET /list  (replaces the buggy /:userId/timeline) ───────────────────────
router.get('/list', protect, async (req, res) => {
  try {
    const goals = await GoalTimeline.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const enriched = goals.map((goal) => {
      const remaining      = Math.max(0, goal.targetAmount - goal.currentSaved);
      const monthsNeeded   = goal.monthlySavingCapacity > 0
        ? Math.ceil(remaining / goal.monthlySavingCapacity)
        : null;
      const estimatedDate  = goal.targetDate || calcCompletionDate(goal.targetAmount, goal.currentSaved, goal.monthlySavingCapacity);
      const percentage     = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));

      return {
        ...goal.toObject(),
        remaining,
        monthsNeeded,
        estimatedDate,
        percentage,
      };
    });

    console.log(`[Goals] Fetched ${goals.length} goals for user ${req.user._id}`);
    return res.json({ success: true, goals: enriched });
  } catch (error) {
    console.error('[Goals] List error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch goals' });
  }
});

// ─── GET /:userId/timeline  (legacy — kept for backward compat) ───────────────
router.get('/:userId/timeline', protect, async (req, res) => {
  try {
    // Allow both exact match and string comparison for ObjectId
    if (req.user._id.toString() !== req.params.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const goals = await GoalTimeline.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const enriched = goals.map((goal) => {
      const remaining    = Math.max(0, goal.targetAmount - goal.currentSaved);
      const estimatedDate = calcCompletionDate(goal.targetAmount, goal.currentSaved, goal.monthlySavingCapacity);
      const percentage   = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
      return {
        ...goal.toObject(),
        remaining,
        estimatedDate,
        percentage,
        projected: {
          achieveByDate:       estimatedDate,
          motivationalMessage: remaining === 0
            ? `🎉 Goal "${goal.goalName}" is complete!`
            : `Keep going — only ₹${remaining.toLocaleString('en-IN')} left to reach your ${goal.goalName} goal!`,
          biggestBlocker: 'consistent monthly saving',
        },
      };
    });

    return res.json({ success: true, goals: enriched });
  } catch (error) {
    console.error('[Goals] Timeline error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load goals timeline' });
  }
});

// ─── PUT /:goalId  (edit goal) ────────────────────────────────────────────────
router.put('/:goalId', protect, async (req, res) => {
  try {
    const goal = await GoalTimeline.findOne({ _id: req.params.goalId, userId: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    const {
      goalName, targetAmount, monthlySavingCapacity,
      currentSaved, targetDate, category, emoji,
    } = req.body;

    if (goalName            !== undefined) goal.goalName              = goalName.trim();
    if (targetAmount        !== undefined) goal.targetAmount          = Number(targetAmount);
    if (monthlySavingCapacity !== undefined) goal.monthlySavingCapacity = Number(monthlySavingCapacity);
    if (currentSaved        !== undefined) goal.currentSaved          = Number(currentSaved);
    if (targetDate          !== undefined) goal.targetDate            = new Date(targetDate);
    if (category            !== undefined) goal.category              = category;
    if (emoji               !== undefined) goal.emoji                 = emoji;

    await goal.save();
    console.log(`[Goals] Updated goal "${goal.goalName}" for user ${req.user._id}`);

    const remaining    = Math.max(0, goal.targetAmount - goal.currentSaved);
    const percentage   = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
    const estimatedDate = calcCompletionDate(goal.targetAmount, goal.currentSaved, goal.monthlySavingCapacity);

    return res.json({ success: true, goal: { ...goal.toObject(), remaining, percentage, estimatedDate } });
  } catch (error) {
    console.error('[Goals] Update error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update goal' });
  }
});

// ─── PATCH /:goalId/complete  (mark complete) ─────────────────────────────────
router.patch('/:goalId/complete', protect, async (req, res) => {
  try {
    const goal = await GoalTimeline.findOne({ _id: req.params.goalId, userId: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    goal.isCompleted  = true;
    goal.completedAt  = new Date();
    goal.currentSaved = goal.targetAmount; // Mark as fully saved
    await goal.save();

    console.log(`[Goals] Marked goal "${goal.goalName}" as complete`);
    return res.json({ success: true, goal });
  } catch (error) {
    console.error('[Goals] Complete error:', error);
    return res.status(500).json({ success: false, message: 'Unable to mark goal as complete' });
  }
});

// ─── DELETE /:goalId ──────────────────────────────────────────────────────────
router.delete('/:goalId', protect, async (req, res) => {
  try {
    const result = await GoalTimeline.findOneAndDelete({ _id: req.params.goalId, userId: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Goal not found' });

    console.log(`[Goals] Deleted goal "${result.goalName}" for user ${req.user._id}`);
    return res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('[Goals] Delete error:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete goal' });
  }
});

module.exports = router;
