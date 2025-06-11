import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PostCard from '@/components/organisms/PostCard';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import Button from '@/components/atoms/Button';

import PostService from '@/services/api/postService';
import UserService from '@/services/api/userService';
import CommentService from '@/services/api/commentService';
// import FollowService from '@/services/api/followService'; // Not used in MainFeature directly

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [likeAnimations, setLikeAnimations] = useState(new Set());

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsData, usersData] = await Promise.all([
        PostService.getAll(),
        UserService.getAll(),
      ]);

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

  const handleAddComment = async (postId, text) => {
    if (!text.trim() || !currentUser) return;

    try {
      const newComment = {
        postId,
        userId: currentUser.id,
        content: text,
        parentId: null,
        likes: [],
        createdAt: new Date().toISOString()
      };

      await CommentService.create(newComment); // savedComment not used directly

      const post = posts.find(p => p.id === postId);
      const updatedPost = {
        ...post,
        commentCount: post.commentCount + 1
      };

      await PostService.update(postId, updatedPost);

      setPosts(prev => prev.map(p =>
        p.id === postId ? updatedPost : p
      ));

      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <LoadingSkeleton type="post" count={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
        >
          Create Post
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <AnimatePresence>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={handleLike}
            onAddComment={handleAddComment}
            likeAnimationActive={likeAnimations.has(post.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PostFeed;