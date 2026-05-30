# Smart Loan & Debt Stress Analyzer

## Overview

Smart Loan & Debt Stress Analyzer is an AI-powered financial management platform designed to help individuals gain better control over their finances. The application provides loan tracking, debt stress analysis, emergency fund planning, goal management, and personalized financial guidance through an AI assistant powered by **Groq AI**.

---

## Features

### Dashboard
- Comprehensive financial overview
- Loan summaries and key metrics
- Debt health stress score visualization
- Personalized insights

### My Loans
- Track active loans
- Monitor EMI payments
- View loan details and repayment progress

### Loan Simulation
- Simulate different loan scenarios
- Compare repayment plans
- Analyze interest and EMI impacts

### Debt Stress Analysis
- Evaluate financial stress levels
- Generate debt stress scores (DTI-based)
- Receive actionable recommendations

### Emergency Fund Planner
- Calculate recommended emergency savings
- Track emergency fund readiness
- Micro-savings intensity settings

### Family Finance
- Manage household finances
- Shared wallet and family group views
- Analyze family expenses and obligations

### My Goals
- Set financial goals
- Monitor savings progress
- Track achievement milestones

### AI Financial Assistant
- Powered by Groq AI (`llama-3.3-70b-versatile`)
- Answers finance-related questions
- Budgeting and debt management guidance
- Replies in English, Hindi, or Kannada (language selector in chat)

### Multi-Language Support
- English, Hindi, and Kannada UI strings
- AI responses follow the selected chat language

---

## Tech Stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB Atlas |
| **AI** | Groq API |

---

## Project Structure

```text
smart-loan-analyzer/
├── frontend/          # React + Vite UI
├── backend/           # Express API + Groq proxy
├── README.md
└── .gitignore
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v8 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- [Groq API key](https://console.groq.com/keys) (`gsk_...`)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-loan-debt-analyzer.git
cd smart-loan-debt-analyzer
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Groq key
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Optional: set VITE_API_BASE_URL if the API is not on localhost:5000
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Environment variables

Do **not** commit `.env` files. Use the example templates:

| File | Purpose |
|------|---------|
| `backend/.env.example` | Copy to `backend/.env` |
| `frontend/.env.example` | Copy to `frontend/.env.local` |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string (`mongodb+srv://...`) |
| `MONGO_URI_STANDARD` | Optional non-SRV Atlas URI (fallback if SRV DNS fails) |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GROQ_API_KEY` | Groq API key (must start with `gsk_`) |
| `GROQ_MODEL` | Model name (default `llama-3.3-70b-versatile`) |
| `NODE_ENV` | Set to `production` when deploying |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default `http://localhost:5000/api`) |

### MongoDB Atlas (deployment)

1. Create a cluster and database user.
2. **Network Access** → allow your server IP or `0.0.0.0/0` for cloud hosts.
3. Copy the connection string into `MONGO_URI`.

---

## API overview

Base URL: `http://localhost:5000/api`

| Area | Examples |
|------|----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Dashboard | `GET /dashboard`, `PUT /dashboard/financial-info` |
| Loans | `GET /loan`, `POST /loan`, `POST /loan/simulate` |
| Stress | `POST /stress/analyze` |
| AI (Groq) | `POST /ai/chat` (public proxy; key stays on server) |
| Assistant | `POST /assistant/chat` (authenticated) |
| Fund / Family / Goals | `/api/fund`, `/api/family`, `/api/goals` |

Health check: `GET /api/health`

---

## Deployment notes

- Set the same environment variables on your host (Render, Railway, VPS, etc.).
- Use `NODE_ENV=production` so the backend uses MongoDB Atlas only (no local fallback).
- Point the frontend `VITE_API_BASE_URL` to your deployed API URL before building (`npm run build`).
- Never expose `GROQ_API_KEY` or `JWT_SECRET` in the frontend or in git.

---

## Future enhancements

- Credit score prediction
- Advanced financial forecasting
- Mobile application
- Financial report generation (PDF export)
- Deeper AI budgeting recommendations

---

## Author

**Harshini S**

Computer Science Engineering Student

Passionate about full stack development, AI integration, and financial technology.

---

## License

This project is developed for **educational and portfolio purposes**.
