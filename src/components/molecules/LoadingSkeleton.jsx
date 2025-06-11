import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'post', count = 3 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'post':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-gray-700 rounded-xl"></div>
            </div>
          </motion.div>
        );
      case 'notification':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700"
          >
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        );
      case 'explore-grid':
        return (
            <div key={index} className="aspect-square bg-surface/50 rounded-xl animate-pulse" />
        );
      case 'profile':
        return (
          <div key={index} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
              <div className="absolute -bottom-16 left-6">
                <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-background animate-pulse"></div>
              </div>
            </div>
            <div className="px-6 pt-20 pb-6 space-y-4">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${type === 'explore-grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : ''}`}>
      {[...Array(count)].map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default LoadingSkeleton;