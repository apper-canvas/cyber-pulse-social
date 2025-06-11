import { messages } from '../mockData/messages';

class MessageService {
  static data = [...messages];

  static async getByConversation(conversationId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const conversationMessages = this.data.filter(m => m.conversationId === conversationId);
    
    // Sort by timestamp (oldest first)
    return conversationMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

static async send(messageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage = {
      id: Date.now().toString(),
      conversationId: messageData.conversationId,
      senderId: messageData.senderId,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: messageData.type || 'text'
    };
    
    this.data.push(newMessage);
    return { ...newMessage };
  }

  static async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const message = this.data.find(m => m.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    
    return { ...message };
  }

  static async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.data.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  static async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.data.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }

  static async markAsRead(conversationId, userId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const conversationMessages = this.data.filter(
      m => m.conversationId === conversationId && m.senderId !== userId
    );
    
    conversationMessages.forEach(message => {
      message.status = 'read';
    });
    
    return true;
  }

  static async getUnreadCount(conversationId, userId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const unreadMessages = this.data.filter(
      m => m.conversationId === conversationId && 
          m.senderId !== userId && 
          m.status !== 'read'
    );
    
    return unreadMessages.length;
  }
}

export default MessageService;