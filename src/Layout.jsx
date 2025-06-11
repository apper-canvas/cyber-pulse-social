import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden order-2 flex-shrink-0">
        <nav className="bg-surface/80 backdrop-blur-lg border-t border-gray-700">
          <div className="flex justify-around items-center py-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
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
        <aside className="w-64 bg-surface/50 backdrop-blur-lg border-r border-gray-700 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Pulse Social
              </span>
            </div>
            
            <nav className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

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