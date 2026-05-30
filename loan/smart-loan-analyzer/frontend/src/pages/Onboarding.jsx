import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { onboardingService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, DollarSign, Briefcase, PlusCircle, Trash2,
  ChevronRight, ChevronLeft, CheckCircle, TrendingUp, Shield
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Finance', icon: DollarSign, desc: 'Income, expenses & savings' },
  { id: 2, title: 'Loan Details', icon: Briefcase, desc: 'Existing loans (optional)' },
  { id: 3, title: 'Review & Confirm', icon: CheckCircle, desc: 'Verify your information' },
];

const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const defaultLoan = () => ({
  type: 'Personal Loan', amount: '', interestRate: '', emiAmount: '', tenureMonths: '',
});

const Onboarding = () => {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: '',
    emergencyFundAmount: '',
    occupation: '',
    loans: [],
  });

  const setField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const addLoan = () => setForm(prev => ({ ...prev, loans: [...prev.loans, defaultLoan()] }));
  const removeLoan = (i) => setForm(prev => ({ ...prev, loans: prev.loans.filter((_, idx) => idx !== i) }));
  const setLoanField = (i, key, val) => {
    setForm(prev => {
      const loans = [...prev.loans];
      loans[i] = { ...loans[i], [key]: val };
      return { ...prev, loans };
    });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.monthlyIncome || Number(form.monthlyIncome) <= 0)
      errs.monthlyIncome = 'Monthly income must be greater than ₹0';
    if (form.monthlyExpenses === '' || Number(form.monthlyExpenses) < 0)
      errs.monthlyExpenses = 'Expenses must be 0 or more';
    if (form.savings !== '' && Number(form.savings) < 0)
      errs.savings = 'Savings must be 0 or more';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validateStep1()) { setStep(1); return; }
    setSubmitting(true);
    try {
      const payload = {
        monthlyIncome: Number(form.monthlyIncome),
        monthlyExpenses: Number(form.monthlyExpenses),
        savings: Number(form.savings || 0),
        emergencyFundAmount: Number(form.emergencyFundAmount || 0),
        occupation: form.occupation,
        loans: form.loans
          .filter(l => l.amount && l.interestRate && l.tenureMonths)
          .map(l => ({
            type: l.type,
            amount: Number(l.amount),
            interestRate: Number(l.interestRate),
            emiAmount: Number(l.emiAmount || 0),
            tenureMonths: Number(l.tenureMonths),
          })),
      };
      await onboardingService.complete(payload);
      markOnboardingComplete();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      console.error('[Onboarding] Submit failed:', e);
      setErrors({ submit: e.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const dtiPreview = form.monthlyIncome > 0 && form.loans.length > 0
    ? ((form.loans.reduce((s, l) => s + Number(l.emiAmount || 0), 0) / Number(form.monthlyIncome)) * 100).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-xs font-semibold tracking-wide">SMART LOAN ANALYZER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Set Up Your Financial Profile
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            This takes 2 minutes. Your data drives accurate stress scores.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  step === s.id
                    ? 'bg-indigo-600 border-indigo-500 text-white scale-110'
                    : step > s.id
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${
                  step === s.id ? 'text-indigo-300' : step > s.id ? 'text-emerald-400' : 'text-slate-600'
                }`}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 max-w-12 transition-all duration-300 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Personal Finance ── */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Personal Finance</h2>
                    <p className="text-slate-500 text-xs">Your monthly cash flow details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'monthlyIncome', label: 'Monthly Income *', placeholder: 'e.g. 500000', required: true },
                    { key: 'monthlyExpenses', label: 'Monthly Expenses *', placeholder: 'e.g. 40000', required: true },
                    { key: 'savings', label: 'Total Savings', placeholder: 'e.g. 200000' },
                    { key: 'emergencyFundAmount', label: 'Emergency Fund', placeholder: 'e.g. 100000' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        {label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          value={form[key]}
                          onChange={e => setField(key, e.target.value)}
                          placeholder={placeholder}
                          min="0"
                          className={`w-full pl-8 pr-4 py-3 bg-slate-800/60 border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                            errors[key] ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'
                          }`}
                        />
                      </div>
                      {errors[key] && <p className="text-rose-400 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Occupation
                    </label>
                    <select
                      value={form.occupation}
                      onChange={e => setField('occupation', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 hover:border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="">Select occupation (optional)</option>
                      {['Salaried Employee', 'Self-Employed / Freelancer', 'Business Owner', 'Government Employee', 'Student', 'Retired', 'Other'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview */}
                {form.monthlyIncome && form.monthlyExpenses && (
                  <div className="mt-5 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs text-indigo-300 font-semibold mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Live Preview
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'Income', val: formatINR(form.monthlyIncome) },
                        { label: 'Expenses', val: formatINR(form.monthlyExpenses) },
                        { label: 'Disposable', val: formatINR(Math.max(0, Number(form.monthlyIncome) - Number(form.monthlyExpenses))) },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider">{item.label}</p>
                          <p className="text-white font-bold text-sm">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 2: Loan Details ── */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Existing Loans</h2>
                      <p className="text-slate-500 text-xs">Optional — skip if you have no loans</p>
                    </div>
                  </div>
                  <button
                    onClick={addLoan}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Loan
                  </button>
                </div>

                {form.loans.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                    <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No loans added yet</p>
                    <p className="text-slate-600 text-xs mt-1">Click "Add Loan" to enter existing EMIs</p>
                    <button onClick={addLoan} className="mt-4 px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-lg text-xs font-semibold hover:bg-indigo-600/30 transition-all">
                      + Add First Loan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {form.loans.map((loan, i) => (
                      <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white text-sm font-bold">Loan #{i + 1}</span>
                          <button onClick={() => removeLoan(i)} className="text-rose-400 hover:text-rose-300 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Loan Type</label>
                            <select
                              value={loan.type}
                              onChange={e => setLoanField(i, 'type', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              {['Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Business Loan', 'Credit Card', 'Other'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          {[
                            { key: 'amount', label: 'Loan Amount (₹)', ph: '100000' },
                            { key: 'interestRate', label: 'Interest Rate (%)', ph: '10.5' },
                            { key: 'emiAmount', label: 'EMI Amount (₹)', ph: '5000' },
                            { key: 'tenureMonths', label: 'Tenure (Months)', ph: '24' },
                          ].map(({ key, label, ph }) => (
                            <div key={key}>
                              <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                              <input
                                type="number" min="0" value={loan[key]} placeholder={ph}
                                onChange={e => setLoanField(i, key, e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dtiPreview !== null && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <p className="text-xs text-emerald-400 font-semibold">
                      Estimated DTI: <span className="text-emerald-300 font-extrabold">{dtiPreview}%</span>
                      {' '}— {Number(dtiPreview) <= 20 ? '✅ Healthy' : Number(dtiPreview) <= 35 ? '⚠️ Moderate' : Number(dtiPreview) <= 50 ? '🔶 High' : '🚨 Critical'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Review & Confirm</h2>
                    <p className="text-slate-500 text-xs">Everything looks good?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Overview</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      {[
                        ['Monthly Income', formatINR(form.monthlyIncome)],
                        ['Monthly Expenses', formatINR(form.monthlyExpenses)],
                        ['Total Savings', formatINR(form.savings)],
                        ['Emergency Fund', formatINR(form.emergencyFundAmount)],
                        ['Disposable Income', formatINR(Math.max(0, Number(form.monthlyIncome) - Number(form.monthlyExpenses)))],
                        ['Occupation', form.occupation || '—'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
                          <p className="text-white font-semibold text-sm mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Loans ({form.loans.length})
                    </h3>
                    {form.loans.length === 0 ? (
                      <p className="text-slate-600 text-sm">No loans added.</p>
                    ) : (
                      <div className="space-y-2">
                        {form.loans.map((l, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{l.type}</span>
                            <span className="text-white font-semibold">{formatINR(l.amount)} @ {l.interestRate}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {dtiPreview !== null && (
                    <div className={`p-4 rounded-2xl border text-center ${
                      Number(dtiPreview) <= 20 ? 'bg-emerald-500/10 border-emerald-500/30' :
                      Number(dtiPreview) <= 35 ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-rose-500/10 border-rose-500/30'
                    }`}>
                      <p className="text-xs text-slate-400 mb-1">Your Debt-to-Income Ratio</p>
                      <p className="text-3xl font-extrabold text-white">{dtiPreview}%</p>
                      <p className="text-xs mt-1 font-semibold text-slate-300">
                        {Number(dtiPreview) <= 20 ? '✅ Healthy Zone' : Number(dtiPreview) <= 35 ? '⚠️ Moderate Zone' : Number(dtiPreview) <= 50 ? '🔶 High Zone' : '🚨 Critical Zone'}
                      </p>
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                    <p className="text-rose-400 text-sm text-center">{errors.submit}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex gap-1.5">
              {STEPS.map(s => (
                <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${step === s.id ? 'bg-indigo-500 w-4' : step > s.id ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              ))}
            </div>

            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Complete Setup</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
