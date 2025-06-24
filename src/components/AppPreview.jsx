import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FollowUpModal from './FollowUpModal';
import CodeModal from './CodeModal';

/**
 * AppPreview component - Display and interact with generated apps
 * Mobile-first design with floating action menu
 */
function AppPreview() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { 
    currentApp, 
    savedApps, 
    generatedApps, 
    saveCurrentApp, 
    updateAppWithFollowUp,
    isGenerating 
  } = useApp();
  
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Auto-register generated apps to "My Apps" when component mounts
  useEffect(() => {
    if (currentApp?.id === appId && !savedApps.some(app => app.id === appId)) {
      saveCurrentApp();
    }
  }, [currentApp, appId, savedApps, saveCurrentApp]);

  // Get app content - prioritize saved app code over generatedApps Map
  const appData = currentApp?.id === appId ? currentApp : savedApps.find(app => app.id === appId);
  const appContent = appData?.code || generatedApps.get(appId);

  /**
   * Navigate back to home screen
   */
  const handleBackToHome = () => {
    navigate('/');
  };

  /**
   * Handle follow-up changes
   */
  const handleFollowUp = async (followUpPrompt) => {
    try {
      await updateAppWithFollowUp(appId, followUpPrompt);
      setShowFollowUpModal(false);
    } catch (error) {
      console.error('Error applying follow-up:', error);
    }
  };

  /**
   * Toggle settings menu
   */
  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  if (!appData || !appContent) {
    return (
      <div className="min-h-screen bg-notion-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-notion-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-notion-muted">Loading app...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-notion-bg relative"
    >
      {/* Minimal header - hidden by default for native app feel */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </motion.button>
            <div>
              <h1 className="font-medium text-white text-sm">{appData.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* App Content */}
      <div className="relative">
        <iframe
          srcDoc={appContent}
          className="w-full h-screen border-none"
          title={appData.name}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showSettingsMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px]"
            >
              {/* Follow Up */}
              <motion.button
                whileHover={{ backgroundColor: '#f8fafc' }}
                onClick={() => {
                  setShowFollowUpModal(true);
                  setShowSettingsMenu(false);
                }}
                disabled={isGenerating}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-800 font-medium">Follow Up</span>
              </motion.button>

              {/* See Code */}
              <motion.button
                whileHover={{ backgroundColor: '#f8fafc' }}
                onClick={() => {
                  setShowCodeModal(true);
                  setShowSettingsMenu(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <CodeBracketIcon className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 font-medium">See Code</span>
              </motion.button>

              {/* Back to Home */}
              <motion.button
                whileHover={{ backgroundColor: '#f8fafc' }}
                onClick={() => {
                  handleBackToHome();
                  setShowSettingsMenu(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <HomeIcon className="w-5 h-5 text-purple-600" />
                <span className="text-gray-800 font-medium">Back to Home</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSettingsMenu}
          className="w-14 h-14 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200"
        >
          <motion.div
            animate={{ rotate: showSettingsMenu ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <CogIcon className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </div>

      {/* Click outside to close settings menu */}
      {showSettingsMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettingsMenu(false)}
        />
      )}

      {/* Modals */}
      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onSubmit={handleFollowUp}
        isLoading={isGenerating}
      />

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        code={appContent}
        appName={appData.name}
      />
    </motion.div>
  );
}

export default AppPreview;