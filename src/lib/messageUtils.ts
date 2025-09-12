/**
 * Utility functions for chat message interactions
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - The text to copy
 * @returns Promise<boolean> - Success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Format message content for copying
 * @param content - The message content
 * @param includeMetadata - Whether to include timestamp and role
 * @param timestamp - Message timestamp
 * @param role - Message role (user/assistant)
 * @returns Formatted text for copying
 */
export const formatMessageForCopy = (
  content: string,
  includeMetadata: boolean = false,
  timestamp?: string,
  role?: string
): string => {
  if (!includeMetadata) {
    return content
  }
  
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : ''
  const roleText = role === 'user' ? 'You' : 'AI Assistant'
  
  return `[${roleText}] ${formattedTime}\n${content}`
}

/**
 * Reaction types for messages
 */
export type MessageReaction = 'like' | 'dislike' | null

/**
 * Message interaction analytics
 */
export interface MessageAnalytics {
  messageId: string
  reaction?: MessageReaction
  copied: boolean
  timestamp: string
}

/**
 * Local storage key for message reactions
 */
const REACTIONS_STORAGE_KEY = 'chat_message_reactions'

/**
 * Save reactions to localStorage
 * @param reactions - Reactions object to save
 */
export const saveReactionsToStorage = (reactions: Record<string, MessageReaction>) => {
  try {
    localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(reactions))
  } catch (error) {
    console.error('Failed to save reactions to localStorage:', error)
  }
}

/**
 * Load reactions from localStorage
 * @returns Reactions object from storage
 */
export const loadReactionsFromStorage = (): Record<string, MessageReaction> => {
  try {
    const stored = localStorage.getItem(REACTIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load reactions from localStorage:', error)
    return {}
  }
}

/**
 * Track message interaction for analytics
 * @param analytics - Analytics data
 */
export const trackMessageInteraction = (analytics: MessageAnalytics) => {
  // This can be extended to send analytics to your backend
  console.log('Message interaction:', analytics)
  
  // Example: Send to analytics service
  // analyticsService.track('message_interaction', analytics)
}