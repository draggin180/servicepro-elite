import JobTestViewer from "./components/JobTestViewer";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Import components
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import OnboardingWizard from './components/OnboardingWizard'
import ClientManagement from './components/ClientManagement'
import QuoteBuilder from './components/QuoteBuilder'
import ScheduleView from './components/ScheduleView'
import InvoiceHistory from './components/InvoiceHistory'
import BillingDashboard from './components/BillingDashboard'

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  // Check if user needs onboarding
  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }
  
  return children
}

// Onboarding Route component
function OnboardingRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  if (user.onboardingComplete) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      
      {/* Onboarding route */}
      <Route path="/onboarding" element={
        <OnboardingRoute>
          <OnboardingWizard />
        </OnboardingRoute>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/clients" element={
        <ProtectedRoute>
          <ClientManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/quotes" element={
        <ProtectedRoute>
          <QuoteBuilder />
        </ProtectedRoute>
      } />
      
      <Route path="/schedule" element={
        <ProtectedRoute>
          <ScheduleView />
        </ProtectedRoute>
      } />
      
      <Route path="/invoices" element={
        <ProtectedRoute>
          <InvoiceHistory />
        </ProtectedRoute>
      } />
      
      <Route path="/billing" element={
        <ProtectedRoute>
          <BillingDashboard />
        </ProtectedRoute>
      } />

      {/* 🔥 TEST ROUTE - Safe to delete later */}
      <Route path="/test-jobs" element={<JobTestViewer />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
