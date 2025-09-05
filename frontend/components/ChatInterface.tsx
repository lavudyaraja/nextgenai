'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Send, Bot, User, Image, Search } from 'lucide-react'

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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'search'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-2">
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
        </CardHeader>
        
        <Separator />
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-200px)] p-4">
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
          </ScrollArea>
        </CardContent>
        
        <Separator />
        
        <CardContent className="p-4">
          <div className="flex gap-2">
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
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {activeTab === 'chat' && <Send className="w-4 h-4" />}
              {activeTab === 'image' && <Image className="w-4 h-4" />}
              {activeTab === 'search' && <Search className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}