// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '15m';
process.env.JWT_REFRESH_EXPIRE = '7d';
process.env.BCRYPT_ROUNDS = '4'; // Lower rounds for faster tests

// Mock external services
jest.mock('../src/config/database', () => ({
  initializeFirebase: jest.fn(),
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => ({ empty: true, docs: [] }))
        }))
      }))
    }))
  })),
  collections: {
    USERS: 'users',
    CONVERSATIONS: 'conversations',
    PAYMENTS: 'payments',
    REFRESH_TOKENS: 'refreshTokens'
  }
}));

jest.mock('../src/services/emailService', () => ({
  sendEmailVerification: jest.fn().mockResolvedValue(true),
  sendPasswordReset: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/services/openaiService', () => ({
  generateChatCompletion: jest.fn().mockResolvedValue({
    message: 'This is a test AI response',
    usage: { total_tokens: 50 },
    model: 'gpt-3.5-turbo'
  }),
  moderateContent: jest.fn().mockResolvedValue({
    flagged: false,
    categories: {}
  })
}));

// Global test timeout
jest.setTimeout(30000);

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});