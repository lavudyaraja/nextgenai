"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, History, Settings, User, ChevronLeft, ChevronRight, MessageSquarePlus, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { createNewConversation } from "@/lib/conversation-manager"
import { UserProfile } from "./UserProfile"
import { SidebarChatHistory } from "@/components/chat"
import AILogo from "@/components/ai-logo"

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
}

const items: SidebarItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chat History", href: "/dashboard/conversations", icon: History },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Persist collapsed state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setCollapsed(JSON.parse(savedState))
    }
  }, [])

  const toggleCollapse = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
  }

  const handleNewChat = async () => {
    // Prevent multiple clicks
    if (isCreatingChat) return
    
    setIsCreatingChat(true)
    
    try {
      console.log('Creating new conversation...')
      const newConversation = await createNewConversation()
      console.log('New conversation created:', newConversation)
      
      // Navigate to new chat
      if (newConversation?.id) {
        router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
      } else {
        throw new Error('No conversation ID returned')
      }
    } catch (error) {
      console.error('Failed to create new chat:', error)
      
      // Fallback: navigate to chat interface without ID
      router.push('/dashboard/chat-ui-interface')
      
      // Show error notification if available
      if (typeof window !== 'undefined' && 'toast' in window) {
        (window as any).toast?.error?.('Failed to create new chat. Please try again.')
      }
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsCreatingChat(false), 500)
    }
  }

  // Check if current path matches menu item
  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside
      className={`hidden md:flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 h-screen transition-all duration-300 border-r border-slate-700/50 backdrop-blur-xl relative ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-slate-700/60 backdrop-blur-sm">
        <div 
          className="flex items-center cursor-pointer group transition-all duration-200 hover:scale-105"
          onClick={toggleCollapse}
          role="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="relative">
            <AILogo className="mr-3 drop-shadow-lg" size={collapsed ? 28 : 36} />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ChatAI
            </span>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        {!collapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-slate-200"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="relative z-10 p-4">
        <Button
          className={`w-full justify-start relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            collapsed ? 'px-3' : ''
          }`}
          onClick={handleNewChat}
          disabled={isCreatingChat}
          aria-label="Create new chat"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {isCreatingChat ? (
            <Loader2 className={`h-4 w-4 relative z-10 animate-spin ${!collapsed ? 'mr-3' : ''}`} />
          ) : (
            <MessageSquarePlus className={`h-4 w-4 relative z-10 ${!collapsed ? 'mr-3' : ''} group-hover:rotate-12 transition-transform duration-300`} />
          )}
          
          {!collapsed && (
            <span className="relative z-10 font-medium">
              {isCreatingChat ? 'Creating...' : 'New Chat'}
            </span>
          )}
          
          {/* Sparkle effect */}
          {!isCreatingChat && (
            <Sparkles className="absolute right-2 top-2 h-3 w-3 text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 flex-1 mt-2 px-2">
        {items.map((item) => {
          const isActive = isActiveRoute(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all duration-200 group relative overflow-hidden border ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive 
                  ? 'bg-slate-700/70 border-slate-600/70 shadow-lg' 
                  : 'border-transparent hover:bg-slate-700/50 hover:border-slate-600/50 hover:shadow-lg'
              }`}
            >
              {/* Subtle hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
                isActive ? 'opacity-100' : ''
              }`}></div>
              
              <item.icon 
                size={20} 
                className={`transition-all duration-200 relative z-10 ${
                  isActive 
                    ? 'text-blue-400 scale-110' 
                    : 'text-slate-400 group-hover:text-blue-400 group-hover:scale-110'
                }`}
              />
              
              {!collapsed && (
                <span className={`transition-colors duration-200 relative z-10 font-medium ${
                  isActive 
                    ? 'text-slate-100' 
                    : 'text-slate-300 group-hover:text-slate-100'
                }`}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </Link>
          )
        })}
      </nav>

      {/* Chat History Section */}
      <div className={`relative z-10 px-3 pb-4 flex-1 overflow-hidden ${collapsed ? 'hidden' : ''}`}>
        <div className="relative">
          {/* Section Header */}
          {/* <div className="mb-3 px-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Chats</h3>
            <div className="mt-1 h-px bg-gradient-to-r from-slate-600 via-slate-500 to-transparent"></div>
          </div> */}
          
          {/* Chat History Container with Custom Scrollbar */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500">
            <SidebarChatHistory />
          </div>
        </div>
      </div>

      {/* Expand Button (when collapsed) */}
      {collapsed && (
        <div className="relative z-10 px-2 py-2">
          <button
            onClick={toggleCollapse}
            className="w-full p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-slate-200 flex items-center justify-center"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}


      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-20 left-4 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-6 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-6 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </aside>
  )
}