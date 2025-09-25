<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="mb-8">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-4">
            <svg class="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p class="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div class="space-y-4">
            <router-link
              to="/"
              class="btn-primary w-full"
            >
              Go Home
            </router-link>
            
            <button
              @click="goBack"
              class="btn-secondary w-full"
            >
              Go Back
            </button>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <p class="text-sm text-gray-500 mb-4">
            Need help? Here are some useful links:
          </p>
          
          <div class="grid grid-cols-1 gap-2 text-sm">
            <router-link
              to="/chat"
              class="text-primary-600 hover:text-primary-800 underline"
            >
              Start a new chat
            </router-link>
            <router-link
              to="/profile"
              class="text-primary-600 hover:text-primary-800 underline"
            >
              View your profile
            </router-link>
            <a
              href="mailto:support@example.com"
              class="text-primary-600 hover:text-primary-800 underline"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>