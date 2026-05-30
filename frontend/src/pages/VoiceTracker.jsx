import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
// Voice feature removed — voiceService and VoiceMicButton have been deprecated and removed.
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Cpu,
  Sparkles,
  useEffect(() => {
    // Voice integration has been removed. This page now shows a deprecation notice.
    setHistory([]);
  }, []);
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `🎤 Voice Expense filed successfully: $${parsed.amount} under ${parsed.category}`,
          textKn: `🎤 ಧ್ವನಿ ಮೂಲಕ ಹೊಸ ವೆಚ್ಚ ದಾಖಲಿಸಲಾಗಿದೆ: $${parsed.amount} (${parsed.category})`
        }
      }));

      const res = await voiceService.history();
      setHistory(res.data.logs || []);
      setParsed(null);
      setTranscript('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mic className="w-8 h-8 text-indigo-600 animate-pulse" />
            {t('voiceExpenseTracker')}
          </h1>
          <p className="mt-1 text-slate-500 text-sm font-medium">
            {t('voiceDescExtended')}
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-700">
          <Cpu className="w-3.5 h-3.5" />
          {t('nlpParserActive')}
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Voice Console */}
        <div className="stripe-card bg-white p-6 md:p-8 md:col-span-2 flex flex-col justify-between space-y-6">
            <div className="text-center py-4">
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                Voice features have been removed from this application. You can use the AI Assistant (chat) in the app for natural language queries.
              </div>
            </div>

          {/* Skeletons on loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-400 animate-pulse"
              >
                {t('decodingAcousticMetrics')}
              </motion.div>
            )}

            {/* Transcript Readout */}
            {transcript && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> {t('recordedSpeech')}
                </span>
                <p className="text-slate-800 text-sm mt-2 font-medium italic">"{transcript}"</p>
              </motion.div>
            )}

            {/* Categorization parsed card */}
            {parsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="stripe-card bg-indigo-950 text-white p-6 relative overflow-hidden"
              >
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-900 opacity-20 rounded-full" />
                <div className="flex items-center gap-1 text-indigo-300 font-bold text-[10px] uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('aiExtractedDetails')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">{t('amount')}</span>
                    <p className="text-xl font-extrabold text-white mt-0.5">{formatCurrency(parsed.amount)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">{t('category')}</span>
                    <p className="text-sm font-bold text-white mt-1 capitalize">{parsed.category}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">{t('portfolioDesc') || 'Description'}</span>
                  <p className="text-xs font-semibold text-indigo-100 mt-1">{parsed.description || 'Parsed Transaction'}</p>
                </div>

                <button
                  type="button"
                  onClick={confirmExpense}
                  className="mt-6 w-full py-2.5 bg-white hover:bg-slate-100 text-indigo-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-indigo-900" />
                  <span>{t('confirmAndLogEntry')}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History timeline log list */}
        <div className="stripe-card bg-white p-6 space-y-6">
          <div>
            <h3 className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-indigo-600" />
              {t('recordedHistory')}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {t('parsedLogs')}
            </p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item._id}
                className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2 hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{new Date(item.createdAt).toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US')}</span>
                  <span className="text-indigo-600">{item.parsedExpense?.category}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {item.parsedExpense?.description || 'Acoustic Log'}
                </p>
                <div className="text-xs font-extrabold text-slate-900">
                  {formatCurrency(item.parsedExpense?.amount || 0)}
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400 font-medium">{t('noTransactions')}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceTracker;
