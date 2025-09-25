<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <router-link to="/chat" class="text-gray-400 hover:text-gray-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Profile Information -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
          <p class="text-sm text-gray-600">Update your account information and email address.</p>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="profileForm.name"
                  :class="['input', profileErrors.name ? 'input-error' : '']"
                  :disabled="profileLoading"
                />
                <p v-if="profileErrors.name" class="mt-1 text-sm text-red-600">{{ profileErrors.name }}</p>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="profileForm.email"
                  :class="['input', profileErrors.email ? 'input-error' : '']"
                  :disabled="profileLoading"
                />
                <p v-if="profileErrors.email" class="mt-1 text-sm text-red-600">{{ profileErrors.email }}</p>
              </div>
            </div>
            
            <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-800">{{ profileError }}</p>
            </div>
            
            <div v-if="profileSuccess" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-sm text-green-800">{{ profileSuccess }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="profileLoading"
                class="btn-primary"
              >
                {{ profileLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
          <p class="text-sm text-gray-600">Update your password to keep your account secure.</p>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                :class="['input', passwordErrors.currentPassword ? 'input-error' : '']"
                :disabled="passwordLoading"
              />
              <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.currentPassword }}</p>
            </div>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  :class="['input', passwordErrors.newPassword ? 'input-error' : '']"
                  :disabled="passwordLoading"
                />
                <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.newPassword }}</p>
              </div>
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  :class="['input', passwordErrors.confirmPassword ? 'input-error' : '']"
                  :disabled="passwordLoading"
                />
                <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.confirmPassword }}</p>
              </div>
            </div>
            
            <div v-if="passwordError" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-800">{{ passwordError }}</p>
            </div>
            
            <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-sm text-green-800">{{ passwordSuccess }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="btn-primary"
              >
                {{ passwordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Usage Statistics</h2>
          <p class="text-sm text-gray-600">Monitor your account usage and subscription status.</p>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ user?.subscriptionStatus || 'Free' }}</div>
              <div class="text-sm text-gray-600">Plan</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ user?.usageCredits || 0 }}</div>
              <div class="text-sm text-gray-600">Credits Remaining</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ user?.monthlyCredits || 50 }}</div>
              <div class="text-sm text-gray-600">Monthly Limit</div>
            </div>
          </div>
          
          <div class="mt-6">
            <div class="bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${usagePercentage}%` }"
              ></div>
            </div>
            <div class="mt-2 text-sm text-gray-600 text-center">
              {{ usagePercentage.toFixed(1) }}% of monthly credits used
            </div>
          </div>
          
          <div v-if="user?.subscriptionStatus === 'free'" class="mt-6 text-center">
            <button class="btn-primary">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white shadow rounded-lg border border-red-200">
        <div class="px-6 py-4 border-b border-red-200">
          <h2 class="text-lg font-medium text-red-900">Danger Zone</h2>
          <p class="text-sm text-red-600">Irreversible and destructive actions.</p>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Delete Account</h3>
              <p class="text-sm text-gray-600">Permanently delete your account and all associated data.</p>
            </div>
            <button 
              @click="showDeleteConfirm = true"
              class="btn-danger"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
        <p class="text-sm text-gray-600 mb-4">
          This action cannot be undone. All your conversations and data will be permanently deleted.
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Please enter your password to confirm:
        </p>
        <input
          type="password"
          v-model="deletePassword"
          placeholder="Enter your password"
          class="input mb-4"
        />
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteConfirm = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="deleteAccount" class="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateForm, validationRules, validators } from '@/utils/validation'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    
    const profileForm = reactive({
      name: '',
      email: ''
    })
    
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const profileErrors = ref({})
    const passwordErrors = ref({})
    const profileError = ref('')
    const passwordError = ref('')
    const profileSuccess = ref('')
    const passwordSuccess = ref('')
    const profileLoading = ref(false)
    const passwordLoading = ref(false)
    const showDeleteConfirm = ref(false)
    const deletePassword = ref('')

    const user = computed(() => authStore.user)
    
    const usagePercentage = computed(() => {
      if (!user.value) return 0
      const used = (user.value.monthlyCredits || 50) - (user.value.usageCredits || 0)
      const total = user.value.monthlyCredits || 50
      return (used / total) * 100
    })

    const updateProfile = async () => {
      profileError.value = ''
      profileSuccess.value = ''
      profileErrors.value = {}
      
      const validation = validateForm(profileForm, validationRules.profile)
      if (!validation.isValid) {
        profileErrors.value = validation.errors
        return
      }

      profileLoading.value = true
      
      try {
        await authStore.updateProfile(profileForm)
        profileSuccess.value = 'Profile updated successfully!'
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          profileSuccess.value = ''
        }, 3000)
      } catch (error) {
        profileError.value = error.response?.data?.message || 'Failed to update profile'
      } finally {
        profileLoading.value = false
      }
    }

    const changePassword = async () => {
      passwordError.value = ''
      passwordSuccess.value = ''
      passwordErrors.value = {}
      
      const rules = {
        ...validationRules.changePassword,
        confirmPassword: [
          validators.required,
          validators.confirmPassword(passwordForm.newPassword)
        ]
      }
      
      const validation = validateForm(passwordForm, rules)
      if (!validation.isValid) {
        passwordErrors.value = validation.errors
        return
      }

      passwordLoading.value = true
      
      try {
        await authStore.changePassword(passwordForm)
        passwordSuccess.value = 'Password changed successfully!'
        
        // Clear form
        Object.keys(passwordForm).forEach(key => {
          passwordForm[key] = ''
        })
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          passwordSuccess.value = ''
        }, 3000)
      } catch (error) {
        passwordError.value = error.response?.data?.message || 'Failed to change password'
      } finally {
        passwordLoading.value = false
      }
    }

    const deleteAccount = async () => {
      if (!deletePassword.value) return
      
      try {
        // Implementation would go here
        console.log('Delete account requested')
        showDeleteConfirm.value = false
        deletePassword.value = ''
      } catch (error) {
        console.error('Failed to delete account:', error)
      }
    }

    onMounted(() => {
      if (user.value) {
        profileForm.name = user.value.name
        profileForm.email = user.value.email
      }
    })

    return {
      profileForm,
      passwordForm,
      profileErrors,
      passwordErrors,
      profileError,
      passwordError,
      profileSuccess,
      passwordSuccess,
      profileLoading,
      passwordLoading,
      showDeleteConfirm,
      deletePassword,
      user,
      usagePercentage,
      updateProfile,
      changePassword,
      deleteAccount
    }
  }
}
</script>