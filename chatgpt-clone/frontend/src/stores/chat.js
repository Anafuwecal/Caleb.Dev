import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatApi } from '@/services/api'

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref([])
  const currentConversation = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const sendingMessage = ref(false)
  const streamingResponse = ref(false)
  const currentStreamContent = ref('')
  const error = ref(null)

  // Getters
  const hasConversations = computed(() => conversations.value.length > 0)
  const currentConversationId = computed(() => currentConversation.value?.id)
  const isStreaming = computed(() => streamingResponse.value)

  // Actions
  const loadConversations = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chatApi.getConversations()
      
      if (response.data.success) {
        conversations.value = response.data.data.conversations
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
      error.value = 'Failed to load conversations'
    } finally {
      loading.value = false
    }
  }

  const loadConversation = async (conversationId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chatApi.getConversation(conversationId)
      
      if (response.data.success) {
        currentConversation.value = response.data.data.conversation
        messages.value = response.data.data.conversation.messages || []
      }
    } catch (err) {
      console.error('Failed to load conversation:', err)
      error.value = 'Failed to load conversation'
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (content, conversationId = null) => {
    sendingMessage.value = true
    error.value = null
    
    // Add user message immediately to UI
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    try {
      const response = await chatApi.sendMessage({
        message: content,
        conversationId
      })
      
      if (response.data.success) {
        const { conversation, usage, creditsRemaining } = response.data.data
        
        // Update conversation info
        if (!currentConversation.value || currentConversation.value.id !== conversation.id) {
          currentConversation.value = {
            id: conversation.id,
            title: conversation.title,
            messages: []
          }
        }

        // Add AI response to messages
        const aiMessage = conversation.messages.find(msg => msg.role === 'assistant')
        if (aiMessage) {
          messages.value.push(aiMessage)
        }

        // Update conversations list
        await loadConversations()
        
        return { usage, creditsRemaining }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      error.value = err.response?.data?.message || 'Failed to send message'
      
      // Remove user message on error
      messages.value.pop()
      throw err
    } finally {
      sendingMessage.value = false
    }
  }

  const sendStreamingMessage = async (content, conversationId = null) => {
    sendingMessage.value = true
    streamingResponse.value = true
    currentStreamContent.value = ''
    error.value = null
    
    // Add user message immediately to UI
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    // Add placeholder for AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true
    }
    messages.value.push(aiMessage)

    try {
      await chatApi.sendStreamingMessage({
        message: content,
        conversationId
      }, (chunk) => {
        // Handle streaming data
        if (chunk.type === 'conversation') {
          if (!currentConversation.value || currentConversation.value.id !== chunk.data.conversationId) {
            currentConversation.value = {
              id: chunk.data.conversationId,
              title: chunk.data.title,
              messages: []
            }
          }
        } else if (chunk.type === 'content') {
          currentStreamContent.value += chunk.data.content
          // Update the last message (AI response)
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = currentStreamContent.value
          }
        } else if (chunk.type === 'complete') {
          // Finalize the message
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.streaming = false
            lastMessage.id = chunk.data.assistantMessage.id
            lastMessage.timestamp = chunk.data.assistantMessage.timestamp
          }
          
          // Update conversations list
          loadConversations()
        } else if (chunk.type === 'error') {
          throw new Error(chunk.data.message)
        }
      })
    } catch (err) {
      console.error('Failed to send streaming message:', err)
      error.value = err.message || 'Failed to send message'
      
      // Remove both user message and AI placeholder on error
      messages.value.splice(-2, 2)
      throw err
    } finally {
      sendingMessage.value = false
      streamingResponse.value = false
      currentStreamContent.value = ''
    }
  }

  const updateConversationTitle = async (conversationId, title) => {
    try {
      const response = await chatApi.updateConversation(conversationId, { title })
      
      if (response.data.success) {
        // Update current conversation
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value.title = title
        }
        
        // Update conversations list
        const conv = conversations.value.find(c => c.id === conversationId)
        if (conv) {
          conv.title = title
        }
      }
    } catch (err) {
      console.error('Failed to update conversation title:', err)
      throw err
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      const response = await chatApi.deleteConversation(conversationId)
      
      if (response.data.success) {
        // Remove from conversations list
        conversations.value = conversations.value.filter(c => c.id !== conversationId)
        
        // Clear current conversation if it was deleted
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value = null
          messages.value = []
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      throw err
    }
  }

  const startNewConversation = () => {
    currentConversation.value = null
    messages.value = []
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    conversations,
    currentConversation,
    messages,
    loading,
    sendingMessage,
    streamingResponse,
    currentStreamContent,
    error,
    
    // Getters
    hasConversations,
    currentConversationId,
    isStreaming,
    
    // Actions
    loadConversations,
    loadConversation,
    sendMessage,
    sendStreamingMessage,
    updateConversationTitle,
    deleteConversation,
    startNewConversation,
    clearError
  }
})