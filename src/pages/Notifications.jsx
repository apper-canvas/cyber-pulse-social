import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';

export default function Notifications() {
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

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Notifications
            </h1>
          </div>
        </header>
        
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700"
            >
              <div className="animate-pulse flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-700">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="text-primary hover:text-secondary text-sm font-medium transition-colors"
              >
                Mark all read
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Notifications List */}
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
            {notifications.map((notification, index) => {
              const { icon, color } = getNotificationIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`bg-surface/50 backdrop-blur-lg rounded-xl p-4 border transition-all cursor-pointer ${
                    notification.read 
                      ? 'border-gray-700 hover:border-gray-600' 
                      : 'border-primary/30 bg-primary/5 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {notification.user.avatar}
                      </span>
                    </div>

                    {/* Content */}
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

                      {/* Post Content */}
                      {notification.postContent && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <p className="text-gray-300 text-sm break-words">"{notification.postContent}"</p>
                        </div>
                      )}

                      {/* Comment Content */}
                      {notification.comment && (
                        <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <p className="text-blue-200 text-sm break-words">"{notification.comment}"</p>
                        </div>
                      )}

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="mt-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}