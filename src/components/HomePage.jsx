import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, SparklesIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import BurgerMenu from './BurgerMenu';
import LoadingModal from './LoadingModal';

/**
 * HomePage component - Main landing page for BYA app
 * Enhanced mobile-first design with modern aesthetics
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
      prompt: 'Build a habit tracker app to track my daily habits',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '💰',
      title: 'Expense Tracker',
      description: 'Monitor spending and manage budget',
      prompt: 'Create an expense tracker to manage my budget',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: '✅',
      title: 'Todo List',
      description: 'Organize tasks and boost productivity',
      prompt: 'Build a simple todo list app for task management',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: '📚',
      title: 'Notes App',
      description: 'Capture and organize your thoughts',
      prompt: 'Create a notes app to organize my thoughts',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-notion-bg"
    >
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with Burger Menu */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-notion-text bg-gradient-to-r from-notion-accent to-notion-accent-light bg-clip-text text-transparent">
              BYA
            </h1>
            <p className="text-notion-muted text-sm font-medium">Build Your App in minutes</p>
          </motion.div>
          <BurgerMenu />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-notion-accent/20 to-notion-accent-light/20 rounded-full blur-xl"></div>
              <SparklesIcon className="relative w-20 h-20 text-notion-accent mx-auto" />
            </div>
            <h2 className="text-4xl font-bold text-notion-text mb-4 leading-tight">
              Create Apps with
              <span className="bg-gradient-to-r from-notion-accent to-notion-accent-light bg-clip-text text-transparent"> AI</span>
            </h2>
            <p className="text-notion-muted text-lg leading-relaxed max-w-sm mx-auto">
              Describe your idea and watch it come to life instantly
            </p>
          </div>
        </motion.div>

        {/* App Creation Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-12"
        >
          <div className="notion-card mb-6">
            <label className="block text-notion-text font-semibold mb-4 text-lg">
              What app would you like to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a habit tracker to track my daily water intake and exercise..."
              className="notion-input w-full h-32 resize-none text-base"
              disabled={isGenerating}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateApp}
            disabled={!prompt.trim() || isGenerating}
            className="notion-button w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-notion-accent-light to-notion-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <RocketLaunchIcon className="relative w-6 h-6" />
            <span className="relative">{isGenerating ? 'Creating App...' : 'Build My App'}</span>
          </motion.button>
        </motion.div>

        {/* Example Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h3 className="text-notion-text font-semibold mb-6 text-center text-lg">
            Or try these ideas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {exampleIdeas.map((idea, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleExampleClick(idea.prompt)}
                className="notion-card-compact text-left relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${idea.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-3xl mb-3">{idea.icon}</div>
                  <h4 className="text-notion-text font-semibold text-sm mb-2">
                    {idea.title}
                  </h4>
                  <p className="text-notion-muted text-xs leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate('/my-apps')}
            className="text-notion-muted hover:text-notion-accent transition-colors duration-200 text-sm font-medium flex items-center gap-2 mx-auto group"
          >
            <span>View My Apps</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
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