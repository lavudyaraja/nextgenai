'use client'

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Plus, Mic, Copy, Search, Image, FileText, Globe, ThumbsUp, ThumbsDown, Sparkles, Loader2 } from 'lucide-react'
import { ArrowRight, Zap, Shield, Layers } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from 'next/navigation'
import { getMessagesByConversationId, createNewConversation } from '@/lib/conversation-manager'
import { performanceUtils } from '@/components/PerformanceMonitor'
import { useAuth } from '@/contexts/auth-context'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  liked?: boolean
  disliked?: boolean
}

// Memoized Message Component for better performance
const MessageItem = memo(({ 
  message, 
  onLike, 
  onDislike, 
  onCopy 
}: { 
  message: Message
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onCopy: (text: string) => void
}) => {
  const handleLike = useCallback(() => onLike(message.id), [onLike, message.id])
  const handleDislike = useCallback(() => onDislike(message.id), [onDislike, message.id])
  const handleCopy = useCallback(() => onCopy(message.content), [onCopy, message.content])

  const renderMessageContent = useMemo(() => {
    // Handle empty content
    if (!message.content) {
      return <p className="text-sm whitespace-pre-wrap">...</p>
    }
    
    // Check if content contains code blocks
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match
    let index = 0

    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${index}`} className="text-sm whitespace-pre-wrap">
            {message.content.substring(lastIndex, match.index)}
          </p>
        )
        index++
      }

      // Add code block
      const language = match[1] || 'text'
      const codeContent = match[2]
      parts.push(
        <div key={`code-${index}`} className="relative my-2 group">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{codeContent}</code>
          </pre>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onCopy(codeContent)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )
      index++

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < message.content.length) {
      parts.push(
        <p key={`text-${index}`} className="text-sm whitespace-pre-wrap">
          {message.content.substring(lastIndex)}
        </p>
      )
    }

    // If no code blocks, just render as plain text
    if (parts.length === 0) {
      parts.push(
        <p key="text-0" className="text-sm whitespace-pre-wrap">
          {message.content}
        </p>
      )
    }

    return parts
  }, [message.content, onCopy])

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`} key={message.id}>
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] rounded-lg p-3 contain-layout ${
        message.role === 'user'
          ? 'bg-primary text-primary-foreground ml-auto'
          : 'bg-muted'
      }`}>
        {renderMessageContent}
        
        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 px-2 ${message.liked ? 'text-green-600' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 px-2 ${message.disliked ? 'text-red-600' : ''}`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {message.role === 'user' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

const FeatureCards = () => {
  return (
    <div className="w-full bg-black relative overflow-hidden p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-cyan-950/40"></div>
      
      {/* Moving Gradient Orbs */}
      {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div> */}
      {/* <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div> */}
      {/* <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div> */}
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-amber-400/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-bounce delay-500"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Feature Cards Grid - Square Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12">
            {/* Card 1 - Multi-AI Models */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-950/60 via-purple-900/40 to-violet-950/60 border border-purple-500/30 rounded-3xl backdrop-blur-2xl hover:border-purple-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 shadow-lg shadow-purple-900/20 bg-opacity-80 backdrop-saturate-150 aspect-square flex flex-col p-6">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.1) 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              
              {/* Floating Particles Effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-bounce"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-2xl backdrop-blur-sm border border-purple-400/30 group-hover:border-purple-300/50 transition-colors duration-300">
                    <Bot className="h-7 w-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-3 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                    Multi-AI Models
                  </h3>
                  
                  <p className="text-purple-100/70 text-sm leading-relaxed mb-4 group-hover:text-purple-100/90 transition-colors duration-300">
                    Seamlessly switch between GPT, Claude, and Gemini with intelligent model selection for optimal results.
                  </p>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Card 2 - Web Integration */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-cyan-950/60 via-blue-900/40 to-indigo-950/60 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl hover:border-cyan-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30 shadow-lg shadow-cyan-900/20 aspect-square flex flex-col p-6">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-2xl backdrop-blur-sm border border-cyan-400/30 group-hover:border-cyan-300/50 transition-colors duration-300">
                    <Globe className="h-7 w-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                  </div>
                  <Zap className="h-4 w-4 text-cyan-400/60 group-hover:text-cyan-300 group-hover:rotate-12 transition-all duration-300" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-3 group-hover:from-cyan-200 group-hover:to-blue-200 transition-all duration-300">
                    Web Integration
                  </h3>
                  
                  <p className="text-cyan-100/70 text-sm leading-relaxed mb-4 group-hover:text-cyan-100/90 transition-colors duration-300">
                    Real-time web research and content analysis with intelligent data extraction and summarization.
                  </p>
                </div>
                
              </div>
            </div>

            {/* Card 3 - Smart Features */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-950/60 via-orange-900/40 to-yellow-950/60 border border-amber-500/30 rounded-3xl backdrop-blur-2xl hover:border-amber-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/30 shadow-lg shadow-amber-900/20 aspect-square flex flex-col p-6">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-3 rounded-2xl backdrop-blur-sm border border-amber-400/30 group-hover:border-amber-300/50 transition-colors duration-300">
                    <Sparkles className="h-7 w-7 text-amber-400 group-hover:text-amber-300 transition-colors duration-300 group-hover:rotate-12" />
                  </div>
                  <Shield className="h-4 w-4 text-amber-400/60 group-hover:text-amber-300 transition-colors duration-300" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-3 group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300">
                    Smart Features
                  </h3>
                  
                  <p className="text-amber-100/70 text-sm leading-relaxed mb-4 group-hover:text-amber-100/90 transition-colors duration-300">
                    Advanced AI tools including code generation, document analysis, and intelligent automation workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// export default FeatureCards;
export default function ChatUIInterface() {
  const searchParams = useSearchParams()
  const urlConversationId = searchParams.get('id')
  const { user } = useAuth() // Get the current user from auth context
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [conversationId, setConversationId] = useState<string | null>(urlConversationId)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null) // Add error state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Optimized scroll function with throttling
  const scrollToBottom = useCallback(
    performanceUtils.throttle(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100),
    []
  )

  // Optimized input resize with debouncing
  const resizeTextarea = useCallback(
    performanceUtils.debounce(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        const scrollHeight = textareaRef.current.scrollHeight
        const minHeight = 80
        const newHeight = Math.max(minHeight, scrollHeight)
        textareaRef.current.style.height = `${newHeight}px`
      }
    }, 50),
    []
  )

  // Memoized handlers
  const handleLike = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked, disliked: false } : msg
    ))
  }, [])

  const handleDislike = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, disliked: !msg.disliked, liked: false } : msg
    ))
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('Copied to clipboard')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }, [])

  // Load conversation messages when component mounts or conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      // Always reset messages when URL changes
      setMessages([])
      setInitialLoadComplete(false)
      setError(null)
      
      // Check if user is authenticated
      if (!user?.id) {
        setError('You must be logged in to view conversations')
        setInitialLoadComplete(true)
        return
      }
      
      if (urlConversationId) {
        try {
          console.log('Loading conversation:', urlConversationId)
          const conversationMessages = await getMessagesByConversationId(urlConversationId)
          setMessages(conversationMessages)
          setConversationId(urlConversationId)
          setInitialLoadComplete(true)
        } catch (error) {
          console.error('Failed to load conversation:', error)
          setError('Failed to load conversation')
          setMessages([])
          setConversationId(urlConversationId)
          setInitialLoadComplete(true)
        }
      } else {
        // No conversation ID in URL, clear messages
        setMessages([])
        setConversationId(null)
        setInitialLoadComplete(true)
      }
    }

    loadConversation()
  }, [urlConversationId, user?.id]) // Depend on urlConversationId and user.id

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(scrollTimeout)
  }, [messages, isLoading, scrollToBottom])

  // Auto-resize textarea when input changes
  useEffect(() => {
    resizeTextarea()
  }, [inputValue, resizeTextarea])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    // Check if user is authenticated
    if (!user?.id) {
      setError('You must be logged in to send messages')
      return
    }

    const userMessageContent = inputValue.trim()
    setInputValue('')

    // Reset textarea height after clearing input
    if (textareaRef.current) {
      textareaRef.current.style.height = '80px'
    }

    // Create user message object with a unique ID
    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const userMessage: Message = {
      id: userMessageId,
      content: userMessageContent,
      role: 'user',
      timestamp: new Date(),
    }

    // Add user message immediately to UI
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // If this is a new conversation, create it first
      let currentConversationId = conversationId
      if (!currentConversationId) {
        console.log('Creating new conversation...')
        const newConversation = await createNewConversation()
        currentConversationId = newConversation.id
        setConversationId(currentConversationId)
        console.log('New conversation created:', currentConversationId)
        
        // Update URL with new conversation ID
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('id', currentConversationId)
          window.history.replaceState({}, '', url.toString())
          
          // Dispatch event to update sidebar chat history
          setTimeout(() => {
            window.dispatchEvent(new Event('chatHistoryUpdated'))
          }, 100)
        }
      }

      // Call the AI API
      console.log('Sending message to AI API for conversation:', currentConversationId)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id // Pass user ID in header
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessageContent }],
          conversationId: currentConversationId,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received response from AI API:', data)

      // Update conversationId if it was newly created
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      // Add AI response to messages
      const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const aiMessage: Message = {
        id: aiMessageId,
        content: data.response || 'I apologize, but I could not generate a response.',
        role: 'assistant',
        timestamp: new Date(),
      }

      // Add AI message to the messages array
      setMessages(prev => [...prev, aiMessage])

      // Dispatch event to update sidebar chat history
      setTimeout(() => {
        window.dispatchEvent(new Event('chatHistoryUpdated'))
      }, 100)
    } catch (error) {
      console.error('Error calling API:', error)
      setError(error instanceof Error ? error.message : 'Failed to get response from AI assistant')
      // Handle error - add error message
      const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const errorMessage: Message = {
        id: errorId,
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from AI assistant'}`,
        role: 'assistant',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Dispatch event to update sidebar chat history even in case of errors
      setTimeout(() => {
        window.dispatchEvent(new Event('chatHistoryUpdated'))
      }, 100)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-4">
            {messages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                onLike={handleLike}
                onDislike={handleDislike}
                onCopy={copyToClipboard}
              />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-muted">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-muted rounded-bl-md flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">AI is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="border-t">
        <div className="flex items-center gap-2 p-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt">GPT</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
