const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_BASE = (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = `${GROQ_BASE}/chat/completions`;

function GROQ_CONFIG_LOG() {
  const key = GROQ_API_KEY;
  return {
    endpoint: GROQ_ENDPOINT,
    model: GROQ_MODEL,
    keyPresent: Boolean(key),
    keyPrefix: key ? `${key.slice(0, 7)}...` : '(none)',
    keyLooksValid: key.startsWith('gsk_'),
  };
}

function logGroqError(label, err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  console.error(`[Groq] ${label}`, {
    status: status || 'n/a',
    message: err?.message,
    response: data || null,
  });
}

function languageInstruction(language) {
  const map = {
    'en-US': 'You MUST write your entire reply in English only.',
    'kn-IN': 'You MUST write your entire reply in Kannada (ಕನ್ನಡ) only. Do not use English except for numbers and proper nouns.',
    'hi-IN': 'You MUST write your entire reply in Hindi (हिंदी) only. Do not use English except for numbers and proper nouns.',
  };
  return map[language] || map['en-US'];
}

/**
 * Call Groq chat completions. Returns { ok, text } or { ok: false, error, status, details }.
 */
async function askGroq({ system = '', user = '', maxTokens = 1000, language = 'en-US' }) {
  if (!GROQ_API_KEY) {
    console.error('[Groq] GROQ_API_KEY is missing. Add a key from https://console.groq.com/keys to backend/.env');
    return {
      ok: false,
      text: null,
      error: 'GROQ_API_KEY is not configured',
      status: 503,
      details: { code: 'missing_api_key' },
    };
  }

  if (!GROQ_API_KEY.startsWith('gsk_')) {
    console.error(
      '[Groq] Invalid key type: Groq requires a key starting with "gsk_". xAI or other provider keys will not work on api.groq.com.'
    );
    return {
      ok: false,
      text: null,
      error: 'GROQ_API_KEY is not a valid Groq key (expected gsk_ prefix)',
      status: 503,
      details: { code: 'invalid_key_type' },
    };
  }

  const langRule = languageInstruction(language);
  const systemContent = system ? `${system}\n\n${langRule}` : langRule;

  const messages = [
    { role: 'system', content: systemContent },
    { role: 'user', content: user },
  ];

  const payload = {
    model: GROQ_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature: 0.2,
  };

  console.log('[Groq] User question:', user);
  console.log('[Groq] Request payload:', JSON.stringify(payload));
  console.log('[Groq] Endpoint / model / auth:', GROQ_ENDPOINT, GROQ_MODEL, 'Bearer <redacted>');

  try {
    const res = await axios.post(GROQ_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      timeout: 30000,
    });

    console.log('[Groq] Raw response:', JSON.stringify(res.data));

    const choice = res?.data?.choices?.[0];
    const text =
      choice?.message?.content ||
      choice?.text ||
      (choice?.delta && choice.delta.content) ||
      null;

    if (!text || !String(text).trim()) {
      console.error('[Groq] Empty content in response');
      return {
        ok: false,
        text: null,
        error: 'Groq returned an empty response',
        status: 502,
        details: res.data,
      };
    }

    return { ok: true, text: String(text).trim(), error: null, status: 200, details: null };
  } catch (err) {
    logGroqError('API request failed', err);
    const status = err?.response?.status || 502;
    const details = err?.response?.data || { message: err.message };
    const apiMessage =
      details?.error?.message || details?.message || err.message || 'Groq request failed';
    return {
      ok: false,
      text: null,
      error: apiMessage,
      status,
      details,
    };
  }
}

module.exports = { askGroq, GROQ_CONFIG_LOG };
