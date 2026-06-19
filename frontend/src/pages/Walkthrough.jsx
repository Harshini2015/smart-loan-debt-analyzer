import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  Play
} from 'lucide-react';

// John SVG character posing dynamically based on step index
const JohnCharacter = ({ step }) => {
  // Determine expressions & arms based on active scene
  let headY = 0;
  let leftArmRotation = 0;
  let rightArmRotation = 0;
  let mouthPath = "M 45 62 Q 50 67 55 62"; // smile
  let eyesPathL = "M 38 48 A 2 2 0 0 1 42 48"; // happy eye
  let eyesPathR = "M 58 48 A 2 2 0 0 1 62 48";
  let bodyColor = "#4f46e5"; // Indigo hoodie
  let showSpeechBubble = true;

  switch (step) {
    case 0: // Welcome (waving left arm)
      leftArmRotation = -40;
      mouthPath = "M 42 62 Q 50 72 58 62"; // wide smile
      break;
    case 1: // Account Setup (points left)
      rightArmRotation = 30;
      leftArmRotation = -110;
      mouthPath = "M 45 62 Q 50 68 55 62";
      break;
    case 2: // Salary Setup (points right/up)
      rightArmRotation = -85;
      mouthPath = "M 45 62 Q 50 70 55 62";
      break;
    case 3: // Expense Setup (hands wide/juggling)
      leftArmRotation = -60;
      rightArmRotation = 60;
      mouthPath = "M 42 62 Q 50 72 58 62";
      break;
    case 4: // Savings (thumbs up pose / arm up)
      leftArmRotation = -90;
      mouthPath = "M 42 62 Q 50 75 58 62";
      break;
    case 5: // Loan Calculation (thinking pose, hand on chin)
      leftArmRotation = -20;
      rightArmRotation = -140;
      mouthPath = "M 46 64 Q 50 64 54 64"; // neutral mouth
      eyesPathL = "M 38 48 A 3 3 0 0 1 42 48"; // wide eye
      eyesPathR = "M 58 48 A 3 3 0 0 1 62 48";
      break;
    case 6: // Stress Analysis (worried pose)
      leftArmRotation = 10;
      rightArmRotation = 10;
      mouthPath = "M 45 67 Q 50 61 55 67"; // frown
      eyesPathL = "M 36 50 Q 40 45 44 50"; // worried eyes
      eyesPathR = "M 56 50 Q 60 45 64 50";
      headY = 2;
      break;
    case 7: // Emergency Fund (holding lifebuoy / shield)
      leftArmRotation = -30;
      rightArmRotation = -30;
      mouthPath = "M 44 62 Q 50 69 56 62";
      break;
    case 8: // Financial Goals (target lookup, looking up)
      leftArmRotation = -80;
      mouthPath = "M 42 62 Q 50 72 58 62";
      break;
    case 9: // AI Assistant (talking)
      leftArmRotation = -45;
      mouthPath = "M 45 61 Q 50 67 55 65"; // talking mouth shape
      break;
    case 10: // Dashboard completion (celebrating!)
      leftArmRotation = -135;
      rightArmRotation = 135;
      mouthPath = "M 40 60 Q 50 76 60 60"; // super smile
      headY = -4;
      break;
    default:
      break;
  }

  return (
    <div className="relative w-72 h-80 mx-auto flex items-center justify-center">
      {/* Animated Glow Backdrop */}
      <div className="absolute w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl z-10 overflow-visible">
        {/* HAIR (BACK) */}
        <path d="M 32 45 C 30 20, 70 20, 68 45 Z" fill="#1e1b4b" />

        {/* LEFT ARM */}
        <g style={{ transform: `rotate(${leftArmRotation}deg)`, transformOrigin: "26px 65px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <path d="M 26 65 L 12 85 C 10 88, 14 92, 16 89 L 28 72 Z" fill="#312e81" />
          <circle cx="12" cy="85" r="4" fill="#fed7aa" /> {/* hand */}
        </g>

        {/* RIGHT ARM */}
        <g style={{ transform: `rotate(${rightArmRotation}deg)`, transformOrigin: "74px 65px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <path d="M 74 65 L 88 85 C 90 88, 86 92, 84 89 L 72 72 Z" fill="#312e81" />
          <circle cx="88" cy="85" r="4" fill="#fed7aa" /> {/* hand */}
        </g>

        {/* BODY (HOODIE) */}
        <path d="M 25 70 C 25 60, 75 60, 75 70 L 80 120 L 20 120 Z" fill={bodyColor} />
        {/* Draw drawstrings for hoodie */}
        <path d="M 46 72 L 46 90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 54 72 L 54 95" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

        {/* NECK */}
        <rect x="44" y="55" width="12" height="12" fill="#fdba74" rx="2" />

        {/* HEAD */}
        <g style={{ transform: `translateY(${headY}px)`, transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {/* Face */}
          <circle cx="50" cy="48" r="18" fill="#fdba74" />
          {/* Hair Front */}
          <path d="M 32 44 Q 50 30 68 44 Q 50 36 32 44" fill="#1e1b4b" />
          
          {/* EYES */}
          {/* Left Eye */}
          <path d={eyesPathL} stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Right Eye */}
          <path d={eyesPathR} stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* NOSE */}
          <path d="M 49 53 L 51 53 L 50 56 Z" fill="#f97316" />

          {/* MOUTH */}
          <path d={mouthPath} stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" style={{ transition: "all 0.4s" }} />

          {/* CHEEKS */}
          <circle cx="37" cy="55" r="2.5" fill="#f43f5e" opacity="0.3" />
          <circle cx="63" cy="55" r="2.5" fill="#f43f5e" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};

export default function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
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
      title: "👋 Welcome John!",
      subtitle: "Meet your guide companion",
      desc: "Hi, I am John. Let me show you how Smart Loan Analyzer helps me manage my money.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl" />
          <div className="space-y-3">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Profile Summary
            </span>
            <h4 className="text-xl font-bold text-white">John's Portfolio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Age: 28 years old <br />
              Profession: Salaried employee <br />
              Goal: Save money, avoid cash-crunch stress, and plan for a bike loan.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
            🎯 Journey objective: Keep cash reserves healthy
          </div>
        </div>
      )
    },
    {
      title: "👤 Setup Account",
      subtitle: "First Step to Financial Safety",
      desc: "First create your account so the app knows who you are.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Registration
            </span>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-400">Profile Name:</span>
                <span className="text-white font-bold">John</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-white font-semibold">john@example.com</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Verified Demo Profile Details
          </div>
        </div>
      )
    },
    {
      title: "💰 Salary Section",
      subtitle: "Gross Salary vs Net Take-Home",
      desc: "I first add my monthly salary.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between overflow-y-auto">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Salary Breakdown
          </span>
          <div className="space-y-1.5 text-xs my-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Monthly:</span>
              <span className="text-white font-bold">₹60,000</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>Provident Fund (PF, 12%):</span>
              <span>-₹7,200</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>Professional Tax (PT):</span>
              <span>-₹200</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>Income Tax (IT):</span>
              <span>-₹2,000</span>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-900/30 p-2.5 rounded-xl flex justify-between text-xs">
            <span className="text-indigo-300 font-bold">Net Salary:</span>
            <span className="text-indigo-200 font-extrabold">₹50,600</span>
          </div>
        </div>
      )
    },
    {
      title: "🏠 Expense Tracking",
      subtitle: "Keep track of where cash flies",
      desc: "I track where my money goes every month.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Floating Expense Items
          </span>
          <div className="grid grid-cols-2 gap-2 my-2">
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">House Rent</span>
              <span className="text-xs font-bold text-white">₹15,000</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Food</span>
              <span className="text-xs font-bold text-white">₹6,000</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Travel</span>
              <span className="text-xs font-bold text-white">₹2,000</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Bills / Wifi</span>
              <span className="text-xs font-bold text-white">₹7,300</span>
            </motion.div>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-850 pt-2.5">
            <span className="text-slate-400 font-semibold">Total Cost:</span>
            <span className="text-white font-extrabold">₹30,300</span>
          </div>
        </div>
      )
    },
    {
      title: "📊 Understand Savings",
      subtitle: "Remaining Cash Surplus",
      desc: "This tells me how much money I can save.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Savings Cushion
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
              <span className="text-emerald-300 font-extrabold">Remaining Money:</span>
              <span className="text-emerald-200 font-black">₹20,300</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 text-center block">Calculated as: Income - Expenses = Remaining Money</span>
        </div>
      )
    },
    {
      title: "🏦 Check Loan Calculator",
      subtitle: "Simulate and Test EMI",
      desc: "I check if I can afford a loan before taking it.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Bike Loan Simulation
          </span>
          <div className="space-y-2 text-xs my-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Loan Principal:</span>
              <span className="text-white font-bold">₹2,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tenure & Rate:</span>
              <span className="text-white font-semibold">10% / 36 Months</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-2 text-sm text-cyan-400 font-black">
              <span>Calculated EMI:</span>
              <span>₹6,453 / month</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-950/30 border border-amber-900/30 rounded-xl text-[10px] text-amber-300">
            Allows testing how EMI impacts leftover buffers before taking credit.
          </div>
        </div>
      )
    },
    {
      title: "⚠️ Debt Stress Analysis",
      subtitle: "How much of your salary goes to loans",
      desc: "The app tells me if my loans are safe or risky.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Stress Meter
          </span>
          <div className="my-auto space-y-3">
            <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden relative">
              <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full" style={{ width: '100%' }} />
              {/* Pointer indicator */}
              <div className="absolute top-0 w-2.5 h-full bg-white shadow-xl" style={{ left: '32%' }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-bold">Stress level: Risky ⚠️</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px]">
                32% of Surplus Taken
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Alerts John to stop taking more loans when stress spikes.</span>
        </div>
      )
    },
    {
      title: "🛟 Emergency Fund",
      subtitle: "Preparing for unexpected costs",
      desc: "I prepare money for emergencies.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Emergency Reserves
          </span>
          <div className="space-y-3 my-auto">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Fund (3-months):</span>
              <span className="text-white font-bold">₹90,900</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Saved Balance:</span>
              <span className="text-emerald-400 font-bold">₹35,000</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '38%' }} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            John saves a small amount monthly for unexpected problems.
          </div>
        </div>
      )
    },
    {
      title: "🎯 Financial Goals",
      subtitle: "Planning Future Dreams",
      desc: "I plan my future goals.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            Future Goals
          </span>
          <div className="space-y-3 my-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" />
                <span className="text-white font-bold">Car / Bike / House / Education</span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 px-1">
              <span>Goal Cost: ₹2,00,000</span>
              <span className="text-pink-400 font-bold">Requires saving over time</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 text-center block">Calculates exact savings path dynamically.</span>
        </div>
      )
    },
    {
      title: "🤖 AI Assistant",
      subtitle: "Your Money Assistant Friend",
      desc: "I can ask financial questions and get guidance.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 h-64 flex flex-col justify-between">
          <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
            AI Guidance
          </span>
          <div className="space-y-2.5 text-[11px] my-2 overflow-y-auto">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-slate-300 text-right">
              "How do I optimize my monthly spends?"
            </div>
            <div className="p-2 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-indigo-200">
              "🤖 Cut non-core expenses and direct savings to your emergency pot!"
            </div>
          </div>
          <span className="text-[9px] text-slate-500">Powered by advanced intelligence model advisors.</span>
        </div>
      )
    },
    {
      title: "📈 Dashboard",
      subtitle: "Visual overview of cash stability",
      desc: "Now I can see my complete financial health.",
      renderPreview: () => (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
              Health Status
            </span>
            <h4 className="text-xl font-bold text-white mt-2">Score: 72/100</h4>
            <p className="text-xs text-slate-400">
              Charts, active EMI calculations, debt health scores, and premium PDF reporting widgets are active!
            </p>
          </div>
          <div className="text-[10px] text-indigo-400 font-extrabold flex items-center gap-1">
            ✨ Setup is now complete!
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white">Smart Loan & Debt Stress Analyzer</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Tour</p>
          </div>
        </div>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-800"
        >
          <X className="w-4 h-4" />
          Skip Tour
        </button>
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
                  Step {activeStep + 1} / {stepsData.length}
                </span>
                <span className="text-slate-400 font-bold">
                  {Math.round(((activeStep + 1) / stepsData.length) * 100)}% Completed
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
                    : 'border-slate-880 bg-slate-950 hover:bg-slate-900 text-white active:scale-95'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {activeStep === stepsData.length - 1 ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/10 active:scale-95 transition-all border border-emerald-500"
                >
                  Enter Dashboard
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 active:scale-95 transition-all border border-indigo-500"
                >
                  Next Step
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
