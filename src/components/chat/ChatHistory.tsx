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
  Filter,
  Clock,
  Calendar,
  MoreHorizontal,
  Pin,
  Archive,
  Sparkles,
  Zap
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
import { useAuth } from '@/contexts/auth-context'

type SortOption = 'newest' | 'oldest' | 'title' | 'activity'

export function ChatHistory() {
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([])
  const [filteredConversations, setFilteredConversations] = useState<ConversationWithMessages[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if user is authenticated
      if (!user?.id) {
        console.log('No authenticated user')
        setConversations([])
        setLoading(false)
        return
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-id': user.id
      }
      
      const response = await fetch('/api/conversations', {
        headers,
        // Add cache-busting to prevent stale data
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      const conversationsArray = Array.isArray(data) ? data : []
      
      // Filter conversations to only show those with user messages
      const filteredConversations = conversationsArray.filter((conv: any) => {
        if (!conv || !conv.id) return false
        const messages = Array.isArray(conv.messages) ? conv.messages : []
        return messages.some((msg: any) => msg.role === 'user')
      })
      
      setConversations(filteredConversations)
      console.log('Fetched conversations:', filteredConversations.length)
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
      setError('Failed to load conversations')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    } else {
      setConversations([])
      setLoading(false)
    }

    const handleConversationUpdate = () => {
      if (user?.id) {
        // Add a small delay to ensure database is updated
        setTimeout(() => {
          fetchConversations()
        }, 100)
      }
    }

    // Also listen for storage events which might indicate changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chatHistoryUpdate' && user?.id) {
        console.log('ChatHistory received storage event for chat history update')
        fetchConversations()
      }
    }
    
    window.addEventListener('chatHistoryUpdated', handleConversationUpdate)
    window.addEventListener('storage', handleStorageChange)
    
    // Polling as a fallback for deployed environments
    const pollInterval = setInterval(() => {
      if (user?.id && !loading) {
        fetchConversations()
      }
    }, 15000) // Poll every 15 seconds
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleConversationUpdate)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [user?.id, loading])

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

    if (searchTerm.trim()) {
      filtered = conversations.filter(conv => {
        const titleMatch = conv.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const messageMatch = conv.messages.some(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return titleMatch || messageMatch
      })
    }

    filtered = sortConversations(filtered, sortBy)
    setFilteredConversations(filtered)
  }, [searchTerm, conversations, sortBy])

  const handleNewChat = async () => {
    try {
      if (!user?.id) {
        setError('You must be logged in to create a chat')
        return
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-id': user.id
      }
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: 'New Chat' })
      })

      if (!response.ok) throw new Error('Failed to create conversation')

      const newConversation = await response.json()
      router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
      
      // Refresh conversations
      await fetchConversations()
      window.dispatchEvent(new Event('chatHistoryUpdated'))
    } catch (err) {
      console.error('Failed to create new conversation:', err)
      router.push('/dashboard/chat-ui-interface')
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (!user?.id) {
      setError('You must be logged in to delete conversations')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to delete conversation')
      }

      // Update local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      // Notify other components
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      
      console.log('Conversation deleted successfully')
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
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

  const handleDeleteAllConversations = async () => {
    if (!user?.id) {
      setError('You must be logged in to delete conversations')
      return
    }

    setDeleting(true)
    try {
      // Delete conversations one by one
      const deletePromises = conversations.map(conv => 
        fetch(`/api/conversations/${conv.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          }
        })
      )

      await Promise.all(deletePromises)
      
      // Clear local state
      setConversations([])
      setFilteredConversations([])
      
      // Notify other components
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      
      console.log('All conversations deleted successfully')
    } catch (err) {
      console.error('Failed to delete all conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete all conversations')
      
      // Refresh to get current state
      await fetchConversations()
    } finally {
      setDeleting(false)
      setDeleteAllDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <p className="text-xl font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Loading conversations...
          </p>
          <p className="text-sm text-slate-400">Please wait while we fetch your chat history</p>
        </div>
      </div>
    )
  }

  if (!user?.id) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <MessageCircle className="h-16 w-16 text-slate-500 mb-4" />
        <p className="text-xl text-slate-400">Please log in to view your chat history</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-pink-600/10"></div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-6">
            <MessageCircle className="h-16 w-16 text-red-400 mx-auto" />
            <div className="absolute inset-0 bg-red-400/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <h3 className="text-xl font-medium text-red-400 mb-2">{error}</h3>
          <p className="text-slate-400 mb-6">
            We couldn't load your conversations. Please try again.
          </p>
          <Button 
            onClick={fetchConversations}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 border-0 shadow-lg hover:shadow-red-500/25"
          >
            <Search className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-purple-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Chat History
            </h1>
            <div className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            <p className="text-slate-400 mt-3">
              Manage and browse your {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {conversations.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => setDeleteAllDialogOpen(true)}
                disabled={deleting}
                className="relative group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete All</span>
              </Button>
            )}
            <Button 
              onClick={handleNewChat} 
              className="relative group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Chat</span>
              <Sparkles className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search conversations and messages..."
              className="pl-12 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800/95 border-slate-700/50">
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                <Clock className="h-4 w-4 mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                <Calendar className="h-4 w-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('activity')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Most Active
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conversations List */}
        <Card className="flex-1 overflow-hidden bg-slate-800/30 border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-cyan-400" />
                Recent Conversations
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                {filteredConversations.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
                <MessageCircle className="h-20 w-20 text-slate-500 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-slate-300 mb-3">
                  {searchTerm ? 'No matching conversations' : 'No conversations yet'}
                </h3>
                <p className="text-slate-400 mb-8">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start your first conversation by clicking "New Chat"'
                  }
                </p>
                <Button onClick={searchTerm ? () => setSearchTerm('') : handleNewChat}>
                  {searchTerm ? 'Clear Search' : 'Start New Chat'}
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="divide-y divide-slate-700/30">
                  {filteredConversations.map((conversation) => {
                    const lastMessage = conversation.messages[conversation.messages.length - 1]
                    const messageCount = conversation.messages.length

                    return (
                      <div
                        key={conversation.id}
                        className="p-6 hover:bg-slate-700/20 cursor-pointer transition-all group"
                        onClick={() => router.push(`/dashboard/chat-ui-interface?id=${conversation.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                <MessageCircle className="h-6 w-6 text-cyan-400" />
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between mb-2">
                                <h3 className="font-medium text-slate-200">
                                  {conversation.title || `Chat from ${formatTime(new Date(conversation.createdAt))}`}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    {messageCount}
                                  </Badge>
                                  <span className="text-xs text-slate-400">
                                    {formatRelativeTime(new Date(conversation.updatedAt))}
                                  </span>
                                </div>
                              </div>
                              
                              {lastMessage && (
                                <p className="text-sm text-slate-400 truncate">
                                  <span className="font-medium text-cyan-400">
                                    {lastMessage.role === 'user' ? 'You: ' : 'AI: '}
                                  </span>
                                  {lastMessage.content.substring(0, 100)}
                                  {lastMessage.content.length > 100 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100">
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
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleExportConversation(conversation)
                                }}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export as JSON
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDeleteDialog(conversation.id)
                                  }}
                                  className="text-red-400"
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
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
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Conversations</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL {conversations.length} conversations? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllConversations}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}