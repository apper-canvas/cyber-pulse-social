import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PostOptions = ({ onPhotoClick }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-gray-700">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
          onClick={onPhotoClick}
        >
          <ApperIcon name="Image" size={20} />
          <span className="text-sm">Photo</span>
        </Button>

        <Button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-gray-400 hover:text-secondary transition-colors"
        >
          <ApperIcon name="Video" size={20} />
          <span className="text-sm">Video</span>
        </Button>

        <Button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-gray-400 hover:text-accent transition-colors"
        >
          <ApperIcon name="Smile" size={20} />
          <span className="text-sm">Emoji</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <ApperIcon name="Globe" size={16} className="text-gray-400" />
        <span className="text-sm text-gray-400">Everyone can reply</span>
      </div>
    </div>
  );
};

export default PostOptions;