import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PostService from '../services/api/postService';
import UserService from '../services/api/userService';

export default function Explore() {
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
      
      // Enrich posts with user data and sort based on filter
      let enrichedPosts = postsData.map(post => {
        const user = usersData.find(u => u.id === post.userId);
        return { ...post, user };
      });

      // Apply filtering/sorting
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
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore
            </h1>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-surface/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mb-4 mx-auto" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Content</h3>
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
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ApperIcon name="Search" size={20} className="text-gray-400" />
            </motion.button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-surface/50 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <ApperIcon name={filter.icon} size={16} />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Content Grid */}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}