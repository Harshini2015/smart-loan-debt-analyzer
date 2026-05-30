import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { dashboardService } from '../services/api';
import StressGauge from '../components/StressGauge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Sparkles,
  PieChart,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

// Indian Rupee formatter
const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Dashboard = () => {
  const { user, refreshKey } = useAuth();
  const { dashboardData, fetchDashboardData, loading, error } = useDashboard();
  const { t } = useLanguage();
  const [showFinancialSetup, setShowFinancialSetup] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');
  const [expensesInput, setExpensesInput] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey, fetchDashboardData]);

  // Debug log: verify all values when dashboard data arrives
  useEffect(() => {
    if (dashboardData) {
      console.log('─────────── Dashboard Data Received ───────────');
      console.log('[Dashboard] Monthly Income    :', dashboardData.monthlyIncome);
      console.log('[Dashboard] Monthly Expenses  :', dashboardData.monthlyExpenses);
      console.log('[Dashboard] Disposable Income :', dashboardData.disposableIncome);
      console.log('[Dashboard] Total EMI         :', dashboardData.totalEMI);
      console.log('[Dashboard] DTI %             :', dashboardData.dtiPercent);
      console.log('[Dashboard] Stress Score      :', dashboardData.stressScore);
      console.log('[Dashboard] Stress Category   :', dashboardData.stressCategory);
      console.log('[Dashboard] Loans Count       :', dashboardData.loansCount);
      console.log('───────────────────────────────────────────────');
    }
  }, [dashboardData]);

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg text-center animate-fade-in">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{t('failedSync')}</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            We ran into an issue retrieving your financial indicators:{' '}
            <span className="font-semibold text-rose-600">{error}</span>.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => fetchDashboardData()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
            >
              {t('retryConnection')}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              {t('reauthenticate')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSetFinancialInfo = async () => {
    setSetupLoading(true);
    try {
      await dashboardService.updateFinancialInfo({
        monthlyIncome: Number(incomeInput) || 0,
        monthlyExpenses: Number(expensesInput) || 0,
      });
      await fetchDashboardData();
      setShowFinancialSetup(false);
      setIncomeInput('');
      setExpensesInput('');

      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `⚙️ Updated your financial configuration metrics successfully.`,
          textKn: `⚙️ ನಿಮ್ಮ ಹಣಕಾಸಿನ ಕಾನ್ಫಿಗರೇಶನ್ ಮೆಟ್ರಿಕ್ಸ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.`
        }
      }));
    } catch (err) {
      console.error('Failed to update financial info:', err);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleSetSampleData = async () => {
    setSetupLoading(true);
    try {
      await dashboardService.updateFinancialInfo({
        monthlyIncome: 500000,
        monthlyExpenses: 40000,
      });
      await fetchDashboardData();
      setShowFinancialSetup(false);

      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `📊 Injected demo financial dataset (₹5L income, ₹40K expenses).`,
          textKn: `📊 ಡೆಮೊ ಡೇಟಾ ಸೇರಿಸಲಾಗಿದೆ.`
        }
      }));
    } catch (err) {
      console.error('Failed to set sample data:', err);
    } finally {
      setSetupLoading(false);
    }
  };

  // stressScore = DTI% from backend (0–100 scale, actual percentage)
  const score = dashboardData?.stressScore ?? dashboardData?.dtiPercent ?? 0;
  const stressCategory = dashboardData?.stressCategory || '';

  // Health score (inverse of stress for the circular widget)
  // Healthy = 100 health, Critical = 0 health
  const getHealthScore = () => {
    if (score <= 20) return Math.round(95 - (score / 20) * 10);   // 85–95
    if (score <= 35) return Math.round(70 - ((score - 20) / 15) * 20); // 50–70
    if (score <= 50) return Math.round(35 - ((score - 35) / 15) * 15); // 20–35
    return Math.max(0, Math.round(20 - ((score - 50) / 50) * 20));     // 0–20
  };
  const healthScore = getHealthScore();

  // Chart data
  const chartData = [
    { name: t('monthlyIncome'), Value: dashboardData?.monthlyIncome || 0, color: '#6366F1' },
    { name: t('expenses'), Value: dashboardData?.monthlyExpenses || 0, color: '#94A3B8' },
    { name: t('totalEMI'), Value: dashboardData?.totalEMI || 0, color: '#EF4444' }
  ];

  // Stress history
  const parseStressHistory = () => {
    if (dashboardData?.stressTrend && dashboardData.stressTrend.length > 0) {
      return dashboardData.stressTrend.map((d, i) => ({
        name: d.month || `M${i + 1}`,
        Stress: Number((d.stress || d.riskScore || 0).toFixed(2))
      }));
    }
    return [{ name: 'Now', Stress: score }];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('hello')}, {user?.name || 'User'}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {t('dashboardDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFinancialSetup(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {t('configureFinancials')}
          </button>
          {(!dashboardData?.monthlyIncome || dashboardData.monthlyIncome === 0) && (
            <button
              onClick={handleSetSampleData}
              disabled={setupLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {setupLoading ? t('synching') : t('injectDemo')}
            </button>
          )}
        </div>
      </div>

      {/* Financial Setup Panel */}
      <AnimatePresence>
        {showFinancialSetup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden"
          >
            <h3 className="text-base font-bold text-slate-900 mb-4">{t('configureFinancials')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {t('monthlyIncome')} (₹)
                </label>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {t('expenses')} (₹)
                </label>
                <input
                  type="number"
                  value={expensesInput}
                  onChange={(e) => setExpensesInput(e.target.value)}
                  placeholder="e.g. 40000"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                />
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleSetFinancialInfo}
                disabled={setupLoading || !incomeInput || !expensesInput}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                {setupLoading ? t('synching') : t('save')}
              </button>
              <button
                onClick={() => setShowFinancialSetup(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!dashboardData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 stripe-card skeleton-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: KPIs + Charts */}
          <div className="lg:col-span-2 space-y-8">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Income */}
              <div className="stripe-card bg-white p-6 relative overflow-hidden group">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('monthlyIncome')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {formatCurrency(dashboardData.monthlyIncome)}
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-2.5 bg-emerald-50 w-fit px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Monthly Base
                </span>
              </div>

              {/* Expenses */}
              <div className="stripe-card bg-white p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('expenses')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {formatCurrency(dashboardData.monthlyExpenses)}
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-2.5 bg-slate-50 w-fit px-1.5 py-0.5 rounded-full">
                  <ArrowDownRight className="w-3 h-3" />
                  {t('managedOutflow')}
                </span>
              </div>

              {/* Total EMI */}
              <div className="stripe-card bg-white p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('totalEMI')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {formatCurrency(dashboardData.totalEMI)}
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-rose-600 font-semibold mt-2.5 bg-rose-50 w-fit px-1.5 py-0.5 rounded-full">
                  DTI: {score.toFixed(2)}% — {stressCategory || 'N/A'}
                </span>
              </div>
            </div>

            {/* Income Allocation Chart */}
            <div className="stripe-card bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 font-bold text-sm tracking-tight">{t('financesBreakdown')}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t('allocationMapping')}</p>
                </div>
                <PieChart className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                      formatter={(val) => [formatCurrency(val), 'Value']}
                    />
                    <Bar dataKey="Value" fill="#6366F1" radius={[8, 8, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Loans Table */}
            <div className="stripe-card bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 font-bold text-sm tracking-tight">{t('activePortfolio')}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t('portfolioDesc')}</p>
                </div>
                <Link to="/loans" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  {t('manageLoans')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-55/80 text-left">
                    <tr>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('loanDetails')}</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('amount')}</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('rate')}</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-sm">
                    {(dashboardData?.recentLoans || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                          No active loans found. <Link to="/loans" className="text-indigo-600 font-semibold">Add a loan →</Link>
                        </td>
                      </tr>
                    ) : (
                      (dashboardData?.recentLoans || []).map((r, i) => {
                        if (!r) return null;
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-5 py-3.5 font-semibold text-slate-800">{r.loanType || r.type || 'Unnamed Loan'}</td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium">{formatCurrency(r.amount)}</td>
                            <td className="px-5 py-3.5 text-slate-500">{r.interestRate}%</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                r.status === 'Active' || r.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : r.status === 'Paid'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Gauge + Health + Trend */}
          <div className="space-y-8">

            {/* Stress Gauge — receives real DTI score */}
            <StressGauge score={score} stressCategory={stressCategory} />

            {/* AI Financial Health Score */}
            <div className="stripe-card bg-white p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm tracking-tight mb-4">{t('financialHealth')}</h3>

              <div className="flex items-center gap-6">
                {/* Circular indicator */}
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="fill-none"
                      stroke={healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="6"
                      strokeDasharray="213"
                      strokeDashoffset={213 - (213 * healthScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-lg font-extrabold text-slate-800">{healthScore}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {healthScore >= 70
                      ? t('healthStatusExcellent')
                      : healthScore >= 40
                      ? t('healthStatusModerate')
                      : t('healthStatusRisk')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    DTI: {score.toFixed(2)}% — {stressCategory}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Fund Health Card */}
            {dashboardData?.emergencyFund && (
              <div className="stripe-card bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900 font-bold text-sm tracking-tight">🛡️ Emergency Fund</h3>
                  <Link to="/emergency-fund" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View Fund <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>{formatCurrency(dashboardData.emergencyFund.balance)}</span>
                    <span>{formatCurrency(dashboardData.emergencyFund.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-700"
                      style={{ width: `${dashboardData.emergencyFund.percentage || 0}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {dashboardData.emergencyFund.percentage}% of 6-month target
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      dashboardData.emergencyFund.runwayMonths >= 6 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      dashboardData.emergencyFund.runwayMonths >= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-600 border-rose-200'
                    }`}>
                      {dashboardData.emergencyFund.runwayMonths}mo runway
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Stress Trend Chart */}
            <div className="stripe-card bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 font-bold text-sm tracking-tight">{t('trajectory')}</h3>
                <Calendar className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={parseStressHistory()} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                      formatter={(val) => [`${val}%`, 'DTI Stress']}
                    />
                    <Line
                      type="monotone"
                      dataKey="Stress"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
