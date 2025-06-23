import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, CogIcon } from '@heroicons/react/24/outline';

/**
 * LoadingModal component - Shows AI generation progress
 * Notion-like design with engaging animations
 */
function LoadingModal({ isOpen, onClose }) {
  const loadingSteps = [
    'Analyzing your idea...',
    'Designing the interface...',
    'Generating code...',
    'Adding functionality...',
    'Finalizing your app...'
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  // Simulate loading progress
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, loadingSteps.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-notion-card border border-notion-border rounded-xl p-8 max-w-sm w-full text-center"
          >
            {/* AI Icon with Animation */}
            <div className="mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-notion-accent to-purple-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-2 bg-notion-card rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-notion-accent" />
                </div>
              </motion.div>
              
              <h3 className="text-xl font-semibold text-notion-text mb-2">
                Creating Your App
              </h3>
              <p className="text-notion-muted text-sm">
                Our AI is working its magic...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3 mb-6">
              {loadingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index <= currentStep 
                      ? 'bg-notion-accent scale-110' 
                      : 'bg-notion-border'
                    }
                  `} />
                  <span className={`
                    text-sm transition-all duration-300
                    ${index <= currentStep 
                      ? 'text-notion-text font-medium' 
                      : 'text-notion-muted'
                    }
                  `}>
                    {step}
                  </span>
                  {index === currentStep && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="ml-auto"
                    >
                      <CogIcon className="w-4 h-4 text-notion-accent" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-notion-border rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-notion-accent to-purple-500 h-2 rounded-full"
              />
            </div>

            {/* Progress Percentage */}
            <p className="text-notion-muted text-xs">
              {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}% Complete
            </p>

            {/* Cancel Button (Optional) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="mt-6 text-notion-muted hover:text-notion-text transition-colors duration-200 text-sm font-medium"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingModal;