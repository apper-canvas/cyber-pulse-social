import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

export default function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({
    messages: 3,
    notifications: 7
  });

  // Auto-collapse on medium screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getUnreadCount = (routeId) => {
    if (routeId === 'messages') return unreadCounts.messages;
    if (routeId === 'notifications') return unreadCounts.notifications;
    return 0;
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden order-2 flex-shrink-0">
<nav className="bg-surface/80 backdrop-blur-lg border-t border-gray-700">
          <div className="flex justify-around items-center py-2">
            {routeArray.filter(route => !route.hidden).map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                  ${route.id === 'create' ? 'relative' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    {route.id === 'create' ? (
                      <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full">
                        <ApperIcon name={route.icon} size={20} className="text-white" />
                      </div>
                    ) : (
                      <div className="relative">
                        <ApperIcon name={route.icon} size={20} />
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                          />
                        )}
                      </div>
                    )}
                    <span className="text-xs mt-1 font-medium">{route.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

{/* Desktop Sidebar */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <motion.aside 
          animate={{ 
            width: isCollapsed ? '80px' : '256px'
          }}
          transition={{ 
            duration: 0.3, 
            ease: 'easeInOut' 
          }}
          className="bg-surface/50 backdrop-blur-lg border-r border-gray-700 flex-shrink-0 relative"
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 w-6 h-6 bg-surface border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors z-10 hidden lg:flex"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={14} 
              className="text-gray-400" 
            />
          </button>

          <div className="p-6">
            {/* Logo */}
            <motion.div 
              className="flex items-center mb-8"
              animate={{ 
                justifyContent: isCollapsed ? 'center' : 'flex-start' 
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="ml-3 text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap overflow-hidden"
                  >
                    Pulse Social
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Navigation */}
<nav className="space-y-2">
              {routeArray.filter(route => !route.hidden).map((route) => {
                const unreadCount = getUnreadCount(route.path.replace('/', ''));
                
                return (
                  <div key={route.path} className="relative">
<NavLink
                      to={route.path}
                      onMouseEnter={() => setHoveredItem(route.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={({ isActive }) => `
                        flex items-center p-3 rounded-xl transition-all duration-200 relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }
                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                      `}
                    >
                      <div className="relative flex-shrink-0">
                        <ApperIcon name={route.icon} size={20} />
                        {unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-white">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium whitespace-nowrap overflow-hidden"
                          >
                            {route.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
{/* Tooltip for collapsed state */}
                    <AnimatePresence>
                      {isCollapsed && hoveredItem === route.path && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50"
                        >
                          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-gray-700 whitespace-nowrap">
                            {route.label}
                            {unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-error rounded-full text-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>
        </motion.aside>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Main Content */}
      <div className="md:hidden flex-1 overflow-y-auto order-1">
        <Outlet />
      </div>
    </div>
  );
}