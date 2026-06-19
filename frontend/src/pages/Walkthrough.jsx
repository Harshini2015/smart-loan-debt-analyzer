import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  PlusCircle, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Compass, 
  Home, 
  HelpCircle, 
  ShieldAlert, 
  HeartHandshake, 
  Users, 
  Target, 
  MessageSquareCode, 
  AreaChart,
  Sparkles,
  MapPin
} from 'lucide-react';

const WALKTHROUGH_STEPS = [
  {
    id: 0,
    title: "👋 Welcome John",
    subtitle: "Your Financial Journey Starts Here",
    lat: 51.505,
    lng: -0.09,
    icon: User,
    color: "indigo",
    explanation: "Welcome to your financial adventure! We will guide you through simple steps to master your money. Meet John, a friendly character who will show us how to use this app.",
    example: {
      "Character": "John",
      "Age": "28 years old",
      "Goal": "Wants to buy a bike and save money safely"
    }
  },
  {
    id: 1,
    title: "👤 Create Account",
    subtitle: "Step 1: Introducing Yourself",
    lat: 51.51,
    lng: -0.08,
    icon: User,
    color: "sky",
    explanation: "First create your account so the app knows who you are.",
    example: {
      "Name": "John",
      "Email": "john@example.com",
      "Password": "John123"
    }
  },
  {
    id: 2,
    title: "💰 Add Salary",
    subtitle: "Step 2: Tell Us How Much Money You Earn",
    lat: 51.52,
    lng: -0.07,
    icon: DollarSign,
    color: "emerald",
    explanation: "Tell us how much money you earn. We subtract tax (money for the government) and PF (savings for when you grow old) to see what is actually left in your hand.",
    example: {
      "Gross Salary": "₹60,000 / month",
      "PF (Savings for Future, 12%)": "-₹7,200",
      "Professional Tax (PT)": "-₹200",
      "Income Tax (IT)": "-₹2,000",
      "Net Take-Home Salary": "₹50,600 (This is the money John actually gets!)"
    }
  },
  {
    id: 3,
    title: "🏠 Add Expenses",
    subtitle: "Step 3: Tell the App Where Your Money Goes",
    lat: 51.515,
    lng: -0.05,
    icon: PlusCircle,
    color: "rose",
    explanation: "Tell the app where your money goes. We track rent, food, travel, and bills so you see exactly where you spend.",
    example: {
      "House Rent": "₹15,000",
      "Food & Snacks": "₹6,000",
      "Bus/Bike Travel": "₹2,000",
      "Electricity & Water": "₹1,500",
      "Internet/Wifi": "₹800",
      "Health Insurance": "₹2,000",
      "Other Spends": "₹3,000",
      "Total Expenses": "₹30,300"
    }
  },
  {
    id: 4,
    title: "📊 Understand Savings",
    subtitle: "Step 4: Money Left to Save",
    lat: 51.505,
    lng: -0.04,
    icon: TrendingUp,
    color: "teal",
    explanation: "After expenses, this is the money you can save or use.",
    example: {
      "Income": "₹50,600",
      "Expenses": "-₹30,300",
      "Remaining Money (Surplus)": "₹20,300"
    }
  },
  {
    id: 5,
    title: "🏦 Check Loan",
    subtitle: "Step 5: Borrowing Safely",
    lat: 51.495,
    lng: -0.05,
    icon: Compass,
    color: "cyan",
    explanation: "Before taking a loan, check if you can afford it. The app calculates your monthly EMI (repayments) so you don't run into trouble.",
    example: {
      "Bike Loan Cost": "₹2,00,000",
      "Monthly Repayment (EMI)": "₹6,453 / month for 3 years",
      "Is it Affordable?": "Risky! It takes 32% of John's remaining money."
    }
  },
  {
    id: 6,
    title: "⚠️ Debt Stress Analysis",
    subtitle: "Step 6: Is Your Debt Safe?",
    lat: 51.485,
    lng: -0.07,
    icon: ShieldAlert,
    color: "amber",
    explanation: "The app checks if your loans are becoming difficult. It shows how much of your salary is going into loans.",
    example: {
      "How much of salary goes to loans": "32% of remaining money",
      "Stress Level": "Warning ⚠️ (Highly Leveraged)"
    }
  },
  {
    id: 7,
    title: "🛟 Emergency Fund",
    subtitle: "Step 7: Safety Piggy Bank",
    lat: 51.48,
    lng: -0.09,
    icon: HeartHandshake,
    color: "blue",
    explanation: "Save money for unexpected problems like doctor visits or emergencies so you don't have to borrow in a panic.",
    example: {
      "Target Fund": "₹90,900 (Enough to cover rent & food for 3 months!)",
      "Current Status": "John is saving ₹5,000 every month towards this."
    }
  },
  {
    id: 8,
    title: "👨👩👧 Family Finance",
    subtitle: "Step 8: Sharing is Caring",
    lat: 51.49,
    lng: -0.11,
    icon: Users,
    color: "violet",
    explanation: "Manage family income and expenses. Combine budgets with other family members to hit joint goals.",
    example: {
      "Joint Household Income": "₹1,20,000 / month",
      "Combined Family Bills": "₹55,000 / month"
    }
  },
  {
    id: 9,
    title: "🎯 Financial Goals",
    subtitle: "Step 9: Plan Your Future Dreams",
    lat: 51.50,
    lng: -0.12,
    icon: Target,
    color: "pink",
    explanation: "Plan your future dreams like buying a car, a house, or paying for college. Set milestones and allocate savings.",
    example: {
      "Dream Bike Cost": "₹2,00,000",
      "Time Left": "12 months",
      "Needs to Save": "₹16,666 / month to buy it without loans!"
    }
  },
  {
    id: 10,
    title: "🤖 AI Assistant",
    subtitle: "Step 10: Your Money Robot Friend",
    lat: 51.51,
    lng: -0.11,
    icon: MessageSquareCode,
    color: "purple",
    explanation: "Ask questions and get financial guidance. Type questions to get instant, multilingual advice.",
    example: {
      "John asks": "How can I buy my bike faster?",
      "AI Robot answers": "Cut down on 'Other Spends' (₹3,000) and save ₹18,000/month instead!"
    }
  },
  {
    id: 11,
    title: "📈 Dashboard Insights",
    subtitle: "Step 11: Complete Financial Health",
    lat: 51.515,
    lng: -0.10,
    icon: AreaChart,
    color: "yellow",
    explanation: "See your complete financial health. View charts, health scores, and premium recommendations.",
    example: {
      "Financial Health Score": "72 / 100",
      "Rating": "Good (John is in good shape!)"
    }
  }
];

