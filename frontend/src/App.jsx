import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import Simulation from "./pages/Simulation";
import StressAnalysis from "./pages/StressAnalysis";
import AdminPanel from "./pages/AdminPanel";
import FundDashboard from "./pages/FundDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import GoalsDashboard from "./pages/GoalsDashboard";
import PrivateRoute from "./pages/PrivateRoute";
import Onboarding from "./pages/Onboarding";
import Walkthrough from "./pages/Walkthrough";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DashboardProvider>
            <Routes>
              {/* Public */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Walkthrough */}
              <Route
                path="/walkthrough"
                element={
                  <PrivateRoute>
                    <Walkthrough />
                  </PrivateRoute>
                }
              />

              {/* Onboarding — protected but outside main layout */}
              <Route
                path="/onboarding"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />

              {/* Protected app (requires onboarding complete) */}
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="loans" element={<Loans />} />
                <Route path="simulation" element={<Simulation />} />
                <Route path="analysis" element={<StressAnalysis />} />
                <Route path="emergency-fund" element={<FundDashboard />} />
                <Route path="family" element={<FamilyDashboard />} />
                <Route path="goals" element={<GoalsDashboard />} />
                <Route path="admin" element={<AdminPanel />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
          </DashboardProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
