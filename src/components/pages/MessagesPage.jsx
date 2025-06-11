import { useState, useEffect } from 'react';
import { MessageCircle, Search, Plus, Send, MoreVertical, Phone, Video, ArrowLeft, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { ChatService, MessageService } from '@/services';
import userService from '@/services/api/userService';
const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatForm, setNewChatForm] = useState({ name: '', avatar: '' });
  const [creatingChat, setCreatingChat] = useState(false);
const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await ChatService.getAll();
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await MessageService.getByConversation(conversationId);
      setMessages(data);
      // Mark conversation as read
      await ChatService.markAsRead(conversationId);
      // Update conversations list to reflect read status
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // If we have a selected user but no conversation, create the conversation first
    if (selectedUser && !selectedConversation) {
      try {
        setSendingMessage(true);
        
        // Create new conversation
        const newChat = await ChatService.create({
          name: selectedUser.displayName || selectedUser.username,
          avatar: selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName || selectedUser.username)}&background=7C3AED&color=fff`,
          participants: ['current-user', selectedUser.id]
        });
        
        // Add to conversations list
        setConversations(prev => [newChat, ...prev]);
        
        // Set as selected conversation
        setSelectedConversation(newChat);
        
        // Clear selected user
        setSelectedUser(null);
        
        // Send the message
        const message = await MessageService.send({
          conversationId: newChat.id,
          content: newMessage.trim(),
          senderId: 'current-user'
        });
        
        setMessages([message]);
        setNewMessage('');
        
        // Update conversation's last message
        setConversations(prev =>
          prev.map(conv =>
            conv.id === newChat.id
              ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp }
              : conv
          )
        );
        
        toast.success('Message sent');
        return;
      } catch (error) {
        toast.error('Failed to send message');
        setSendingMessage(false);
        return;
      }
    }
    
    // Regular message sending for existing conversations
    if (!selectedConversation) return;

    try {
      setSendingMessage(true);
      const message = await MessageService.send({
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        senderId: 'current-user'
      });
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp }
            : conv
        )
      );
      
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await userService.searchUsers(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

const selectUser = async (user) => {
    try {
      setCreatingChat(true);
      
      // Check if conversation with this user already exists
      const existingConversation = conversations.find(conv => 
        conv.name === (user.displayName || user.username)
      );
      
      if (existingConversation) {
        // Select existing conversation
        setSelectedConversation(existingConversation);
        setSelectedUser(null);
        setShowMobileChat(true);
        resetNewChatModal();
        toast.success('Conversation opened');
        return;
      }
      
      // Set selected user but don't create conversation yet
      setSelectedUser(user);
      setSelectedConversation(null);
      setMessages([]);
      setShowMobileChat(true);
      
      // Reset modal
      resetNewChatModal();
      
      toast.success('Ready to start conversation');
    } catch (error) {
      toast.error('Failed to select user');
    } finally {
      setCreatingChat(false);
    }
  };

const resetNewChatModal = () => {
    setShowNewChatModal(false);
    setNewChatForm({ name: '', avatar: '' });
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedUser(null);
    setCreatingChat(false);
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
return (
    <>
{/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Start New Chat</h2>
                <button
                  onClick={resetNewChatModal}
                  className="text-gray-400 hover:text-white"
                  disabled={creatingChat}
                >
                  ×
                </button>
              </div>
              
              {/* Search Users */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name or ID..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    disabled={creatingChat}
                  />
                  {(searchLoading || creatingChat) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                
                {/* Search Results */}
                {showSearchResults && (
                  <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg">
                    {searchResults.length === 0 ? (
                      <div className="p-3 text-center text-gray-400">
                        <User className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">No users found</p>
                      </div>
                    ) : (
                      searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => !creatingChat && selectUser(user)}
                          className={`flex items-center p-3 transition-colors ${
                            creatingChat 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:bg-gray-700 cursor-pointer'
                          }`}
                        >
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&background=7C3AED&color=fff`}
                            alt={user.displayName || user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="ml-3">
                            <p className="text-white font-medium">{user.displayName || user.username}</p>
                            <p className="text-gray-400 text-sm">@{user.username}</p>
                          </div>
                          {creatingChat && (
                            <div className="ml-auto">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {!showSearchResults && !searchQuery.trim() && (
                  <div className="mt-2 p-4 text-center text-gray-400">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Start typing to search for users</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    <div className="h-full flex bg-background">
      {/* Conversations List */}
<div className={`w-full md:w-80 bg-surface border-r border-gray-700 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
<div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              New Chat
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-400 ml-2">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
{/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {(selectedConversation || selectedUser) ? (
          <>
            {/* Chat Header */}
<div className="flex items-center justify-between p-4 bg-surface border-b border-gray-700">
              <div className="flex items-center">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden mr-3 p-1 hover:bg-gray-700 rounded"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <img
                  src={selectedConversation?.avatar || selectedUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((selectedUser?.displayName || selectedUser?.username) || 'User')}&background=7C3AED&color=fff`}
                  alt={selectedConversation?.name || selectedUser?.displayName || selectedUser?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h2 className="font-medium text-white">
                    {selectedConversation?.name || selectedUser?.displayName || selectedUser?.username}
                  </h2>
                  <p className="text-sm text-gray-400">
{selectedConversation?.isOnline ? 'Online' : selectedUser ? 'Ready to chat' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'current-user' ? 'text-purple-100' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-surface border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
              <p>Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
</div>
    </div>
    </>
  );
};

export default MessagesPage;