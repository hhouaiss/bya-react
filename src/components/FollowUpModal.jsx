import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

/**
 * FollowUpModal component - Handle app modifications through AI
 * Mobile-first design with Notion-like aesthetics
 */
function FollowUpModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [followUpPrompt, setFollowUpPrompt] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (followUpPrompt.trim() && !isLoading) {
      onSubmit(followUpPrompt.trim());
      setFollowUpPrompt('');
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion) => {
    setFollowUpPrompt(suggestion);
  };

  const suggestions = [
    'Add a dark mode toggle',
    'Make the design more colorful',
    'Add data export functionality',
    'Include progress statistics',
    'Add notification reminders',
    'Improve the mobile layout'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-notion-card border border-notion-border rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-notion-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-notion-accent/20 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-notion-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-notion-text">Improve Your App</h3>
                  <p className="text-notion-muted text-sm">Tell AI what you'd like to change</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-notion-bg transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5 text-notion-muted" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-notion-text font-medium mb-2">
                    What would you like to change?
                  </label>
                  <textarea
                    value={followUpPrompt}
                    onChange={(e) => setFollowUpPrompt(e.target.value)}
                    placeholder="e.g., Add a dark mode toggle, change the color scheme, add new features..."
                    className="notion-input w-full h-24 resize-none"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!followUpPrompt.trim() || isLoading}
                  className="notion-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Applying Changes...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Apply Changes
                    </>
                  )}
                </motion.button>
              </form>

              {/* Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LightBulbIcon className="w-4 h-4 text-notion-accent" />
                  <span className="text-notion-text font-medium text-sm">Quick suggestions</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                      className="text-left p-3 rounded-lg bg-notion-bg border border-notion-border hover:border-notion-accent/50 text-notion-text text-sm transition-all duration-200 disabled:opacity-50"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-notion-bg rounded-lg p-4">
                <p className="text-notion-muted text-xs leading-relaxed">
                  💡 <strong>Tip:</strong> Be specific about what you want to change. 
                  The AI works best with clear, detailed instructions.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FollowUpModal;