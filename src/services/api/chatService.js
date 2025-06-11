import { chats } from '../mockData/chats';

class ChatService {
  static data = [...chats];

  static async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Sort by last message time (most recent first)
    return [...this.data].sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  }

  static async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chat = this.data.find(c => c.id === id);
    if (!chat) {
      throw new Error('Conversation not found');
    }
    
    return { ...chat };
  }

  static async create(chatData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newChat = {
      id: Date.now().toString(),
      name: chatData.name,
      avatar: chatData.avatar || '/api/placeholder/40/40',
      isOnline: false,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      participants: chatData.participants || []
    };
    
    this.data.unshift(newChat);
    return { ...newChat };
  }

  static async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Conversation not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  static async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Conversation not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }

  static async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const chat = this.data.find(c => c.id === id);
    if (chat) {
      chat.unreadCount = 0;
    }
    
    return true;
  }

  static async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const searchTerm = query.toLowerCase();
    return this.data.filter(chat =>
      chat.name.toLowerCase().includes(searchTerm) ||
      chat.lastMessage.toLowerCase().includes(searchTerm)
    );
  }
}

export default ChatService;