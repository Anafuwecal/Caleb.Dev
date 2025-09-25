const { getFirestore, collections } = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.subscriptionStatus = data.subscriptionStatus || 'free';
    this.emailVerified = data.emailVerified || false;
    this.emailVerificationToken = data.emailVerificationToken;
    this.passwordResetToken = data.passwordResetToken;
    this.passwordResetExpires = data.passwordResetExpires;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.usageCredits = data.usageCredits || 50; // Free tier credits
    this.monthlyCredits = data.monthlyCredits || 50;
    this.lastCreditReset = data.lastCreditReset || new Date();
  }

  // Create a new user
  static async create(userData) {
    try {
      const db = getFirestore();
      const hashedPassword = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
        id: undefined // Let Firestore generate the ID
      });

      const docRef = await db.collection(collections.USERS).add({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        emailVerified: user.emailVerified,
        emailVerificationToken: user.emailVerificationToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        usageCredits: user.usageCredits,
        monthlyCredits: user.monthlyCredits,
        lastCreditReset: user.lastCreditReset
      });

      user.id = docRef.id;
      logger.info(`User created successfully: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(collections.USERS)
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = { id: doc.id, ...doc.data() };
      return new User(userData);
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const db = getFirestore();
      const doc = await db.collection(collections.USERS).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const userData = { id: doc.id, ...doc.data() };
      return new User(userData);
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const db = getFirestore();
      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      };

      await db.collection(collections.USERS).doc(this.id).update(updatedData);
      
      // Update current instance
      Object.assign(this, updatedData);
      logger.info(`User updated successfully: ${this.email}`);
      return this;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  // Verify password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Update password
  async updatePassword(newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    return this.update({ password: hashedPassword });
  }

  // Check and deduct usage credits
  async useCredits(amount = 1) {
    if (this.usageCredits < amount) {
      throw new Error('Insufficient credits');
    }

    await this.update({
      usageCredits: this.usageCredits - amount
    });

    return this.usageCredits - amount;
  }

  // Reset monthly credits (called by cron job)
  async resetMonthlyCredits() {
    const now = new Date();
    const lastReset = new Date(this.lastCreditReset);
    
    // Check if a month has passed
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await this.update({
        usageCredits: this.monthlyCredits,
        lastCreditReset: now
      });
    }
  }

  // Convert to JSON (remove sensitive data)
  toJSON() {
    const { password, emailVerificationToken, passwordResetToken, ...userData } = this;
    return userData;
  }
}

module.exports = User;