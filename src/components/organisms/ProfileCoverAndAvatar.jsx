import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';

const ProfileCoverAndAvatar = ({ user, onBackClick }) => {
  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
        >
          <ApperIcon name="Camera" size={16} />
        </Button>
      </div>

      <div className="absolute -bottom-16 left-6">
        <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-background flex items-center justify-center relative">
          <Avatar initial={user?.displayName?.charAt(0) || 'U'} size="xl" />
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full"
          >
            <ApperIcon name="Camera" size={14} />
          </Button>
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackClick}
          className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
        >
          <ApperIcon name="ArrowLeft" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCoverAndAvatar;