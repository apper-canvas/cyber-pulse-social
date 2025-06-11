import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TabNavigation from '@/components/molecules/TabNavigation';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const ProfileContentTabs = ({ posts, navigate }) => {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'Grid3X3', count: posts.length },
    { id: 'media', label: 'Media', icon: 'Image', count: posts.filter(p => p.imageUrls?.length > 0).length },
    { id: 'likes', label: 'Likes', icon: 'Heart', count: posts.reduce((sum, p) => sum + p.likes.length, 0) }
  ];

  const filteredMedia = posts
    .filter(post => post.imageUrls && post.imageUrls.length > 0)
    .flatMap(post => post.imageUrls);

  return (
    <>
      <div className="px-6">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="px-6 pb-6">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="FileText" size={48} className="text-gray-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-gray-400 mb-4">Share your first post to get started!</p>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
                  onClick={() => navigate('/create')}
                >
                  Create Post
                </Button>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                >
                  <p className="text-white mb-4 break-words">{post.content}</p>
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {post.imageUrls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Post content"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Heart" size={14} />
                        <span>{post.likes.length}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="MessageCircle" size={14} />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                    <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-3 gap-2">
            {filteredMedia.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <ApperIcon name="Image" size={48} className="text-gray-400 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">No Media Yet</h3>
                <p className="text-gray-400">Photos and videos you post will appear here</p>
              </div>
            ) : (
              filteredMedia.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-12">
            <ApperIcon name="Heart" size={48} className="text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Private Likes</h3>
            <p className="text-gray-400">Posts you've liked are kept private</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileContentTabs;