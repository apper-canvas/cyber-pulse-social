import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import FilterTabs from '@/components/molecules/FilterTabs';
import PostGridItem from '@/components/molecules/PostGridItem';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import Button from '@/components/atoms/Button';

import PostService from '@/services/api/postService';
import UserService from '@/services/api/userService';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('trending');

  const filters = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'recent', label: 'Recent', icon: 'Clock' },
    { id: 'popular', label: 'Popular', icon: 'Heart' },
    { id: 'following', label: 'Following', icon: 'Users' },
  ];

  useEffect(() => {
    loadData();
  }, [activeFilter]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsData, usersData] = await Promise.all([
        PostService.getAll(),
        UserService.getAll()
      ]);

      let enrichedPosts = postsData.map(post => {
        const user = usersData.find(u => u.id === post.userId);
        return { ...post, user };
      });

      switch (activeFilter) {
        case 'trending':
          enrichedPosts = enrichedPosts.sort((a, b) => (b.likes.length + b.commentCount) - (a.likes.length + a.commentCount));
          break;
        case 'recent':
          enrichedPosts = enrichedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          enrichedPosts = enrichedPosts.sort((a, b) => b.likes.length - a.likes.length);
          break;
        default:
          break;
      }

      setPosts(enrichedPosts);
    } catch (err) {
      setError(err.message || 'Failed to load explore content');
      toast.error('Failed to load explore content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
return (
      <div className="h-full overflow-y-auto bg-background">
        <PageHeader title="Explore" />
        <div className="max-w-4xl mx-auto p-4">
          <LoadingSkeleton type="explore-grid" count={12} />
        </div>
      </div>
    );
  }

  if (error) {
return (
      <div className="h-full flex items-center justify-center bg-background">
        <ErrorMessage message={error} onRetry={loadData} />
      </div>
    );
  }

return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader
        title="Explore"
        rightContent={
          <Button
            whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
>
            <ApperIcon name="Search" size={20} className="text-gray-600" />
          </Button>
        }
      />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <FilterTabs filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Compass" size={48} className="text-gray-400 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Nothing to Explore Yet</h3>
            <p className="text-gray-400 mb-4">Check back later for trending content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post, index) => (
              <PostGridItem key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;