import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { SnackbarProvider } from './Snackbar';
import Layout from './Layout';
import Documentation from './Documentation/Documentation';
import Error from '../pages/error';
import Login from '../pages/login';
import Verify from '../pages/verify';
import Reset from '../pages/reset';
import { useUserState } from '../context/UserContext';
import { NotificationProvider } from '../store/alert-context';

export default function App() {
  const isAuth = !!localStorage.getItem('token');
  const { isAuthenticated } = useUserState(); 

  return (
    <NotificationProvider>
      <SnackbarProvider>
        <Router>
          <Routes>
            {/* Redirect root to /app/dashboard */}
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute isAuth={isAuth}><Login /></PublicRoute>} />
            <Route path="/verify-email" element={<PublicRoute isAuth={isAuth}><Verify /></PublicRoute>} />
            <Route path="/password-reset" element={<PublicRoute isAuth={isAuth}><Reset /></PublicRoute>} />

            {/* Documentation (Public or Private depending on your need) */}
            <Route path="/documentation/*" element={<Documentation />} />

            {/* Private Routes - Layout uses nested routes */}
            
            <Route 
          path="/app/*" 
          element={<PrivateRoute isAuth={isAuthenticated}><Layout /></PrivateRoute>} 
        />

            {/* Fallback to Error page */}
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </NotificationProvider>
  );
}

// PrivateRoute Wrapper
export function PrivateRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

// PublicRoute Wrapper
function PublicRoute({ isAuth, children }) {
  return !isAuth ? children : <Navigate to="/app/dashboard" replace />;
}
