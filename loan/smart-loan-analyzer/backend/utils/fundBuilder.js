/**
 * Round up a transaction amount based on the saving mode.
 * @param {number} transactionAmount
 * @param {'gentle'|'moderate'|'aggressive'} mode
 * @returns {{saving:number,rounded:number}}
 */
function calculateRoundupSaving(transactionAmount, mode) {
  const roundBase = mode === 'aggressive' ? 100 : mode === 'moderate' ? 50 : 10;
  const rounded = Math.ceil(transactionAmount / roundBase) * roundBase;
  const saving = Math.max(0, rounded - transactionAmount);
  return { saving, rounded };
}

/**
 * Analyze past transactions and return safe saving windows.
 * @param {Array} transactions
 */
async function findSavingWindow(transactions) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const spendingByDay = {};

  transactions.forEach((tx) => {
    const day = days[new Date(tx.timestamp).getDay()];
    spendingByDay[day] = (spendingByDay[day] || 0) + tx.amount;
  });

  const sorted = Object.entries(spendingByDay).sort((a, b) => a[1] - b[1]);
  const safeDays = sorted.slice(0, 3).map(([day]) => day);
  const averageSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0) / Math.max(1, transactions.length);
  const recommendedAmount = Math.round(Math.min(500, averageSpending * 0.05));

  return { safeDays, recommendedAmount };
}

module.exports = {
  calculateRoundupSaving,
  findSavingWindow,
};
