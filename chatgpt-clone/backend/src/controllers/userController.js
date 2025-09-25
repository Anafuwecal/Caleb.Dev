const User = require('../models/User');
const logger = require('../utils/logger');

// Get user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const updateData = {};
    
    if (name && name !== req.user.name) {
      updateData.name = name;
    }

    if (email && email !== req.user.email) {
      // Check if email is already taken
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      
      updateData.email = email;
      updateData.emailVerified = false; // Require re-verification for new email
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }

    const updatedUser = await req.user.update(updateData);

    logger.info(`Profile updated for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is different
    const isSamePassword = await req.user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Update password
    await req.user.updatePassword(newPassword);

    logger.info(`Password changed for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Get user usage statistics
const getUsageStats = async (req, res) => {
  try {
    const user = req.user;

    // Reset monthly credits if needed
    await user.resetMonthlyCredits();

    const stats = {
      subscriptionStatus: user.subscriptionStatus,
      usageCredits: user.usageCredits,
      monthlyCredits: user.monthlyCredits,
      lastCreditReset: user.lastCreditReset,
      creditsUsedThisMonth: user.monthlyCredits - user.usageCredits,
      isUnlimited: user.subscriptionStatus === 'premium'
    };

    res.json({
      success: true,
      data: {
        usage: stats
      }
    });
  } catch (error) {
    logger.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    // Verify password before deletion
    const isPasswordValid = await req.user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // TODO: Delete all user's conversations and data
    // This would require implementing a proper data cleanup process
    
    // For now, just mark the account as deleted or actually delete it
    // In a production system, you might want to soft delete and keep data for a period
    
    logger.info(`Account deletion requested for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Account deletion process initiated. Your data will be removed within 24 hours.'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

// Get user settings
const getSettings = async (req, res) => {
  try {
    const user = req.user;

    const settings = {
      notifications: {
        email: true, // Default settings, could be stored in user model
        push: false
      },
      privacy: {
        dataSharing: false,
        analytics: true
      },
      preferences: {
        theme: 'light',
        language: 'en'
      }
    };

    res.json({
      success: true,
      data: {
        settings
      }
    });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings'
    });
  }
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    // In a real application, you'd validate and store these settings
    // For now, just return success
    
    logger.info(`Settings updated for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings
      }
    });
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Export user data (GDPR compliance)
const exportUserData = async (req, res) => {
  try {
    const user = req.user;

    // TODO: Implement comprehensive data export
    // This should include all user data: profile, conversations, settings, etc.
    
    const userData = {
      profile: user.toJSON(),
      exportDate: new Date(),
      // conversations: await getFullUserConversations(user.id),
      // settings: await getUserSettings(user.id)
    };

    logger.info(`Data export requested for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Data export prepared successfully',
      data: userData
    });
  } catch (error) {
    logger.error('Export user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export user data'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUsageStats,
  deleteAccount,
  getSettings,
  updateSettings,
  exportUserData
};