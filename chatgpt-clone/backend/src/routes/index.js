const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const chatRoutes = require('./chat');
const userRoutes = require('./user');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ChatGPT Clone API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      api: 'online',
      database: 'connected', // You could add actual database health check here
      openai: 'connected',    // You could add actual OpenAI API health check here
      timestamp: new Date().toISOString()
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/user', userRoutes);

module.exports = router;