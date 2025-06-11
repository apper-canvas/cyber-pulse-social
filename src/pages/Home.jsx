import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

export default function Home() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Home Feed
            </h1>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ApperIcon name="Search" size={20} className="text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ApperIcon name="Settings" size={20} className="text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Stories Section */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center border-2 border-gray-600">
              <ApperIcon name="Plus" size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-400">Your Story</span>
          </motion.div>
          
          {['Alex', 'Sarah', 'Mike', 'Emma', 'Jake'].map((name, i) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center border-2 border-gradient-to-r from-primary to-secondary">
                <span className="text-white font-bold">{name.charAt(0)}</span>
              </div>
              <span className="text-xs text-gray-400">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <MainFeature />
    </div>
  );
}