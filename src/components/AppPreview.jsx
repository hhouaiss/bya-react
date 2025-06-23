import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  HeartIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Check if app is saved
  useEffect(() => {
    const isAppSaved = savedApps.some(app => app.id === appId);
    setIsSaved(isAppSaved);
  }, [savedApps, appId]);

  // Get app content
  const appContent = generatedApps.get(appId);
  const appData = currentApp?.id === appId ? currentApp : savedApps.find(app => app.id === appId);

  /**
   * Handle saving the current app
   */
  const handleSaveApp = () => {
    if (!isSaved && currentApp) {
      saveCurrentApp();
      setIsSaved(true);
    }
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
   * Copy app code to clipboard
   */
  const handleCopyCode = async () => {
    if (appContent) {
      try {
        await navigator.clipboard.writeText(appContent);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-notion-bg/80 backdrop-blur-sm border-b border-notion-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-notion-card border border-notion-border hover:border-notion-accent/50 transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-notion-text" />
            </motion.button>
            <div>
              <h1 className="font-semibold text-notion-text">{appData.name}</h1>
              <p className="text-notion-muted text-sm">{appData.description}</p>
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

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-4 z-50">
        <div className="flex flex-col gap-3">
          {/* Follow Up Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFollowUpModal(true)}
            disabled={isGenerating}
            className="w-12 h-12 bg-notion-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </motion.button>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveApp}
            disabled={isSaved}
            className={`
              w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center
              ${isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-notion-card border border-notion-border text-notion-text hover:border-notion-accent/50'
              }
            `}
          >
            {isSaved ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </motion.button>

          {/* View Code Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCodeModal(true)}
            className="w-12 h-12 bg-notion-card border border-notion-border text-notion-text rounded-full shadow-lg hover:shadow-xl hover:border-notion-accent/50 transition-all duration-200 flex items-center justify-center"
          >
            <CodeBracketIcon className="w-5 h-5" />
          </motion.button>

          {/* Copy Code Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyCode}
            className={`
              w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center
              ${copiedCode 
                ? 'bg-green-500 text-white' 
                : 'bg-notion-card border border-notion-border text-notion-text hover:border-notion-accent/50'
              }
            `}
          >
            {copiedCode ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <DocumentDuplicateIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

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