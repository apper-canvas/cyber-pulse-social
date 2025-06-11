import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            activeFilter === filter.id
              ? 'bg-gradient-to-r from-primary to-secondary text-white'
              : 'bg-surface/50 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <ApperIcon name={filter.icon} size={16} />
          <span>{filter.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;