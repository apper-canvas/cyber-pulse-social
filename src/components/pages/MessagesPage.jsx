import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, FileText, MessageCircle, MoreVertical, Paperclip, Phone, Play, Plus, Search, Send, Smile, User, Video, X } from "lucide-react";
import { toast } from "react-toastify";
import { ChatService, MessageService } from "@/services";
import userService from "@/services/api/userService";
import EmojiPicker from "emoji-picker-react";
import { useDropzone } from "react-dropzone";
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
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const messageInputRef = useRef(null);
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
    if (!newMessage.trim() && selectedMedia.length === 0) return;
    
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
        const messagePayload = {
          conversationId: newChat.id,
          content: newMessage.trim() || 'Shared media',
          senderId: 'current-user'
        };

        // Add media if present
        if (selectedMedia.length > 0) {
          messagePayload.type = 'media';
          messagePayload.media = selectedMedia[0]; // For now, send first media file
        }

        const message = await MessageService.send(messagePayload);
        
        setMessages([message]);
        setNewMessage('');
        setSelectedMedia([]);
        
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
      
      const messagePayload = {
        conversationId: selectedConversation.id,
        content: newMessage.trim() || 'Shared media',
        senderId: 'current-user'
      };

      // Add media if present
      if (selectedMedia.length > 0) {
        messagePayload.type = 'media';
        messagePayload.media = selectedMedia[0]; // For now, send first media file
      }

      const message = await MessageService.send(messagePayload);
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setSelectedMedia([]);
      
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
  
  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const input = messageInputRef.current;
    
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newValue = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newValue);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length;
        input.focus();
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
    
    // Add to recent emojis
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered].slice(0, 8);
    });
    
    setShowEmojiPicker(false);
};

  // Media upload handling
  const handleMediaUpload = async (files) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported');
      return;
    }
    
    try {
      setUploadingMedia(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create file URL and thumbnail
      const fileUrl = URL.createObjectURL(file);
      let thumbnail = null;
      
      if (file.type.startsWith('image/')) {
        thumbnail = fileUrl;
      } else if (file.type.startsWith('video/')) {
        // In a real app, you'd generate a video thumbnail
        thumbnail = '/api/placeholder/150/150';
      }
      
      const mediaFile = {
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        thumbnail
      };
      
      setSelectedMedia([mediaFile]);
      toast.success('Media uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleMediaUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: uploadingMedia || sendingMessage
  });

  const removeSelectedMedia = () => {
    setSelectedMedia([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMediaContent = (message) => {
    if (!message.media) return null;
    
    const { media } = message;
    
    if (media.type === 'image') {
      return (
        <div className="media-message">
          <img 
            src={media.url} 
            alt={media.fileName}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setMediaPreview(media)}
          />
          <div className="p-2 bg-gray-800 bg-opacity-50">
            <p className="text-xs text-gray-300">{media.fileName}</p>
          </div>
        </div>
      );
    }
    
    if (media.type === 'video') {
      return (
        <div className="media-message">
          <div className="relative">
            <video 
              src={media.url}
              className="cursor-pointer"
              onClick={() => setMediaPreview(media)}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="p-2 bg-gray-800 bg-opacity-50">
            <p className="text-xs text-gray-300">{media.fileName}</p>
          </div>
        </div>
      );
    }
    
    if (media.type === 'document') {
      return (
        <div className="flex items-center p-3 bg-gray-700 rounded-lg max-w-xs">
          <FileText className="w-8 h-8 text-primary mr-3" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{media.fileName}</p>
            <p className="text-xs text-gray-400">{formatFileSize(media.fileSize)}</p>
          </div>
          <button 
            onClick={() => window.open(media.url, '_blank')}
            className="ml-2 p-1 hover:bg-gray-600 rounded"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      );
    }
    
    return null;
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
          <div className="bg-surface rounded-lg border border-gray-200 w-full max-w-md">
            <div className="p-6">
<div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Start New Chat</h2>
                <button
onClick={resetNewChatModal}
                  className="text-gray-500 hover:text-gray-900"
                  disabled={creatingChat}
                >
                  ×
                </button>
              </div>
              
              {/* Search Users */}
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
placeholder="Search by name or ID..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary"
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
                  <div className="mt-2 max-h-48 overflow-y-auto bg-gray-50 border border-gray-300 rounded-lg">
                    {searchResults.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
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
                              : 'hover:bg-gray-100 cursor-pointer'
                          }`}
                        >
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&background=7C3AED&color=fff`}
                            alt={user.displayName || user.username}
                            className="w-8 h-8 rounded-full"
                          />
<div className="ml-3">
                            <p className="text-gray-900 font-medium">{user.displayName || user.username}</p>
                            <p className="text-gray-500 text-sm">@{user.username}</p>
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
                  <div className="mt-2 p-4 text-center text-gray-500">
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
<div className={`w-full md:w-80 bg-surface border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
{/* Header */}
<div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary"
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
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
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
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
<div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
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
<div className="flex items-center justify-between p-4 bg-surface border-b border-gray-200">
              <div className="flex items-center">
                <button
onClick={() => setShowMobileChat(false)}
                  className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <img
                  src={selectedConversation?.avatar || selectedUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((selectedUser?.displayName || selectedUser?.username) || 'User')}&background=7C3AED&color=fff`}
                  alt={selectedConversation?.name || selectedUser?.displayName || selectedUser?.username}
                  className="w-10 h-10 rounded-full"
                />
<div className="ml-3">
                  <h2 className="font-medium text-gray-900">
                    {selectedConversation?.name || selectedUser?.displayName || selectedUser?.username}
                  </h2>
                  <p className="text-sm text-gray-500">
{selectedConversation?.isOnline ? 'Online' : selectedUser ? 'Ready to chat' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
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
                    className={`max-w-xs lg:max-w-md ${
                      message.senderId === 'current-user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-gray-700 text-white'
                    } ${message.type === 'media' ? 'p-0 overflow-hidden' : 'px-4 py-2'} rounded-lg`}
                  >
                    {message.type === 'media' ? (
                      <div>
                        {renderMediaContent(message)}
                        {message.content !== 'Shared media' && (
                          <div className="px-4 py-2">
                            <p>{message.content}</p>
                          </div>
                        )}
                        <div className="px-4 py-2">
                          <p className={`text-xs ${
                            message.senderId === 'current-user' ? 'text-purple-100' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'current-user' ? 'text-purple-100' : 'text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

{/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-surface border-t border-gray-200">
              {/* Media Preview */}
{selectedMedia.length > 0 && (
                <div className="mb-3 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Media to send:</span>
                    <button
                      type="button"
onClick={removeSelectedMedia}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    {selectedMedia[0].type === 'image' && (
                      <img 
                        src={selectedMedia[0].url} 
                        alt={selectedMedia[0].fileName}
                        className="w-12 h-12 rounded object-cover"
                      />
)}
                    {selectedMedia[0].type === 'video' && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
{selectedMedia[0].type === 'document' && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
<div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{selectedMedia[0].fileName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedMedia[0].fileSize)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
{uploadingMedia && (
                <div className="mb-3 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Uploading media...</span>
                    <span className="text-xs text-gray-500">Please wait</span>
</div>
                  <div className="w-full bg-gray-300 rounded-full h-2 upload-progress-bar">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"></div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-20 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary"
                    disabled={sendingMessage || uploadingMedia}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button
                        type="button"
className={`p-1 hover:bg-gray-200 rounded transition-colors ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={uploadingMedia || sendingMessage}
                      >
                        <Paperclip className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                      </button>
                    </div>
                    <button
                      type="button"
onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={uploadingMedia || sendingMessage}
                    >
                      <Smile className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                  
                  {/* Emoji Picker */}
{showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          theme="dark"
                          width={350}
                          height={400}
                          searchPlaceholder="Search emojis..."
                          previewConfig={{
                            showPreview: false
                          }}
skinTonesDisabled={true}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && selectedMedia.length === 0) || sendingMessage || uploadingMedia}
                  className="p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Drag and Drop Overlay */}
              {isDragActive && (
                <div className="absolute inset-0 bg-primary bg-opacity-10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <Paperclip className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-primary font-medium">Drop media file here</p>
                  </div>
                </div>
              )}
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
    
{/* Click outside to close emoji picker */}
    {showEmojiPicker && (
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setShowEmojiPicker(false)}
      />
    )}

    {/* Media Preview Modal */}
    {mediaPreview && (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={() => setMediaPreview(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <X className="w-6 h-6" />
          </button>
          
          {mediaPreview.type === 'image' && (
            <img 
              src={mediaPreview.url} 
              alt={mediaPreview.fileName}
              className="max-w-full max-h-full object-contain animate-media-preview"
            />
          )}
          
          {mediaPreview.type === 'video' && (
            <video 
              src={mediaPreview.url}
              controls
              autoPlay
              className="max-w-full max-h-full animate-media-preview"
            />
          )}
          
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
            <p className="text-white font-medium">{mediaPreview.fileName}</p>
            <p className="text-gray-300 text-sm">{formatFileSize(mediaPreview.fileSize)}</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MessagesPage;