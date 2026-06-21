import React, { useEffect, useState, useCallback } from 'react';
import { emergencyFundService, dashboardService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Minus, List, Settings, X, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const AUTO_SAVE_AMOUNTS = { gentle: 10, moderate: 50, aggressive: 100 };

const FundDashboard = () => {
  const { t } = useLanguage();
  const [wallet, setWallet]             = useState(null);
  const [runwayMonths, setRunwayMonths] = useState(0);
  const [percentage, setPercentage]     = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeModal, setActiveModal]   = useState(null); // 'deposit'|'withdraw'|'setup'|'txns'
  const [amount, setAmount]             = useState('');
  const [reason, setReason]             = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg]       = useState('');
  const [mode, setMode]                 = useState('gentle');

  // Setup form state
  const [setupIncome,   setSetupIncome]   = useState('');
  const [setupExpenses, setSetupExpenses] = useState('');
  const [setupSavings,  setSetupSavings]  = useState('');

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await emergencyFundService.status();
      setWallet(res.data.wallet);
      setRunwayMonths(res.data.runwayMonths || 0);
      setPercentage(res.data.percentage || 0);
      setMode(res.data.wallet?.savingMode || 'gentle');
    } catch (e) {
      setError(t('ef_failed_load', 'Failed to load emergency fund. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const res = await emergencyFundService.transactions({ limit: 20 });
      setTransactions(res.data.transactions || []);
    } catch (e) {
      setTransactions([]);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setActionLoading(true);
    setActionMsg('');
    try {
      const res = await emergencyFundService.deposit({ amount: Number(amount), reason: reason || t('ef_manual_deposit', 'Manual deposit') });
      setWallet(res.data.wallet);
      setRunwayMonths(res.data.runwayMonths);
      setPercentage(res.data.percentage);
      setActionMsg(`✅ ${t('ef_deposit_success')}`);
      setAmount(''); setReason('');
      setTimeout(() => { setActiveModal(null); setActionMsg(''); }, 1500);
    } catch (e) {
      setActionMsg(e.response?.data?.message || t('ef_deposit_failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) return;
    setActionLoading(true);
    setActionMsg('');
    try {
      const res = await emergencyFundService.withdraw({ amount: Number(amount), reason: reason || t('ef_emergency_withdrawal', 'Emergency withdrawal') });
      setWallet(res.data.wallet);
      setRunwayMonths(res.data.runwayMonths);
      setPercentage(res.data.percentage);
      setActionMsg(`✅ ${t('ef_withdraw_success')}`);
      setAmount(''); setReason('');
      setTimeout(() => { setActiveModal(null); setActionMsg(''); }, 1500);
    } catch (e) {
      setActionMsg(e.response?.data?.message || t('ef_withdraw_failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetup = async () => {
    if (!setupExpenses) return;
    setActionLoading(true);
    setActionMsg('');
    try {
      const res = await emergencyFundService.setup({
        monthlyIncome:   Number(setupIncome)   || 0,
        monthlyExpenses: Number(setupExpenses) || 0,
        currentSavings:  Number(setupSavings)  || 0,
        savingMode: mode,
      });
      setWallet(res.data.wallet);
      setRunwayMonths(res.data.runwayMonths);
      setPercentage(res.data.percentage);
      setActionMsg(`✅ ${t('ef_setup_saved')}`);
      setTimeout(() => { setActiveModal(null); setActionMsg(''); }, 1500);
    } catch (e) {
      setActionMsg(e.response?.data?.message || t('ef_setup_failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    try {
      const res = await emergencyFundService.setup({
        monthlyIncome:   wallet?.monthlyIncome   || 0,
        monthlyExpenses: wallet?.monthlyExpenses || 0,
        savingMode: newMode,
      });
      setWallet(res.data.wallet);
    } catch (e) { console.error(e); }
  };

  // Build chart data from real transactions (last 8 credits, cumulative)
  const buildChartData = () => {
    if (!wallet?.transactions?.length) {
      return [{ label: 'Start', balance: 0 }, { label: 'Now', balance: wallet?.balance || 0 }];
    }
    const credits = [...wallet.transactions]
      .filter(t => t.type === 'credit')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-8);
    let running = 0;
    return credits.map((tx, i) => {
      running += tx.amount;
      const d = new Date(tx.date);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      return { label, balance: running };
    });
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-56 bg-slate-100 rounded-2xl" />
      <div className="h-44 bg-slate-100 rounded-2xl" />
    </div>
  );

  if (error) return (
    <div className="max-w-lg mx-auto mt-16 text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <p className="text-slate-700 font-semibold mb-4">{error}</p>
      <button onClick={loadStatus} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-700">{t('retry')}</button>
    </div>
  );

  const bal    = wallet?.balance    || 0;
  const target = wallet?.targetAmount || 0;
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (circ * percentage) / 100;
  const chartData = buildChartData();

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-indigo-600" />
            {t('ef_builder_title')}
          </h1>
          <p className="mt-1 text-slate-500 text-sm">{t('ef_builder_desc')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setActiveModal('setup'); setSetupIncome(wallet?.monthlyIncome || ''); setSetupExpenses(wallet?.monthlyExpenses || ''); setSetupSavings(''); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all">
            <Settings className="w-3.5 h-3.5" /> {t('ef_setup_financials')}
          </button>
          <button onClick={() => { loadTransactions(); setActiveModal('txns'); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all">
            <List className="w-3.5 h-3.5" /> {t('ef_transactions')}
          </button>
          <button onClick={() => { setAmount(''); setReason(''); setActionMsg(''); setActiveModal('deposit'); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-200">
            <Plus className="w-3.5 h-3.5" /> {t('ef_add_money')}
          </button>
          <button onClick={() => { setAmount(''); setReason(''); setActionMsg(''); setActiveModal('withdraw'); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-rose-200">
            <Minus className="w-3.5 h-3.5" /> {t('ef_withdraw')}
          </button>
        </div>
      </div>

      {/* Setup prompt if target is 0 */}
      {target === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">{t('ef_profile_not_set')}</p>
            <p className="text-xs text-amber-700 mt-1">{t('ef_profile_not_set_desc')}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: stats + chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats card */}
          <div className="stripe-card bg-white p-6 flex flex-col sm:flex-row items-center gap-8">
            <div className="space-y-5 flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ef_current_balance')}</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-slate-900">{fmt(bal)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ef_target_6m')}</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-slate-900">{fmt(target)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ef_monthly_expenses')}</p>
                  <p className="mt-1.5 text-lg font-bold text-slate-700">{fmt(wallet?.monthlyExpenses)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ef_total_accumulated')}</p>
                  <p className="mt-1.5 text-lg font-bold text-slate-700">{fmt(wallet?.totalSaved)}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  <span>{t('ef_progress')}</span><span>{percentage}% {t('ef_saved')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
            {/* Circular gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r={radius} className="stroke-slate-200 fill-none" strokeWidth="8" />
                <circle cx="72" cy="72" r={radius} className="stroke-indigo-600 fill-none transition-all duration-1000"
                  strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-slate-900">{percentage}%</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{t('ef_complete')}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="stripe-card bg-white p-6">
            <h3 className="text-slate-900 font-bold text-sm tracking-tight mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> {t('ef_growth_trend')}
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="efGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                    formatter={v => [fmt(v), t('ef_balance_label', 'Balance')]} />
                  <Area type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#efGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: mode + runway */}
        <div className="space-y-6">
          {/* Auto-save mode */}
          <div className="stripe-card bg-white p-6">
            <h3 className="text-slate-900 font-bold text-sm tracking-tight">{t('ef_auto_saving_mode')}</h3>
            <p className="text-slate-500 text-xs mt-1 mb-4">{t('ef_auto_saving_desc')}</p>
            <div className="flex flex-col gap-2">
              {Object.entries(AUTO_SAVE_AMOUNTS).map(([key, val]) => (
                <button key={key} onClick={() => handleModeChange(key)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all cursor-pointer ${
                    mode === key ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  <span className="capitalize">{t('ef_mode_' + key, key + ' Mode')}</span>
                  <span className={`font-extrabold ${mode === key ? 'text-indigo-700' : 'text-slate-400'}`}>₹{val}{t('ef_per_txn', '/txn')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Runway */}
          <div className="stripe-card bg-white p-6">
            <h3 className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" /> {t('ef_support_runway')}
            </h3>
            <p className="text-slate-500 text-xs mt-1">{t('ef_runway_desc_detail')}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-extrabold text-slate-900">{runwayMonths}</span>
              <span className="text-sm font-bold text-slate-500 mb-1">{t('ef_months')}</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                runwayMonths >= 6 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                runwayMonths >= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {runwayMonths >= 6 ? `✅ ${t('ef_fully_protected')}` : runwayMonths >= 3 ? `⚠️ ${t('ef_partial_coverage')}` : `🔴 ${t('ef_low_build_now')}`}
              </span>
            </div>
            {wallet?.monthlyExpenses > 0 && (
              <p className="text-[11px] text-slate-400 mt-2">{t('ef_based_on_expenses')}: ₹{wallet.monthlyExpenses.toLocaleString('en-IN')}</p>
            )}
          </div>

          {/* Quick stats */}
          <div className="stripe-card bg-indigo-950 text-white p-6">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">{t('ef_health')}</p>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-indigo-300">{t('ef_remaining_to_goal')}</span>
                <span className="font-bold text-white">{fmt(Math.max(0, target - bal))}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-indigo-300">{t('ef_autosave_per_txn')}</span>
                <span className="font-bold text-white">₹{AUTO_SAVE_AMOUNTS[mode]}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-indigo-300">{t('ef_transactions')}</span>
                <span className="font-bold text-white">{wallet?.transactions?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) { setActiveModal(null); setActionMsg(''); } }}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button onClick={() => { setActiveModal(null); setActionMsg(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>

              {/* DEPOSIT modal */}
              {activeModal === 'deposit' && (
                <>
                  <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-600" /> {t('ef_add_money')}</h2>
                  <p className="text-xs text-slate-500 mb-5">{t('ef_add_money_modal_desc')}</p>
                  <label className={labelCls}>{t('ef_amount_inr')}</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" className={`${inputCls} mb-4`} />
                  <label className={labelCls}>{t('ef_note_optional')}</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder={t('ef_note_placeholder', 'e.g. Bonus deposit')} className={`${inputCls} mb-5`} />
                  {actionMsg && <p className={`text-xs font-semibold mb-4 ${actionMsg.startsWith('✅') ? 'text-emerald-600' : 'text-rose-600'}`}>{actionMsg}</p>}
                  <button onClick={handleDeposit} disabled={actionLoading || !amount}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer transition-all">
                    {actionLoading ? t('ef_processing') : `${t('ef_deposit_btn')} ${amount ? fmt(amount) : ''}`}
                  </button>
                </>
              )}

              {/* WITHDRAW modal */}
              {activeModal === 'withdraw' && (
                <>
                  <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2"><Minus className="w-5 h-5 text-rose-600" /> {t('ef_withdraw')}</h2>
                  <p className="text-xs text-slate-500 mb-1">{t('ef_current_balance')}: <strong>{fmt(bal)}</strong></p>
                  <p className="text-xs text-amber-600 mb-5">⚠️ {t('ef_withdraw_warning')}</p>
                  <label className={labelCls}>{t('ef_amount_inr')}</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 2000" className={`${inputCls} mb-4`} />
                  <label className={labelCls}>{t('ef_reason_required')}</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder={t('ef_reason_placeholder', 'e.g. Medical emergency')} className={`${inputCls} mb-5`} />
                  {actionMsg && <p className={`text-xs font-semibold mb-4 ${actionMsg.startsWith('✅') ? 'text-emerald-600' : 'text-rose-600'}`}>{actionMsg}</p>}
                  <button onClick={handleWithdraw} disabled={actionLoading || !amount || !reason}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer transition-all">
                    {actionLoading ? t('ef_processing') : `${t('ef_withdraw_btn')} ${amount ? fmt(amount) : ''}`}
                  </button>
                </>
              )}

              {/* SETUP modal */}
              {activeModal === 'setup' && (
                <>
                  <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-600" /> {t('ef_financial_setup_title')}</h2>
                  <p className="text-xs text-slate-500 mb-5">{t('ef_target_formula')}</p>
                  <label className={labelCls}>{t('ef_monthly_income_label')}</label>
                  <input type="number" value={setupIncome} onChange={e => setSetupIncome(e.target.value)} placeholder="e.g. 80000" className={`${inputCls} mb-4`} />
                  <label className={labelCls}>{t('ef_monthly_expenses_label')}</label>
                  <input type="number" value={setupExpenses} onChange={e => setSetupExpenses(e.target.value)} placeholder="e.g. 40000" className={`${inputCls} mb-4`} />
                  <label className={labelCls}>{t('ef_current_savings_label')}</label>
                  <input type="number" value={setupSavings} onChange={e => setSetupSavings(e.target.value)} placeholder="e.g. 15000" className={`${inputCls} mb-2`} />
                  {setupExpenses && <p className="text-[11px] text-indigo-600 font-semibold mb-5">📌 {t('ef_calculated_target')}: {fmt(Number(setupExpenses) * 6)}</p>}
                  {actionMsg && <p className={`text-xs font-semibold mb-4 ${actionMsg.startsWith('✅') ? 'text-emerald-600' : 'text-rose-600'}`}>{actionMsg}</p>}
                  <button onClick={handleSetup} disabled={actionLoading || !setupExpenses}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer transition-all">
                    {actionLoading ? t('ef_saving') : t('ef_save_setup_btn')}
                  </button>
                </>
              )}

              {/* TRANSACTIONS modal */}
              {activeModal === 'txns' && (
                <>
                  <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2"><List className="w-5 h-5 text-slate-600" /> {t('ef_txn_history_title')}</h2>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">{t('ef_no_txns')}</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{tx.reason}</p>
                            <p className="text-[11px] text-slate-400">{new Date(tx.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</p>
                          </div>
                          <span className={`text-sm font-extrabold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FundDashboard;
