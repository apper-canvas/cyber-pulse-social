import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import UserDisplay from '@/components/molecules/UserDisplay';
import PostActions from '@/components/molecules/PostActions';
import CommentInput from '@/components/molecules/CommentInput';
import ApperIcon from '@/components/ApperIcon';
import CommentService from '@/services/api/commentService';
import UserService from '@/services/api/userService';

const PostCard = ({ post, currentUser, onLike, onAddComment, likeAnimationActive }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  const toggleComments = () => setExpandedComments(prev => !prev);

  const handleCommentSubmit = async () => {
    await onAddComment(post.id, commentText);
    setCommentText('');
    // Refresh comments after adding
    if (expandedComments) {
      loadComments();
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const [commentsData, usersData] = await Promise.all([
        CommentService.getByPostId(post.id),
        UserService.getAll()
      ]);

      const enrichedComments = commentsData.map(comment => {
        const user = usersData.find(u => u.id === comment.userId);
        return { ...comment, user };
      });

      setComments(enrichedComments);
    } catch (err) {
      setCommentsError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (expandedComments) {
      loadComments();
    }
  }, [expandedComments, post.id]);

  const formatCommentTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'recently';
    }
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

              {/* Real Comments */}
              <div className="space-y-3">
                {commentsLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-400 text-sm">Loading comments...</span>
                  </div>
                )}

                {commentsError && (
                  <div className="text-center py-4">
                    <p className="text-red-400 text-sm mb-2">{commentsError}</p>
                    <button
                      onClick={loadComments}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!commentsLoading && !commentsError && comments.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                )}

                {!commentsLoading && !commentsError && comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {comment.user?.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white text-sm">
                          {comment.user?.username || 'Unknown User'}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="text-gray-400 hover:text-red-400 text-xs flex items-center space-x-1">
                          <ApperIcon name="Heart" size={14} />
                          <span>{comment.likes?.length || 0}</span>
                        </button>
                        <button className="text-gray-400 hover:text-blue-400 text-xs">Reply</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default PostCard;