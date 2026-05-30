import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🚀 [AuthContext] Initializing. Token present:', !!token);
    if (token) {
      authAPI
        .me()
        .then((res) => {
          const userData = res.data?.data;
          console.log('🚀 [AuthContext] Token verified. User:', userData);
          console.log('🚀 [AuthContext] onboardingCompleted:', userData?.onboardingCompleted);
          setUser(userData);
        })
        .catch((err) => {
          console.error('🚀 [AuthContext] Token verification failed:', err.message);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('token', token);
    console.log('🚀 [AuthContext] Login success. onboardingCompleted:', userData?.onboardingCompleted);
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('token', token);
    console.log('🚀 [AuthContext] Register success. onboardingCompleted:', userData?.onboardingCompleted);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Called after onboarding wizard completes so state updates immediately
  const markOnboardingComplete = () => {
    setUser(prev => prev ? { ...prev, onboardingCompleted: true } : prev);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshKey, triggerRefresh, markOnboardingComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
