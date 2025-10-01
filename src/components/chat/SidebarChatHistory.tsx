'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MoreHorizontal, 
  MessageCircle,
  RefreshCw,
  Trash2,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ChatItem {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export function SidebarChatHistory() {
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchConversations = useCallback(async () => {
    // Don't fetch if already loading or refreshing
    if (loading && refreshing) return
    
    try {
      setError(null)
      
      // Check authentication first
      if (!user?.id) {
        console.log('[Sidebar] No authenticated user')
        setConversations([])
        setLoading(false)
        setRefreshing(false)
        return
      }
      
      console.log('[Sidebar] Fetching conversations for user:', user.id)
      
      // Use absolute URL in production to avoid routing issues
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = `${baseUrl}/api/conversations`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        credentials: 'include', // Include cookies for authentication
        cache: 'no-store'
      })
      
      console.log('[Sidebar] Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Sidebar] API error:', errorText)
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('[Sidebar] Raw response data:', data)
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.error('[Sidebar] Response is not an array:', data)
        setConversations([])
        setLoading(false)
        setRefreshing(false)
        return
      }
      
      // Filter and transform conversations
      const chatItems: ChatItem[] = data
        .filter((conv: any) => {
          if (!conv || !conv.id) {
            console.warn('[Sidebar] Invalid conversation:', conv)
            return false
          }
          
          // Check if conversation has messages
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          const hasUserMessage = messages.some((msg: any) => msg?.role === 'user')
          
          if (!hasUserMessage) {
            console.log('[Sidebar] Skipping conversation without user messages:', conv.id)
          }
          
          return hasUserMessage
        })
        .map((conv: any) => {
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          const firstUserMessage = messages.find((msg: any) => msg?.role === 'user')
          
          // Generate title from first user message
          let title = 'New Conversation'
          if (firstUserMessage?.content) {
            const content = String(firstUserMessage.content)
            title = content.length > 40 
              ? content.substring(0, 40) + '...' 
              : content
          } else if (conv.title) {
            title = conv.title
          }

          return {
            id: conv.id,
            title: title,
            lastMessage: '',
            timestamp: new Date(conv.updatedAt || conv.createdAt || Date.now())
          }
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      console.log('[Sidebar] Processed chat items:', chatItems.length)
      setConversations(chatItems)
      
    } catch (err) {
      console.error('[Sidebar] Failed to fetch conversations:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations'
      setError(errorMessage)
      setConversations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id, loading, refreshing])

  // Initial load and event listeners
  useEffect(() => {
    console.log('[Sidebar] User changed:', user?.id)
    
    // Reset state when user changes
    setConversations([])
    setLoading(true)
    
    // Fetch conversations
    fetchConversations()
    
    // Listen for updates
    const handleChatHistoryUpdate = () => {
      console.log('[Sidebar] Received chatHistoryUpdated event')
      fetchConversations()
    }
    
    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    }
  }, [user?.id])

  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        console.log('[Sidebar] Tab became visible, refreshing')
        setRefreshing(true)
        fetchConversations()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user?.id])

  const handleRefresh = async () => {
    if (!user?.id) return
    console.log('[Sidebar] Manual refresh triggered')
    setRefreshing(true)
    await fetchConversations()
  }

  const handleChatSelect = (conversationId: string) => {
    console.log('[Sidebar] Navigating to conversation:', conversationId)
    router.push(`/dashboard/chat-ui-interface?id=${conversationId}`)
  }

  const handleDelete = async (conversationId: string) => {
    if (!user?.id) {
      setError('Authentication required')
      return
    }

    setDeleting(true)
    
    try {
      console.log('[Sidebar] Deleting conversation:', conversationId)
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = `${baseUrl}/api/conversations/${conversationId}`
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        credentials: 'include'
      })

      console.log('[Sidebar] Delete response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to delete: ${response.status}`)
      }

      // Update local state immediately
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      // Notify other components
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      
      console.log('[Sidebar] Conversation deleted successfully')
      
    } catch (error) {
      console.error('[Sidebar] Delete failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete'
      setError(errorMessage)
      
      // Refresh to sync state
      setTimeout(() => fetchConversations(), 500)
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversationToDelete(conversationId)
    setDeleteConfirmationOpen(true)
  }

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      handleDelete(conversationToDelete)
      setConversationToDelete(null)
    }
    setDeleteConfirmationOpen(false)
  }

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false)
    setConversationToDelete(null)
  }

  // Loading state
  if (loading && conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Loading chats...</p>
      </div>
    )
  }

  // Not authenticated
  if (!user?.id) {
    return (
      <div className="px-2 py-4 text-center text-xs text-muted-foreground">
        Please log in to view chats
      </div>
    )
  }

  // Error state
  if (error && conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <p className="text-xs text-red-500 mb-2">{error}</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Retry'}
        </Button>
      </div>
    )
  }

  // Empty state
  if (conversations.length === 0 && !loading) {
    return (
      <div className="px-2 py-4 text-center text-xs text-muted-foreground">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The conversation will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <h3 className="text-sm font-semibold text-gray-400">Recent Chats</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {error && (
        <div className="px-2 py-1">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
      
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer group transition-colors"
              onClick={() => handleChatSelect(conversation.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      onClick={(e) => handleDeleteClick(conversation.id, e)}
                      className="text-red-500 focus:text-red-500"
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}