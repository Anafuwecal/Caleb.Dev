const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const { verifyToken, checkCredits } = require('../middleware/auth');
const {
  validateChatMessage,
  validateConversation,
  sanitizeInput
} = require('../middleware/validation');
const { chatLimiter } = require('../middleware/security');

// Apply middleware to all routes
router.use(sanitizeInput);
router.use(verifyToken);

// Chat routes
router.post('/message', chatLimiter, checkCredits(1), validateChatMessage, chatController.sendMessage);
router.post('/stream', chatLimiter, checkCredits(1), validateChatMessage, chatController.sendStreamingMessage);

// Conversation management routes
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:conversationId', chatController.getConversation);
router.put('/conversations/:conversationId', validateConversation, chatController.updateConversation);
router.delete('/conversations/:conversationId', chatController.deleteConversation);

module.exports = router;