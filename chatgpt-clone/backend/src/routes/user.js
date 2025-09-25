const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validateChangePassword,
  sanitizeInput
} = require('../middleware/validation');

// Apply middleware to all routes
router.use(sanitizeInput);
router.use(verifyToken);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.post('/change-password', validateChangePassword, userController.changePassword);

// User data and settings routes
router.get('/usage', userController.getUsageStats);
router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

// Data management routes
router.get('/export', userController.exportUserData);
router.delete('/account', userController.deleteAccount);

module.exports = router;