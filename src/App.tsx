import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { darkTheme } from './config/theme';
import { queryClient } from './services/api';

// Components
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import CompanyForm from './components/company/CompanyForm';

// Route Protection
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/register"
                element={
                  <ProtectedRoute>
                    <CompanyForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/edit"
                element={
                  <ProtectedRoute>
                    <CompanyForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: '#0a1525',
              border: '1px solid rgba(0, 247, 255, 0.3)',
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;