'use client'

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Plus, Mic, Copy, Search, Image, FileText, Globe, ThumbsUp, ThumbsDown, Sparkles, Loader2 } from 'lucide-react'
import { ArrowRight, Zap, Shield } from 'lucide-react'

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
    <div className={`flex gap-3 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[85%] rounded-lg p-4 ${
        message.role === 'user'
          ? 'bg-primary text-primary-foreground'
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
    <div className="w-full max-w-5xl mx-auto px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Powerful AI Features
        </h2>
        <p className="text-muted-foreground">
          Experience next-generation AI capabilities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 - Multi-AI Models */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/10 p-3 rounded-xl">
              <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
            Multi-AI Models
          </h3>
          
          <p className="text-sm text-purple-700/80 dark:text-purple-300/80 leading-relaxed">
            Seamlessly switch between GPT, Claude, and Gemini with intelligent model selection for optimal results.
          </p>
        </div>

        {/* Card 2 - Web Integration */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-cyan-500/10 p-3 rounded-xl">
              <Globe className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <Zap className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-cyan-900 dark:text-cyan-100">
            Web Integration
          </h3>
          
          <p className="text-sm text-cyan-700/80 dark:text-cyan-300/80 leading-relaxed">
            Real-time web research and content analysis with intelligent data extraction and summarization.
          </p>
        </div>

        {/* Card 3 - Smart Features */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <Shield className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-amber-900 dark:text-amber-100">
            Smart Features
          </h3>
          
          <p className="text-sm text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
            Advanced AI tools including code generation, document analysis, and intelligent automation workflows.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ChatUIInterface() {
  const searchParams = useSearchParams()
  const urlConversationId = searchParams.get('id')
  const { user } = useAuth()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [conversationId, setConversationId] = useState<string | null>(urlConversationId)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(
    performanceUtils.throttle(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100),
    []
  )

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
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }, [])

  useEffect(() => {
    const loadConversation = async () => {
      setMessages([])
      setInitialLoadComplete(false)
      setError(null)
      
      if (!user?.id) {
        setError('You must be logged in to view conversations')
        setInitialLoadComplete(true)
        return
      }
      
      if (urlConversationId) {
        try {
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
        setMessages([])
        setConversationId(null)
        setInitialLoadComplete(true)
      }
    }

    loadConversation()
  }, [urlConversationId, user?.id])

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(scrollTimeout)
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    resizeTextarea()
  }, [inputValue, resizeTextarea])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    if (!user?.id) {
      setError('You must be logged in to send messages')
      return
    }

    const userMessageContent = inputValue.trim()
    setInputValue('')

    if (textareaRef.current) {
      textareaRef.current.style.height = '80px'
    }

    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const userMessage: Message = {
      id: userMessageId,
      content: userMessageContent,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      let currentConversationId = conversationId
      if (!currentConversationId) {
        const newConversation = await createNewConversation()
        currentConversationId = newConversation.id
        setConversationId(currentConversationId)
        
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('id', currentConversationId)
          window.history.replaceState({}, '', url.toString())
          
          setTimeout(() => {
            window.dispatchEvent(new Event('chatHistoryUpdated'))
          }, 100)
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
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

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const aiMessage: Message = {
        id: aiMessageId,
        content: data.response || 'I apologize, but I could not generate a response.',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('chatHistoryUpdated'))
      }
    } catch (error) {
      console.error('Error calling API:', error)
      setError(error instanceof Error ? error.message : 'Failed to get response from AI assistant')
      
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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('chatHistoryUpdated'))
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          {/* Show feature cards when no messages */}
          {messages.length === 0 && !isLoading && initialLoadComplete && (
            <div className="flex items-center justify-center min-h-full py-12">
              <FeatureCards />
            </div>
          )}
          
          {/* Center the messages container to match textarea width */}
          {(messages.length > 0 || isLoading) && (
            <div className="flex justify-center p-4">
              <div className="w-full max-w-3xl space-y-4">
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
                  <div className="flex items-start gap-3 w-full">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-muted">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="px-4 py-3 rounded-2xl bg-muted flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">AI is thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      
      <div className="border-t bg-background">
        <div className="flex justify-center p-4">
          <div className="relative flex items-center w-full max-w-3xl">
            {/* Plus Icon with Dropdown Menu */}
            <div className="absolute left-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>
                    <Image className="h-4 w-4 mr-2" />
                    <span>Upload Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Search className="h-4 w-4 mr-2" />
                    <span>Web Research</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Upload PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Resources</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Textarea with padding to accommodate icons */}
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Type a message..."
              className="min-h-[80px] pl-12 pr-44 py-3 resize-none w-full"
              disabled={isLoading}
            />
            
            {/* Right side icons container */}
            <div className="absolute right-2 z-10 flex items-center gap-2">
              
                    
              {/* Voice Icon */}
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Mic className="h-4 w-4" />
              </Button>
              
              
              {/* Model Selection */}
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-24 h-9 text-xs">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt">GPT</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
        
              
              {/* Send Button */}
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-9 w-9 rounded-full"
                onClick={handleSubmit}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}