import React, { useState, useEffect } from 'react';
import { loanService } from "../services/api";
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingDown,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertCircle,
  Info,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { groqService } from '../services/groqService';

export default function Simulation() {
  const { dashboardData } = useDashboard();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    duration: '',
    emiAdjustment: '0',
    prepayment: '0'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // AI Scenario Advice State
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Populate form with real data from dashboard
  useEffect(() => {
    if (dashboardData?.recentLoans && dashboardData.recentLoans.length > 0) {
      const firstLoan = dashboardData.recentLoans[0];
      setFormData(prev => ({
        ...prev,
        amount: firstLoan.amount || 150000,
        interestRate: firstLoan.interestRate || 3.5,
        duration: firstLoan.tenureMonths || 240,
        emiAdjustment: prev.emiAdjustment || '0',
        prepayment: prev.prepayment || '0'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amount: 150000,
        interestRate: 3.5,
        duration: 240,
        emiAdjustment: prev.emiAdjustment || '0',
        prepayment: prev.prepayment || '0'
      }));
    }
  }, [dashboardData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    setAiAdvice('');
    try {
      const loan = {
        amount: Number(formData.amount || 150000),
        interestRate: Number(formData.interestRate || 3.5),
        tenureMonths: Number(formData.duration || 240),
      };
      const whatIf = {
        extraEMI: Number(formData.emiAdjustment || 0),
        prepayment: Number(formData.prepayment || 0),
      };
      
      const res = await loanService.simulate(loan, whatIf);
      if (res.data.success && res.data.data) {
        setResult(res.data.data);

        // Dispatch dynamic bilingual notification
        const savedAmt = res.data.data.interestSaved || 0;
        window.dispatchEvent(
          new CustomEvent('add-notification', {
            detail: {
              text: `🎯 Simulated payoff boost! Projected savings of $${Number(savedAmt).toLocaleString()}!`,
              textKn: `🎯 ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಲಾಗಿದೆ! $${Number(savedAmt).toLocaleString()} ಉಳಿತಾಯದ ಅಂದಾಜು!`,
            },
          })
        );
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Simulation failed to calculate. Please check input parameters.');
    } finally {
      setLoading(false);
    }
  };

  const getAIScenarioAdvice = async () => {
    if (!result) return;
    setAiLoading(true);
    setAiAdvice('');
    try {
      const prompt = `I ran an interactive simulation on my loan. Here are the details:
      - Principal Amount: $${Number(formData.amount).toLocaleString()}
      - Interest Rate: ${formData.interestRate}%
      - Base Duration: ${formData.duration} months
      - Proposed Monthly Extra EMI: +$${formData.emiAdjustment || 0}
      - Proposed One-time Prepayment: $${formData.prepayment || 0}
      
      The results are:
      - Total Interest Saved: $${Number(result.interestSaved).toLocaleString()}
      - New Monthly EMI: $${Number(result.newEmi).toLocaleString()}
      - Remaining Horizon: ${result.months} months
      - Projected New End Date: ${result.newEndDate ? new Date(result.newEndDate).toLocaleDateString() : 'N/A'}
      
      Give me a professional, highly engaging, MERN-stack principal engineer and fintech product advisor perspective.
      Include a punchy summary of how viable this is, and the compounding percentage payoff. Limit to 3 sentences maximum. Keep it clean and highly sophisticated.`;

      const context = {
        monthlyIncome: dashboardData?.monthlyIncome || 0,
        monthlyExpenses: dashboardData?.monthlyExpenses || 0,
        totalEMI: dashboardData?.totalEMI || 0,
        stressScore: dashboardData?.stressScore || 0,
        loans: dashboardData?.recentLoans || []
      };

      const res = await groqService.chat(prompt, context);
      if (res.success) {
        setAiAdvice(res.reply);
      } else {
        setAiAdvice("Failed to load AI analysis. Let's try again shortly.");
      }
    } catch (err) {
      console.error(err);
      setAiAdvice("Unable to communicate with AI Advisor right now.");
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger AI advice automatically once results load
  useEffect(() => {
    if (result) {
      getAIScenarioAdvice();
    }
  }, [result]);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> {t('simSandbox')}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('simMainTitle')}
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {t('simDescExtended')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Parameters Form */}
        <motion.div variants={cardVariants} className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-indigo-500" /> {t('scenarioParams')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('scenarioDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Amount slider + input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    {t('loanPrincipal')}
                  </label>
                  <input
                    type="number"
                    name="amount"
                    className="w-28 px-2 py-1 text-right text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1000"
                    max="2000000"
                  />
                </div>
                <input
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={formData.amount || 150000}
                  onChange={(e) => handleSliderChange('amount', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>$5k</span>
                  <span>$500k</span>
                  <span>$1M</span>
                </div>
              </div>

              {/* Interest rate slider + input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    {t('interestRate')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="interestRate"
                    className="w-20 px-2 py-1 text-right text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    value={formData.interestRate}
                    onChange={handleChange}
                    min="0.1"
                    max="30"
                  />
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={formData.interestRate || 3.5}
                  onChange={(e) => handleSliderChange('interestRate', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>0.5%</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Duration slider + input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    {t('tenureHorizon')}
                  </label>
                  <input
                    type="number"
                    name="duration"
                    className="w-20 px-2 py-1 text-right text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    value={formData.duration}
                    onChange={handleChange}
                    min="6"
                    max="480"
                  />
                </div>
                <input
                  type="range"
                  min="12"
                  max="360"
                  step="12"
                  value={formData.duration || 240}
                  onChange={(e) => handleSliderChange('duration', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{t('tenure1Year')}</span>
                  <span>{t('tenure15Years')}</span>
                  <span>{t('tenure30Years')}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 my-4 pt-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-4">{t('payoffBoosters')}</span>

                {/* EMI Adjustment slider + input */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      {t('extraMonthlyPayoff')}
                    </label>
                    <input
                      type="number"
                      name="emiAdjustment"
                      className="w-20 px-2 py-1 text-right text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      value={formData.emiAdjustment}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={Number(formData.emiAdjustment || 0)}
                    onChange={(e) => handleSliderChange('emiAdjustment', e.target.value)}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>+$0/mo</span>
                    <span>+$1k/mo</span>
                    <span>+$2k/mo</span>
                  </div>
                </div>

                {/* Prepayment slider + input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      {t('oneTimePrepayment')}
                    </label>
                    <input
                      type="number"
                      name="prepayment"
                      className="w-20 px-2 py-1 text-right text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      value={formData.prepayment}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={Number(formData.prepayment || 0)}
                    onChange={(e) => handleSliderChange('prepayment', e.target.value)}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>$0</span>
                    <span>$25k</span>
                    <span>$50k</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t('simCompounding')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> {t('runSandbox')}
                  </>
                )}
              </button>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">{t('calcException')}</h4>
                    <p className="text-xs mt-1 text-rose-600 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Right column: Results & AI Counseling */}
        <motion.div variants={cardVariants} className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[500px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{t('waitingScenario')}</h3>
                <p className="text-sm text-slate-500 max-w-md mt-2 font-medium">
                  {t('waitingScenarioDesc')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8 text-left">
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex gap-3">
                    <TrendingDown className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('interestSavings')}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{t('interestSavingsDesc')}</p>
                    </div>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex gap-3">
                    <Calendar className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('timelineShortening')}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{t('timelineShorteningDesc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Main Highlight Card: Interest Saved */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-12 -translate-y-12 filter blur-2xl opacity-60"></div>
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{t('compoundingBenefit')}</span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{t('repaymentSummary')}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t('highOptimization')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('projectedInterestSaved')}</p>
                      <h2 className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mt-1 flex items-baseline gap-1">
                        ${Number(result.interestSaved || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </h2>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        {t('interestSavedDesc')}
                      </p>
                    </div>

                    <div className="space-y-3.5 bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-500">{t('newMonthlyEmi')}:</span>
                        <span className="font-bold text-slate-800">${Number(result.newEmi || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-500">{t('remainingHorizon')}:</span>
                        <span className="font-bold text-slate-800">{result.months} {language === 'en' ? 'Months' : 'ತಿಂಗಳುಗಳು'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-500">{t('optimizedDate')}:</span>
                        <span className="font-bold text-slate-800">
                          {result.newEndDate ? new Date(result.newEndDate).toLocaleDateString(language === 'en' ? 'en-US' : 'kn-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payoff Horizon Comparison (Visual CSS Bar Charts) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" /> {t('payoffComparison')}
                  </h3>

                  <div className="space-y-4">
                    {/* Original Timeline Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{t('originalHorizon')}</span>
                        <span>{formData.duration} {language === 'en' ? 'Months' : 'ತಿಂಗಳುಗಳು'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200/50">
                        <div className="bg-slate-400 h-full rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    {/* Optimized Timeline Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" /> {t('optimizedHorizon')}
                        </span>
                        <span className="font-bold text-indigo-600">
                          {result.months} {language === 'en' ? 'Months' : 'ತಿಂಗಳುಗಳು'} ({Math.max(0, Number(formData.duration) - Number(result.months))}m {t('quicker')})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200/50">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${Math.min(100, (Number(result.months) / Number(formData.duration)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Expert Advice Box */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-indigo-500 rounded text-white flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-extrabold text-indigo-950 uppercase tracking-wider">{t('aiScenarioCounsel')}</h3>
                    </div>
                    {aiLoading && (
                      <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 animate-spin" /> {t('synthesizingData')}
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {aiAdvice ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-indigo-900 leading-relaxed font-medium"
                      >
                        "{aiAdvice}"
                      </motion.div>
                    ) : aiLoading ? (
                      <div className="space-y-2">
                        <div className="h-3.5 bg-indigo-100 rounded animate-pulse w-full"></div>
                        <div className="h-3.5 bg-indigo-100 rounded animate-pulse w-5/6"></div>
                        <div className="h-3.5 bg-indigo-100 rounded animate-pulse w-2/3"></div>
                      </div>
                    ) : (
                      <button
                        onClick={getAIScenarioAdvice}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> {t('retriggerAI')}
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
}
