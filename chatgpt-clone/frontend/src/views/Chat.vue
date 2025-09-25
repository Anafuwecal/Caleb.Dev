<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <ChatSidebar 
      :conversations="conversations"
      :current-conversation="currentConversation"
      :loading="loading"
      @new-conversation="startNewConversation"
      @select-conversation="selectConversation"
      @delete-conversation="deleteConversation"
      @update-title="updateConversationTitle"
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <ChatHeader 
        :user="user"
        :current-conversation="currentConversation"
        @logout="handleLogout"
      />

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto" ref="messagesContainer">
        <div v-if="messages.length === 0" class="h-full flex items-center justify-center">
          <div class="text-center max-w-md">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p class="text-gray-600 mb-4">Ask me anything! I'm here to help with writing, coding, analysis, and more.</p>
            <div class="grid grid-cols-1 gap-2 text-sm">
              <button 
                @click="sendSampleMessage('Help me write a professional email')"
                class="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                💼 Help me write a professional email
              </button>
              <button 
                @click="sendSampleMessage('Explain quantum computing in simple terms')"
                class="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                🧠 Explain quantum computing in simple terms
              </button>
              <button 
                @click="sendSampleMessage('Write a Python function to sort a list')"
                class="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                💻 Write a Python function to sort a list
              </button>
            </div>
          </div>
        </div>

        <div v-else class="space-y-0">
          <ChatMessage 
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
        </div>
      </div>

      <!-- Input Area -->
      <ChatInput 
        :disabled="sendingMessage"
        :streaming="isStreaming"
        @send="handleSendMessage"
        @stop="stopGeneration"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'

export default {
  name: 'Chat',
  components: {
    ChatSidebar,
    ChatHeader,
    ChatMessage,
    ChatInput
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    
    const messagesContainer = ref(null)

    // Computed properties
    const user = computed(() => authStore.user)
    const conversations = computed(() => chatStore.conversations)
    const currentConversation = computed(() => chatStore.currentConversation)
    const messages = computed(() => chatStore.messages)
    const loading = computed(() => chatStore.loading)
    const sendingMessage = computed(() => chatStore.sendingMessage)
    const isStreaming = computed(() => chatStore.isStreaming)

    // Methods
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    const loadConversations = async () => {
      try {
        await chatStore.loadConversations()
      } catch (error) {
        console.error('Failed to load conversations:', error)
      }
    }

    const selectConversation = async (conversationId) => {
      try {
        await chatStore.loadConversation(conversationId)
        router.push(`/chat/${conversationId}`)
        scrollToBottom()
      } catch (error) {
        console.error('Failed to load conversation:', error)
      }
    }

    const startNewConversation = () => {
      chatStore.startNewConversation()
      router.push('/chat')
    }

    const handleSendMessage = async (content) => {
      try {
        const conversationId = currentConversation.value?.id || null
        
        // Use streaming for better UX
        await chatStore.sendStreamingMessage(content, conversationId)
        
        // Update URL if this was a new conversation
        if (!conversationId && chatStore.currentConversationId) {
          router.replace(`/chat/${chatStore.currentConversationId}`)
        }
        
        scrollToBottom()
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }

    const sendSampleMessage = (content) => {
      handleSendMessage(content)
    }

    const deleteConversation = async (conversationId) => {
      try {
        await chatStore.deleteConversation(conversationId)
        
        // If we deleted the current conversation, start a new one
        if (currentConversation.value?.id === conversationId) {
          startNewConversation()
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error)
      }
    }

    const updateConversationTitle = async (conversationId, title) => {
      try {
        await chatStore.updateConversationTitle(conversationId, title)
      } catch (error) {
        console.error('Failed to update conversation title:', error)
      }
    }

    const stopGeneration = () => {
      // TODO: Implement stop generation functionality
      console.log('Stop generation requested')
    }

    const handleLogout = async () => {
      try {
        await authStore.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Load initial data
    onMounted(async () => {
      await loadConversations()
      
      // Load specific conversation if ID is in route
      const conversationId = route.params.conversationId
      if (conversationId) {
        await selectConversation(conversationId)
      }
    })

    // Watch for route changes
    watch(
      () => route.params.conversationId,
      async (newId, oldId) => {
        if (newId && newId !== oldId) {
          await selectConversation(newId)
        } else if (!newId && oldId) {
          startNewConversation()
        }
      }
    )

    // Auto-scroll when new messages arrive
    watch(
      () => messages.value.length,
      () => {
        scrollToBottom()
      }
    )

    return {
      messagesContainer,
      user,
      conversations,
      currentConversation,
      messages,
      loading,
      sendingMessage,
      isStreaming,
      selectConversation,
      startNewConversation,
      handleSendMessage,
      sendSampleMessage,
      deleteConversation,
      updateConversationTitle,
      stopGeneration,
      handleLogout
    }
  }
}
</script>