import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NotificationItem from '@/components/molecules/NotificationItem';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import Button from '@/components/atoms/Button';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'like',
          user: { name: 'Sarah Wilson', username: 'sarahw', avatar: 'S' },
          content: 'liked your post',
          postContent: 'Just finished my morning workout! 💪',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'comment',
          user: { name: 'Mike Johnson', username: 'mikej', avatar: 'M' },
          content: 'commented on your post',
          postContent: 'Amazing sunset from my balcony today',
          comment: 'Wow, absolutely stunning! Where was this taken?',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '3',
          type: 'follow',
          user: { name: 'Emma Davis', username: 'emmad', avatar: 'E' },
          content: 'started following you',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '4',
          type: 'like',
          user: { name: 'Jake Miller', username: 'jakem', avatar: 'J' },
          content: 'liked your post',
          postContent: 'Coffee and code - perfect Sunday morning',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '5',
          type: 'mention',
          user: { name: 'Lisa Chen', username: 'lisac', avatar: 'L' },
          content: 'mentioned you in a post',
          postContent: 'Great discussion with @alexchen about the future of web development',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <LoadingSkeleton type="notification" count={5} />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="text-primary hover:text-secondary text-sm font-medium transition-colors"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Bell" size={48} className="text-gray-400 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-gray-400">When people interact with your posts, you'll see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => !notification.read && markAsRead(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationList;