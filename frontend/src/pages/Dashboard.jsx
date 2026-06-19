import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { dashboardService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Sparkles,
  PieChart as PieIcon,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent,
  Download,
  Settings,
  PlusCircle,
  FileText,
  Calculator,
  Smile,
  Frown,
  Activity,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const { user, refreshKey } = useAuth();
  const { dashboardData, fetchDashboardData, loading, error } = useDashboard();
  const { t } = useLanguage();

  // Modal and Guide toggles
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(true);

  // Form states for Salary & Expenses Config
  const [grossInput, setGrossInput] = useState('');
  const [pfPercentInput, setPfPercentInput] = useState('12');
  const [ptInput, setPtInput] = useState('');
  const [itInput, setItInput] = useState('');
  const [rentInput, setRentInput] = useState('');
  const [foodInput, setFoodInput] = useState('');
  const [transportInput, setTransportInput] = useState('');
  const [electricityInput, setElectricityInput] = useState('');
  const [internetInput, setInternetInput] = useState('');
  const [insuranceInput, setInsuranceInput] = useState('');
  const [otherInput, setOtherInput] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState('');
  const [emiRate, setEmiRate] = useState('');
  const [emiTenure, setEmiTenure] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey, fetchDashboardData]);

  // Populate config inputs from existing data
  useEffect(() => {
    if (dashboardData) {
      setGrossInput(dashboardData.grossSalary || '');
      setPfPercentInput(dashboardData.pfPercentage !== undefined ? dashboardData.pfPercentage : '12');
      setPtInput(dashboardData.professionalTax || '');
      setItInput(dashboardData.incomeTax || '');
      setRentInput(dashboardData.expenseRent || '');
      setFoodInput(dashboardData.expenseFood || '');
      setTransportInput(dashboardData.expenseTransport || '');
      setElectricityInput(dashboardData.expenseElectricity || '');
      setInternetInput(dashboardData.expenseInternet || '');
      setInsuranceInput(dashboardData.expenseInsurance || '');
      setOtherInput(dashboardData.expenseOther || '');
    }
  }, [dashboardData]);

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('failedSync')}</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            We ran into an issue retrieving your financial indicators:{' '}
            <span className="font-semibold text-rose-600">{error}</span>
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => fetchDashboardData()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            >
              {t('retryConnection')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle updates to financial config
  const handleSaveFinancials = async (e) => {
    e.preventDefault();
    setSetupLoading(true);
    try {
      await dashboardService.updateFinancialInfo({
        grossSalary: Number(grossInput) || 0,
        pfPercentage: Number(pfPercentInput) || 0,
        professionalTax: Number(ptInput) || 0,
        incomeTax: Number(itInput) || 0,
        expenseRent: Number(rentInput) || 0,
        expenseFood: Number(foodInput) || 0,
        expenseTransport: Number(transportInput) || 0,
        expenseElectricity: Number(electricityInput) || 0,
        expenseInternet: Number(internetInput) || 0,
        expenseInsurance: Number(insuranceInput) || 0,
        expenseOther: Number(otherInput) || 0
      });
      await fetchDashboardData();
      setShowConfigModal(false);
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `⚙️ Updated your financial profile and recalculating metrics.`,
          textKn: `⚙️ ನಿಮ್ಮ ಹಣಕಾಸಿನ ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ.`
        }
      }));
    } catch (err) {
      console.error('Failed to update financials:', err);
    } finally {
      setSetupLoading(false);
    }
  };

  // Compute EMI calculations
  const calculateEMI = (e) => {
    e.preventDefault();
    const principal = Number(emiAmount);
    const ratePerMonth = (Number(emiRate) / 12) / 100;
    const months = Number(emiTenure);

    if (principal > 0 && ratePerMonth > 0 && months > 0) {
      const emiVal = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
      const totalRepay = emiVal * months;
      const totalInterest = totalRepay - principal;
      setCalcResult({
        emi: parseFloat(emiVal.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalRepay: parseFloat(totalRepay.toFixed(2))
      });
    }
  };

  // Calculations for displays
  const gross = dashboardData?.grossSalary || 0;
  const pfPct = dashboardData?.pfPercentage || 0;
  const pfAmt = dashboardData?.pfAmount || 0;
  const pt = dashboardData?.professionalTax || 0;
  const it = dashboardData?.incomeTax || 0;
  const net = dashboardData?.netSalary || (dashboardData?.monthlyIncome || 0);

  const rent = dashboardData?.expenseRent || 0;
  const food = dashboardData?.expenseFood || 0;
  const transport = dashboardData?.expenseTransport || 0;
  const electricity = dashboardData?.expenseElectricity || 0;
  const internet = dashboardData?.expenseInternet || 0;
  const insurance = dashboardData?.expenseInsurance || 0;
  const other = dashboardData?.expenseOther || 0;
  const totalExp = dashboardData?.totalExpenses || (dashboardData?.monthlyExpenses || 0);
  const dispIncome = Math.max(0, net - totalExp);

  // Financial Health Score algorithm
  const netSafe = net || 1;
  const savingsRatio = (dispIncome / netSafe) * 100;
  const savingsScore = savingsRatio >= 30 ? 40 : Math.max(0, (savingsRatio / 30) * 40);

  const expenseRatio = (totalExp / netSafe) * 100;
  const expenseScore = expenseRatio <= 30 ? 30 : Math.max(0, 30 - ((expenseRatio - 30) / 50) * 30);

  const totalEmi = dashboardData?.totalEMI || 0;
  const emiBurden = (totalEmi / netSafe) * 100;
  const emiScore = emiBurden <= 15 ? 30 : Math.max(0, 30 - ((emiBurden - 15) / 35) * 30);

  const healthScore = Math.min(100, Math.round(savingsScore + expenseScore + emiScore));

  // Determine health category text
  let healthLabel = 'Moderate';
  let healthColor = 'text-amber-600 border-amber-200 bg-amber-50';
  if (healthScore >= 75) {
    healthLabel = 'Excellent';
    healthColor = 'text-emerald-700 border-emerald-200 bg-emerald-50';
  } else if (healthScore < 45) {
    healthLabel = 'Needs Attention';
    healthColor = 'text-rose-700 border-rose-200 bg-rose-50';
  }

  // Charts payloads
  const comparisonData = [
    { name: 'Net Salary', Amount: net, fill: '#4f46e5' },
    { name: 'Expenses', Amount: totalExp, fill: '#d97706' },
    { name: 'EMIs', Amount: totalEmi, fill: '#dc2626' }
  ];

  const pieData = [
    { name: 'Rent', value: rent, color: '#3b82f6' },
    { name: 'Food', value: food, color: '#10b981' },
    { name: 'Transport', value: transport, color: '#8b5cf6' },
    { name: 'Electricity', value: electricity, color: '#f59e0b' },
    { name: 'Internet', value: internet, color: '#06b6d4' },
    { name: 'Insurance', value: insurance, color: '#ec4899' },
    { name: 'Other', value: other, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const [showInAppSummary, setShowInAppSummary] = useState(false);

  return (
    <div className="space-y-8 pb-10 bg-slate-50 min-h-screen text-slate-800 font-sans leading-relaxed">
      
      {/* Top Banner Header with Black styling welcome text */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-2.5 font-sans">
            {t('welcomeJohn')}
            <span className="text-xs bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full font-medium tracking-normal">
              {t('premiumAccount')}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {t('dashboardDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/walkthrough"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/15 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            {t('startWalkthroughBtn')}
          </Link>
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 shadow active:scale-95 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            {t('configureFinancials')}
          </button>
          <button
            onClick={() => setShowInAppSummary(!showInAppSummary)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            {showInAppSummary ? t('hideSummary') : t('inAppSummary')}
          </button>
        </div>
      </div>

      {/* In-App Financial Summary Widget */}
      {showInAppSummary && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              {t('inAppSummary')}
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">{t('confidentialAudit')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">{t('deductionsSummary')}</h4>
              <p className="text-xs text-slate-600">{t('grossSalaryLabel')} {formatCurrency(gross)}</p>
              <p className="text-xs text-slate-600">{t('pfLabel')} {formatCurrency(pfAmt)} ({pfPct}%)</p>
              <p className="text-xs text-slate-600">{t('ptLabel')} {formatCurrency(pt)}</p>
              <p className="text-xs text-slate-600">{t('itLabel')} {formatCurrency(it)}</p>
              <p className="text-xs font-bold text-indigo-600">{t('netTakeHomeLabel')} {formatCurrency(net)}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">{t('expenseAllocations')}</h4>
              <p className="text-xs text-slate-600">{t('coreTotal')} {formatCurrency(totalExp)}</p>
              <p className="text-xs text-slate-600">{t('surplusHeadroom')} {formatCurrency(dispIncome)}</p>
              <p className="text-xs text-slate-600">{t('dtiRatioLabel')} {(dashboardData?.dtiPercent || 0).toFixed(1)}%</p>
              <p className="text-xs font-bold text-emerald-600">{t('savingsRateLabel')} {savingsRatio.toFixed(1)}%</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">{t('advisorRec')}</h4>
              <p className="text-xs text-slate-600">💡 {t('savingsCatStatus')} {healthLabel}</p>
              <p className="text-xs text-slate-600">📈 {t('combinedRiskFactor')} {healthScore}/100</p>
              <p className="text-xs text-slate-600">• {t('dtiTip')}</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP-BY-STEP USER GUIDE / WALKTHROUGH ACCORDION */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowUserGuide(!showUserGuide)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border-b border-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm tracking-tight">{t('howToUseTitle')}</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{showUserGuide ? t('cancel') : t('manageLoans')}</span>
        </button>

        {showUserGuide && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                {t('howToUseTitle')}
              </h4>
              <p className="text-slate-500">
                {t('howToUseDesc')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1">{t('step1Title')}</span>
                  <p className="text-slate-500">{t('step1Desc')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1">{t('step2Title')}</span>
                  <p className="text-slate-500">{t('step2Desc')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1">{t('step3Title')}</span>
                  <p className="text-slate-500">{t('step3Desc')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1">{t('step4Title')}</span>
                  <p className="text-slate-500">{t('step4Desc')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  {t('guidedJourneyTitle')}
                </h4>
                <p className="text-[11px] text-slate-600 mb-4">
                  {t('guidedJourneyDesc')}
                </p>
                <Link
                  to="/walkthrough"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  🚀 {t('startWalkthroughBtn')}
                </Link>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 text-[10px] text-indigo-900 space-y-1">
                <span className="font-bold block text-indigo-950">{t('leafletLandmarks')}</span>
                <p>{t('leafletLandmarksDesc')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main KPI Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Salary Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Take-Home Salary</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            {formatCurrency(net)}
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mt-3.5">
            <ShieldCheck className="w-4 h-4" />
            After PF & tax deductions
          </span>
        </div>

        {/* Expenses Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monthly Expenses</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            {formatCurrency(totalExp)}
          </h3>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold mt-3.5">
            <ArrowDownRight className="w-4 h-4 text-slate-400" />
            Core outflows tracked
          </span>
        </div>

        {/* Disposable Income Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disposable Buffer</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            {formatCurrency(dispIncome)}
          </h3>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-3.5">
            <ArrowUpRight className="w-4 h-4" />
            Free cash surplus
          </span>
        </div>

        {/* Debt-To-Income Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Active EMIs</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            {formatCurrency(totalEmi)}
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-3.5">
            DTI Ratio: {(dashboardData?.dtiPercent || 0).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Salary vs Expenses vs EMI Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900 font-bold text-base tracking-tight">Finances Allocation Profile</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ratio comparison of income, expenses, and loan liabilities.</p>
            </div>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                  labelStyle={{ color: '#64748b' }}
                  formatter={(val) => [formatCurrency(val), 'Amount']}
                />
                <Bar dataKey="Amount" fill="#4f46e5" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {comparisonData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Category Pie Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900 font-bold text-base tracking-tight">Expenses Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Categories breakdown of core expenditures.</p>
            </div>
            <PieIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-44 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-sm text-slate-400">No expenses configured yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                    itemStyle={{ color: '#0f172a' }}
                    formatter={(val) => [formatCurrency(val), 'Expenses']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold text-slate-500">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({Math.round((item.value / totalExp) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Health Score & Interactive EMI Calculator Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Score Progress Indicator */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 font-bold text-base tracking-tight">Financial Health Score</h3>
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Derived dynamically based on savings capability, total expense constraints, and debt liabilities ratios.
            </p>
          </div>

          <div className="flex items-center gap-6 justify-center my-2">
            {/* Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" className="stroke-slate-100 fill-none" strokeWidth="8" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="fill-none transition-all duration-1000"
                  stroke={healthScore >= 75 ? '#10b981' : healthScore >= 45 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * healthScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-950">{healthScore}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 rounded-xl border p-3.5 text-center ${healthColor}`}>
            <span className="text-xs font-bold uppercase tracking-wider block">Health Rating</span>
            <span className="text-sm font-black mt-1 block">{healthLabel}</span>
          </div>
        </div>

        {/* EMI Calculator & Affordability Analysis */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl lg:col-span-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="text-slate-900 font-bold text-base tracking-tight">Interactive EMI Calculator & Affordability Engine</h3>
          </div>

          <form onSubmit={calculateEMI} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Loan Principal (₹)</label>
              <input
                type="number"
                value={emiAmount}
                onChange={(e) => setEmiAmount(e.target.value)}
                placeholder="e.g. 200000"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={emiRate}
                onChange={(e) => setEmiRate(e.target.value)}
                placeholder="e.g. 10"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tenure (Months)</label>
              <input
                type="number"
                value={emiTenure}
                onChange={(e) => setEmiTenure(e.target.value)}
                placeholder="e.g. 36"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Compute Loan Affordability
              </button>
            </div>
          </form>

          {calcResult && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Calculated Monthly EMI</span>
                <span className="text-lg font-extrabold text-slate-900 block mt-1">{formatCurrency(calcResult.emi)}</span>

                <div className="mt-3.5 space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Total Interest Paid:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(calcResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cumulative Repayment:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(calcResult.totalRepay)}</span>
                  </div>
                </div>
              </div>

              {/* Affordability Analysis Box */}
              <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Affordability Analysis</span>
                {(() => {
                  const percentOfDisp = dispIncome > 0 ? (calcResult.emi / dispIncome) * 100 : 100;
                  if (percentOfDisp <= 30) {
                    return (
                      <div className="mt-2 flex items-start gap-2.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-lg">
                        <Smile className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <strong className="text-xs font-bold block">Highly Affordable ✅</strong>
                          <span className="text-[10px] text-slate-500">EMI is {Math.round(percentOfDisp)}% of your disposable income.</span>
                        </div>
                      </div>
                    );
                  } else if (percentOfDisp <= 50) {
                    return (
                      <div className="mt-2 flex items-start gap-2.5 text-amber-700 bg-amber-50 border border-amber-200/80 p-2.5 rounded-lg">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <strong className="text-xs font-bold block">Risky Leverage ⚠️</strong>
                          <span className="text-[10px] text-slate-500">EMI takes {Math.round(percentOfDisp)}% of disposable funds. Proceed cautiously.</span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="mt-2 flex items-start gap-2.5 text-rose-700 bg-rose-50 border border-rose-200/80 p-2.5 rounded-lg">
                        <Frown className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <strong className="text-xs font-bold block">Not Affordable ❌</strong>
                          <span className="text-[10px] text-slate-500">EMI exceeds 50% ({Math.round(percentOfDisp)}%) of remaining cash. Recommended to reject.</span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal Dialog */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Configure Financial Profile</h3>
                  <p className="text-xs text-slate-500 mt-1">Specify detailed income components and itemized expenses tracking.</p>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSaveFinancials} className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">
                {/* Salary Module Breakdown Section */}
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-4 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    Salary Module Structure
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gross Salary</label>
                      <input
                        type="number"
                        value={grossInput}
                        onChange={(e) => setGrossInput(e.target.value)}
                        placeholder="Gross Amount"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">PF Rate (%)</label>
                      <input
                        type="number"
                        value={pfPercentInput}
                        onChange={(e) => setPfPercentInput(e.target.value)}
                        placeholder="12%"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Prof. Tax (PT)</label>
                      <input
                        type="number"
                        value={ptInput}
                        onChange={(e) => setPtInput(e.target.value)}
                        placeholder="PT Amount"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Income Tax (IT)</label>
                      <input
                        type="number"
                        value={itInput}
                        onChange={(e) => setItInput(e.target.value)}
                        placeholder="IT Amount"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Expense Categories Breakdown Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-xs font-black uppercase text-amber-600 tracking-wider mb-4 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    Itemized Expenses Tracking
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Rent</label>
                      <input
                        type="number"
                        value={rentInput}
                        onChange={(e) => setRentInput(e.target.value)}
                        placeholder="Rent"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Food & Groceries</label>
                      <input
                        type="number"
                        value={foodInput}
                        onChange={(e) => setFoodInput(e.target.value)}
                        placeholder="Food"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Transport/Fuel</label>
                      <input
                        type="number"
                        value={transportInput}
                        onChange={(e) => setTransportInput(e.target.value)}
                        placeholder="Transport"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Electricity bill</label>
                      <input
                        type="number"
                        value={electricityInput}
                        onChange={(e) => setElectricityInput(e.target.value)}
                        placeholder="Electricity"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Wifi / Internet</label>
                      <input
                        type="number"
                        value={internetInput}
                        onChange={(e) => setInternetInput(e.target.value)}
                        placeholder="Internet"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Life/Health Ins.</label>
                      <input
                        type="number"
                        value={insuranceInput}
                        onChange={(e) => setInsuranceInput(e.target.value)}
                        placeholder="Insurance"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Other Expenses</label>
                      <input
                        type="number"
                        value={otherInput}
                        onChange={(e) => setOtherInput(e.target.value)}
                        placeholder="Other"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="border-t border-slate-200 pt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={setupLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    {setupLoading ? 'Saving...' : 'Save & Calculate'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
