import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import { AuthProvider, useAuth } from './components/AuthContext'; 

// Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import SupportCenter from './pages/Supportcentre';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import BudgetTracking from './pages/BudgetTracking';
// import ForgotPassword from './components/ForgotPassword';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Page transition wrapper component
const PageTransitionWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3 }
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// Animated Routes with location-based transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransitionWrapper><HomePage /></PageTransitionWrapper>} />
        <Route 
          path="/dashboard" 
          element={
            // <ProtectedRoute>
              <PageTransitionWrapper><Dashboard /></PageTransitionWrapper>
            // </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <PageTransitionWrapper><Settings /></PageTransitionWrapper>
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<PageTransitionWrapper><Login /></PageTransitionWrapper>} />
        <Route path="/signup" element={<PageTransitionWrapper><SignUp /></PageTransitionWrapper>} />
        {/* <Route path="/forgot-password" element={<PageTransitionWrapper><ForgotPassword /></PageTransitionWrapper>} /> */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageTransitionWrapper><UserProfile /></PageTransitionWrapper>
            </ProtectedRoute>
          } 
        />
        <Route path="/privacy" element={<PageTransitionWrapper><PrivacyPolicy /></PageTransitionWrapper>} />
        <Route path="/terms" element={<PageTransitionWrapper><TermsOfService /></PageTransitionWrapper>} />
        <Route path="/faq" element={<PageTransitionWrapper><FAQ /></PageTransitionWrapper>} />
        <Route path="/about" element={<PageTransitionWrapper><AboutUs /></PageTransitionWrapper>} />
        <Route path="/supportcenter" element={<PageTransitionWrapper><SupportCenter /></PageTransitionWrapper>} />
        <Route path="/how-it-works" element={<PageTransitionWrapper><HowItWorks /></PageTransitionWrapper>} />
        <Route 
          path="/budget-tracking" 
          element={
            <ProtectedRoute>
              <PageTransitionWrapper><BudgetTracking /></PageTransitionWrapper>
            </ProtectedRoute>
          } 
        />
        {/* Catch all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;