<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">ChatGPT Clone</h1>
        <h2 class="text-2xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </router-link>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success message -->
        <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Registration successful!</h3>
              <p class="mt-1 text-sm text-green-700">
                Please check your email to verify your account before signing in.
              </p>
            </div>
          </div>
        </div>

        <form v-if="!success" @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <div class="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                v-model="form.name"
                :class="[
                  'input',
                  errors.name ? 'input-error' : ''
                ]"
                placeholder="Enter your full name"
                :disabled="loading"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>
          </div>

          <!-- Email -->
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

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
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
                placeholder="Create a strong password"
                :disabled="loading"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
            <div class="mt-2">
              <div class="text-sm text-gray-600">
                Password must contain:
                <ul class="list-disc list-inside mt-1 space-y-1">
                  <li :class="passwordChecks.length ? 'text-green-600' : 'text-gray-500'">
                    At least 8 characters
                  </li>
                  <li :class="passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'">
                    One uppercase letter
                  </li>
                  <li :class="passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'">
                    One lowercase letter
                  </li>
                  <li :class="passwordChecks.number ? 'text-green-600' : 'text-gray-500'">
                    One number
                  </li>
                  <li :class="passwordChecks.special ? 'text-green-600' : 'text-gray-500'">
                    One special character
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm password
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
                placeholder="Confirm your password"
                :disabled="loading"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>

          <!-- Terms and Privacy -->
          <div>
            <div class="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                v-model="form.acceptTerms"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                :disabled="loading"
              />
              <label for="acceptTerms" class="ml-2 block text-sm text-gray-900">
                I agree to the
                <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
                and
                <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
              </label>
            </div>
            <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">
              {{ errors.acceptTerms }}
            </p>
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

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !form.acceptTerms"
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
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <!-- Back to login after success -->
        <div v-if="success" class="mt-6">
          <router-link
            to="/login"
            class="btn-primary w-full text-center block"
          >
            Go to Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateForm, validationRules, validators } from '@/utils/validation'

export default {
  name: 'Register',
  setup() {
    const authStore = useAuthStore()
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    
    const errors = ref({})
    const error = ref('')
    const loading = ref(false)
    const success = ref(false)

    // Password strength checks
    const passwordChecks = computed(() => ({
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /\d/.test(form.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password)
    }))

    const handleRegister = async () => {
      error.value = ''
      errors.value = {}
      
      // Custom validation rules for registration
      const rules = {
        ...validationRules.register,
        confirmPassword: [
          validators.required,
          validators.confirmPassword(form.password)
        ],
        acceptTerms: [(value) => value ? null : 'You must accept the terms and conditions']
      }
      
      // Validate form
      const validation = validateForm(form, rules)
      if (!validation.isValid) {
        errors.value = validation.errors
        return
      }

      loading.value = true
      
      try {
        await authStore.register({
          name: form.name,
          email: form.email,
          password: form.password
        })
        
        success.value = true
      } catch (err) {
        console.error('Registration error:', err)
        error.value = err.response?.data?.message || 'Registration failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      error,
      loading,
      success,
      passwordChecks,
      handleRegister
    }
  }
}
</script>