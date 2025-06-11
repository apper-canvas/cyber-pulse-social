export const chats = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: '/api/placeholder/48/48',
    isOnline: true,
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    unreadCount: 2,
    participants: ['current-user', 'alice-johnson']
  },
  {
    id: '2', 
    name: 'Bob Smith',
    avatar: '/api/placeholder/48/48',
    isOnline: false,
    lastMessage: 'Thanks for sharing that article!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    unreadCount: 0,
    participants: ['current-user', 'bob-smith']
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: '/api/placeholder/48/48',
    isOnline: true,
    lastMessage: 'Perfect! See you tomorrow at 3pm',
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    unreadCount: 1,
    participants: ['current-user', 'carol-williams']
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: '/api/placeholder/48/48',
    isOnline: false,
    lastMessage: 'Let me know when you\'re free to chat',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    unreadCount: 0,
    participants: ['current-user', 'david-brown']
  },
  {
    id: '5',
    name: 'Emma Davis',
    avatar: '/api/placeholder/48/48',
    isOnline: true,
    lastMessage: 'That sounds like a great idea!',
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    unreadCount: 3,
    participants: ['current-user', 'emma-davis']
  },
  {
    id: '6',
    name: 'Frank Wilson',
    avatar: '/api/placeholder/48/48',
    isOnline: false,
    lastMessage: 'I\'ll send you the files later today',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    unreadCount: 0,
    participants: ['current-user', 'frank-wilson']
  }
];