const { askGroq, GROQ_CONFIG_LOG } = require('../services/groqService');

const sanitizeReply = (s) =>
  String(s || '')
    .replace(/NaN/g, '0.00')
    .replace(/undefined/g, 'unavailable')
    .replace(/Infinity/g, 'very high');

const USER_FACING_ERROR =
  'The AI assistant is temporarily unavailable. Please try again in a moment.';

const chat = async (req, res) => {
  try {
    const {
      message = '',
      monthlyIncome = 0,
      monthlyExpenses = 0,
      totalEMI = 0,
      loans = [],
      language = 'en-US',
    } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'message is required and must be a string' });
    }

    const safeIncome = Number(monthlyIncome) || 0;
    const safeExpenses = Number(monthlyExpenses) || 0;
    const safeEMI = Number(totalEMI) || 0;
    const safeLoans = Array.isArray(loans) ? loans : [];

    console.log('[AI /chat] User question:', message);
    console.log('[AI /chat] Response language:', language);
    console.log('[AI /chat] Groq config:', GROQ_CONFIG_LOG());

    const systemPrompt = `You are a helpful, concise financial assistant. Answer accurately. Context (if relevant): monthlyIncome=${safeIncome}, monthlyExpenses=${safeExpenses}, totalEMI=${safeEMI}, loans=${JSON.stringify(safeLoans).slice(0, 2000)}. Do not reveal API keys.`;

    const groq = await askGroq({
      system: systemPrompt,
      user: message,
      maxTokens: 1000,
      language,
    });

    if (!groq.ok) {
      console.error('[AI /chat] Groq error response:', groq.error, groq.details);
      const payload = {
        success: false,
        message: USER_FACING_ERROR,
        error: groq.error,
      };
      console.log('[AI /chat] Response sent to frontend:', JSON.stringify(payload));
      return res.status(groq.status >= 400 && groq.status < 600 ? groq.status : 503).json(payload);
    }

    const finalReply = sanitizeReply(groq.text);
    const payload = { success: true, data: { reply: finalReply } };
    console.log('[AI /chat] Response sent to frontend:', finalReply.slice(0, 2000));
    return res.json(payload);
  } catch (error) {
    console.error('[AI /chat] Unexpected error:', error);
    res.status(500).json({ success: false, message: USER_FACING_ERROR });
  }
};

module.exports = { chat };
