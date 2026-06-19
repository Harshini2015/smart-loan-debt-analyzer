import axios from "axios";

// Automatically check environment variable or fallback to production
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://smart-loan-debt-analyzer.onrender.com/api",
  withCredentials: true,
});

// Automatically attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= AUTH =================
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  me: () => API.get("/auth/me"),
};

// ================= DASHBOARD =================
export const dashboardService = {
  getData: () => API.get("/dashboard"),
  updateFinancialInfo: (data) => API.put("/dashboard/financial-info", data),
};

// ================= LOANS =================
export const loanService = {
  getLoans: () => API.get("/loan"),
  create: (data) => API.post("/loan", data),
  simulate: (loan, whatIf) => API.post("/loan/simulate", { loan, whatIf }),
};

// ================= FINANCE =================
export const financeService = {
  analyze: ({ monthlyIncome, monthlyExpenses, loans }) =>
    API.post("/finance/analyze", { monthlyIncome, monthlyExpenses, loans }),
};

// ================= STRESS =================
export const stressService = {
  analyze: (data) => API.post("/stress/analyze", data),
};

// ================= AI ASSISTANT =================
export const assistantService = {
  chat: (payload) => API.post("/assistant/chat", payload),
};

// Public AI endpoint (Groq)
export const aiService = {
  chat: (payload) => API.post('/ai/chat', payload),
};
// ================= ADMIN =================
export const adminService = {
  getUsers: () => API.get("/admin/users"),
  getLoans: () => API.get("/admin/loans"),
};

// ================= SUGGESTIONS =================
export const suggestionsService = {
  get: (data) => API.post("/suggestions/get", data),
};


// ================= EMERGENCY FUND =================
export const emergencyFundService = {
  setup:        (data)   => API.post('/fund/setup', data),
  status:       ()       => API.get('/fund/status'),
  deposit:      (data)   => API.post('/fund/deposit', data),
  withdraw:     (data)   => API.post('/fund/withdraw', data),
  transactions: (params) => API.get('/fund/transactions', { params }),
};

// ================= FAMILY =================
export const familyService = {
  getMyGroup: () => API.get('/family/my-group'),
  create: (data) => API.post('/family/create', data),
  invite: (data) => API.post('/family/invite', data),
  dashboard: (groupId) => API.get(`/family/${groupId}/dashboard`),
  topup: (groupId, data) => API.post(`/family/${groupId}/wallet/topup`, data),
};

// ================= VOICE =================
// Voice endpoints removed: voice features deprecated and APIs removed.

// ================= GOALS =================
export const goalService = {
  list:         ()             => API.get('/goals/list'),
  create:       (data)         => API.post('/goals/create', data),
  update:       (id, data)     => API.put(`/goals/${id}`, data),
  markComplete: (id)           => API.patch(`/goals/${id}/complete`),
  remove:       (id)           => API.delete(`/goals/${id}`),
  // legacy — kept for backward compat
  timeline:     (userId)       => API.get(`/goals/${userId}/timeline`),
};


// ================= ONBOARDING =================
export const onboardingService = {
  status: () => API.get('/onboarding/status'),
  complete: (data) => API.post('/onboarding/complete', data),
};

export default API;
