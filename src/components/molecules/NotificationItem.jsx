import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import { format } from 'date-fns';

const NotificationItem = ({ notification, onClick }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { icon: 'Heart', color: 'text-red-500' };
      case 'comment':
        return { icon: 'MessageCircle', color: 'text-blue-500' };
      case 'follow':
        return { icon: 'UserPlus', color: 'text-green-500' };
      case 'mention':
        return { icon: 'AtSign', color: 'text-purple-500' };
      default:
        return { icon: 'Bell', color: 'text-gray-500' };
    }
  };

  const { icon, color } = getNotificationIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`bg-surface/50 backdrop-blur-lg rounded-xl p-4 border transition-all cursor-pointer ${
        notification.read
          ? 'border-gray-700 hover:border-gray-600'
          : 'border-primary/30 bg-primary/5 hover:border-primary/50'
      }`}
    >
      <div className="flex items-start space-x-3">
        <Avatar initial={notification.user.avatar} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-white">
              <span className="font-semibold">{notification.user.name}</span>
              <span className="text-gray-400 ml-1">{notification.content}</span>
            </p>
            <div className={`flex-shrink-0 ${color}`}>
              <ApperIcon name={icon} size={16} />
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            @{notification.user.username} • {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
          </p>

          {notification.postContent && (
            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm break-words">"{notification.postContent}"</p>
            </div>
          )}

          {notification.comment && (
            <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-200 text-sm break-words">"{notification.comment}"</p>
            </div>
          )}

          {!notification.read && (
            <div className="mt-2">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;