import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WingsIntro from './animations/WingsIntro';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

// Auth Pages
import LoginSelect from './pages/auth/LoginSelect';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import AgentLogin from './pages/auth/AgentLogin';
import AgentSignup from './pages/auth/AgentSignup';
import AdminLogin from './pages/auth/AdminLogin';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard & Protected Pages
import UserDashboard from './pages/user/UserDashboard';
import MemoryVault from './pages/user/MemoryVault';
import EmotionDirector from './pages/user/EmotionDirector';
import Profile from './pages/user/Profile';
import Wishlist from './pages/user/Wishlist';
import TransactionHistory from './pages/user/TransactionHistory';
import AgentDashboard from './pages/agent/AgentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import InfoPage from './pages/info/InfoPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const log = (msg) => {
  const logs = JSON.parse(sessionStorage.getItem('debug_logs') || '[]');
  logs.push(`${new Date().toISOString()}: [App] ${msg}`);
  sessionStorage.setItem('debug_logs', JSON.stringify(logs.slice(-50)));
  console.log('[App] ' + msg);
};

const PageWrapper = ({ children }) => {
  log('PageWrapper Rendering');
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  log('App component function called');
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    log('App useEffect [showIntro] triggering');
    
    // Check for page refresh
    const [navigation] = performance.getEntriesByType('navigation');
    if (navigation && navigation.type === 'reload' && window.location.pathname !== '/') {
      log('Page refresh detected. Redirecting to Home.');
      window.location.href = '/';
      return;
    }

    setShowIntro(true);
  }, []);

  log('App Rendering with showIntro = ' + showIntro);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-center" />
        {showIntro && <WingsIntro onComplete={() => setShowIntro(false)} />}
        <div className="flex flex-col min-h-screen bg-wwPrimary overflow-x-hidden relative">
          <div className="watermark-bg" />
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/packages" element={<PageWrapper><Packages /></PageWrapper>} />
                <Route path="/package/:id" element={<PageWrapper><PackageDetail /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<PageWrapper><LoginSelect /></PageWrapper>} />
                <Route path="/user/login" element={<PageWrapper><UserLogin /></PageWrapper>} />
                <Route path="/user/signup" element={<PageWrapper><UserSignup /></PageWrapper>} />
                <Route path="/agent/login" element={<PageWrapper><AgentLogin /></PageWrapper>} />
                <Route path="/agent/signup" element={<PageWrapper><AgentSignup /></PageWrapper>} />
                <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
                <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />

                {/* Protected User Routes */}
                <Route path="/user/dashboard" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><UserDashboard /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/profile" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><Profile /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/memory-vault" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><MemoryVault /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/emotion-director" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><EmotionDirector /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/track/:id" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><EmotionDirector /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/vault/:bookingId" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><MemoryVault /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/wishlist" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><Wishlist /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/user/transactions" element={
                  <ProtectedRoute roles={['user']}>
                    <PageWrapper><TransactionHistory /></PageWrapper>
                  </ProtectedRoute>
                } />

                {/* Protected Agent Routes */}
                <Route path="/agent/dashboard" element={
                  <ProtectedRoute roles={['agent']}>
                    <PageWrapper><AgentDashboard /></PageWrapper>
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <PageWrapper><AdminDashboard /></PageWrapper>
                  </ProtectedRoute>
                } />

                {/* Info Routes */}
                <Route path="/info/:type" element={<PageWrapper><InfoPage /></PageWrapper>} />
                <Route path="/feedback" element={<PageWrapper><Feedback /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