const customMarkerHtml = (stepNum, active) => {
  const label = stepNum === 0 ? '👋' : stepNum.toString();
  return `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid ${active ? '#818cf8' : '#334155'};
      background-color: ${active ? '#4f46e5' : '#1e293b'};
      color: ${active ? '#ffffff' : '#94a3b8'};
      font-weight: 800;
      font-size: 13px;
      box-shadow: ${active ? '0 0 12px #6366f1' : 'none'};
      transition: all 0.3s ease;
      cursor: pointer;
    ">
      ${active ? `<div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #6366f1;
        opacity: 0.4;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>` : ''}
      <span style="position: relative; z-index: 10;">${label}</span>
    </div>
    <style>
      @keyframes ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    </style>
  `;
};

export default function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  // Initialize Map
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        center: [WALKTHROUGH_STEPS[0].lat, WALKTHROUGH_STEPS[0].lng],
        zoom: 13,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstance.current = map;

      // Draw polyline connecting all steps
      const latlngs = WALKTHROUGH_STEPS.map(s => [s.lat, s.lng]);
      L.polyline(latlngs, {
        color: '#6366f1',
        weight: 3,
        dashArray: '5, 10',
        opacity: 0.7
      }).addTo(map);

      // Add markers
      WALKTHROUGH_STEPS.forEach((step, idx) => {
        const active = idx === activeStep;
        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: customMarkerHtml(idx, active),
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([step.lat, step.lng], { icon })
          .addTo(map)
          .on('click', () => {
            setActiveStep(idx);
          });

        markersRef.current[idx] = marker;
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map position and marker active styles on step change
  useEffect(() => {
    if (mapInstance.current) {
      const step = WALKTHROUGH_STEPS[activeStep];
      mapInstance.current.flyTo([step.lat, step.lng], 14, {
        animate: true,
        duration: 1.5
      });

      // Update all marker icons
      WALKTHROUGH_STEPS.forEach((s, idx) => {
        const marker = markersRef.current[idx];
        if (marker) {
          const active = idx === activeStep;
          marker.setIcon(L.divIcon({
            className: 'custom-leaflet-marker',
            html: customMarkerHtml(idx, active),
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          }));
        }
      });
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep < WALKTHROUGH_STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const currentStepData = WALKTHROUGH_STEPS[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Smart Loan Walkthrough</h1>
            <p className="text-xs text-slate-400 font-semibold">Interactive Leaflet Guided Journey</p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold transition-all border border-slate-700 shadow"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative min-h-0">
        {/* Leaflet Map Section */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 relative z-0">
          <div ref={mapRef} className="w-full h-full absolute inset-0" />
          
          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl z-[1000] text-[10px] text-slate-300 font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            🗺️ Click Map Pins to Navigate Journey
          </div>
        </div>

        {/* Story Info Panel */}
        <div className="w-full lg:w-[420px] bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-850 p-6 flex flex-col justify-between overflow-y-auto shrink-0 z-10 shadow-2xl">
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-indigo-400 uppercase tracking-widest">
                  Landmark {activeStep + 1} / {WALKTHROUGH_STEPS.length}
                </span>
                <span className="text-slate-400 font-bold">
                  {Math.round(((activeStep + 1) / WALKTHROUGH_STEPS.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500 rounded-full"
                  style={{ width: `${((activeStep + 1) / WALKTHROUGH_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Description Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="bg-slate-950/60 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg tracking-tight">{currentStepData.title}</h3>
                      <p className="text-[11px] text-slate-400 font-semibold">{currentStepData.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-slate-300 text-sm leading-relaxed font-medium bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
                    {currentStepData.explanation}
                  </div>
                </div>

                {/* Example Context Container */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/40 border border-indigo-900/30 rounded-3xl p-5 shadow-lg space-y-3">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Real Example: John's Financials
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                    {Object.entries(currentStepData.example).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start gap-4">
                        <span className="text-slate-400 font-bold">{key}:</span>
                        <span className="text-white text-right font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-8 gap-4">
            <button
              onClick={handlePrev}
              disabled={activeStep === 0}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeStep === 0 
                  ? 'border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed' 
                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Prev
            </button>

            {activeStep === WALKTHROUGH_STEPS.length - 1 ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-all border border-emerald-500"
              >
                Go to App Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all border border-indigo-500"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
