const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken, verifyRefreshToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateEmailVerification,
  sanitizeInput
} = require('../middleware/validation');
const {
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter
} = require('../middleware/security');

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.post('/register', authLimiter, validateRegistration, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh', authLimiter, verifyRefreshToken, authController.refreshToken);

// Email verification routes
router.post('/verify-email', emailVerificationLimiter, validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', emailVerificationLimiter, authController.resendEmailVerification);

// Password reset routes
router.post('/forgot-password', passwordResetLimiter, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, validatePasswordReset, authController.resetPassword);

// Protected routes
router.post('/logout', verifyToken, authController.logout);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;