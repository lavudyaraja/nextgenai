'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MoreHorizontal, 
  MessageCircle,
  RefreshCw,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      setError(null)
      
      // Check if user is authenticated
      if (!user?.id) {
        console.log('No authenticated user, clearing conversations')
        setConversations([])
        setLoading(false)
        setRefreshing(false)
        return
      }
      
      console.log('Fetching conversations for user:', user.id)
      
      const response = await fetch('/api/conversations', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        cache: 'no-store' // Prevent caching
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const conversationsArray = Array.isArray(data) ? data : []
      
      // Transform conversations to ChatItem format
      const chatItems: ChatItem[] = conversationsArray
        .filter((conv: any) => {
          // Only include conversations with at least one user message
          if (!conv || !conv.id) return false
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          return messages.some((msg: any) => msg.role === 'user')
        })
        .map((conv: any) => {
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          const firstUserMessage = messages.find((msg: any) => msg.role === 'user')
          
          const title = firstUserMessage 
            ? firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
            : conv.title || 'New Conversation'

          return {
            id: conv.id,
            title: title,
            lastMessage: '',
            timestamp: new Date(conv.updatedAt || conv.createdAt)
          }
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      console.log('Fetched chat items:', chatItems.length)
      setConversations(chatItems)
    } catch (err) {
      console.error('Failed to fetch conversations for sidebar:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
      setConversations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchConversations()
    
    // Listen for chat history updates
    const handleChatHistoryUpdate = () => {
      console.log('Sidebar received chatHistoryUpdated event')
      fetchConversations()
    }
    
    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    }
  }, [fetchConversations])

  // Auto-refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        console.log('Tab visible, refreshing conversations')
        fetchConversations()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchConversations, user?.id])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchConversations()
  }

  const handleChatSelect = (conversationId: string) => {
    console.log('Navigating to conversation:', conversationId)
    router.push(`/dashboard/chat-ui-interface?id=${conversationId}`)
  }

  const handleDelete = async (conversationId: string) => {
    if (!user?.id) {
      setError('You must be logged in to delete conversations')
      return
    }

    try {
      console.log('Deleting conversation:', conversationId)
      
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Update local state immediately
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      // Notify other components
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      
      console.log('Conversation deleted successfully')
      
      // Refresh to ensure sync
      setTimeout(() => fetchConversations(), 500)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete conversation')
      
      // Refresh on error to get correct state
      await fetchConversations()
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
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

  if (loading) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        Loading conversations...
      </div>
    )
  }

  if (!user?.id) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        Please log in to view chats
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-2 py-4 text-center">
        <p className="text-xs text-red-500 mb-2">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchConversations}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        No conversations yet. Start a chat to see it here!
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="flex items-center justify-between px-2 py-2">
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
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer group"
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