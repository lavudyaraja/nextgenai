'use client'

import { 
  useState, 
  useEffect 
} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Loader2, 
  MessageCircle, 
  Search, 
  Plus, 
  Trash2, 
  Download,
  SortAsc,
  SortDesc,
  Filter,
  Clock,
  Calendar,
  MoreHorizontal,
  Pin,
  Archive
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { formatTime, formatRelativeTime } from '@/lib/conversation-manager'
import { type ConversationWithMessages } from '@/lib/database-service'

type SortOption = 'newest' | 'oldest' | 'title' | 'activity'

export function ChatHistory() {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([])
  const [filteredConversations, setFilteredConversations] = useState<ConversationWithMessages[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the API to get conversations
      const response = await fetch('/api/conversations')
      const data = await response.json()
      
      const conversationsArray = Array.isArray(data) ? data : []
      setConversations(conversationsArray)
      console.log('Fetched conversations:', conversationsArray.length)
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
      setError('Failed to load conversations')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()

    // Listen for conversation updates
    const handleConversationUpdate = () => {
      fetchConversations()
    }

    window.addEventListener('chatHistoryUpdated', handleConversationUpdate)
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleConversationUpdate)
    }
  }, [])

  // Sort conversations
  const sortConversations = (convs: ConversationWithMessages[], sortOption: SortOption) => {
    const sorted = [...convs].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'activity':
          return b.messages.length - a.messages.length
        default:
          return 0
      }
    })
    return sorted
  }

  // Filter and sort conversations
  useEffect(() => {
    let filtered = conversations

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = conversations.filter(conv => {
        const titleMatch = conv.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const messageMatch = conv.messages.some(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return titleMatch || messageMatch
      })
    }

    // Apply sorting
    filtered = sortConversations(filtered, sortBy)
    
    setFilteredConversations(filtered)
  }, [searchTerm, conversations, sortBy])

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      })

      if (!response.ok) throw new Error('Failed to create conversation')

      const newConversation = await response.json()
      router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
      
      // Refresh conversations
      fetchConversations()
    } catch (err) {
      console.error('Failed to create new conversation:', err)
      // Fallback to local creation
      router.push('/dashboard/chat-ui-interface')
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete conversation')

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      console.log('Conversation deleted successfully')
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      setError('Failed to delete conversation')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setConversationToDelete(null)
    }
  }

  const openDeleteDialog = (conversationId: string) => {
    setConversationToDelete(conversationId)
    setDeleteDialogOpen(true)
  }

  const handleExportConversation = async (conversation: ConversationWithMessages) => {
    try {
      const exportData = {
        title: conversation.title,
        createdAt: conversation.createdAt,
        messages: conversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt
        }))
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conversation-${conversation.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'export'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export conversation:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg font-medium">Loading conversations...</p>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your chat history</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't load your conversations. Please try again.
          </p>
          <Button onClick={fetchConversations}>
            <Search className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Chat History</h1>
          <p className="text-muted-foreground">
            Manage and browse your {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNewChat} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations and messages..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('newest')}>
              <Clock className="h-4 w-4 mr-2" />
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('oldest')}>
              <Calendar className="h-4 w-4 mr-2" />
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('title')}>
              <SortAsc className="h-4 w-4 mr-2" />
              By Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('activity')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Most Active
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} 
            matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* Conversations List */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Conversations
            <Badge variant="secondary">
              {filteredConversations.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Click on any conversation to continue chatting
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)] p-8 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {searchTerm ? 'No matching conversations' : 'No conversations yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all conversations'
                  : 'Start your first conversation by clicking the "New Chat" button above'
                }
              </p>
              {searchTerm ? (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  <Search className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              ) : (
                <Button onClick={handleNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="divide-y">
                {filteredConversations.map((conversation) => {
                  const lastMessage = conversation.messages.length > 0 
                    ? conversation.messages[conversation.messages.length - 1] 
                    : null
                  const messageCount = conversation.messages.length

                  return (
                    <div
                      key={conversation.id}
                      className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                      onClick={() => router.push(`/dashboard/chat-ui-interface?id=${conversation.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              <MessageCircle className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                              <h3 className="font-medium truncate">
                                {conversation.title || `Chat from ${formatTime(new Date(conversation.createdAt))}`}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {messageCount} message{messageCount !== 1 ? 's' : ''}
                                </Badge>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatRelativeTime(new Date(conversation.updatedAt))}
                                </span>
                              </div>
                            </div>
                            
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                <span className="font-medium">
                                  {lastMessage.role === 'user' ? 'You: ' : 'AI: '}
                                </span>
                                {lastMessage.content.length > 100 
                                  ? lastMessage.content.substring(0, 100) + '...' 
                                  : lastMessage.content}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Created {formatTime(new Date(conversation.createdAt))}
                              {conversation.updatedAt !== conversation.createdAt && (
                                <>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  Updated {formatTime(new Date(conversation.updatedAt))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Pin conversation:', conversation.id)
                                }}
                              >
                                <Pin className="h-4 w-4 mr-2" />
                                Pin Conversation
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleExportConversation(conversation)
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Export as JSON
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Archive conversation:', conversation.id)
                                }}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(conversation.id)
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone 
              and will permanently remove all messages in this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (conversationToDelete) {
                  handleDeleteConversation(conversationToDelete)
                }
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}