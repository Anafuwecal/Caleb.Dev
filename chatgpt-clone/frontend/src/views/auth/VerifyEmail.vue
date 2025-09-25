<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">ChatGPT Clone</h1>
        <h2 class="text-2xl font-bold text-gray-900">Verify your email</h2>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Loading state -->
        <div v-if="loading" class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Verifying your email...</p>
        </div>

        <!-- Success state -->
        <div v-else-if="success" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Email verified successfully!</h3>
          <p class="text-gray-600 mb-6">Your account has been verified. You can now sign in.</p>
          <router-link to="/login" class="btn-primary">
            Sign In
          </router-link>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Verification failed</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="space-y-3">
            <button @click="retryVerification" class="btn-primary w-full">
              Try Again
            </button>
            <router-link to="/login" class="btn-secondary w-full block text-center">
              Back to Sign In
            </router-link>
          </div>
        </div>

        <!-- Manual verification form -->
        <div v-else class="space-y-6">
          <div class="text-center mb-6">
            <p class="text-gray-600">
              Enter the verification token from your email to verify your account.
            </p>
          </div>

          <form @submit.prevent="handleVerification">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  v-model="form.email"
                  class="input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label for="token" class="block text-sm font-medium text-gray-700">
                Verification token
              </label>
              <div class="mt-1">
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  v-model="form.token"
                  class="input"
                  placeholder="Enter verification token"
                />
              </div>
            </div>

            <button type="submit" class="btn-primary w-full">
              Verify Email
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'VerifyEmail',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    const form = reactive({
      email: '',
      token: route.query.token || ''
    })
    
    const loading = ref(false)
    const success = ref(false)
    const error = ref('')

    const handleVerification = async () => {
      loading.value = true
      error.value = ''
      
      try {
        await authStore.verifyEmail({
          email: form.email,
          token: form.token
        })
        
        success.value = true
      } catch (err) {
        console.error('Email verification error:', err)
        error.value = err.response?.data?.message || 'Verification failed. Please check your token and try again.'
      } finally {
        loading.value = false
      }
    }

    const retryVerification = () => {
      error.value = ''
      success.value = false
      loading.value = false
    }

    // Auto-verify if token is in URL
    onMounted(() => {
      if (route.query.token && route.query.email) {
        form.email = route.query.email
        form.token = route.query.token
        handleVerification()
      }
    })

    return {
      form,
      loading,
      success,
      error,
      handleVerification,
      retryVerification
    }
  }
}
</script>