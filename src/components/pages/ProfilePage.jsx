import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileCoverAndAvatar from '@/components/organisms/ProfileCoverAndAvatar';
import ProfileInfo from '@/components/organisms/ProfileInfo';
import ProfileContentTabs from '@/components/organisms/ProfileContentTabs';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorMessage from '@/components/molecules/ErrorMessage';

import UserService from '@/services/api/userService';
import PostService from '@/services/api/postService';
import FollowService from '@/services/api/followService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const currentUser = usersData[0];
      setUser(currentUser);

      const userPosts = postsData.filter(post => post.userId === currentUser.id);
      setPosts(userPosts);

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
        />
        <ProfileContentTabs posts={posts} navigate={navigate} />
      </div>
    </div>
  );
};

export default ProfilePage;