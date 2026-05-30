const { debtHealthScore, loanPriority } = require('../utils/finance');
const { askGroq, GROQ_CONFIG_LOG } = require('../services/groqService');

const USER_FACING_ERROR =
  'The AI assistant is temporarily unavailable. Please try again in a moment.';

const chat = async (req, res) => {
  try {
    const {
      monthlyIncome = 0,
      monthlyExpenses = 0,
      totalEMI = 0,
      stressScore: passedScore = null,
      loans = [],
      message = '',
      language = 'en-US',
    } = req.body || {};

    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const safeIncome = Number(monthlyIncome) || 0;
    const safeExpenses = Number(monthlyExpenses) || 0;
    const safeEMI = Number(totalEMI) || 0;
    const safeLoans = Array.isArray(loans) ? loans : [];

    if (safeIncome === 0) {
      return res.json({
        success: true,
        data: {
          reply:
            'Income data is not set yet. Please add your financial information on the Dashboard, then ask again.',
          stressScore: 0,
          category: 'Unknown',
          priority: null,
          timestamp: new Date().toISOString(),
        },
      });
    }

    let stressScore;
    let category;
    if (passedScore !== null && Number.isFinite(passedScore)) {
      stressScore = Number(passedScore);
      category =
        stressScore >= 70 ? 'Low Stress' : stressScore >= 40 ? 'Moderate Stress' : 'High Stress';
    } else {
      const scoreData = debtHealthScore(safeIncome, safeExpenses, safeLoans);
      stressScore = scoreData.score;
      category = scoreData.category;
    }
    const priority = loanPriority(safeLoans);

    console.log('[Assistant /chat] User question:', message);
    console.log('[Assistant /chat] Groq config:', GROQ_CONFIG_LOG());

    const systemPrompt = `You are a concise financial assistant for a loan-stress analyzer. Use context when relevant. Context: monthlyIncome=${safeIncome}, monthlyExpenses=${safeExpenses}, totalEMI=${safeEMI}, stressScore=${stressScore}, loans=${JSON.stringify(safeLoans).slice(0, 2000)}. Reply in the requested language when specified.`;

    const groq = await askGroq({
      system: systemPrompt,
      user: message,
      maxTokens: 800,
      language,
    });

    if (!groq.ok) {
      console.error('[Assistant /chat] Groq error response:', groq.error, groq.details);
      const payload = { success: false, message: USER_FACING_ERROR, error: groq.error };
      console.log('[Assistant /chat] Response sent to frontend:', JSON.stringify(payload));
      return res.status(groq.status >= 400 && groq.status < 600 ? groq.status : 503).json(payload);
    }

    const finalReply = String(groq.text)
      .replace(/NaN/g, '0.00')
      .replace(/undefined/g, 'unavailable')
      .replace(/Infinity/g, 'very high');

    const payload = {
      success: true,
      data: {
        reply: finalReply,
        stressScore: Number.isFinite(stressScore) ? stressScore : 0,
        category: category || 'Unknown',
        priority: priority || null,
        timestamp: new Date().toISOString(),
      },
    };
    console.log('[Assistant /chat] Response sent to frontend:', finalReply.slice(0, 2000));
    return res.json(payload);
  } catch (error) {
    console.error('[Assistant /chat] Unexpected error:', error);
    res.status(500).json({ success: false, message: USER_FACING_ERROR });
  }
};

module.exports = { chat };
