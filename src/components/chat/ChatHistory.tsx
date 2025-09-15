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
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch('/api/conversations', {
        headers
      })
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

    const handleConversationUpdate = () => {
      fetchConversations()
    }

    window.addEventListener('chatHistoryUpdated', handleConversationUpdate)
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleConversationUpdate)
    }
  }, [user?.id])

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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: 'New Chat' })
      })

      if (!response.ok) throw new Error('Failed to create conversation')

      const newConversation = await response.json()
      router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
      
      fetchConversations()
    } catch (err) {
      console.error('Failed to create new conversation:', err)
      router.push('/dashboard/chat-ui-interface')
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    setDeleting(true)
    try {
      const headers: Record<string, string> = {}
      
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) throw new Error('Failed to delete conversation')

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

  const handleDeleteAllConversations = async () => {
    setDeleting(true)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'deleteAll' })
      })

      if (response.ok) {
        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            console.log('Delete all response:', data);
          } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            console.log('Response text was:', text);
          }
        }
        setConversations([])
        setFilteredConversations([])
        console.log('All conversations deleted successfully')
      } else {
        const text = await response.text();
        let errorMessage = 'Failed to delete all conversations';
        if (text) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Failed to delete all conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete all conversations')
    } finally {
      setDeleting(false)
      setDeleteAllDialogOpen(false)
      fetchConversations()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
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
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-pink-400/40 rounded-full animate-pulse"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

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
                className="relative group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Trash2 className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Delete All</span>
              </Button>
            )}
            <Button 
              onClick={handleNewChat} 
              className="relative group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
              <Plus className="h-4 w-4 mr-2 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">New Chat</span>
              <Sparkles className="h-3 w-3 ml-2 relative z-10 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search conversations and messages..."
              className="pl-12 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-slate-800/95 border-slate-700/50 text-slate-200 backdrop-blur-sm"
            >
              <DropdownMenuItem 
                onClick={() => setSortBy('newest')}
                className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
              >
                <Clock className="h-4 w-4 mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('oldest')}
                className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('title')}
                className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
              >
                <SortAsc className="h-4 w-4 mr-2" />
                By Title
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('activity')}
                className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Most Active
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Found <span className="text-cyan-400 font-medium">{filteredConversations.length}</span> conversation{filteredConversations.length !== 1 ? 's' : ''} 
              matching "<span className="text-purple-400 font-medium">{searchTerm}</span>"
            </p>
          </div>
        )}

        {/* Conversations List */}
        <Card className="flex-1 overflow-hidden bg-slate-800/30 border-slate-700/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-slate-700/50 bg-slate-800/20">
            <CardTitle className="flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-cyan-400" />
                Recent Conversations
              </span>
              <Badge 
                variant="secondary"
                className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30"
              >
                {filteredConversations.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Click on any conversation to continue chatting
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)] p-8 text-center">
                <div className="relative mb-6">
                  <MessageCircle className="h-20 w-20 text-slate-500 mx-auto" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-medium mb-3 bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                  {searchTerm ? 'No matching conversations' : 'No conversations yet'}
                </h3>
                <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse all conversations'
                    : 'Start your first conversation by clicking the "New Chat" button above'
                  }
                </p>
                {searchTerm ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-400"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNewChat}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg hover:shadow-cyan-500/25"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="divide-y divide-slate-700/30">
                  {filteredConversations.map((conversation, index) => {
                    const lastMessage = conversation.messages.length > 0 
                      ? conversation.messages[conversation.messages.length - 1] 
                      : null
                    const messageCount = conversation.messages.length

                    return (
                      <div
                        key={conversation.id}
                        className="p-6 hover:bg-slate-700/20 cursor-pointer transition-all duration-300 group relative overflow-hidden border-l-2 border-transparent hover:border-cyan-500/50"
                        onClick={() => router.push(`/dashboard/chat-ui-interface?id=${conversation.id}`)}
                      >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="relative">
                              <Avatar className="h-12 w-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-slate-600/50">
                                <AvatarFallback className="bg-transparent">
                                  <MessageCircle className="h-6 w-6 text-cyan-400" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between mb-2">
                                <h3 className="font-medium truncate text-slate-200 group-hover:text-white transition-colors duration-300">
                                  {conversation.title || `Chat from ${formatTime(new Date(conversation.createdAt))}`}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 text-cyan-300"
                                  >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {messageCount} message{messageCount !== 1 ? 's' : ''}
                                  </Badge>
                                  <span className="text-xs text-slate-400 whitespace-nowrap group-hover:text-slate-300 transition-colors duration-300">
                                    {formatRelativeTime(new Date(conversation.updatedAt))}
                                  </span>
                                </div>
                              </div>
                              
                              {lastMessage && (
                                <p className="text-sm text-slate-400 truncate group-hover:text-slate-300 transition-colors duration-300">
                                  <span className="font-medium text-cyan-400">
                                    {lastMessage.role === 'user' ? 'You: ' : 'AI: '}
                                  </span>
                                  {lastMessage.content.length > 100 
                                    ? lastMessage.content.substring(0, 100) + '...' 
                                    : lastMessage.content}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
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
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-48 bg-slate-800/95 border-slate-700/50 text-slate-200 backdrop-blur-sm"
                              >
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('Pin conversation:', conversation.id)
                                  }}
                                  className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
                                >
                                  <Pin className="h-4 w-4 mr-2" />
                                  Pin Conversation
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleExportConversation(conversation)
                                  }}
                                  className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export as JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('Archive conversation:', conversation.id)
                                  }}
                                  className="hover:bg-slate-700/50 focus:bg-slate-700/50 hover:text-cyan-400"
                                >
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700/50" />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDeleteDialog(conversation.id)
                                  }}
                                  className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 hover:text-red-300"
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
        <AlertDialogContent className="bg-slate-800/90 border-slate-700 text-slate-200 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this conversation? This action cannot be undone 
              and will permanently remove all messages in this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 hover:bg-slate-700" disabled={deleting}>Cancel</AlertDialogCancel>
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

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-slate-800/90 border-slate-700 text-slate-200 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Conversations</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete ALL conversations? This action cannot be undone 
              and will permanently remove all your chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 hover:bg-slate-700" disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllConversations}
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
                  Delete All
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}