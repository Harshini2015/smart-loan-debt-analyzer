# 💰 Smart Loan & Debt Stress Analyzer

An AI-powered full-stack MERN application designed to help users manage loans, analyze debt stress, plan emergency funds, and receive intelligent financial guidance using Groq AI.

---

## 🚀 Live Demo

- 🌐 Frontend (Vercel):
https://smart-loan-debt-analyzer.vercel.app/

- ⚙️ Backend (Render API):
https://smart-loan-debt-analyzer.onrender.com

---

## ✨ Features

- **Dashboard**: High-fidelity modern financial dashboard style overview with responsive cards, micro-animations, and visual metrics.
- **Interactive Walkthrough Guide**: Interactive Leaflet.js-based timeline map routing that guides new users through every section of the application with clear, simple examples.
- **Loan Management**: Track active loans, monthly EMIs, and overall repayment progress.
- **Loan Simulation**: Compare loan configurations, tenure options, and interest burdens.
- **Debt Stress Analysis**: Real-time Debt-to-Income (DTI) ratio tracking, stress severity categories, and mitigation suggestions.
- **Emergency Fund Planner**: Plan your buffer runway based on monthly core outflows.
- **Family Finance**: Shared household views and joint liability budgets.
- **Financial Goals**: Define long-term milestones and align savings ratios.
- **AI Financial Assistant**: Integrated chat assistant powered by Groq (Llama 3.3 70B) supporting multiple languages (English, Kannada, Hindi).
- **Salary Module**: Net take-home calculator incorporating PF (12%), Professional Tax (PT), and Income Tax (IT) deductions.
- **Expense Tracking**: Itemized breakdown for Rent, Food, Utilities, Transport, Wifi, and Insurance.
- **Disposable Income Engine**: Identifies surplus headroom for budgeting security.
- **Financial Health Score**: Score algorithm utilizing savings ratios, DTI values, and expense margins.
- **In-App Financial Summary**: Real-time summary overview outlining deductions, outflows, surplus margins, and advisor observations.

---

## 📖 How To Use / User Guide

Our application features a step-by-step onboarding process to construct your financial profile:

1. **Register/Login**: Set up a new secure profile. For quick testing, you can register as:
   - **Name**: John
   - **Email**: john@example.com
   - **Password**: John123
2. **Salary Configuration**: Input your monthly Gross Salary. The system automatically computes your PF deduction (e.g. 12% of Gross) and subtracts Professional Tax (PT) and Income Tax (IT) to yield your exact **Net Take-Home Salary**.
   - *Example*: Gross (₹60,000) - PF (₹7,200) - PT (₹200) - IT (₹2,000) = **₹50,600 Net Take-home**.
3. **Expense Tracking**: Enter itemized core expenditures (Rent, Food, Transportation, Electricity, Internet, Insurance, etc.). The system aggregates these to display your total monthly outflows.
   - *Example*: Rent (₹15k) + Food (₹6k) + Transport (₹2k) + Electricity (₹1.5k) + Internet (₹800) + Insurance (₹2k) + Other (₹3k) = **₹30,300 Total Expenses**.
4. **Disposable Income**: Calculate your cash surplus (Net Salary - Total Expenses) to evaluate how much free cash remains for savings and investments.
   - *Example*: ₹50,600 Net - ₹30,300 Expenses = **₹20,300 Disposable surplus**.
5. **Loan Simulation**: Test target loan scenarios by specifying Principal, Interest Rate, and Tenure. The engine dynamically computes the monthly EMI and interest metrics.
   - *Example*: Simulated bike loan of ₹2,00,000 at 10% for 36 months calculates the precise EMI, total payback, and interest rates.
6. **Affordability Analysis**: Instantly checks if simulated EMIs are **Highly Affordable** (<=30% of disposable income), **Risky** (30%-50%), or **Not Affordable** (>50%).
7. **In-App Summary View**: Review your dynamic Financial Health score (Savings, Expense, and Debt ratios) and toggle the **In-App Financial Summary** view to see a detailed advisor breakdown directly on screen.

---

## 🗺️ Walkthrough Guide

New users can open the walkthrough page to learn the complete application via an interactive step-by-step map/timeline journey using Leaflet.js.

It explains the features in simple, easy-to-understand language:
- **Account Setup & Salary Deductions**: Creating a profile and adding gross income to calculate deductions.
- **Expenses & Savings**: Adding rent, food, transport, and bills to understand remaining cash.
- **Loan Checks & Debt Stress**: Checking EMI affordability and mapping stress indicators (DTI ratios) without technical complexity.
- **Goals & Emergency Reserve**: Building a safety fund runway and setting savings targets.
- **AI Financial Guidance**: Querying the built-in advisor to optimize your savings budget.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, Recharts, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Authentication | JWT |
| AI | Groq API |

---

## 📂 Project Structure

```
smart-loan-analyzer/
├── frontend/
├── backend/
└── README.md
```

---

## ⚙️ Local Setup

### Clone Repository
```bash
git clone https://github.com/Harshini2015/smart-loan-debt-analyzer.git
cd smart-loan-debt-analyzer
```

---

### Backend Setup
```bash
cd backend
npm install
npm start
```

Backend runs at:  
http://localhost:5000

---

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:  
http://localhost:5173

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=production
```

---

## 🌐 API Base URL
https://smart-loan-debt-analyzer.onrender.com/api

---

## 🚀 Deployment
- Backend: Hosted on Render, auto deploy from GitHub
- Frontend: Hosted on Vercel, auto build & deploy

---

## 👩‍💻 Author
Harshini S  
