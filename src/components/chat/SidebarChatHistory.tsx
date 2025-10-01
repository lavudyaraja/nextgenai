'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MoreHorizontal, 
  Pin, 
  Bookmark, 
  Archive, 
  Download,
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
import { formatTime } from '@/lib/conversation-manager'
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
import { toast } from 'sonner'

interface ChatItem {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export function SidebarChatHistory() {
  const router = useRouter()
  const { user } = useAuth() // Get the current user from auth context
  const [conversations, setConversations] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setError(null)
      console.log('Fetching conversations for sidebar...')
      
      // Check if user is authenticated
      if (!user?.id) {
        console.log('No authenticated user, clearing conversations')
        setConversations([])
        setLoading(false)
        return
      }
      
      console.log('Fetching conversations for user ID:', user.id)
      
      // Use the API to get conversations for the current user
      const response = await fetch('/api/conversations', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      })
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Fetched raw data from /api/conversations:', data)
      
      // Ensure data is an array
      const conversationsArray = Array.isArray(data) ? data : []
      console.log('Conversations array:', conversationsArray)
      
      // Transform conversations to ChatItem format
      const chatItems: ChatItem[] = conversationsArray
        .filter((conv: any) => conv && conv.id) // Filter out invalid conversations
        .map((conv: any) => {
          // Get the first user message as the title
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          const firstUserMessage = messages.find((msg: any) => msg.role === 'user')
          
          // Use first user message as title, or fall back to a generic title
          const title = firstUserMessage 
            ? firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
            : 'New Conversation'

          return {
            id: conv.id,
            title: title,
            lastMessage: '', // We don't need to show last message in sidebar
            timestamp: new Date(conv.updatedAt || conv.createdAt)
          }
        })
        // Filter out conversations that don't have actual messages (only show conversations with user messages)
        .filter((item: ChatItem) => {
          const conversation = conversationsArray.find((conv: any) => conv.id === item.id)
          if (conversation && Array.isArray(conversation.messages)) {
            // Only show conversations that have at least one user message
            return conversation.messages.some((msg: any) => msg.role === 'user')
          }
          return false
        })
        // Sort by timestamp, newest first
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      console.log('Transformed chat items:', chatItems)
      setConversations(chatItems)
    } catch (err) {
      console.error('Failed to fetch conversations for sidebar:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
      // Show error state to user
      setConversations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    // Only fetch conversations if user is authenticated
    if (user?.id) {
      fetchConversations()
    } else {
      // Clear conversations if user is not authenticated
      setConversations([])
      setLoading(false)
    }
    
    // Listen for chat history updates
    const handleChatHistoryUpdate = (event: Event) => {
      console.log('Received chatHistoryUpdated event')
      // Only fetch if user is authenticated
      if (user?.id) {
        fetchConversations()
      }
    }
    
    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    }
  }, [user?.id]) // Re-fetch when user changes

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchConversations()
  }

  const handleChatSelect = (conversationId: string) => {
    console.log('Navigating to conversation:', conversationId)
    router.push(`/dashboard/chat-ui-interface?id=${conversationId}`)
  }

  const handlePin = (conversationId: string) => {
    console.log('Pin conversation:', conversationId)
    // TODO: Implement pin functionality
  }

  const handleBookmark = (conversationId: string) => {
    console.log('Bookmark conversation:', conversationId)
    // TODO: Implement bookmark functionality
  }

  const handleArchive = (conversationId: string) => {
    console.log('Archive conversation:', conversationId)
    // TODO: Implement archive functionality
  }

  const handleDownload = (conversationId: string) => {
    console.log('Download conversation:', conversationId)
    // TODO: Implement download functionality
  }

  const handleDelete = async (conversationId: string) => {
    try {
      console.log('Deleting conversation:', conversationId)
      console.log('Current user ID:', user?.id)
      
      // Prepare headers with user ID
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Add user ID to headers if available
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers
      })

      console.log('Delete response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      // Refresh the conversations list
      await fetchConversations()
      
      // Dispatch event to update other parts of the UI
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      
      console.log('Conversation deleted successfully')
      toast.success('Conversation deleted successfully')
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation'
      setError(errorMessage)
      toast.error(`Failed to delete conversation: ${errorMessage}`)
      
      // Show error to user for a few seconds
      setTimeout(() => {
        setError(null)
      }, 5000)
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

  // Force refresh when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations()
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        Loading conversations...
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-2 py-4 text-center text-sm text-red-500">
        Error: {error}
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePin(conversation.id)
                      }}
                    >
                      <Pin className="h-4 w-4 mr-2" />
                      Pin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBookmark(conversation.id)
                      }}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchive(conversation.id)
                      }}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(conversation.id)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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