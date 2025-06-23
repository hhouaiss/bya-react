import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  HomeIcon, 
  RectangleStackIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

/**
 * BurgerMenu component - Mobile navigation menu
 * Notion-like design with smooth animations
 */
function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Handle navigation and close menu
   */
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      icon: RectangleStackIcon,
      label: 'My Apps',
      path: '/my-apps',
      isActive: location.pathname === '/my-apps'
    },
    {
      icon: PlusIcon,
      label: 'New App',
      path: '/',
      isActive: false
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Burger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-notion-card border border-notion-border hover:border-notion-accent/50 transition-all duration-200"
      >
        <Bars3Icon className="w-5 h-5 text-notion-text" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-notion-card border border-notion-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200
                      hover:bg-notion-accent/10 hover:text-notion-accent
                      ${item.isActive 
                        ? 'bg-notion-accent/10 text-notion-accent border-r-2 border-notion-accent' 
                        : 'text-notion-text'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.button>
                );
              })}
              
              {/* Divider */}
              <div className="border-t border-notion-border my-1" />
              
              {/* Additional Options */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-3"
              >
                <p className="text-notion-muted text-xs">
                  BYA v1.0 - Build Your App
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BurgerMenu;