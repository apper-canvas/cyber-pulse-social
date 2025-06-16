import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

export default function Layout() {
  const location = useLocation();
  const [unreadCounts, setUnreadCounts] = useState({
    messages: 3,
    notifications: 7
  });

  const getUnreadCount = (routeId) => {
    if (routeId === 'messages') return unreadCounts.messages;
    if (routeId === 'notifications') return unreadCounts.notifications;
    return 0;
  };
return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Navigation */}
      <header className="bg-surface/80 backdrop-blur-lg border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <span className="ml-3 text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Pulse Social
              </span>
            </div>

            {/* Center Navigation - Main Items */}
            <nav className="hidden md:flex items-center space-x-8">
              {routeArray.filter(route => ['/', '/home', '/explore', '/create'].includes(route.path)).map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative
                    ${isActive 
                      ? 'text-gray-900 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {route.path === '/create' ? (
                        <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                          <ApperIcon name={route.icon} size={18} className="text-white" />
                        </div>
                      ) : (
                        <ApperIcon name={route.icon} size={18} />
                      )}
                      <span className="font-medium">{route.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="topNavActiveIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Navigation - Secondary Items (Icons Only) */}
            <div className="flex items-center space-x-4">
              {routeArray.filter(route => ['/notifications', '/messages'].includes(route.path)).map((route) => {
                const unreadCount = getUnreadCount(route.path.replace('/', ''));
                
                return (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) => `
                      relative p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'text-gray-900 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                      }
                    `}
                  >
                    <div className="relative">
                      <ApperIcon name={route.icon} size={20} />
                      {unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-xs font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden order-2 flex-shrink-0">
        <nav className="bg-surface/80 backdrop-blur-lg border-t border-gray-200">
          <div className="flex justify-around items-center py-2">
            {routeArray.filter(route => !route.hidden).map((route) => {
              const unreadCount = getUnreadCount(route.path.replace('/', ''));
              
              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) => `
                    flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {route.path === '/create' ? (
                        <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full">
                          <ApperIcon name={route.icon} size={20} className="text-white" />
                        </div>
                      ) : (
                        <div className="relative">
                          <ApperIcon name={route.icon} size={20} />
                          {unreadCount > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            </motion.div>
                          )}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                            />
                          )}
                        </div>
                      )}
                      <span className="text-xs mt-1 font-medium">{route.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Main Content */}
      <div className="md:hidden flex-1 overflow-y-auto order-1">
        <Outlet />
      </div>
    </div>
  );
}