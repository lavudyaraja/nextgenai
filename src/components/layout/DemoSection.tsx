'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User, Copy, Check, Zap, Stars, MessageCircle, Mic } from 'lucide-react'

export default function DemoSection() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today? Feel free to ask me anything!',
      timestamp: new Date()
    }
  ])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const responses = [
        'That\'s a great question! Let me break this down for you with a comprehensive explanation that covers the key aspects...',
        'I\'d be happy to help you with that! Here\'s what I think based on current knowledge and best practices...',
        'Excellent inquiry! This is actually a fascinating topic that involves several important considerations...',
        'Thanks for asking! This is something I can definitely help you understand better. Let me explain...'
      ]
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const suggestions = [
    { text: 'Explain machine learning basics', icon: '🤖', color: 'from-blue-500 to-cyan-500' },
    { text: 'Write a creative story', icon: '📝', color: 'from-purple-500 to-pink-500' },
    { text: 'Help me plan my day', icon: '📅', color: 'from-green-500 to-emerald-500' },
    { text: 'Code a simple calculator', icon: '💻', color: 'from-orange-500 to-red-500' }
  ]

  return (
    // Changed min-h-screen to min-h-[calc(100vh-4rem)] to prevent scroll jumping
    <section className="relative min-h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-8 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Stars className="h-4 w-4 text-yellow-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700 tracking-wide">LIVE AI DEMO</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 leading-tight tracking-tight">
            Meet Your AI
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the future of AI conversation. Ask questions, get insights, and discover what's possible when technology understands you.
          </p>
          
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Always Available</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Instant Responses</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by GPT</span>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
                    <p className="text-sm text-gray-600">Ready to help • Powered by advanced AI</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[500px] overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-gray-50/50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`max-w-[85%] group ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Enhanced Avatar */}
                      <div className={`relative flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-6 w-6 text-white" />
                          ) : (
                            <Bot className="h-6 w-6 text-white" />
                          )}
                        </div>
                        {message.role === 'assistant' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      {/* Enhanced Message Bubble */}
                      <div className={`relative group ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-full rounded-3xl px-6 py-4 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900 shadow-md'
                        }`}>
                          <div className={`font-semibold text-xs mb-2 opacity-80 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </div>
                          <div className="text-sm leading-relaxed font-medium">{message.content}</div>
                          <div className={`text-xs mt-2 opacity-60 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        
                        {/* Enhanced Copy Button */}
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className={`absolute top-2 ${message.role === 'user' ? 'left-2' : 'right-2'} w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm border border-gray-200`}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Enhanced Loading Animation */}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
                          <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                          <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {isTyping ? 'Thinking...' : 'Processing your request...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Section */}
            <div className="p-8 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative group">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                      placeholder="Type your message here... Ask me anything about AI, technology, or any topic you're curious about!"
                      className="w-full h-20 bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium shadow-sm"
                      disabled={isLoading}
                      rows={3}
                    />
                    <div className="absolute bottom-3 left-6 flex items-center gap-2 opacity-50">
                      <Mic className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Press Enter to send</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group relative overflow-hidden shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="animate-spin relative z-10">
                        <Zap className="h-6 w-6" />
                      </div>
                    ) : (
                      <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    )}
                  </button>
                </div>

                {/* Enhanced Quick Suggestions */}
                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-500 font-medium">Quick suggestions to get started:</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion.text)}
                        className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-300 group shadow-sm"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">{suggestion.icon}</span>
                        <span className="font-medium">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          {[
            { 
              icon: MessageCircle, 
              title: 'Natural Conversations', 
              desc: 'Chat with AI that understands context and nuance like a human expert',
              gradient: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: Zap, 
              title: 'Lightning Fast', 
              desc: 'Get instant, intelligent responses powered by cutting-edge AI technology',
              gradient: 'from-purple-500 to-pink-500'
            },
            { 
              icon: Stars, 
              title: 'Always Improving', 
              desc: 'Built on advanced models that continuously learn and evolve',
              gradient: 'from-cyan-500 to-purple-500'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white border border-gray-200 rounded-3xl p-8 text-center hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:scale-105 shadow-lg"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(156, 163, 175, 0.8), rgba(156, 163, 175, 0.6));
          border-radius: 4px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(107, 114, 128, 0.8), rgba(107, 114, 128, 0.6));
        }
      `}</style>
    </section>
  )
}