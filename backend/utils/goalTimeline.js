const { askClaude } = require('../services/claudeService');

/**
 * Calculate goal timeline by using Claude if available.
 * @param {Object} goal
 * @param {Array} recentExpenses
 */
async function calculateGoalTimeline(goal, recentExpenses) {
  const categories = goal.linkedExpenseCategories.length ? goal.linkedExpenseCategories.join(', ') : 'spending';
  const expenseAmount = recentExpenses
    .filter((expense) => goal.linkedExpenseCategories.includes(expense.category))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpense = Math.round(expenseAmount / 3 || 0);
  const monthlySaving = goal.monthlySavingCapacity || 0;
  const prompt = `User wants to save ₹${goal.targetAmount} for ${goal.goalName}. They save ₹${monthlySaving} per month but spend ₹${monthlyExpense} on ${categories}. Give: days_to_goal (integer), motivational_message (1 sentence), biggest_blocker (expense category name). Return only JSON.`;

  try {
    const aiText = await askClaude({
      system: 'You are a financial AI assistant. Always respond in the exact format requested.',
      user: prompt,
      maxTokens: 180,
    });
    return JSON.parse(aiText);
  } catch (error) {
    return {
      days_to_goal: Math.max(1, Math.round((goal.targetAmount - goal.currentSaved) / (monthlySaving / 30 || 1))),
      motivational_message: `Consistency will turn small savings into ${goal.goalName}.`,
      biggest_blocker: categories || 'spending',
    };
  }
}

module.exports = {
  calculateGoalTimeline,
};
