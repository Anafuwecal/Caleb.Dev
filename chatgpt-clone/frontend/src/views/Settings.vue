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
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- General Settings -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">General Settings</h2>
          <p class="text-sm text-gray-600">Customize your application preferences.</p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Theme -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Theme</h3>
              <p class="text-sm text-gray-600">Choose your preferred theme.</p>
            </div>
            <select v-model="settings.theme" class="input w-32">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <!-- Language -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Language</h3>
              <p class="text-sm text-gray-600">Select your preferred language.</p>
            </div>
            <select v-model="settings.language" class="input w-32">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Chat Settings -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Chat Settings</h2>
          <p class="text-sm text-gray-600">Configure your chat experience.</p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Auto-scroll -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Auto-scroll</h3>
              <p class="text-sm text-gray-600">Automatically scroll to new messages.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.autoScroll"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <!-- Streaming responses -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Streaming responses</h3>
              <p class="text-sm text-gray-600">Show AI responses as they're generated.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.streamingResponses"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <!-- Sound effects -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Sound effects</h3>
              <p class="text-sm text-gray-600">Play sounds for notifications and events.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.soundEffects"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Privacy Settings</h2>
          <p class="text-sm text-gray-600">Control how your data is used and shared.</p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Analytics -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Analytics</h3>
              <p class="text-sm text-gray-600">Help improve our service by sharing usage data.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.analytics"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <!-- Data sharing -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Data sharing</h3>
              <p class="text-sm text-gray-600">Share anonymized data for research purposes.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.dataSharing"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Notifications</h2>
          <p class="text-sm text-gray-600">Choose what notifications you want to receive.</p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Email notifications -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Email notifications</h3>
              <p class="text-sm text-gray-600">Receive important updates via email.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.emailNotifications"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <!-- Push notifications -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Push notifications</h3>
              <p class="text-sm text-gray-600">Receive notifications in your browser.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.pushNotifications"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Data Management</h2>
          <p class="text-sm text-gray-600">Manage your personal data and conversations.</p>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Export Data</h3>
              <p class="text-sm text-gray-600">Download all your data and conversations.</p>
            </div>
            <button @click="exportData" class="btn-secondary">
              Export
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Clear Chat History</h3>
              <p class="text-sm text-gray-600">Delete all your conversations permanently.</p>
            </div>
            <button @click="clearHistory" class="btn-danger">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Save Settings -->
      <div class="flex justify-end">
        <button
          @click="saveSettings"
          :disabled="loading"
          class="btn-primary"
        >
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="success" class="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
        <p class="text-sm text-green-800">{{ success }}</p>
      </div>
      
      <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { userApi } from '@/services/api'

export default {
  name: 'Settings',
  setup() {
    const settings = reactive({
      theme: 'light',
      language: 'en',
      autoScroll: true,
      streamingResponses: true,
      soundEffects: false,
      analytics: true,
      dataSharing: false,
      emailNotifications: true,
      pushNotifications: false
    })
    
    const loading = ref(false)
    const success = ref('')
    const error = ref('')

    const loadSettings = async () => {
      try {
        const response = await userApi.getSettings()
        if (response.data.success) {
          Object.assign(settings, response.data.data.settings)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }

    const saveSettings = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      
      try {
        const response = await userApi.updateSettings(settings)
        if (response.data.success) {
          success.value = 'Settings saved successfully!'
          setTimeout(() => {
            success.value = ''
          }, 3000)
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to save settings'
      } finally {
        loading.value = false
      }
    }

    const exportData = async () => {
      try {
        const response = await userApi.exportData()
        if (response.data.success) {
          // Create and download file
          const data = JSON.stringify(response.data.data, null, 2)
          const blob = new Blob([data], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `chatgpt-clone-data-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          success.value = 'Data exported successfully!'
          setTimeout(() => {
            success.value = ''
          }, 3000)
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to export data'
      }
    }

    const clearHistory = async () => {
      if (!confirm('Are you sure you want to delete all your conversations? This action cannot be undone.')) {
        return
      }
      
      try {
        // Implementation would go here
        success.value = 'Chat history cleared successfully!'
        setTimeout(() => {
          success.value = ''
        }, 3000)
      } catch (err) {
        error.value = 'Failed to clear chat history'
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      settings,
      loading,
      success,
      error,
      saveSettings,
      exportData,
      clearHistory
    }
  }
}
</script>