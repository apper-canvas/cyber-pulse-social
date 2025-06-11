import React from 'react';
import Button from '@/components/atoms/Button';
import ProfileStat from '@/components/molecules/ProfileStat';

const ProfileInfo = ({ user, postsCount, followersCount, followingCount }) => {
  return (
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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-surface/50 border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Edit Profile
        </Button>
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <ProfileStat count={postsCount} label="Posts" />
        <ProfileStat count={followersCount} label="Followers" />
        <ProfileStat count={followingCount} label="Following" />
      </div>
    </div>
  );
};

export default ProfileInfo;