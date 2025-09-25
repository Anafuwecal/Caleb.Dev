const { getFirestore, collections } = require('../config/database');
const logger = require('../utils/logger');

class Conversation {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title || 'New Conversation';
    this.messages = data.messages || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new conversation
  static async create(conversationData) {
    try {
      const db = getFirestore();
      
      const conversation = new Conversation({
        ...conversationData,
        id: undefined // Let Firestore generate the ID
      });

      const docRef = await db.collection(collections.CONVERSATIONS).add({
        userId: conversation.userId,
        title: conversation.title,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      });

      conversation.id = docRef.id;
      logger.info(`Conversation created successfully: ${conversation.id}`);
      return conversation;
    } catch (error) {
      logger.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Find conversation by ID
  static async findById(id) {
    try {
      const db = getFirestore();
      const doc = await db.collection(collections.CONVERSATIONS).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const conversationData = { id: doc.id, ...doc.data() };
      return new Conversation(conversationData);
    } catch (error) {
      logger.error('Error finding conversation by ID:', error);
      throw error;
    }
  }

  // Find conversations by user ID
  static async findByUserId(userId, limit = 20, offset = 0) {
    try {
      const db = getFirestore();
      let query = db.collection(collections.CONVERSATIONS)
        .where('userId', '==', userId)
        .orderBy('updatedAt', 'desc')
        .limit(limit);

      if (offset > 0) {
        // For pagination, you might want to use startAfter with a document snapshot
        query = query.offset(offset);
      }

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => {
        const conversationData = { id: doc.id, ...doc.data() };
        return new Conversation(conversationData);
      });
    } catch (error) {
      logger.error('Error finding conversations by user ID:', error);
      throw error;
    }
  }

  // Add message to conversation
  async addMessage(message) {
    try {
      const newMessage = {
        id: Date.now().toString(),
        role: message.role, // 'user' or 'assistant'
        content: message.content,
        timestamp: new Date()
      };

      this.messages.push(newMessage);
      
      // Update title if it's the first user message
      if (this.messages.length === 1 && message.role === 'user') {
        this.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      }

      await this.update({
        messages: this.messages,
        title: this.title
      });

      logger.info(`Message added to conversation: ${this.id}`);
      return newMessage;
    } catch (error) {
      logger.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  // Update conversation
  async update(updateData) {
    try {
      const db = getFirestore();
      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      };

      await db.collection(collections.CONVERSATIONS).doc(this.id).update(updatedData);
      
      // Update current instance
      Object.assign(this, updatedData);
      logger.info(`Conversation updated successfully: ${this.id}`);
      return this;
    } catch (error) {
      logger.error('Error updating conversation:', error);
      throw error;
    }
  }

  // Delete conversation
  async delete() {
    try {
      const db = getFirestore();
      await db.collection(collections.CONVERSATIONS).doc(this.id).delete();
      logger.info(`Conversation deleted successfully: ${this.id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // Get conversation summary for list view
  getSummary() {
    return {
      id: this.id,
      title: this.title,
      lastMessage: this.messages.length > 0 ? this.messages[this.messages.length - 1] : null,
      messageCount: this.messages.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      messages: this.messages,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Conversation;