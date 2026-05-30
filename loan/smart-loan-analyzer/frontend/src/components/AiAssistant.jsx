import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { groqService } from '../services/groqService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, RefreshCw, MessageCircle } from 'lucide-react';

const GROQ_LANG = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN' };

const AI_COPY = {
  en: {
    welcome:
      "Hello! I'm your AI financial assistant. Ask about loans, EMI, stress score, or how to reduce debt.",
    languageSwitched: 'Language set to English. I will reply in English.',
    placeholder: 'Ask about loans, EMI, stress score…',
    thinking: 'Thinking…',
    prompts: [
      { text: 'Analyze my financial health', short: 'Health' },
      { text: 'How can I reduce debt stress?', short: 'Reduce stress' },
      { text: 'Which loan should I close first?', short: 'Payoff order' },
      { text: 'What is EMI?', short: 'EMI' },
    ],
  },
  kn: {
    welcome:
      'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಹಣಕಾಸು ಸಹಾಯಕ. ಸಾಲ, EMI, ಒತ್ತಡ ಸ್ಕೋರ್ ಅಥವಾ ಸಾಲ ಕಡಿಮೆ ಮಾಡುವ ಬಗ್ಗೆ ಕೇಳಿ.',
    languageSwitched: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಾನು ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸುತ್ತೇನೆ.',
    placeholder: 'ಸಾಲ, EMI, ಒತ್ತಡ ಸ್ಕೋರ್ ಬಗ್ಗೆ ಕೇಳಿ…',
    thinking: 'ಯೋಚಿಸುತ್ತಿದೆ…',
    prompts: [
      { text: 'ನನ್ನ ಹಣಕಾಸು ಆರೋಗ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಿ', short: 'ಆರೋಗ್ಯ' },
      { text: 'ಸಾಲದ ಒತ್ತಡವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುವುದು?', short: 'ಒತ್ತಡ' },
      { text: 'ಯಾವ ಸಾಲವನ್ನು ಮೊದಲು ಮುಚ್ಚಬೇಕು?', short: 'ಮುಚ್ಚುವ ಕ್ರಮ' },
      { text: 'EMI ಎಂದರೇನು?', short: 'EMI' },
    ],
  },
  hi: {
    welcome:
      'नमस्ते! मैं आपका AI वित्तीय सहायक हूँ। ऋण, EMI, तनाव स्कोर या कर्ज कम करने के बारे में पूछें।',
    languageSwitched: 'भाषा हिंदी में सेट की गई। मैं हिंदी में उत्तर दूँगा।',
    placeholder: 'ऋण, EMI, तनाव स्कोर के बारे में पूछें…',
    thinking: 'सोच रहा हूँ…',
    prompts: [
      { text: 'मेरे वित्तीय स्वास्थ्य का विश्लेषण करें', short: 'स्वास्थ्य' },
      { text: 'ऋण का तनाव कैसे कम करें?', short: 'तनाव' },
      { text: 'पहले कौन सा ऋण बंद करूँ?', short: 'भुगतान क्रम' },
      { text: 'EMI क्या है?', short: 'EMI' },
    ],
  },
};

const AiAssistant = () => {
  const { dashboardData, fetchDashboardData } = useDashboard();
  const { language: uiLanguage, setLanguage } = useLanguage();

  const copy = AI_COPY[uiLanguage] || AI_COPY.en;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: copy.welcome }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const prevLangRef = useRef(uiLanguage);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-ai-assistant', handleToggle);
    return () => window.removeEventListener('toggle-ai-assistant', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // When language changes, notify in chat and sync welcome if still the only message
  useEffect(() => {
    if (prevLangRef.current === uiLanguage) return;
    const prev = prevLangRef.current;
    prevLangRef.current = uiLanguage;
    const nextCopy = AI_COPY[uiLanguage] || AI_COPY.en;

    setMessages((prevMsgs) => {
      const onlyWelcome =
        prevMsgs.length === 1 &&
        prevMsgs[0].role === 'assistant' &&
        Object.values(AI_COPY).some((c) => c.welcome === prevMsgs[0].text);

      if (onlyWelcome) {
        return [{ role: 'assistant', text: nextCopy.welcome }];
      }
      if (prev !== uiLanguage) {
        return [...prevMsgs, { role: 'assistant', text: nextCopy.languageSwitched }];
      }
      return prevMsgs;
    });
  }, [uiLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageChange = (e) => {
    const next = e.target.value;
    setLanguage(next);
    window.dispatchEvent(new CustomEvent('language-change', { detail: next }));
  };

  const sendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const groqLanguage = GROQ_LANG[uiLanguage] || 'en-US';

    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      await fetchDashboardData();
      const context = {
        monthlyIncome: dashboardData?.monthlyIncome || 0,
        monthlyExpenses: dashboardData?.monthlyExpenses || 0,
        totalEMI: dashboardData?.totalEMI || 0,
        stressScore: dashboardData?.stressScore || 0,
        loans: dashboardData?.recentLoans || [],
        language: groqLanguage,
      };

      console.log('[AI Assistant] Sending with language:', groqLanguage);

      const result = await groqService.chat(textToSend, context);

      if (!result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: result.reply || 'The AI assistant is temporarily unavailable. Please try again.',
          },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: result.reply }]);
    } catch (err) {
      console.error('AI chat failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            err?.response?.data?.message ||
            'The AI assistant is temporarily unavailable. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(
      /^\s*-\s+(.*?)$/gm,
      '<li class="ml-4 list-disc text-slate-700 py-0.5">$1</li>'
    );
    formatted = formatted.replace(/\n/g, '<br />');
    return (
      <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-[60] flex h-14 items-center gap-2 rounded-full bg-indigo-600 pl-4 pr-5 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-colors sm:bottom-6 sm:right-6"
            aria-label="Open AI assistant"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Ask AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-16 right-0 z-[60] flex h-[calc(100vh-4rem)] w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[400px]"
              role="dialog"
              aria-label="AI Financial Assistant"
            >
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900">AI Assistant</h3>
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {uiLanguage === 'kn' ? 'ಕನ್ನಡ' : uiLanguage === 'hi' ? 'हिंदी' : 'English'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={uiLanguage}
                    onChange={handleLanguageChange}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium"
                    aria-label="Chat language"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="kn">ಕನ್ನಡ</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close assistant"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto bg-slate-50/80 p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'border border-slate-200/80 bg-white text-slate-800 rounded-bl-md'
                      }`}
                    >
                      {renderFormattedText(m.text)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500">
                      <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                      {copy.thinking}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-2">
                <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
                  {copy.prompts.map((p, idx) => (
                    <button
                      key={`${uiLanguage}-${idx}`}
                      type="button"
                      onClick={(e) => sendMessage(e, p.text)}
                      className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {p.short}
                    </button>
                  ))}
                </div>
                <form onSubmit={(e) => sendMessage(e)} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={copy.placeholder}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
