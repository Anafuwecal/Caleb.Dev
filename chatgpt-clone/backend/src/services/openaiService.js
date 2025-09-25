const OpenAI = require('openai');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Generate chat completion
  async generateChatCompletion(messages, options = {}) {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 1000,
        temperature = 0.7,
        stream = false
      } = options;

      const response = await this.client.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: maxTokens,
        temperature,
        stream
      });

      if (stream) {
        return response;
      }

      const assistantMessage = response.choices[0]?.message?.content;
      const usage = response.usage;

      logger.info('OpenAI API call successful', {
        model,
        tokensUsed: usage?.total_tokens,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens
      });

      return {
        message: assistantMessage,
        usage,
        model
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      
      // Handle different types of OpenAI errors
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.status === 429) {
        throw new Error('OpenAI API rate limit exceeded');
      } else if (error.status === 500) {
        throw new Error('OpenAI API server error');
      } else {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  }

  // Generate streaming chat completion
  async generateStreamingChatCompletion(messages, options = {}) {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 1000,
        temperature = 0.7
      } = options;

      const stream = await this.client.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: maxTokens,
        temperature,
        stream: true
      });

      return stream;
    } catch (error) {
      logger.error('OpenAI streaming API error:', error);
      throw error;
    }
  }

  // Moderate content using OpenAI's moderation API
  async moderateContent(text) {
    try {
      const response = await this.client.moderations.create({
        input: text
      });

      const result = response.results[0];
      
      return {
        flagged: result.flagged,
        categories: result.categories,
        categoryScores: result.category_scores
      };
    } catch (error) {
      logger.error('OpenAI moderation API error:', error);
      throw error;
    }
  }

  // Calculate approximate token count (rough estimation)
  estimateTokenCount(text) {
    // Very rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  // Prepare messages for OpenAI API
  prepareMessages(conversationMessages, systemPrompt = null) {
    const messages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Add conversation messages
    conversationMessages.forEach(msg => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    return messages;
  }

  // Truncate conversation history to fit within token limits
  truncateMessages(messages, maxTokens = 4000) {
    let totalTokens = 0;
    const truncatedMessages = [];

    // Always keep the system message if it exists
    if (messages.length > 0 && messages[0].role === 'system') {
      truncatedMessages.push(messages[0]);
      totalTokens += this.estimateTokenCount(messages[0].content);
    }

    // Add messages from the end (most recent) until we hit the token limit
    for (let i = messages.length - 1; i >= (messages[0]?.role === 'system' ? 1 : 0); i--) {
      const messageTokens = this.estimateTokenCount(messages[i].content);
      
      if (totalTokens + messageTokens > maxTokens) {
        break;
      }

      truncatedMessages.unshift(messages[i]);
      totalTokens += messageTokens;
    }

    return truncatedMessages;
  }
}

module.exports = new OpenAIService();