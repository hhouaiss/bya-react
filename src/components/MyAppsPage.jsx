import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  RectangleStackIcon,
  CalendarIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import BurgerMenu from './BurgerMenu';

/**
 * MyAppsPage component - Display user's saved apps
 * Enhanced mobile-first design with modern card layout
 */
function MyAppsPage() {
  const { savedApps, dispatch } = useApp();
  const navigate = useNavigate();

  /**
   * Handle app deletion
   */
  const handleDeleteApp = (appId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this app?')) {
      dispatch({ type: 'DELETE_APP', payload: appId });
    }
  };

  /**
   * Handle app preview
   */
  const handleViewApp = (appId) => {
    navigate(`/preview/${appId}`);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Get app icon based on type
   */
  const getAppIcon = (type) => {
    const icons = {
      productivity: '⚡',
      finance: '💰',
      health: '🏥',
      education: '📚',
      entertainment: '🎮',
      social: '👥',
      utility: '🔧',
      other: '📱'
    };
    return icons[type] || icons.other;
  };

  /**
   * Get app type color
   */
  const getTypeColor = (type) => {
    const colors = {
      productivity: 'from-blue-500 to-purple-600',
      finance: 'from-green-500 to-emerald-600',
      health: 'from-red-500 to-pink-600',
      education: 'from-yellow-500 to-orange-600',
      entertainment: 'from-purple-500 to-indigo-600',
      social: 'from-pink-500 to-rose-600',
      utility: 'from-gray-500 to-slate-600',
      other: 'from-blue-500 to-cyan-600'
    };
    return colors[type] || colors.other;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-notion-bg"
    >
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-notion-card border border-notion-border text-notion-text hover:bg-notion-card-hover hover:border-notion-accent/30 transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-notion-text">My Apps</h1>
              <p className="text-notion-muted text-sm">{savedApps.length} apps created</p>
            </div>
          </div>
          <BurgerMenu />
        </div>

        {/* Apps Content */}
        {savedApps.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center py-20"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-notion-accent/10 to-notion-accent-light/10 rounded-full blur-xl"></div>
              <RectangleStackIcon className="relative w-20 h-20 text-notion-muted mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-notion-text mb-3">
              No apps yet
            </h3>
            <p className="text-notion-muted mb-10 leading-relaxed max-w-sm mx-auto">
              Create your first app with AI and start building amazing experiences
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="notion-button flex items-center gap-3 mx-auto relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-notion-accent-light to-notion-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className="relative w-5 h-5" />
              <span className="relative">Create First App</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Apps Grid */
          <div className="space-y-4">
            {savedApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="notion-card cursor-pointer group relative overflow-hidden"
                onClick={() => handleViewApp(app.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(app.type)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative flex items-start gap-4">
                  {/* App Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-notion-bg border border-notion-border flex items-center justify-center text-2xl group-hover:border-notion-accent/30 transition-colors duration-300">
                      {getAppIcon(app.type)}
                    </div>
                  </div>
                  
                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-notion-text group-hover:text-notion-accent transition-colors duration-200 truncate text-lg">
                        {app.name}
                      </h3>
                      <div className="flex items-center gap-2 ml-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewApp(app.id);
                          }}
                          className="p-2 rounded-lg text-notion-muted hover:text-notion-accent hover:bg-notion-bg transition-all duration-200"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteApp(app.id, e)}
                          className="p-2 rounded-lg text-notion-muted hover:text-red-400 hover:bg-notion-bg transition-all duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <p className="text-notion-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                      {app.description}
                    </p>
                    
                    {/* App Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-notion-muted">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatDate(app.createdAt)}</span>
                      </div>
                      <div className={`notion-badge bg-gradient-to-r ${getTypeColor(app.type)} text-white border-0`}>
                        {app.type}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create New App Button */}
        {savedApps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="notion-button flex items-center gap-3 mx-auto relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-notion-accent-light to-notion-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className="relative w-5 h-5" />
              <span className="relative">Create New App</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default MyAppsPage;