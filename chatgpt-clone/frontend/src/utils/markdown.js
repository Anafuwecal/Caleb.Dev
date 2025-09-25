// Simple markdown parser for chat messages
export function parseMarkdown(text) {
  if (!text) return ''

  let html = text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Code blocks (```code```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text'
      return `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4"><code class="language-${language}">${code.trim()}</code></pre>`
    })
    
    // Inline code (`code`)
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-900 px-1 py-0.5 rounded text-sm">$1</code>')
    
    // Bold (**text**)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Italic (*text*)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-800 underline">$1</a>')
    
    // Line breaks
    .replace(/\n/g, '<br>')

  return html
}

// Extract plain text from markdown
export function extractPlainText(markdown) {
  if (!markdown) return ''
  
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove line breaks
    .replace(/\n/g, ' ')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim()
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Generate conversation title from first message
export function generateConversationTitle(message) {
  const plainText = extractPlainText(message)
  return truncateText(plainText, 50) || 'New Conversation'
}