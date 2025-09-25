<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">ChatGPT Clone</h1>
        <h2 class="text-2xl font-bold text-gray-900">Reset your password</h2>
        <p class="mt-2 text-sm text-gray-600">
          Remember your password?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </router-link>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success message -->
        <div v-if="success" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
          <p class="text-gray-600 mb-6">
            If an account with that email exists, we've sent you a password reset link.
          </p>
          <div class="space-y-3">
            <button @click="resetForm" class="btn-secondary w-full">
              Send Another Email
            </button>
            <router-link to="/login" class="btn-primary w-full block text-center">
              Back to Sign In
            </router-link>
          </div>
        </div>

        <!-- Request form -->
        <form v-else @submit.prevent="handlePasswordReset" class="space-y-6">
          <div class="text-center mb-6">
            <p class="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :class="[
                  'input',
                  errors.email ? 'input-error' : ''
                ]"
                placeholder="Enter your email"
                :disabled="loading"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full flex justify-center items-center"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? 'Sending...' : 'Send reset link' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateForm, validationRules } from '@/utils/validation'

export default {
  name: 'ForgotPassword',
  setup() {
    const authStore = useAuthStore()
    
    const form = reactive({
      email: ''
    })
    
    const errors = ref({})
    const error = ref('')
    const loading = ref(false)
    const success = ref(false)

    const handlePasswordReset = async () => {
      error.value = ''
      errors.value = {}
      
      // Validate form
      const validation = validateForm(form, validationRules.forgotPassword)
      if (!validation.isValid) {
        errors.value = validation.errors
        return
      }

      loading.value = true
      
      try {
        await authStore.requestPasswordReset(form.email)
        success.value = true
      } catch (err) {
        console.error('Password reset error:', err)
        error.value = err.response?.data?.message || 'Failed to send reset email. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      success.value = false
      form.email = ''
      error.value = ''
      errors.value = {}
    }

    return {
      form,
      errors,
      error,
      loading,
      success,
      handlePasswordReset,
      resetForm
    }
  }
}
</script>