import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      try {
        // Simple token validation (you might want to decode and check expiration)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    }
  }, [token, dispatch]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;