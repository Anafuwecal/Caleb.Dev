const Conversation = require('../models/Conversation');
const openaiService = require('../services/openaiService');
const logger = require('../utils/logger');

// Send chat message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Moderate content before processing
    try {
      const moderation = await openaiService.moderateContent(message);
      if (moderation.flagged) {
        logger.warn('Content flagged by moderation:', { userId, message: message.substring(0, 100) });
        return res.status(400).json({
          success: false,
          message: 'Message contains inappropriate content',
          moderation: moderation.categories
        });
      }
    } catch (moderationError) {
      logger.error('Content moderation error:', moderationError);
      // Continue without moderation if service fails
    }

    let conversation;

    // Get or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      // Create new conversation
      conversation = await Conversation.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message to conversation
    const userMessage = await conversation.addMessage({
      role: 'user',
      content: message
    });

    // Deduct credits for premium features
    if (req.user.subscriptionStatus !== 'premium') {
      try {
        await req.user.useCredits(1);
      } catch (creditError) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient credits',
          creditsRemaining: req.user.usageCredits
        });
      }
    }

    // Prepare messages for OpenAI
    const systemPrompt = `You are a helpful, knowledgeable, and friendly AI assistant. 
    Provide accurate, informative, and engaging responses. 
    If you're unsure about something, acknowledge the uncertainty rather than guessing.
    Format your responses using markdown when appropriate for better readability.`;

    const messages = openaiService.prepareMessages(conversation.messages, systemPrompt);
    const truncatedMessages = openaiService.truncateMessages(messages, 3000);

    try {
      // Get AI response
      const aiResponse = await openaiService.generateChatCompletion(truncatedMessages, {
        model: req.user.subscriptionStatus === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        maxTokens: req.user.subscriptionStatus === 'premium' ? 2000 : 1000,
        temperature: 0.7
      });

      // Add AI response to conversation
      const assistantMessage = await conversation.addMessage({
        role: 'assistant',
        content: aiResponse.message
      });

      logger.info('Chat message processed successfully', {
        userId,
        conversationId: conversation.id,
        tokensUsed: aiResponse.usage?.total_tokens,
        model: aiResponse.model
      });

      res.json({
        success: true,
        data: {
          conversation: {
            id: conversation.id,
            title: conversation.title,
            messages: [userMessage, assistantMessage]
          },
          usage: aiResponse.usage,
          creditsRemaining: req.user.subscriptionStatus === 'premium' ? 'unlimited' : req.user.usageCredits - 1
        }
      });
    } catch (aiError) {
      logger.error('OpenAI API error:', aiError);
      
      // Remove user message if AI response failed
      conversation.messages.pop();
      await conversation.update({ messages: conversation.messages });

      // Refund credits if AI call failed
      if (req.user.subscriptionStatus !== 'premium') {
        await req.user.update({ usageCredits: req.user.usageCredits + 1 });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to generate AI response. Please try again.',
        error: process.env.NODE_ENV === 'development' ? aiError.message : undefined
      });
    }
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message'
    });
  }
};

// Send streaming chat message
const sendStreamingMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Input validation
    if (!message || message.trim().length === 0) {
      res.write(`data: ${JSON.stringify({ error: 'Message content is required' })}\n\n`);
      return res.end();
    }

    let conversation;

    // Get or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.userId !== userId) {
        res.write(`data: ${JSON.stringify({ error: 'Conversation not found' })}\n\n`);
        return res.end();
      }
    } else {
      conversation = await Conversation.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message
    const userMessage = await conversation.addMessage({
      role: 'user',
      content: message
    });

    // Check credits
    if (req.user.subscriptionStatus !== 'premium') {
      try {
        await req.user.useCredits(1);
      } catch (creditError) {
        res.write(`data: ${JSON.stringify({ error: 'Insufficient credits' })}\n\n`);
        return res.end();
      }
    }

    // Prepare messages for OpenAI
    const systemPrompt = `You are a helpful, knowledgeable, and friendly AI assistant. 
    Provide accurate, informative, and engaging responses. 
    Format your responses using markdown when appropriate for better readability.`;

    const messages = openaiService.prepareMessages(conversation.messages, systemPrompt);
    const truncatedMessages = openaiService.truncateMessages(messages, 3000);

    try {
      // Get streaming AI response
      const stream = await openaiService.generateStreamingChatCompletion(truncatedMessages, {
        model: req.user.subscriptionStatus === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        maxTokens: req.user.subscriptionStatus === 'premium' ? 2000 : 1000,
        temperature: 0.7
      });

      let fullResponse = '';

      // Send conversation info first
      res.write(`data: ${JSON.stringify({
        type: 'conversation',
        data: {
          conversationId: conversation.id,
          title: conversation.title,
          userMessage
        }
      })}\n\n`);

      // Stream the response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({
            type: 'content',
            data: { content }
          })}\n\n`);
        }
      }

      // Save assistant message
      const assistantMessage = await conversation.addMessage({
        role: 'assistant',
        content: fullResponse
      });

      // Send completion message
      res.write(`data: ${JSON.stringify({
        type: 'complete',
        data: {
          assistantMessage,
          creditsRemaining: req.user.subscriptionStatus === 'premium' ? 'unlimited' : req.user.usageCredits - 1
        }
      })}\n\n`);

      res.end();

      logger.info('Streaming chat message processed successfully', {
        userId,
        conversationId: conversation.id
      });
    } catch (aiError) {
      logger.error('Streaming OpenAI API error:', aiError);
      
      // Remove user message if AI response failed
      conversation.messages.pop();
      await conversation.update({ messages: conversation.messages });

      // Refund credits
      if (req.user.subscriptionStatus !== 'premium') {
        await req.user.update({ usageCredits: req.user.usageCredits + 1 });
      }

      res.write(`data: ${JSON.stringify({
        type: 'error',
        data: { message: 'Failed to generate AI response. Please try again.' }
      })}\n\n`);
      res.end();
    }
  } catch (error) {
    logger.error('Streaming message error:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      data: { message: 'Failed to process message' }
    })}\n\n`);
    res.end();
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        conversation: conversation.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation'
    });
  }
};

// Get user's conversations list
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const conversations = await Conversation.findByUserId(userId, limitNum, offset);
    
    // Get summaries for list view
    const conversationSummaries = conversations.map(conv => conv.getSummary());

    res.json({
      success: true,
      data: {
        conversations: conversationSummaries,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: conversations.length
        }
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await conversation.delete();

    logger.info(`Conversation deleted: ${conversationId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation'
    });
  }
};

// Update conversation title
const updateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await conversation.update({ title });

    res.json({
      success: true,
      data: {
        conversation: conversation.toJSON()
      }
    });
  } catch (error) {
    logger.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update conversation'
    });
  }
};

module.exports = {
  sendMessage,
  sendStreamingMessage,
  getConversation,
  getConversations,
  deleteConversation,
  updateConversation
};