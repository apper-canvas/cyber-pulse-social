export const messages = [
  // Conversation with Alice Johnson (id: '1')
  {
    id: 'm1',
    conversationId: '1',
    senderId: 'alice-johnson',
    content: 'Hi there! How has your day been?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm2',
    conversationId: '1',
    senderId: 'current-user',
    content: 'Hey Alice! It\'s been pretty good, thanks for asking. How about yours?',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm3',
    conversationId: '1',
    senderId: 'alice-johnson',
    content: 'Can\'t complain! I just finished a really interesting project at work.',
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm4',
    conversationId: '1',
    senderId: 'alice-johnson',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'sent',
    type: 'text'
  },

  // Conversation with Bob Smith (id: '2')
  {
    id: 'm5',
    conversationId: '2',
    senderId: 'current-user',
    content: 'Hey Bob, I found this really interesting article about React performance optimization. Thought you might like it!',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm6',
    conversationId: '2',
    senderId: 'bob-smith',
    content: 'Thanks for sharing that article!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },

  // Conversation with Carol Williams (id: '3')
  {
    id: 'm7',
    conversationId: '3',
    senderId: 'carol-williams',
    content: 'Are we still on for tomorrow?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm8',
    conversationId: '3',
    senderId: 'current-user',
    content: 'Yes, absolutely! 3pm at the coffee shop downtown?',
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm9',
    conversationId: '3',
    senderId: 'carol-williams',
    content: 'Perfect! See you tomorrow at 3pm',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    type: 'text'
  },

  // Conversation with David Brown (id: '4')
  {
    id: 'm10',
    conversationId: '4',
    senderId: 'david-brown',
    content: 'Let me know when you\'re free to chat',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },

  // Conversation with Emma Davis (id: '5')
  {
    id: 'm11',
    conversationId: '5',
    senderId: 'current-user',
    content: 'What do you think about organizing a team building event next month?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm12',
    conversationId: '5',
    senderId: 'emma-davis',
    content: 'That sounds like a great idea!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    type: 'text'
  },

  // Conversation with Frank Wilson (id: '6')
  {
    id: 'm13',
    conversationId: '6',
    senderId: 'current-user',
    content: 'Do you have those design files ready?',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'm14',
    conversationId: '6',
    senderId: 'frank-wilson',
    content: 'I\'ll send you the files later today',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    type: 'text'
  }
];