import React from 'react';
import { motion } from 'framer-motion';

const ProfileStat = ({ count, label, onClick, clickable = false }) => {
  const Component = clickable ? motion.button : 'div';
  
  return (
    <Component
      onClick={clickable ? onClick : undefined}
      whileHover={clickable ? { scale: 1.05 } : undefined}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      className={`text-center ${clickable ? 'cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors' : ''}`}
    >
      <div className="text-xl font-bold text-white">{count || 0}</div>
      <div className="text-sm font-medium text-gray-400">{label}</div>
    </Component>
  );
};

export default ProfileStat;