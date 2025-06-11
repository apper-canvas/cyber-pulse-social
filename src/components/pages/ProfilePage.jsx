import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileCoverAndAvatar from '@/components/organisms/ProfileCoverAndAvatar';
import ProfileInfo from '@/components/organisms/ProfileInfo';
import ProfileContentTabs from '@/components/organisms/ProfileContentTabs';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import FollowersModal from '@/components/organisms/FollowersModal';

import UserService from '@/services/api/userService';
import PostService from '@/services/api/postService';
import FollowService from '@/services/api/followService';
const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [modalType, setModalType] = useState('followers'); // 'followers' or 'following'
  const currentUserId = 'current_user'; // In real app, get from auth context

  useEffect(() => {
loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, postsData, followsData] = await Promise.all([
        UserService.getAll(),
        PostService.getAll(),
        FollowService.getAll()
      ]);

      // Determine which user profile to show
      let targetUser;
      if (userId) {
        targetUser = usersData.find(u => u.id === userId);
        setIsOwnProfile(userId === currentUserId);
      } else {
        targetUser = usersData.find(u => u.id === currentUserId) || usersData[0];
        setIsOwnProfile(true);
      }

      if (!targetUser) {
        throw new Error('User not found');
      }

      setUser(targetUser);

      const userPosts = postsData.filter(post => post.userId === targetUser.id);
      setPosts(userPosts);

      const userFollowers = followsData.filter(follow => follow.followingId === targetUser.id);
      const userFollowing = followsData.filter(follow => follow.followerId === targetUser.id);

      setFollowers(userFollowers);
      setFollowing(userFollowing);

      // Check if current user is following this profile
      if (!isOwnProfile || userId !== currentUserId) {
        const followingStatus = await FollowService.isFollowing(currentUserId, targetUser.id);
        setIsFollowing(followingStatus);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user || isOwnProfile) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await FollowService.delete(currentUserId, user.id);
        setIsFollowing(false);
        setFollowers(prev => prev.filter(f => f.followerId !== currentUserId));
        toast.success(`Unfollowed ${user.displayName}`);
      } else {
        await FollowService.create({
          followerId: currentUserId,
          followingId: user.id
        });
        setIsFollowing(true);
        setFollowers(prev => [...prev, { followerId: currentUserId, followingId: user.id }]);
        toast.success(`Following ${user.displayName}`);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleOpenFollowersModal = (type) => {
    setModalType(type);
    setShowFollowersModal(true);
  };

  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <LoadingSkeleton type="profile" />
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
      <div className="max-w-2xl mx-auto">
        <ProfileCoverAndAvatar user={user} onBackClick={() => navigate('/home')} />
        <ProfileInfo
          user={user}
          postsCount={posts.length}
          followersCount={user?.followersCount || followers.length}
          followingCount={user?.followingCount || following.length}
          isOwnProfile={isOwnProfile}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollow={handleFollow}
          onOpenFollowersModal={handleOpenFollowersModal}
        />
        <ProfileContentTabs posts={posts} navigate={navigate} />
        
        {showFollowersModal && (
          <FollowersModal
            isOpen={showFollowersModal}
            onClose={handleCloseFollowersModal}
            userId={user?.id}
            type={modalType}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
};

export default ProfilePage;