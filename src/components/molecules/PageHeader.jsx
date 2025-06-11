import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ title, showBackButton = false, onBackClick, rightContent, unreadCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackClick}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-gray-400" />
              </Button>
            )}
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </h1>
            {unreadCount !== undefined && unreadCount > 0 && (
              <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          {rightContent}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;