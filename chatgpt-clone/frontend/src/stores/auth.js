import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const loading = ref(false)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified || false)

  // Actions
  const initializeAuth = async () => {
    if (token.value && !user.value) {
      try {
        await getProfile()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        clearAuth()
      }
    }
    initialized.value = true
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      
      if (response.data.success) {
        token.value = response.data.data.accessToken
        user.value = response.data.data.user
        
        localStorage.setItem('accessToken', token.value)
        
        // Redirect to intended page or chat
        const redirect = router.currentRoute.value.query.redirect || '/chat'
        router.push(redirect)
        
        return response.data
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await authApi.register(userData)
      
      if (response.data.success) {
        // Don't auto-login after registration, user needs to verify email
        return response.data
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      router.push('/')
      loading.value = false
    }
  }

  const getProfile = async () => {
    try {
      const response = await authApi.getProfile()
      
      if (response.data.success) {
        user.value = response.data.data.user
        return response.data
      }
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    try {
      const response = await authApi.updateProfile(profileData)
      
      if (response.data.success) {
        user.value = response.data.data.user
        return response.data
      }
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    loading.value = true
    try {
      const response = await authApi.changePassword(passwordData)
      return response.data
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async (verificationData) => {
    loading.value = true
    try {
      const response = await authApi.verifyEmail(verificationData)
      
      if (response.data.success) {
        // Update user's email verification status
        if (user.value) {
          user.value.emailVerified = true
        }
      }
      
      return response.data
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email) => {
    loading.value = true
    try {
      const response = await authApi.requestPasswordReset({ email })
      return response.data
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (resetData) => {
    loading.value = true
    try {
      const response = await authApi.resetPassword(resetData)
      return response.data
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken()
      
      if (response.data.success) {
        token.value = response.data.data.accessToken
        localStorage.setItem('accessToken', token.value)
        return response.data
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      clearAuth()
      throw error
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    // State
    user,
    token,
    loading,
    initialized,
    
    // Getters
    isAuthenticated,
    isEmailVerified,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    refreshToken,
    clearAuth
  }
})