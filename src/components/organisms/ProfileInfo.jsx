import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import Button from '@/components/atoms/Button';
import ProfileStat from '@/components/molecules/ProfileStat';
import FollowersModal from '@/components/organisms/FollowersModal';
import FollowService from '@/services/api/followService';

const ProfileInfo = ({ user, postsCount, followersCount, followingCount, isOwnProfile = true, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [modalTab, setModalTab] = useState('followers');

  useEffect(() => {
    if (!isOwnProfile && currentUserId && user?.id) {
      checkFollowStatus();
    }
  }, [user?.id, currentUserId, isOwnProfile]);

  const checkFollowStatus = async () => {
    try {
      const following = await FollowService.isFollowing(currentUserId, user.id);
      setIsFollowing(following);
    } catch (error) {
      console.error('Failed to check follow status:', error);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await FollowService.delete(currentUserId, user.id);
        setIsFollowing(false);
        toast.success(`Unfollowed @${user.username}`);
      } else {
        await FollowService.create({
          followerId: currentUserId,
          followingId: user.id
        });
        setIsFollowing(true);
        toast.success(`Now following @${user.username}`);
      }
    } catch (error) {
      toast.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
    } finally {
      setFollowLoading(false);
    }
  };

  const openFollowersModal = (tab) => {
    setModalTab(tab);
    setShowFollowersModal(true);
  };

  return (
    <>
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
          
          {isOwnProfile ? (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-surface/50 border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-gray-700 hover:bg-red-600 text-white border border-gray-600'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {followLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserMinus size={16} className="mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-surface/50 border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                <MessageCircle size={16} className="mr-2" />
                Message
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <ProfileStat count={postsCount} label="Posts" />
          <ProfileStat 
            count={followersCount} 
            label="Followers" 
            onClick={() => openFollowersModal('followers')}
            clickable={true}
          />
          <ProfileStat 
            count={followingCount} 
            label="Following" 
            onClick={() => openFollowersModal('following')}
            clickable={true}
          />
        </div>
      </div>

      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={user?.id}
        initialTab={modalTab}
      />
    </>
  );
};

export default ProfileInfo;