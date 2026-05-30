import React, { createContext, useContext, useState, useCallback } from 'react';
import { dashboardService } from '../services/api';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getData();
      if (response.data && response.data.data) {
        setDashboardData(response.data.data);
      } else {
        throw new Error("Invalid response format from dashboard API");
      }
      return response.data;
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      const errMsg = err.response?.data?.message || err.message || 'Could not connect to API server';
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData, fetchDashboardData, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
