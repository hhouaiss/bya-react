import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  RectangleStackIcon,
  CalendarIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import BurgerMenu from './BurgerMenu';

/**
 * MyAppsPage component - Display user's saved apps
 * Mobile-first design with Notion-like aesthetics
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
   * Get app type icon
   */
  const getAppIcon = (type) => {
    switch (type) {
      case 'habit':
        return '📝';
      case 'expense':
        return '💰';
      case 'notes':
        return '📚';
      case 'todo':
      default:
        return '✅';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-notion-bg"
    >
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-notion-card border border-notion-border hover:border-notion-accent/50 transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-notion-text" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-notion-text">My Apps</h1>
              <p className="text-notion-muted text-sm">
                {savedApps.length} {savedApps.length === 1 ? 'app' : 'apps'} created
              </p>
            </div>
          </div>
          <BurgerMenu />
        </div>

        {/* Empty State */}
        {savedApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <RectangleStackIcon className="w-16 h-16 text-notion-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-notion-text mb-2">
              No apps yet
            </h3>
            <p className="text-notion-muted mb-8 leading-relaxed">
              Create your first app with AI and start building amazing experiences
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="notion-button flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              Create First App
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
                transition={{ delay: index * 0.1 }}
                className="notion-card cursor-pointer group"
                onClick={() => handleViewApp(app.id)}
              >
                <div className="flex items-start gap-4">
                  {/* App Icon */}
                  <div className="text-3xl">{getAppIcon(app.type)}</div>
                  
                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-notion-text group-hover:text-notion-accent transition-colors duration-200 truncate">
                        {app.name}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewApp(app.id);
                          }}
                          className="p-1 rounded text-notion-muted hover:text-notion-accent transition-colors duration-200"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteApp(app.id, e)}
                          className="p-1 rounded text-notion-muted hover:text-red-400 transition-colors duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <p className="text-notion-muted text-sm mb-3 line-clamp-2">
                      {app.description}
                    </p>
                    
                    {/* App Meta */}
                    <div className="flex items-center gap-4 text-xs text-notion-muted">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(app.createdAt)}</span>
                      </div>
                      <div className="px-2 py-1 bg-notion-bg rounded text-xs font-medium capitalize">
                        {app.type}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-notion-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Create New App Button */}
        {savedApps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="notion-button flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              Create New App
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default MyAppsPage;