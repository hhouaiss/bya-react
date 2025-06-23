import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import BurgerMenu from './BurgerMenu';
import LoadingModal from './LoadingModal';

/**
 * HomePage component - Main landing page for BYA app
 * Mobile-first design with Notion-like aesthetics
 */
function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const { generateApp, isGenerating } = useApp();
  const navigate = useNavigate();

  /**
   * Handle app creation with AI generation
   */
  const handleCreateApp = async () => {
    if (!prompt.trim()) return;
    
    setShowLoadingModal(true);
    
    try {
      const appData = await generateApp(prompt);
      setShowLoadingModal(false);
      navigate(`/preview/${appData.id}`);
    } catch (error) {
      console.error('Error creating app:', error);
      setShowLoadingModal(false);
      
      // Show user-friendly error message
      alert(`Failed to create app: ${error.message}. Please check your API key and try again.`);
    }
  };

  /**
   * Handle example idea click
   */
  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  const exampleIdeas = [
    {
      icon: '📝',
      title: 'Habit Tracker',
      description: 'Track daily habits and build consistency',
      prompt: 'Build a habit tracker app to track my daily habits'
    },
    {
      icon: '💰',
      title: 'Expense Tracker',
      description: 'Monitor spending and manage budget',
      prompt: 'Create an expense tracker to manage my budget'
    },
    {
      icon: '✅',
      title: 'Todo List',
      description: 'Organize tasks and boost productivity',
      prompt: 'Build a simple todo list app for task management'
    },
    {
      icon: '📚',
      title: 'Notes App',
      description: 'Capture and organize your thoughts',
      prompt: 'Create a notes app to organize my thoughts'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-notion-bg"
    >
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header with Burger Menu */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-notion-text">BYA</h1>
            <p className="text-notion-muted text-sm">Build Your App in minutes</p>
          </motion.div>
          <BurgerMenu />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <SparklesIcon className="w-16 h-16 text-notion-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-notion-text mb-3">
              Create Apps with AI
            </h2>
            <p className="text-notion-muted text-lg leading-relaxed">
              Describe your idea and watch it come to life instantly
            </p>
          </div>
        </motion.div>

        {/* App Creation Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="notion-card mb-4">
            <label className="block text-notion-text font-medium mb-3">
              What app would you like to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a habit tracker to track my daily water intake and exercise..."
              className="notion-input w-full h-24 resize-none"
              disabled={isGenerating}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateApp}
            disabled={!prompt.trim() || isGenerating}
            className="notion-button w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RocketLaunchIcon className="w-5 h-5" />
            {isGenerating ? 'Creating App...' : 'Build My App'}
          </motion.button>
        </motion.div>

        {/* Example Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-notion-text font-semibold mb-4 text-center">
            Or try these ideas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {exampleIdeas.map((idea, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExampleClick(idea.prompt)}
                className="notion-card text-left p-4 hover:border-notion-accent/70 transition-all duration-200"
              >
                <div className="text-2xl mb-2">{idea.icon}</div>
                <h4 className="text-notion-text font-medium text-sm mb-1">
                  {idea.title}
                </h4>
                <p className="text-notion-muted text-xs leading-relaxed">
                  {idea.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate('/my-apps')}
            className="text-notion-muted hover:text-notion-accent transition-colors duration-200 text-sm font-medium"
          >
            View My Apps →
          </button>
        </motion.div>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <LoadingModal
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
        />
      )}
    </motion.div>
  );
}

export default HomePage;