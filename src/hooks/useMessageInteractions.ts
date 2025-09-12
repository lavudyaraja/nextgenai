/**
 * Custom React hook for managing message interactions
 * Provides copy, like, and dislike functionality for chat messages
 */

import { useState, useCallback, useEffect } from 'react'
import { 
  copyToClipboard, 
  formatMessageForCopy, 
  trackMessageInteraction, 
  MessageReaction,
  saveReactionsToStorage,
  loadReactionsFromStorage
} from '@/lib/messageUtils'

export interface UseMessageInteractionsReturn {
  // State
  copiedMessageId: string | null
  messageReactions: Record<string, MessageReaction>
  
  // Actions
  handleCopyMessage: (messageId: string, content: string, timestamp?: string, role?: string) => Promise<void>
  handleMessageReaction: (messageId: string, reaction: 'like' | 'dislike') => Promise<void>
  loadMessageReactions: (conversationId: string) => Promise<void>
  
  // Utilities
  isMessageCopied: (messageId: string) => boolean
  getMessageReaction: (messageId: string) => MessageReaction
}

export const useMessageInteractions = (): UseMessageInteractionsReturn => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [messageReactions, setMessageReactions] = useState<Record<string, MessageReaction>>({})

  // Load reactions from localStorage on mount
  useEffect(() => {
    const storedReactions = loadReactionsFromStorage()
    setMessageReactions(storedReactions)
  }, [])

  // Copy message to clipboard
  const handleCopyMessage = useCallback(async (
    messageId: string, 
    content: string, 
    timestamp?: string, 
    role?: string
  ) => {
    const formattedContent = formatMessageForCopy(content, false)
    const success = await copyToClipboard(formattedContent)
    
    if (success) {
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
      
      trackMessageInteraction({
        messageId,
        copied: true,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  // Handle like/dislike reactions
  const handleMessageReaction = useCallback(async (messageId: string, reaction: 'like' | 'dislike') => {
    const currentReaction = messageReactions[messageId]
    const newReaction = currentReaction === reaction ? null : reaction
    
    // Update state
    const newReactions = {
      ...messageReactions,
      [messageId]: newReaction
    }
    setMessageReactions(newReactions)
    
    // Save to localStorage
    saveReactionsToStorage(newReactions)

    // Track the interaction
    trackMessageInteraction({
      messageId,
      reaction: newReaction,
      copied: false,
      timestamp: new Date().toISOString()
    })

    // Also try to save to API (will work when database is updated)
    try {
      await fetch('/api/message-reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          reaction: newReaction
        })
      })
    } catch (error) {
      console.log('API save failed (expected until database is updated):', error)
    }
  }, [messageReactions])

  // Load reactions for a conversation (from localStorage for now)
  const loadMessageReactions = useCallback(async (conversationId: string) => {
    console.log(`Loading reactions for conversation ${conversationId} from localStorage`)
    // Reactions are already loaded from localStorage in useEffect
    // In the future, this will load from the API when database is updated
  }, [])

  // Utility functions
  const isMessageCopied = useCallback((messageId: string) => {
    return copiedMessageId === messageId
  }, [copiedMessageId])

  const getMessageReaction = useCallback((messageId: string) => {
    return messageReactions[messageId] || null
  }, [messageReactions])

  return {
    copiedMessageId,
    messageReactions,
    handleCopyMessage,
    handleMessageReaction,
    loadMessageReactions,
    isMessageCopied,
    getMessageReaction
  }
}