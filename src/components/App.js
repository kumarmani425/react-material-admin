import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Use BrowserRouter and Routes from react-router-dom v6
import { SnackbarProvider } from './Snackbar';

// Components
import Layout from './Layout';
import Documentation from './Documentation/Documentation';

// Pages
import ErrorPage from '../pages/error';
import Login from '../pages/login';
import Verify from '../pages/verify';
import Reset from '../pages/reset';

// Context
import { useUserState } from '../context/UserContext';

export default function App() {
  const { isAuthenticated } = useUserState();
  const isAuth = isAuthenticated();

  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to /app/profile */}
          <Route path="/" element={<Navigate to="/app/profile" replace />} />

          {/* Redirect /app to /app/dashboard */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

          {/* Documentation route */}
          <Route path="/documentation" element={<Documentation />} />

          {/* Public routes */}
          <Route path="/login" element={isAuth ? <Navigate to="/app/dashboard" replace /> : <Login />} />
          <Route path="/verify-email" element={isAuth ? <Navigate to="/app/dashboard" replace /> : <Verify />} />
          <Route path="/password-reset" element={isAuth ? <Navigate to="/app/dashboard" replace /> : <Reset />} />

          {/* Protected route for /app/* - renders Layout with nested routes */}
          <Route path="/app/*" element={isAuth ? <Layout /> : <Navigate to="/login" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}