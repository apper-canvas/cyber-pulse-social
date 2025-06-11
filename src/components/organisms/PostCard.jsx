import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserDisplay from '@/components/molecules/UserDisplay';
import PostActions from '@/components/molecules/PostActions';
import CommentInput from '@/components/molecules/CommentInput';
import ApperIcon from '@/components/ApperIcon'; // Needed for sample comment

const PostCard = ({ post, currentUser, onLike, onAddComment, likeAnimationActive }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const toggleComments = () => setExpandedComments(prev => !prev);

  const handleCommentSubmit = () => {
    onAddComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.1 }}
      className="bg-surface/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
    >
      <div className="p-6 pb-4">
        <UserDisplay user={post.user} timestamp={post.createdAt}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ApperIcon name="MoreHorizontal" size={16} className="text-gray-400" />
          </motion.button>
        </UserDisplay>
      </div>

      <div className="px-6 pb-4">
        <p className="text-white leading-relaxed break-words">{post.content}</p>
      </div>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden">
            {post.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Post content"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-6 pb-4 pt-2 border-t border-gray-700">
        <PostActions
          likesCount={post.likes.length}
          commentCount={post.commentCount}
          isLikedByCurrentUser={currentUser ? post.likes.includes(currentUser.id) : false}
          onLike={() => onLike(post.id)}
          onCommentToggle={toggleComments}
          likeAnimationActive={likeAnimationActive}
          onShare={() => console.log('Share clicked')}
          onBookmark={() => console.log('Bookmark clicked')}
        />
      </div>

      <AnimatePresence>
        {expandedComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-700 bg-gray-800/30"
          >
            <div className="p-6 space-y-4">
              <CommentInput
                currentUser={currentUser}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onPostComment={handleCommentSubmit}
              />

              {/* Sample Comments (as per original logic, not fetched) */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">J</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white text-sm">johndoe</span>
                      <span className="text-gray-400 text-xs">2h</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">Great post! Really love this content 🔥</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-gray-400 hover:text-red-400 text-xs flex items-center space-x-1">
                        <ApperIcon name="Heart" size={14} />
                        <span>12</span>
                      </button>
                      <button className="text-gray-400 hover:text-blue-400 text-xs">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default PostCard;