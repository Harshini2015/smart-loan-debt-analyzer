import React, { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Coins,
  Info,
  TrendingDown,
  Layers,
  ShieldCheck,
  Calendar,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { groqService } from '../services/groqService';
import StressGauge from '../components/StressGauge';

const StressAnalysis = () => {
  const { dashboardData } = useDashboard();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // AI advice state
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Calculate stress contribution per loan (real data)
  const stressData = useMemo(() => {
    if (!dashboardData || !dashboardData.recentLoans) return [];
    
    const disposableIncome = dashboardData.monthlyIncome - dashboardData.monthlyExpenses;
    
    return dashboardData.recentLoans.map(loan => ({
      name: loan.loanType || loan.type || 'Loan',
      amount: loan.amount || 0,
      emi: loan.emi || 0,
      stress: disposableIncome > 0 ? Math.round(((loan.emi || 0) / disposableIncome) * 100) : 0
    })).sort((a, b) => b.stress - a.stress); // Sort by stress descending
  }, [dashboardData]);

  const maxStress = Math.max(1, ...stressData.map(d => d.stress));
  const score = dashboardData?.stressScore ?? 0;
  
  // Risk categorization
  const getRiskLabel = (s) => {
    if (s < 20) return { text: language === 'en' ? 'Minimal Risk' : 'ಕನಿಷ್ಠ ಅಪಾಯ', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', barColor: 'bg-emerald-500' };
    if (s < 40) return { text: language === 'en' ? 'Moderate Risk' : 'ಮಧ್ಯಮ ಅಪಾಯ', color: 'text-amber-600 bg-amber-50 border-amber-100', barColor: 'bg-amber-500' };
    return { text: language === 'en' ? 'Severe Stress' : 'ತೀವ್ರ ಒತ್ತಡ', color: 'text-rose-600 bg-rose-50 border-rose-100', barColor: 'bg-rose-500' };
  };
  const riskStatus = getRiskLabel(score);

  // Generate stress history trend
  const parseStressHistory = () => {
    if (dashboardData?.stressTrend && dashboardData.stressTrend.length > 0) {
      return dashboardData.stressTrend.map((d, i) => ({
        name: d.month || `M${i+1}`,
        Stress: d.stress || d.riskScore || 0
      }));
    }
    // Fallback data
    return [
      { name: 'Jan', Stress: Math.max(15, score - 15) },
      { name: 'Feb', Stress: Math.max(22, score - 8) },
      { name: 'Mar', Stress: Math.max(18, score - 12) },
      { name: 'Apr', Stress: score }
    ];
  };

  const getAIStressAdvisory = async () => {
    if (!dashboardData) return;
    setAiLoading(true);
    setAiAdvice('');
    try {
      const prompt = `I need an expert debt stress reduction advisory.
      Here is my current financial status:
      - Monthly Income: $${dashboardData.monthlyIncome.toLocaleString()}
      - Monthly Expenses: $${dashboardData.monthlyExpenses.toLocaleString()}
      - Total Monthly Loan EMIs: $${dashboardData.totalEMI.toLocaleString()}
      - Combined Debt Stress Score: ${dashboardData.stressScore}%
      - My active loans: ${JSON.stringify(stressData)}
      
      Give me a professional, Stripe/Linear style fintech advisory with exactly 3 ultra-concise, highly actionable bullet points to reduce this debt stress (e.g. debt consolidation, prepayment allocation, refinancing suggestion). Keep the tone highly intelligent and reassuring. Maximum 3 sentences total.`;

      const context = {
        monthlyIncome: dashboardData.monthlyIncome,
        monthlyExpenses: dashboardData.monthlyExpenses,
        totalEMI: dashboardData.totalEMI,
        stressScore: dashboardData.stressScore,
        loans: dashboardData.recentLoans || []
      };

      const res = await groqService.chat(prompt, context);
      if (res.success) {
        setAiAdvice(res.reply);
      } else {
        setAiAdvice("Failed to retrieve AI risk advisory. Let's try again.");
      }
    } catch (err) {
      console.error(err);
      setAiAdvice("Unable to connect to AI Risk Advisor.");
    } finally {
      setAiLoading(false);
    }
  };

  // Auto load AI advice and dispatch bilingual notifications reactively
  useEffect(() => {
    if (dashboardData) {
      getAIStressAdvisory();

      // Dispatch dynamic bilingual notification
      window.dispatchEvent(
        new CustomEvent('add-notification', {
          detail: {
            text: `📈 Core risk scan finished. Debt stress score: ${dashboardData.stressScore || 0}%.`,
            textKn: `📈 ಒಟ್ಟಾರೆ ಸಾಲದ ಒತ್ತಡ ಸ್ಕ್ಯಾನ್ ಪೂರ್ಣಗೊಂಡಿದೆ: ${dashboardData.stressScore || 0}%.`,
          },
        })
      );
    }
  }, [dashboardData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 23 } }
  };

  if (!dashboardData) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Synchronizing latest financial ledger analytics...</p>
      </div>
    );
  }

  const disposableIncome = dashboardData.monthlyIncome - dashboardData.monthlyExpenses;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-2">
            <Activity className="w-3.5 h-3.5" /> {t('coreRiskDiagnostic')}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('debtStressAnalysisTitle')}
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {t('debtStressDescExtended')}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('disposableCashflow')}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              ${disposableIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{t('incomeMinusExpenses')}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('totalMonthlyEmi')}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              ${Number(dashboardData.totalEMI || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{t('activeLoanPayments')}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('combinedStressScore')}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {score}%
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${riskStatus.color}`}>
                {riskStatus.text}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{t('debtToDisposableRatio')}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Chart & Loan Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
          
          {/* Stress Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-500" /> {t('historicalTrend')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{t('timelineTrackStress')}</p>
            </div>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={parseStressHistory()} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                  />
                  <Area type="monotone" dataKey="Stress" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-Loan Bar List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" /> {t('stressContribution')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{t('isolatedImpactScore')}</p>
            </div>

            {stressData.length > 0 ? (
              <div className="space-y-4 mt-2">
                {stressData.map((loan, i) => {
                  const barWidth = (loan.stress / maxStress) * 100;
                  const loanRisk = getRiskLabel(loan.stress);

                  return (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                      {/* Name */}
                      <div className="sm:w-32 truncate">
                        <span className="text-sm font-bold text-slate-800">{loan.name}</span>
                        <p className="text-[10px] text-slate-400 font-medium">{t('activeObligation')}</p>
                      </div>

                      {/* Bar Track */}
                      <div className="flex-1 space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`${loanRisk.barColor} h-full rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400">
                          <span>0% {t('stressRatio') || 'stress'}</span>
                          <span className="text-indigo-600">{loan.stress}% {t('combinedStressScore') || 'Individual Ratio'}</span>
                        </div>
                      </div>

                      {/* Status readouts */}
                      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1.5 sm:gap-0 mt-1 sm:mt-0">
                        <span className="text-sm font-black text-slate-800">${Number(loan.emi).toLocaleString()}</span>
                        <span className="text-[10px] font-semibold text-slate-500">{t('totalMonthlyEmi') || 'Monthly EMI'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Sliders className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{t('noLoansDetected')}</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 font-medium">{t('noLoansDetectedDesc')}</p>
              </div>
            )}
          </div>

        </motion.div>
        
        {/* Right Column: Gauge, AI Risk Advice & Key Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">

          <StressGauge score={score} stressCategory={dashboardData.stressCategory || ''} />

          {/* AI Advisor Panel */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/30 rounded-full translate-x-12 -translate-y-12 filter blur-xl opacity-60"></div>
            
            <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-500 rounded text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">{t('aiScenarioCounsel') || 'AI Risk Advisor'}</h3>
              </div>
              {aiLoading && (
                <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> {t('synthesizingData') || 'Synthesizing risk...'}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {aiAdvice ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-indigo-900 leading-relaxed font-medium space-y-2"
                >
                  <p className="italic">"{aiAdvice}"</p>
                </motion.div>
              ) : aiLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-indigo-100 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-indigo-100 rounded animate-pulse w-5/6"></div>
                  <div className="h-3 bg-indigo-100 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <button
                  onClick={getAIStressAdvisory}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {t('retriggerAI') || 'Re-trigger Risk Counsel'}
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Insights List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" /> {t('repaymentSummary') || 'Diagnostic Summary'}
            </h3>

            <div className="space-y-4">
              {stressData.length > 0 ? (
                <>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{t('primaryStressDriver')}:</span>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        <strong>{stressData[0].name}</strong> {t('contributesLargest')} <strong>{stressData[0].stress}%</strong> {t('ratioText')}.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{t('debtDisposableRatioText')}</span>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {t('consumeDisposable')} <strong>{score}%</strong> of your monthly net disposable funds (${disposableIncome.toLocaleString()}).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{t('safeCashflowRunway')}</span>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {t('preserveMonthlyNet')} <strong>${(disposableIncome - Number(dashboardData.totalEMI)).toLocaleString()}</strong> {t('discretionarySavings')}.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  {t('noLoansDetectedDesc')}
                </div>
              )}
            </div>
          </div>

          {/* Warning Banner (Score-Dependent) */}
          {score >= 35 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wider">{t('cashflowAlert')}</h4>
                <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">
                  {t('stressExceedsWarning')}
                </p>
              </div>
            </div>
          )}

        </motion.div>

      </div>
    </motion.div>
  );
};

export default StressAnalysis;
