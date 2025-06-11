import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PostGridItem = ({ post, index }) => {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="aspect-square bg-surface/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden cursor-pointer group"
    >
      {post.imageUrls && post.imageUrls.length > 0 ? (
        <div className="relative h-full">
          <img
            src={post.imageUrls[0]}
            alt="Post content"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Heart" size={14} />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MessageCircle" size={14} />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {post.user?.displayName?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-gray-400 text-xs">@{post.user?.username || 'unknown'}</span>
            </div>
            <p className="text-white text-sm line-clamp-4 break-words">{post.content}</p>
          </div>
          <div className="flex items-center justify-between text-gray-400 text-xs mt-3">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Heart" size={12} />
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageCircle" size={12} />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostGridItem;