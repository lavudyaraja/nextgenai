'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Plus, Mic, Copy, Search, Image, FileText, Globe, ThumbsUp, ThumbsDown } from 'lucide-react'
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

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  liked?: boolean
  disliked?: boolean
}

export default function Chat0UIInterface() {
  const searchParams = useSearchParams()
  const urlConversationId = searchParams.get('id')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt')
  const [conversationId, setConversationId] = useState<string | null>(urlConversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Load conversation messages when component mounts or conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      if (urlConversationId) {
        try {
          console.log('Loading conversation:', urlConversationId)
          const conversationMessages = await getMessagesByConversationId(urlConversationId)
          setMessages(conversationMessages)
          setConversationId(urlConversationId)
        } catch (error) {
          console.error('Failed to load conversation:', error)
          // Fallback to welcome message
          setMessages([
            {
              id: 'welcome-1',
              content: 'Hello! I\'m your AI assistant. How can I help you today?',
              role: 'assistant',
              timestamp: new Date(),
            }
          ])
        }
      } else {
        // New conversation - show welcome message
        setMessages([
          {
            id: 'welcome-1',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            role: 'assistant',
            timestamp: new Date(),
          }
        ])
      }
    }

    loadConversation()
  }, [urlConversationId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Use a small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages])

  // Auto-resize textarea with improved logic - no max height limit
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto'
      
      // Calculate new height with only minimum constraint
      const scrollHeight = textareaRef.current.scrollHeight
      const minHeight = 80 // Minimum height
      
      // No maximum height - let it grow freely
      const newHeight = Math.max(minHeight, scrollHeight)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessageContent = inputValue.trim()
    setInputValue('')

    // Reset textarea height after clearing input
    if (textareaRef.current) {
      textareaRef.current.style.height = '80px'
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: userMessageContent,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

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
        }
      }

      // Call the AI API
      console.log('Sending message to AI API for conversation:', currentConversationId)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: data.response || 'I apologize, but I could not generate a response.',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])

      // Update conversationId if it was newly created
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      // Dispatch event to update sidebar chat history
      window.dispatchEvent(new Event('chatHistoryUpdated'))

    } catch (error) {
      console.error('Error calling API:', error)
      // Handle error
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from AI assistant'}`,
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('Copied to clipboard')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked, disliked: false } : msg
    ))
  }

  const handleDislike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, disliked: !msg.disliked, liked: false } : msg
    ))
  }

  const renderMessageContent = (content: string, messageId: string, role: 'user' | 'assistant') => {
    // Check if content contains code blocks
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match
    let index = 0

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${index}`} className="text-sm whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
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
            onClick={() => copyToClipboard(codeContent)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )
      index++

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${index}`} className="text-sm whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </p>
      )
    }

    // If no code blocks, just render as plain text
    if (parts.length === 0) {
      parts.push(
        <p key="text-0" className="text-sm whitespace-pre-wrap">
          {content}
        </p>
      )
    }

    return <div>{parts}</div>
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto relative">
      {/* Messages - Scrollable Area */}
      <div className="flex-1 overflow-hidden pb-4">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 group ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl relative ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  }`}
                >
                  {renderMessageContent(message.content, message.id, message.role)}
                  
                  {/* Action buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-6 px-2 ${message.liked ? 'text-green-500' : ''}`}
                        onClick={() => handleLike(message.id)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-6 px-2 ${message.disliked ? 'text-red-500' : ''}`}
                        onClick={() => handleDislike(message.id)}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-muted">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-muted rounded-bl-md">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input - Fixed at Bottom */}
      <div 
        ref={inputContainerRef}
        className="sticky bottom-0 left-0 right-0 bg-background border-t p-4 z-10"
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[80px] resize-none py-4 pl-12 pr-32 rounded-2xl border-2 focus:border-primary/50 transition-colors leading-relaxed overflow-hidden"
              disabled={isLoading}
              rows={1}
              style={{ height: '80px' }}
            />
            
            {/* Plus Icon with Dropdown */}
            <div className="absolute left-3 bottom-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => console.log('Research selected')}>
                    <Search className="h-4 w-4 mr-2" />
                    Research
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log('Image selected')}>
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log('PDF selected')}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log('Web search selected')}>
                    <Globe className="h-4 w-4 mr-2" />
                    Web Search
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Model Selection - Hidden on mobile */}
            <div className="absolute right-12 bottom-4 hidden sm:block">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt">GPT</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="grok">Grok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Voice Icon */}
            <div className="absolute right-3 bottom-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-12 w-12 rounded-full flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI Assistant may produce inaccurate information about people, places, or facts • Using {selectedModel.toUpperCase()} model
        </p>
      </div>
    </div>
  )
}