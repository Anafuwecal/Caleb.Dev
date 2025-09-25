<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-primary-600">ChatGPT Clone</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="btn-primary text-sm"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Your AI Assistant
          <span class="text-primary-600">Awaits</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Experience the power of AI conversation with our ChatGPT-style assistant. 
          Get help with writing, coding, analysis, and more in a beautiful, intuitive interface.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <router-link
            to="/register"
            class="btn-primary text-lg px-8 py-3"
          >
            Start Chatting Free
          </router-link>
          <button
            @click="scrollToFeatures"
            class="btn-secondary text-lg px-8 py-3"
          >
            Learn More
          </button>
        </div>

        <!-- Demo Chat Preview -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div class="ml-4 text-sm text-gray-600">ChatGPT Clone</div>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-end">
                <div class="bg-primary-600 text-white px-4 py-2 rounded-2xl max-w-xs">
                  Hello! Can you help me write a professional email?
                </div>
              </div>
              <div class="flex justify-start">
                <div class="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl max-w-md">
                  I'd be happy to help you write a professional email! Could you tell me more about the purpose of the email and who you're sending it to?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Assistant?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with modern technology and designed for the best user experience
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Conversations</h3>
            <p class="text-gray-600">
              Engage in natural, context-aware conversations with advanced AI technology
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p class="text-gray-600">
              Your conversations are encrypted and stored securely with enterprise-grade security
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p class="text-gray-600">
              Get instant responses with our optimized infrastructure and streaming technology
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-gray-600">
            Start free, upgrade when you need more
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Free Plan -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div class="text-4xl font-bold text-gray-900 mb-4">
                $0<span class="text-lg text-gray-600">/month</span>
              </div>
              <ul class="text-left space-y-3 mb-8">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  50 messages per month
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Basic AI model
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Conversation history
                </li>
              </ul>
              <router-link to="/register" class="btn-secondary w-full">
                Get Started Free
              </router-link>
            </div>
          </div>

          <!-- Premium Plan -->
          <div class="bg-primary-600 text-white rounded-2xl shadow-sm border border-primary-600 p-8 relative">
            <div class="absolute top-0 right-8 transform -translate-y-1/2">
              <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </span>
            </div>
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-2">Premium</h3>
              <div class="text-4xl font-bold mb-4">
                $20<span class="text-lg opacity-75">/month</span>
              </div>
              <ul class="text-left space-y-3 mb-8">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Unlimited messages
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Advanced AI model
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Priority support
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Export conversations
                </li>
              </ul>
              <router-link to="/register" class="btn bg-white text-primary-600 hover:bg-gray-50 w-full">
                Upgrade to Premium
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">ChatGPT Clone</h3>
          <p class="text-gray-400 mb-8">
            Your intelligent AI assistant for all your needs
          </p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Support</a>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
            © 2025 ChatGPT Clone. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    scrollToFeatures() {
      const element = document.getElementById('features')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>