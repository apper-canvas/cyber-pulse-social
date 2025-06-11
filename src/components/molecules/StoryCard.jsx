import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const StoryCard = ({ type = 'user', name, initial, avatarGradient = 'from-accent to-primary', onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
      onClick={handleClick}
    >
      {type === 'your' ? (
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center border-2 border-gray-600 hover:border-primary transition-colors">
          <ApperIcon name="Plus" size={20} className="text-white" />
        </div>
      ) : (
        <div className="relative">
          <Avatar 
            initial={initial} 
            size="lg" 
            className="border-2 border-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform" 
            gradient={avatarGradient} 
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 hover:opacity-20 transition-opacity" />
        </div>
      )}
<span className="text-xs text-gray-400 max-w-[64px] truncate">{name}</span>
    </motion.div>
  );
};

export default StoryCard;