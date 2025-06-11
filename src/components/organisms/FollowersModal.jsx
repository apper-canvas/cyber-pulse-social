import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Users, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import Input from '@/components/atoms/Input';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import UserService from '@/services/api/userService';
import FollowService from '@/services/api/followService';

const FollowersModal = ({ isOpen, onClose, userId, initialTab = 'followers' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState({});

  useEffect(() => {
    if (isOpen && userId) {
      loadFollowData();
    }
  }, [isOpen, userId]);

  const loadFollowData = async () => {
    setLoading(true);
    try {
      const [followersData, followingData, usersData] = await Promise.all([
        FollowService.getFollowers(userId),
        FollowService.getFollowing(userId),
        UserService.getAll()
      ]);

      // Map follow data to user objects
      const followersWithUsers = followersData.map(follow => {
        const user = usersData.find(u => u.id === follow.followerId);
        return { ...user, followId: follow.id };
      });

      const followingWithUsers = followingData.map(follow => {
        const user = usersData.find(u => u.id === follow.followingId);
        return { ...user, followId: follow.id };
      });

      setFollowers(followersWithUsers);
      setFollowing(followingWithUsers);
    } catch (error) {
      toast.error('Failed to load follow data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
    try {
      await FollowService.create({
        followerId: 'current_user', // In real app, get from auth context
        followingId: targetUserId
      });
      toast.success('User followed successfully');
      loadFollowData(); // Refresh data
    } catch (error) {
      toast.error('Failed to follow user');
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleUnfollow = async (targetUserId) => {
    setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
    try {
      await FollowService.delete('current_user', targetUserId);
      toast.success('User unfollowed successfully');
      loadFollowData(); // Refresh data
    } catch (error) {
      toast.error('Failed to unfollow user');
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const filterUsers = (users) => {
    if (!searchQuery) return users;
    return users.filter(user =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentUsers = activeTab === 'followers' ? followers : following;
  const filteredUsers = filterUsers(currentUsers);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface rounded-2xl w-full max-w-md h-[600px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {activeTab === 'followers' ? 'Followers' : 'Following'}
              </h2>
              <Button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('followers')}
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  activeTab === 'followers'
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Followers
                {activeTab === 'followers' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  activeTab === 'following'
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Following
                {activeTab === 'following' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4">
                  <LoadingSkeleton type="userList" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Users size={48} className="mb-4" />
                  <p className="text-center">
                    {searchQuery ? 'No users found' : `No ${activeTab} yet`}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-xl hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={user.avatar}
                          alt={user.displayName}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-white">{user.displayName}</p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleFollow(user.id)}
                        disabled={followLoading[user.id]}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {followLoading[user.id] ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus size={16} className="mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowersModal;