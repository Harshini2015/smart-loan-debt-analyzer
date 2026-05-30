import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🚀 [PrivateRoute] checking access. User:', user?.name, '| Loading:', loading, '| Path:', location.pathname);

  if (loading) {
    // Show nothing while auth state is being determined
    return null;
  }

  if (!user) {
    console.log('🚀 [PrivateRoute] No user. → /auth/login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but hasn't completed onboarding,
  // redirect to wizard — unless they're already on /onboarding
  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    console.log('🚀 [PrivateRoute] Onboarding not completed. → /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('🚀 [PrivateRoute] Access granted to:', location.pathname);
  return children;
};

export default PrivateRoute;
