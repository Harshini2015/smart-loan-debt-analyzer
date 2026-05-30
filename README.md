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

### 📊 Dashboard
- Financial overview
- Loan summaries
- Debt stress score visualization
- Personalized insights

### 💳 Loan Management
- Track active loans
- EMI tracking
- Repayment progress

### 📈 Loan Simulation
- Compare loan scenarios
- EMI & interest analysis

### ⚠️ Debt Stress Analysis
- Debt-to-income evaluation
- Stress scoring system
- Smart recommendations

### 💰 Emergency Fund Planner
- Savings planning
- Emergency readiness estimation

### 👨‍👩‍👧 Family Finance
- Household expense tracking
- Shared finance view

### 🎯 Financial Goals
- Goal setting
- Progress tracking

### 🤖 AI Financial Assistant
- Powered by Groq AI (Llama-3.3-70B)
- Financial guidance chatbot
- Supports English, Hindi, Kannada

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

## ⚠️ Security Notes
- Never commit `.env` files
- Never expose API keys in frontend
- Store secrets only in deployment platforms
- Rotate keys if exposed

---

## 📌 Future Improvements
- Credit score prediction
- AI financial planner enhancement
- PDF report generation
- Mobile app version
- Advanced analytics dashboard

---

## 👩‍💻 Author
Harshini S  
Computer Science Engineering Student  
Full Stack Developer | AI Enthusiast

---
```
