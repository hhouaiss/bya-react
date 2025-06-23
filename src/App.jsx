import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './components/HomePage';
import MyAppsPage from './components/MyAppsPage';
import AppPreview from './components/AppPreview';
import { AppProvider } from './context/AppContext';
import './index.css';

/**
 * Main App component with routing and global state management
 * Mobile-first design with Notion-like aesthetics
 */
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-notion-bg">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-apps" element={<MyAppsPage />} />
              <Route path="/preview/:appId" element={<AppPreview />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;