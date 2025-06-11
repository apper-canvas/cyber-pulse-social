import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PostActions = ({
  likesCount,
  commentCount,
  isLikedByCurrentUser,
  onLike,
  onCommentToggle,
  likeAnimationActive,
  onShare,
  onBookmark
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-6">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLike}
          className={`flex items-center space-x-2 transition-colors ${
            isLikedByCurrentUser ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <div className="relative">
            <ApperIcon
              name="Heart"
              size={20}
              className={isLikedByCurrentUser ? 'fill-current' : ''}
            />
            {likeAnimationActive && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 text-red-500"
              >
                <ApperIcon name="Heart" size={20} className="fill-current" />
              </motion.div>
            )}
          </div>
          <span className="text-sm font-medium">{likesCount}</span>
        </Button>

        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCommentToggle}
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <ApperIcon name="MessageCircle" size={20} />
          <span className="text-sm font-medium">{commentCount}</span>
        </Button>

        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
        >
          <ApperIcon name="Share" size={20} />
        </Button>
      </div>

      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBookmark}
        className="text-gray-400 hover:text-yellow-400 transition-colors"
      >
        <ApperIcon name="Bookmark" size={20} />
      </Button>
    </div>
  );
};

export default PostActions;