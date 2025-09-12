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
  RefreshCw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { formatTime } from '@/lib/conversation-manager'

interface ChatItem {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export function SidebarChatHistory() {
  const router = useRouter()
  const [conversations, setConversations] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations for sidebar...')
      // Use the API to get conversations
      const response = await fetch('/api/conversations')
      const data = await response.json()
      console.log('Fetched raw data from /api/conversations:', data)
      
      // Ensure data is an array
      const conversationsArray = Array.isArray(data) ? data : []
      console.log('Conversations array:', conversationsArray)
      
      // Transform conversations to ChatItem format
      const chatItems: ChatItem[] = conversationsArray
        .filter((conv: any) => conv && conv.id) // Filter out invalid conversations
        .map((conv: any) => {
          // Get the last message for display
          const messages = Array.isArray(conv.messages) ? conv.messages : []
          const lastMessage = messages.length > 0 
            ? messages[messages.length - 1] 
            : null

          return {
            id: conv.id,
            title: conv.title || `Chat ${formatTime(new Date(conv.createdAt || new Date()))}`,
            lastMessage: lastMessage?.content || 'New conversation',
            timestamp: new Date(conv.updatedAt || conv.createdAt || new Date())
          }
        })
        // Sort by timestamp, newest first
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      console.log('Transformed chat items:', chatItems)
      setConversations(chatItems)
    } catch (err) {
      console.error('Failed to fetch conversations for sidebar:', err)
      setConversations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchConversations()
    
    // Listen for chat history updates
    const handleChatHistoryUpdate = () => {
      console.log('Received chatHistoryUpdated event')
      fetchConversations()
    }
    
    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate)
    }
  }, [])

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

  if (conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        No conversations yet. Start a new chat!
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
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
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage.length > 80 
                      ? conversation.lastMessage.substring(0, 80) + '...' 
                      : conversation.lastMessage}
                  </p>
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