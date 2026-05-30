import { aiService } from './api';

/**
 * Client wrapper for Groq via backend proxy (/api/ai/chat).
 * No local or template fallbacks — only Groq responses or explicit errors.
 */
export const groqService = {
  async chat(message, context = {}) {
    const payload = {
      message,
      monthlyIncome: context.monthlyIncome || 0,
      monthlyExpenses: context.monthlyExpenses || 0,
      totalEMI: context.totalEMI || 0,
      stressScore: context.stressScore || 0,
      loans: context.loans || [],
      language: context.language || 'en-US',
    };

    console.log('[Groq frontend] User question:', message);
    console.log('[Groq frontend] Request payload:', payload);

    try {
      const response = await aiService.chat(payload);
      console.log('[Groq frontend] Raw response:', response?.data);

      const reply = response?.data?.data?.reply;
      if (!reply || typeof reply !== 'string') {
        const errMsg =
          response?.data?.message || 'No reply received from the AI service.';
        console.error('[Groq frontend] Missing reply in success response:', response?.data);
        return { success: false, reply: errMsg, error: errMsg };
      }

      const sanitized = reply.replace(/NaN/g, '0.00').replace(/undefined/g, 'unavailable');
      console.log('[Groq frontend] Reply shown in UI:', sanitized.slice(0, 1000));

      return {
        success: true,
        reply: sanitized,
        stressScore: response?.data?.data?.stressScore || 0,
        category: response?.data?.data?.category || 'Unknown',
      };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'The AI assistant is temporarily unavailable. Please try again.';
      console.error('[Groq frontend] Error response:', error?.response?.data || error?.message);
      return { success: false, reply: errMsg, error: errMsg };
    }
  },

  async getFinancialHealthSummary(context) {
    const prompt = `Provide a short professional financial health summary. Stress score: ${context.stressScore}%`;
    return this.chat(prompt, context);
  },
};

export default groqService;
