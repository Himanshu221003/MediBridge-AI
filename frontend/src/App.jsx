import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PrescriptionScanner from './pages/PrescriptionScanner';
import MedicineLookup from './pages/MedicineLookup';
import HealthChat from './pages/HealthChat';
import VoiceAssistant from './pages/VoiceAssistant';
import EmergencyInfo from './pages/EmergencyInfo';
import AdminPanel from './pages/AdminPanel';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950">
        <div className="w-8 h-8 border-4 border-healthcare-200 border-t-healthcare-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Main App Router
function App() {
  return (
    <Router>
      <LanguageProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ocr"
                element={
                  <ProtectedRoute>
                    <PrescriptionScanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicines"
                element={
                  <ProtectedRoute>
                    <MedicineLookup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <HealthChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/voice-assistant"
                element={
                  <ProtectedRoute>
                    <VoiceAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emergency"
                element={
                  <ProtectedRoute>
                    <EmergencyInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
