import React from 'react';
import Avatar from '@/components/atoms/Avatar';
import { format } from 'date-fns';

const UserDisplay = ({ user, timestamp, avatarSize = 'md' }) => {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <Avatar initial={user.displayName?.charAt(0) || 'U'} size={avatarSize} />
      <div className="flex-1">
        <h3 className="font-semibold text-white">{user.displayName || 'Unknown User'}</h3>
        <p className="text-gray-400 text-sm">
          @{user.username || 'unknown'}
          {timestamp && ` • ${format(new Date(timestamp), 'MMM d, h:mm a')}`}
        </p>
      </div>
    </div>
  );
};

export default UserDisplay;