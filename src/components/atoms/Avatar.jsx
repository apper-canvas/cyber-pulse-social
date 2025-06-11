import React from 'react';

const Avatar = ({ initial, size = 'default', className, gradient = 'from-primary to-secondary' }) => {
  const sizeClasses = {
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-12 h-12 text-lg',
    'lg': 'w-16 h-16 text-xl',
    'xl': 'w-32 h-32 text-4xl',
    'default': 'w-12 h-12 text-lg', // Default to md size
  };

  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-bold">
        {initial}
      </span>
    </div>
  );
};

export default Avatar;