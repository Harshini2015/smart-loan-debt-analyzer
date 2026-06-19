import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  DollarSign, 
  Home, 
  PlusCircle, 
  Percent, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  AlertTriangle, 
  HeartHandshake, 
  Target, 
  MessageSquareCode, 
  AreaChart, 
  Sparkles,
  Play,
  Globe,
  ChevronDown
} from 'lucide-react';

// John SVG character posing dynamically based on step index
const JohnCharacter = ({ step }) => {
  let headY = 0;
  let leftArmRotation = 0;
  let rightArmRotation = 0;
  let mouthPath = "M 45 62 Q 50 67 55 62"; // smile
  let eyesPathL = "M 38 48 A 2 2 0 0 1 42 48"; // happy eye
  let eyesPathR = "M 58 48 A 2 2 0 0 1 62 48";
  let bodyColor = "#4f46e5"; // Indigo hoodie

  switch (step) {
    case 0:
      leftArmRotation = -40;
      mouthPath = "M 42 62 Q 50 72 58 62";
      break;
    case 1:
      rightArmRotation = 30;
      leftArmRotation = -110;
      mouthPath = "M 45 62 Q 50 68 55 62";
      break;
    case 2:
      rightArmRotation = -85;
      mouthPath = "M 45 62 Q 50 70 55 62";
      break;
    case 3:
      leftArmRotation = -60;
      rightArmRotation = 60;
      mouthPath = "M 42 62 Q 50 72 58 62";
      break;
    case 4:
      leftArmRotation = -90;
      mouthPath = "M 42 62 Q 50 75 58 62";
      break;
    case 5:
      leftArmRotation = -20;
      rightArmRotation = -140;
      mouthPath = "M 46 64 Q 50 64 54 64";
      eyesPathL = "M 38 48 A 3 3 0 0 1 42 48";
      eyesPathR = "M 58 48 A 3 3 0 0 1 62 48";
      break;
    case 6:
      leftArmRotation = 10;
      rightArmRotation = 10;
      mouthPath = "M 45 67 Q 50 61 55 67";
      eyesPathL = "M 36 50 Q 40 45 44 50";
      eyesPathR = "M 56 50 Q 60 45 64 50";
      headY = 2;
      break;
    case 7:
      leftArmRotation = -30;
      rightArmRotation = -30;
      mouthPath = "M 44 62 Q 50 69 56 62";
      break;
    case 8:
      leftArmRotation = -80;
      mouthPath = "M 42 62 Q 50 72 58 62";
      break;
    case 9:
      leftArmRotation = -45;
      mouthPath = "M 45 61 Q 50 67 55 65";
      break;
    case 10:
      leftArmRotation = -135;
      rightArmRotation = 135;
      mouthPath = "M 40 60 Q 50 76 60 60";
      headY = -4;
      break;
    default:
      break;
  }

  return (
    <div className="relative w-72 h-80 mx-auto flex items-center justify-center">
      <div className="absolute w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl z-10 overflow-visible">
        <path d="M 32 45 C 30 20, 70 20, 68 45 Z" fill="#1e1b4b" />
        <g style={{ transform: `rotate(${leftArmRotation}deg)`, transformOrigin: "26px 65px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <path d="M 26 65 L 12 85 C 10 88, 14 92, 16 89 L 28 72 Z" fill="#312e81" />
          <circle cx="12" cy="85" r="4" fill="#fed7aa" />
        </g>
        <g style={{ transform: `rotate(${rightArmRotation}deg)`, transformOrigin: "74px 65px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <path d="M 74 65 L 88 85 C 90 88, 86 92, 84 89 L 72 72 Z" fill="#312e81" />
          <circle cx="88" cy="85" r="4" fill="#fed7aa" />
        </g>
        <path d="M 25 70 C 25 60, 75 60, 75 70 L 80 120 L 20 120 Z" fill={bodyColor} />
        <path d="M 46 72 L 46 90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 54 72 L 54 95" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="44" y="55" width="12" height="12" fill="#fdba74" rx="2" />
        <g style={{ transform: `translateY(${headY}px)`, transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <circle cx="50" cy="48" r="18" fill="#fdba74" />
          <path d="M 32 44 Q 50 30 68 44 Q 50 36 32 44" fill="#1e1b4b" />
          <path d={eyesPathL} stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={eyesPathR} stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 49 53 L 51 53 L 50 56 Z" fill="#f97316" />
          <path d={mouthPath} stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="37" cy="55" r="2.5" fill="#f43f5e" opacity="0.3" />
          <circle cx="63" cy="55" r="2.5" fill="#f43f5e" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};

export default function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { t, language, setLanguage, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep < 10) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const stepsData = [
    {
      title: t('w_welcome_title'),
      subtitle: t('w_welcome_subtitle'),
      desc: t('w_welcome_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl" />
          <div className="space-y-3">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {t('w_welcome_label')}
            </span>
            <h4 className="text-base font-bold text-white">{t('welcomeJohn').replace(' 👋', '')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {t('w_welcome_body')}
            </p>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
            {t('w_welcome_footer')}
          </div>
        </div>
      )
    },
    {
      title: t('w_account_title'),
      subtitle: t('w_account_subtitle'),
      desc: t('w_account_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {t('w_account_label')}
            </span>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('nickname')}:</span>
                <span className="text-white font-bold">John</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('emailAddress')}:</span>
                <span className="text-white font-semibold">john@example.com</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {t('w_account_footer')}
          </div>
        </div>
      )
    },
    {
      title: t('w_salary_title'),
      subtitle: t('w_salary_subtitle'),
      desc: t('w_salary_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between overflow-y-auto">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_salary_label')}
          </span>
          <div className="space-y-1.5 text-xs my-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{t('grossSalaryInput')}:</span>
              <span className="text-white font-bold">₹60,000</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>{t('pfLabel')} (12%):</span>
              <span>-₹7,200</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>{t('ptLabel')}:</span>
              <span>-₹200</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>{t('itLabel')}:</span>
              <span>-₹2,00,0</span>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-900/30 p-2.5 rounded-xl flex justify-between text-xs">
            <span className="text-indigo-300 font-bold">{t('netTakeHomeLabel')}</span>
            <span className="text-indigo-200 font-extrabold">₹50,600</span>
          </div>
        </div>
      )
    },
    {
      title: t('w_expense_title'),
      subtitle: t('w_expense_subtitle'),
      desc: t('w_expense_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_expense_label')}
          </span>
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
              <span className="text-[10px] text-slate-400 block">{t('monthlyRentInput')}</span>
              <span className="font-bold text-white">₹15,000</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
              <span className="text-[10px] text-slate-400 block">{t('foodGroceriesInput')}</span>
              <span className="font-bold text-white">₹6,000</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
              <span className="text-[10px] text-slate-400 block">{t('transportInputLabel')}</span>
              <span className="font-bold text-white">₹2,00,0</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
              <span className="text-[10px] text-slate-400 block">{t('otherExpensesInputLabel')}</span>
              <span className="font-bold text-white">₹7,300</span>
            </div>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-850 pt-2.5">
            <span className="text-slate-400 font-semibold">{t('coreTotal')}</span>
            <span className="text-white font-extrabold">₹30,300</span>
          </div>
        </div>
      )
    },
    {
      title: t('w_savings_title'),
      subtitle: t('w_savings_subtitle'),
      desc: t('w_savings_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_savings_label')}
          </span>
          <div className="space-y-3.5 my-auto">
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex text-[9px] font-bold text-white text-center">
              <div className="bg-indigo-600 h-full flex items-center justify-center transition-all" style={{ width: '60%' }}>
                Net ₹50.6k
              </div>
              <div className="bg-amber-600 h-full flex items-center justify-center transition-all" style={{ width: '40%' }}>
                Cost ₹30.3k
              </div>
            </div>
            <div className="flex justify-between text-xs bg-emerald-950/40 border border-emerald-900/30 p-3 rounded-2xl">
              <span className="text-emerald-300 font-extrabold">{t('surplusHeadroom')}</span>
              <span className="text-emerald-200 font-black">₹20,300</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 text-center block">Calculated as: {t('incomeMinusExpenses')}</span>
        </div>
      )
    },
    {
      title: t('w_loan_title'),
      subtitle: t('w_loan_subtitle'),
      desc: t('w_loan_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_loan_label')}
          </span>
          <div className="space-y-2 text-xs my-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{t('loanPrincipal').replace(' ($)', '')}:</span>
              <span className="text-white font-bold">₹2,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t('rate')}:</span>
              <span className="text-white font-semibold">10% / 36 Months</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-2 text-sm text-cyan-400 font-black">
              <span>{t('calcMonthlyEmi')}:</span>
              <span>₹6,453 / month</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-950/30 border border-amber-900/30 rounded-xl text-[10px] text-amber-300">
            {t('calibrateMicroSavings').replace('round-up algorithm rounding checks are.', 'loan affordability constraints.')}
          </div>
        </div>
      )
    },
    {
      title: t('w_stress_title'),
      subtitle: t('w_stress_subtitle'),
      desc: t('w_stress_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_stress_label')}
          </span>
          <div className="my-auto space-y-3">
            <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden relative">
              <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full" style={{ width: '100%' }} />
              <div className="absolute top-0 w-2.5 h-full bg-white shadow-xl" style={{ left: '32%' }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-bold">{t('statusLabel')}: {t('riskyLeverage').replace(' ⚠️', '')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px]">
                32%
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">{t('dtiTip')}</span>
        </div>
      )
    },
    {
      title: t('w_fund_title'),
      subtitle: t('w_fund_subtitle'),
      desc: t('w_fund_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_fund_label')}
          </span>
          <div className="space-y-3 my-auto">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('fundGoal')}:</span>
              <span className="text-white font-bold">₹90,900</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('currentBalance')}:</span>
              <span className="text-emerald-400 font-bold">₹35,000</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '38%' }} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            {t('fundDesc')}
          </div>
        </div>
      )
    },
    {
      title: t('w_goals_title'),
      subtitle: t('w_goals_subtitle'),
      desc: t('w_goals_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_goals_label')}
          </span>
          <div className="space-y-3 my-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" />
                <span className="text-white font-bold">{t('myGoals')}</span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 px-1">
              <span>₹2,00,000</span>
              <span className="text-pink-400 font-bold">{t('monthlyContribution')}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 text-center block">{t('goalsDesc')}</span>
        </div>
      )
    },
    {
      title: t('w_ai_title'),
      subtitle: t('w_ai_subtitle'),
      desc: t('w_ai_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            {t('w_ai_label')}
          </span>
          <div className="space-y-2.5 text-[11px] my-2 overflow-y-auto">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-slate-300 text-right">
              "Optimize spends?"
            </div>
            <div className="p-2 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-indigo-200">
              {t('aiAdvisorySuggestions')}
            </div>
          </div>
          <span className="text-[9px] text-slate-500">{t('neuralEngineActive')}</span>
        </div>
      )
    },
    {
      title: t('w_dashboard_title'),
      subtitle: t('w_dashboard_subtitle'),
      desc: t('w_dashboard_desc'),
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
              {t('w_dashboard_label')}
            </span>
            <h4 className="text-xl font-bold text-white mt-2">{t('financialHealth')}: 72/100</h4>
            <p className="text-xs text-slate-400">
              {t('dashboardDesc')}
            </p>
          </div>
          <div className="text-[10px] text-indigo-400 font-extrabold flex items-center gap-1">
            ✨ {t('inviteSuccess').replace('family member!', 'Walkthrough!')}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white">{t('guidedJourneyTitle')}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('startWalkthroughBtn').replace(' 🚀', '')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative animate-fade-in">
            <button
              onClick={() => setLangDropdownOpen((v) => !v)}
              title="Switch Language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-950 border border-slate-800 shadow-xl p-1.5 z-20 text-slate-400"
                  >
                    <button
                      onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        language === 'en' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        language === 'hi' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => { setLanguage('kn'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        language === 'kn' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-800"
          >
            <X className="w-4 h-4" />
            {t('w_skip')}
          </button>
        </div>
      </header>

      {/* Tour Frame */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col justify-center z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/40 border border-slate-900 rounded-3xl p-6 md:p-10 backdrop-blur-lg">
          
          {/* Character Column */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <JohnCharacter step={activeStep} />
            
            {/* Speak Bubble */}
            <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-xl text-sm font-semibold max-w-sm relative leading-relaxed">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-600 rotate-45" />
              {stepsData[activeStep].desc}
            </div>
          </div>

          {/* Feature Preview Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-indigo-400 uppercase tracking-widest">
                  {t('progressText')} {activeStep + 1} / {stepsData.length}
                </span>
                <span className="text-slate-400 font-bold">
                  {Math.round(((activeStep + 1) / stepsData.length) * 100)}% {t('completedText')}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500 rounded-full"
                  style={{ width: `${((activeStep + 1) / stepsData.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">{stepsData[activeStep].title}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stepsData[activeStep].subtitle}</p>
            </div>

            {/* Render dynamically depending on activeStep */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepsData[activeStep].renderPreview()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeStep === 0 
                    ? 'border-slate-900 bg-slate-950/20 text-slate-600 cursor-not-allowed' 
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-white active:scale-95'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('w_prev')}
              </button>

              {activeStep === stepsData.length - 1 ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/10 active:scale-95 transition-all border border-emerald-500"
                >
                  {t('w_finish')}
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 active:scale-95 transition-all border border-indigo-500"
                >
                  {t('w_next')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
