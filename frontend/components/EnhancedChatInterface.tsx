'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  Image, 
  Search, 
  History, 
  Menu, 
  X,
  Plus,
  Mic,
  MoreHorizontal,
  Share2,
  Download,
  Moon,
  Sun,
  Monitor,
  LogOut,
  User as UserIcon,
  Video,
  FileText,
  Settings,
  HelpCircle,
  Crown,
  Wand2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MessageSquare,
  FileQuestion,
  CreditCard
} from 'lucide-react'
import ConversationHistory from './ConversationHistory'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  createdAt: string
}

interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: string
}

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'search'>('chat')
  const [showHistory, setShowHistory] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isResearchDropdownOpen, setIsResearchDropdownOpen] = useState(false)
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Apply theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          conversationId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          createdAt: new Date().toISOString()
        }

        setMessages(prev => [...prev, assistantMessage])
        setConversationId(data.conversationId)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          size: '1024x1024'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const imageMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Generated image for: "${input}"`,
          imageUrl: `data:image/png;base64,${data.image}`,
          createdAt: new Date().toISOString()
        }

        setMessages(prev => [...prev, imageMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error generating the image. Please try again.',
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleWebSearch = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(input)}`)
      const data = await response.json()

      if (response.ok) {
        const searchResults = data.slice(0, 5).map((result: any, index: number) => ({
          url: result.url,
          name: result.name,
          snippet: result.snippet
        }))

        const searchMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Search results for "${input}":\n\n${searchResults.map((result: any, i: number) => 
            `${i + 1}. [${result.name}](${result.url})\n   ${result.snippet}`
          ).join('\n')}`,
          createdAt: new Date().toISOString()
        }

        setMessages(prev => [...prev, searchMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error with the web search. Please try again.',
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => {
    switch (activeTab) {
      case 'chat':
        handleSendMessage()
        break
      case 'image':
        handleGenerateImage()
        break
      case 'search':
        handleWebSearch()
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceRecord = () => {
    setIsVoiceRecording(!isVoiceRecording)
    // Placeholder for voice recording functionality
    setTimeout(() => {
      setIsVoiceRecording(false)
      setInput("Voice input would appear here...")
    }, 2000)
  }

  const handleExportChat = () => {
    const chatData = {
      messages: messages,
      timestamp: new Date().toISOString(),
      conversationId
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${conversationId || 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShareChat = async () => {
    const shareUrl = `${window.location.origin}?chat=${conversationId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Assistant Chat',
          text: 'Check out this conversation with AI Assistant',
          url: shareUrl
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Chat link copied to clipboard!')
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setConversationId(null)
    setInput('')
  }

  const handleClearChat = () => {
    setMessages([])
    setConversationId(null)
  }

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const renderThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
      default:
        return <Sun className="w-4 h-4" />
    }
  }

  const handleResearchAction = (action: string) => {
    setIsResearchDropdownOpen(false)
    
    switch (action) {
      case 'web':
        setActiveTab('search')
        setInput('What would you like to search for?')
        break
      case 'image':
        setActiveTab('image')
        setInput('Describe the image you want to generate...')
        break
      case 'video':
        // Placeholder for video generation
        setInput('Video generation feature coming soon...')
        break
      case 'document':
        // Placeholder for document analysis
        setInput('Document analysis feature coming soon...')
        break
      default:
        break
    }
  }

  const handleLogout = () => {
    // Placeholder for logout functionality
    alert('Logout functionality would be implemented here')
  }

  const handleUpgrade = () => {
    // Placeholder for upgrade functionality
    alert('Upgrade functionality would be implemented here')
  }

  const handleCustomizeAI = () => {
    // Placeholder for customize AI functionality
    alert('Customize AI functionality would be implemented here')
  }

  const handleHelp = () => {
    // Placeholder for help functionality
    alert('Help functionality would be implemented here')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={`relative transition-all duration-300 ${
          isSidebarOpen ? 'w-80' : 'w-16'
        } bg-card border-r`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* Hover overlay for collapsed sidebar */}
        {!isSidebarOpen && isSidebarHovered && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-primary-foreground">AI Assistant</span>
            </div>
          </div>
        )}
        
        {isSidebarOpen && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg font-semibold">AI Assistant</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleNewChat}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('search')
                    setInput('What would you like to search for?')
                  }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </div>
            </div>

            {/* Conversation History */}
            {showHistory && (
              <div className="flex-1 overflow-hidden">
                <ConversationHistory
                  onSelectConversation={(id) => {
                    // Placeholder for loading conversation
                    console.log('Loading conversation:', id)
                  }}
                  selectedConversation={conversationId}
                />
              </div>
            )}

            {/* User Profile Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">User Profile</div>
                  <div className="text-xs text-muted-foreground">Free Plan</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(true)}
                    className="h-8 w-8 p-0"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 w-8 p-0"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className={isSidebarOpen ? 'invisible' : ''}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                {conversationId ? 'Active conversation' : 'Start chatting'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportChat}
              title="Export Chat"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareChat}
              title="Share Chat"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={`Theme: ${theme}`}
            >
              {renderThemeIcon()}
            </Button>
          </div>
        </div>

        {/* Chat Tabs */}
        <div className="flex gap-2 p-4 border-b">
          <Badge 
            variant={activeTab === 'chat' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </Badge>
          <Badge 
            variant={activeTab === 'image' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('image')}
          >
            Generate Image
          </Badge>
          <Badge 
            variant={activeTab === 'search' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('search')}
          >
            Web Search
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with AI assistant</p>
                    <p className="text-sm mt-2">You can chat, generate images, or search the web</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                      </div>
                      
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Generated image"
                            className="max-w-full rounded-md"
                          />
                        </div>
                      )}
                      
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    activeTab === 'chat' ? 'Type your message...' :
                    activeTab === 'image' ? 'Describe the image you want to generate...' :
                    'What would you like to search for?'
                  }
                  disabled={isLoading}
                  className="pr-12"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceRecord}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                    title={isVoiceRecording ? "Stop recording" : "Voice input"}
                  >
                    <Mic className={`w-4 h-4 ${isVoiceRecording ? 'text-red-500 animate-pulse' : ''}`} />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsResearchDropdownOpen(!isResearchDropdownOpen)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                      title="Research options"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    {isResearchDropdownOpen && (
                      <div className="absolute right-0 top-8 w-48 bg-background border rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => handleResearchAction('web')}
                          >
                            <Search className="w-4 h-4 inline mr-2" />
                            Web Search
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => handleResearchAction('image')}
                          >
                            <Image className="w-4 h-4 inline mr-2" />
                            Generate Image
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => handleResearchAction('video')}
                          >
                            <Video className="w-4 h-4 inline mr-2" />
                            Generate Video
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => handleResearchAction('document')}
                          >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Analyze Document
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Settings Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Settings Content */}
            <div className="p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Customize AI Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Customize AI</h3>
                    <p className="text-sm text-muted-foreground">Personalize AI behavior and responses</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Help Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Help & Support</h3>
                    <p className="text-sm text-muted-foreground">Get help and contact support</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Upgrade Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Upgrade to Pro</h3>
                    <p className="text-sm text-muted-foreground">Unlock advanced features and priority support</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Account Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Appearance</h3>
                    <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Data & Privacy */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Data & Privacy</h3>
                    <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Billing */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Billing</h3>
                    <p className="text-sm text-muted-foreground">Manage subscription and payments</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Settings Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">User Profile</div>
                  <div className="text-sm text-muted-foreground">user@example.com</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}