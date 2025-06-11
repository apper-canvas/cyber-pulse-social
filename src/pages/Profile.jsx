import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import UserService from '../services/api/userService';
import PostService from '../services/api/postService';
import FollowService from '../services/api/followService';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, postsData, followsData] = await Promise.all([
        UserService.getAll(),
        PostService.getAll(),
        FollowService.getAll()
      ]);

      // Get current user (simulate with first user)
      const currentUser = usersData[0];
      setUser(currentUser);

      // Get user's posts
      const userPosts = postsData.filter(post => post.userId === currentUser.id);
      setPosts(userPosts);

      // Get followers and following
      const userFollowers = followsData.filter(follow => follow.followingId === currentUser.id);
      const userFollowing = followsData.filter(follow => follow.followerId === currentUser.id);
      
      setFollowers(userFollowers);
      setFollowing(userFollowing);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'Grid3X3', count: posts.length },
    { id: 'media', label: 'Media', icon: 'Image', count: posts.filter(p => p.imageUrls?.length > 0).length },
    { id: 'likes', label: 'Likes', icon: 'Heart', count: posts.reduce((sum, p) => sum + p.likes.length, 0) }
  ];

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto">
          {/* Header Skeleton */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-background animate-pulse"></div>
            </div>
          </div>
          
          <div className="px-6 pt-20 pb-6 space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
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
          <h3 className="text-lg font-semibold mb-2">Failed to Load Profile</h3>
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
      <div className="max-w-2xl mx-auto">
        {/* Cover & Profile Section */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ApperIcon name="Camera" size={16} />
            </motion.button>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-background flex items-center justify-center relative">
              <span className="text-white font-bold text-4xl">
                {user?.displayName?.charAt(0) || 'U'}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full"
              >
                <ApperIcon name="Camera" size={14} />
              </motion.button>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="absolute top-4 left-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ApperIcon name="ArrowLeft" size={16} />
            </motion.button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-20 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.displayName || 'Unknown User'}
              </h1>
              <p className="text-gray-400 mb-3">@{user?.username || 'unknown'}</p>
              {user?.bio && (
                <p className="text-white leading-relaxed mb-4 break-words">{user.bio}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-surface/50 border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              Edit Profile
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-white font-bold text-lg">{posts.length}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-white font-bold text-lg">{user?.followersCount || followers.length}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-white font-bold text-lg">{user?.followingCount || following.length}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-all ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-primary'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-6 pb-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="FileText" size={48} className="text-gray-400 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-gray-400 mb-4">Share your first post to get started!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
                  >
                    Create Post
                  </motion.button>
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
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-3 gap-2">
              {posts
                .filter(post => post.imageUrls && post.imageUrls.length > 0)
                .flatMap(post => post.imageUrls)
                .map((url, index) => (
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
                ))}
              {posts.filter(post => post.imageUrls && post.imageUrls.length > 0).length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <ApperIcon name="Image" size={48} className="text-gray-400 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">No Media Yet</h3>
                  <p className="text-gray-400">Photos and videos you post will appear here</p>
                </div>
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
      </div>
    </div>
  );
}