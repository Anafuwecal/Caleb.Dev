<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">ChatGPT Clone</h1>
        <h2 class="text-2xl font-bold text-gray-900">Set new password</h2>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success message -->
        <div v-if="success" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Password reset successful!</h3>
          <p class="text-gray-600 mb-6">Your password has been updated. You can now sign in with your new password.</p>
          <router-link to="/login" class="btn-primary">
            Sign In
          </router-link>
        </div>

        <!-- Reset form -->
        <form v-else @submit.prevent="handlePasswordReset" class="space-y-6">
          <div class="text-center mb-6">
            <p class="text-gray-600">
              Enter your new password below.
            </p>
          </div>

          <!-- Email (hidden field) -->
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
                :disabled="loading"
              />
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="form.password"
                :class="[
                  'input',
                  errors.password ? 'input-error' : ''
                ]"
                placeholder="Enter your new password"
                :disabled="loading"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm new password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="form.confirmPassword"
                :class="[
                  'input',
                  errors.confirmPassword ? 'input-error' : ''
                ]"
                placeholder="Confirm your new password"
                :disabled="loading"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
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
              {{ loading ? 'Resetting password...' : 'Reset password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateForm, validationRules, validators } from '@/utils/validation'

export default {
  name: 'ResetPassword',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    const form = reactive({
      email: route.query.email || '',
      password: '',
      confirmPassword: '',
      token: route.query.token || ''
    })
    
    const errors = ref({})
    const error = ref('')
    const loading = ref(false)
    const success = ref(false)

    const handlePasswordReset = async () => {
      error.value = ''
      errors.value = {}
      
      // Custom validation rules
      const rules = {
        ...validationRules.resetPassword,
        confirmPassword: [
          validators.required,
          validators.confirmPassword(form.password)
        ]
      }
      
      // Validate form
      const validation = validateForm(form, rules)
      if (!validation.isValid) {
        errors.value = validation.errors
        return
      }

      if (!form.token) {
        error.value = 'Reset token is missing. Please use the link from your email.'
        return
      }

      loading.value = true
      
      try {
        await authStore.resetPassword({
          email: form.email,
          password: form.password,
          token: form.token
        })
        
        success.value = true
      } catch (err) {
        console.error('Password reset error:', err)
        error.value = err.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (!form.token) {
        error.value = 'Reset token is missing. Please use the link from your email.'
      }
    })

    return {
      form,
      errors,
      error,
      loading,
      success,
      handlePasswordReset
    }
  }
}
</script>