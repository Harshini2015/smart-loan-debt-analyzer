import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Target, AlertTriangle, Calendar } from 'lucide-react';

const formatCurrency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const GoalCard = ({ goal }) => {
  const { t, language } = useLanguage();
  const progress = Math.min(100, Math.round(((goal.currentSaved || 0) / goal.targetAmount) * 100)) || 15;
  const blocker = goal.projected?.biggestBlocker || 'Unpruned flexible categories';

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="stripe-card bg-white p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shadow-inner">
              {goal.emoji || '🎯'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">{goal.goalName}</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('targetText')}: {formatDate(goal.projected?.achieveByDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold">
            {progress}% {t('completedText')}
          </span>
        </div>

        {/* Motivational advisory details */}
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            "{goal.projected?.motivationalMessage || 'Keep saving aggressively; you are on track to beat your deadline!'}"
          </p>
          <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase tracking-wider pt-2 border-t border-slate-200/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('blockerText')} {blocker}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
          <span>{formatCurrency(goal.currentSaved || 0)} {t('savedText')}</span>
          <span>{formatCurrency(goal.targetAmount)} {t('targetText')}</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GoalCard;
