import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-700 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-all ${
            activeTab === tab.id
              ? 'text-white border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <ApperIcon name={tab.icon} size={16} />
          <span className="font-medium">{tab.label}</span>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
            {tab.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TabNavigation;