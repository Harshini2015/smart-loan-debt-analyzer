import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingDown, AlertCircle } from 'lucide-react';

/**
 * Debt Health Stress Score — DTI % (Total EMI ÷ Monthly Income × 100)
 */
const StressGauge = ({ score = 0, stressCategory = '' }) => {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));

  const getCategory = () => {
    if (stressCategory) return stressCategory;
    if (safeScore <= 20) return 'Healthy';
    if (safeScore <= 35) return 'Moderate';
    if (safeScore <= 50) return 'High';
    return 'Critical';
  };

  const category = getCategory();

  const theme = {
    Healthy: {
      ring: '#10b981',
      bg: 'from-emerald-50 to-white',
      badge: 'text-emerald-800 bg-emerald-100 border-emerald-200',
      icon: TrendingDown,
    },
    Moderate: {
      ring: '#f59e0b',
      bg: 'from-amber-50 to-white',
      badge: 'text-amber-800 bg-amber-100 border-amber-200',
      icon: Activity,
    },
    High: {
      ring: '#f97316',
      bg: 'from-orange-50 to-white',
      badge: 'text-orange-800 bg-orange-100 border-orange-200',
      icon: AlertCircle,
    },
    Critical: {
      ring: '#ef4444',
      bg: 'from-rose-50 to-white',
      badge: 'text-rose-800 bg-rose-100 border-rose-200',
      icon: AlertCircle,
    },
  }[category] || {
    ring: '#6366f1',
    bg: 'from-slate-50 to-white',
    badge: 'text-slate-700 bg-slate-100 border-slate-200',
    icon: Activity,
  };

  const Icon = theme.icon;
  const radius = 78;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const progress = (safeScore / 100) * arcLength;

  const zones = [
    { label: 'Healthy', range: '0–20%', color: '#10b981' },
    { label: 'Moderate', range: '20–35%', color: '#f59e0b' },
    { label: 'High', range: '35–50%', color: '#f97316' },
    { label: 'Critical', range: '50%+', color: '#ef4444' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b ${theme.bg} p-6 shadow-sm`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Debt Health Stress
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">DTI ratio · EMI vs income</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${theme.badge}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {category}
        </span>
      </div>

      <div className="relative mx-auto flex justify-center py-2">
        <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible">
          <defs>
            <linearGradient id="stressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <g transform="translate(110, 118) rotate(144)">
            <circle
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
            />
            <motion.circle
              r={radius}
              fill="none"
              stroke={theme.ring}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset: arcLength - progress }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </g>
          <text
            x="110"
            y="108"
            textAnchor="middle"
            className="fill-slate-900 text-[2.75rem] font-extrabold"
            style={{ fontSize: 44, fontWeight: 800 }}
          >
            {safeScore.toFixed(1)}
          </text>
          <text x="110" y="132" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600">
            % DTI
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        {zones.map((z) => (
          <div
            key={z.label}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] ${
              z.label === category
                ? 'border-slate-300 bg-white shadow-sm font-semibold text-slate-800'
                : 'border-transparent bg-white/60 text-slate-500'
            }`}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: z.color }} />
            <span>
              {z.label}{' '}
              <span className="text-slate-400 font-normal">{z.range}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">
        {category === 'Healthy' && 'Strong capacity — debt load is well within safe limits.'}
        {category === 'Moderate' && 'Manageable, but avoid taking on large new debt.'}
        {category === 'High' && 'EMIs are heavy — consider prepayment or consolidation.'}
        {category === 'Critical' && 'Urgent action needed — reduce debt or increase income.'}
        {!['Healthy', 'Moderate', 'High', 'Critical'].includes(category) &&
          'Add income and loan data to calculate your score.'}
      </p>
    </motion.div>
  );
};

export default StressGauge;
