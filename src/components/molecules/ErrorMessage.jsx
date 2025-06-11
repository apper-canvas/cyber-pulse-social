import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onRetry, retryButtonText = 'Try Again', icon = 'AlertCircle' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
      <ApperIcon name={icon} size={48} className="text-error mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
        >
          {retryButtonText}
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;