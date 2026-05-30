/**
 * Centralized Stress Calculation Utility
 * Used across all controllers for consistent stress metrics
 *
 * Formula: DTI = (totalLoanEMI / monthlyIncome) × 100
 *
 * Risk Categories (DTI %):
 *   0–20%   → HEALTHY
 *   20–35%  → MODERATE
 *   35–50%  → HIGH
 *   >50%    → CRITICAL
 */

const calculateStressMetrics = (monthlyIncome, monthlyExpense, totalLoanEMI) => {
  // Debug log for tracing
  console.log('[StressCalc] Input — Income:', monthlyIncome, '| Expense:', monthlyExpense, '| EMI:', totalLoanEMI);

  if (!monthlyIncome || monthlyIncome <= 0) {
    console.log('[StressCalc] No income → returning CRITICAL defaults');
    return {
      debtRatio: 0,
      dtiPercent: 0,
      stressLevel: 'CRITICAL',
      riskScore: 100,
      stressCategory: 'Critical',
    };
  }

  // DTI = (totalEMI / monthlyIncome) × 100  ← canonical formula
  const dtiPercent = parseFloat(((totalLoanEMI / monthlyIncome) * 100).toFixed(2));
  const debtRatio = parseFloat((totalLoanEMI / monthlyIncome).toFixed(4));

  // Determine Stress Level based on DTI %
  let stressLevel, stressCategory;
  if (dtiPercent <= 20) {
    stressLevel = 'HEALTHY';
    stressCategory = 'Healthy';
  } else if (dtiPercent <= 35) {
    stressLevel = 'MODERATE';
    stressCategory = 'Moderate';
  } else if (dtiPercent <= 50) {
    stressLevel = 'HIGH';
    stressCategory = 'High';
  } else {
    stressLevel = 'CRITICAL';
    stressCategory = 'Critical';
  }

  // Risk Score (0–100): linear scale where 100% DTI = 100 risk
  // Capped at 100 for display purposes
  const riskScore = Math.min(100, Math.round(dtiPercent * 2)); // 50% DTI = 100 risk

  console.log(`[StressCalc] DTI: ${dtiPercent}% | Level: ${stressLevel} | RiskScore: ${riskScore}`);

  return {
    debtRatio,
    dtiPercent,
    stressLevel,
    stressCategory,
    riskScore: Math.min(riskScore, 100),
  };
};

const getStressLevelColor = (stressLevel) => {
  switch (stressLevel) {
    case 'HEALTHY':
      return '#22c55e';   // green-500
    case 'MODERATE':
      return '#f59e0b';   // amber-500
    case 'HIGH':
      return '#f97316';   // orange-500
    case 'CRITICAL':
      return '#ef4444';   // red-500
    // Legacy aliases
    case 'SAFE':
      return '#22c55e';
    case 'RISKY':
      return '#f59e0b';
    case 'DANGEROUS':
      return '#ef4444';
    default:
      return '#6b7280';   // gray-500
  }
};

const getStressSuggestion = (dtiPercent, stressLevel, monthlyIncome) => {
  const suggestions = [];

  if (stressLevel === 'HEALTHY') {
    const maxBorrowable = monthlyIncome * 0.20 - (dtiPercent / 100) * monthlyIncome;
    suggestions.push({
      title: '✅ Financial Health Good',
      message: `Your DTI ratio is healthy at ${dtiPercent.toFixed(1)}%. You have room to safely borrow if needed.`,
      priority: 'low',
    });
    suggestions.push({
      title: '💡 Maintain Your Discipline',
      message: 'Continue managing your expenses well. Consider building an emergency fund.',
      priority: 'low',
    });
  } else if (stressLevel === 'MODERATE') {
    suggestions.push({
      title: '⚠️ Monitor Carefully',
      message: `Your DTI is at ${dtiPercent.toFixed(1)}% (20–35% range). Avoid taking new loans.`,
      priority: 'medium',
    });
    suggestions.push({
      title: '🎯 Action Items',
      message: 'Control expenses, increase income if possible, or consider debt consolidation.',
      priority: 'medium',
    });
  } else if (stressLevel === 'HIGH') {
    suggestions.push({
      title: '🔶 High Debt Load',
      message: `Your DTI is at ${dtiPercent.toFixed(1)}% (35–50% range). Reduce debt urgently.`,
      priority: 'high',
    });
    suggestions.push({
      title: '🎯 Priority Actions',
      message: 'Focus on closing high-interest loans first. Cut non-essential spending.',
      priority: 'high',
    });
  } else {
    suggestions.push({
      title: '🚨 Critical Situation',
      message: `Your DTI is ${dtiPercent.toFixed(1)}% (>50%). This requires immediate action.`,
      priority: 'critical',
    });
    suggestions.push({
      title: '💰 Urgent Recommendations',
      message:
        'Focus on closing high-interest loans, reduce non-essential spending, increase income, or seek financial counseling.',
      priority: 'critical',
    });
  }

  return suggestions;
};

module.exports = {
  calculateStressMetrics,
  getStressLevelColor,
  getStressSuggestion,
};
