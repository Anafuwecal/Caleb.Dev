import axios from 'axios'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const response = await api.post('/auth/refresh')
        const newToken = response.data.data.accessToken
        
        localStorage.setItem('accessToken', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  changePassword: (passwordData) => api.post('/user/change-password', passwordData),
  verifyEmail: (verificationData) => api.post('/auth/verify-email', verificationData),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', email),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  refreshToken: () => api.post('/auth/refresh')
}

// Chat API
export const chatApi = {
  sendMessage: (messageData) => api.post('/chat/message', messageData),
  sendStreamingMessage: async (messageData, onChunk) => {
    const response = await fetch(`${api.defaults.baseURL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(messageData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to send message')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              onChunk(data)
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },
  getConversations: (params = {}) => api.get('/chat/conversations', { params }),
  getConversation: (conversationId) => api.get(`/chat/conversations/${conversationId}`),
  updateConversation: (conversationId, updateData) => api.put(`/chat/conversations/${conversationId}`, updateData),
  deleteConversation: (conversationId) => api.delete(`/chat/conversations/${conversationId}`)
}

// User API
export const userApi = {
  getUsageStats: () => api.get('/user/usage'),
  getSettings: () => api.get('/user/settings'),
  updateSettings: (settings) => api.put('/user/settings', { settings }),
  exportData: () => api.get('/user/export'),
  deleteAccount: (password) => api.delete('/user/account', { data: { password } })
}

// Health API
export const healthApi = {
  check: () => api.get('/health'),
  status: () => api.get('/status')
}

export default api