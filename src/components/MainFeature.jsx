import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import PostService from '../services/api/postService';
import UserService from '../services/api/userService';
import CommentService from '../services/api/commentService';
import FollowService from '../services/api/followService';

export default function MainFeature() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [likeAnimations, setLikeAnimations] = useState(new Set());

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsData, usersData, followsData] = await Promise.all([
        PostService.getAll(),
        UserService.getAll(),
        FollowService.getAll()
      ]);
      
      // Enrich posts with user data
      const enrichedPosts = postsData.map(post => {
        const user = usersData.find(u => u.id === post.userId);
        return { ...post, user };
      });
      
      setPosts(enrichedPosts);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const users = await UserService.getAll();
      setCurrentUser(users[0]); // Simulate current user
    } catch (err) {
      console.error('Failed to load current user:', err);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) return;
    
    try {
      // Add animation
      setLikeAnimations(prev => new Set([...prev, postId]));
      setTimeout(() => {
        setLikeAnimations(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }, 600);

      const post = posts.find(p => p.id === postId);
      const isLiked = post.likes.includes(currentUser.id);
      
      const updatedPost = {
        ...post,
        likes: isLiked 
          ? post.likes.filter(id => id !== currentUser.id)
          : [...post.likes, currentUser.id]
      };
      
      await PostService.update(postId, updatedPost);
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? updatedPost : p
      ));
      
      toast.success(isLiked ? 'Post unliked' : 'Post liked!');
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text || !currentUser) return;
    
    try {
      const newComment = {
        postId,
        userId: currentUser.id,
        content: text,
        parentId: null,
        likes: [],
        createdAt: new Date().toISOString()
      };
      
      const savedComment = await CommentService.create(newComment);
      
      // Update post comment count
      const post = posts.find(p => p.id === postId);
      const updatedPost = {
        ...post,
        commentCount: post.commentCount + 1
      };
      
      await PostService.update(postId, updatedPost);
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? updatedPost : p
      ));
      
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-gray-700 rounded-xl"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-error mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Posts</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Users" size={48} className="text-gray-400 mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
        <p className="text-gray-400 mb-4">Follow some users or create your first post to get started!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
        >
          Create Post
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
          >
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {post.user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{post.user?.displayName || 'Unknown User'}</h3>
                  <p className="text-gray-400 text-sm">@{post.user?.username || 'unknown'} • {format(new Date(post.createdAt), 'MMM d, h:mm a')}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ApperIcon name="MoreHorizontal" size={16} className="text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
              <p className="text-white leading-relaxed break-words">{post.content}</p>
            </div>

            {/* Post Images */}
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

            {/* Post Actions */}
            <div className="px-6 pb-4 pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex space-x-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      currentUser && post.likes.includes(currentUser.id)
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <div className="relative">
                      <ApperIcon 
                        name={currentUser && post.likes.includes(currentUser.id) ? 'Heart' : 'Heart'} 
                        size={20} 
                        className={currentUser && post.likes.includes(currentUser.id) ? 'fill-current' : ''}
                      />
                      {likeAnimations.has(post.id) && (
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.5, 1] }}
                          className="absolute inset-0 text-red-500"
                        >
                          <ApperIcon name="Heart" size={20} className="fill-current" />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{post.likes.length}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <ApperIcon name="MessageCircle" size={20} />
                    <span className="text-sm font-medium">{post.commentCount}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <ApperIcon name="Share" size={20} />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <ApperIcon name="Bookmark" size={20} />
                </motion.button>
              </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {expandedComments.has(post.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-700 bg-gray-800/30"
                >
                  <div className="p-6 space-y-4">
                    {/* Add Comment */}
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {currentUser?.displayName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 flex space-x-3">
                        <input
                          type="text"
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post
                        </motion.button>
                      </div>
                    </div>

                    {/* Sample Comments */}
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
        ))}
      </AnimatePresence>
    </div>
  );
}