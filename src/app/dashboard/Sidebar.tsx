"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, History, Settings, User, ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createNewConversation } from "@/lib/conversation-manager"
import { UserProfile } from "./UserProfile" // Import UserProfile component
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
  // { label: "Profile", href: "/dashboard/profile", icon: User },
  // { label: "Settings", href: "/dashboard/settings", icon: Settings },
  // AI Features removed as requested
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const handleNewChat = async () => {
    try {
      console.log('Creating new conversation...')
      const newConversation = await createNewConversation()
      console.log('New conversation created:', newConversation)
      router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
      // Refresh the chat history in the sidebar
      window.dispatchEvent(new Event('chatHistoryUpdated'))
    } catch (error) {
      console.error('Failed to create new chat:', error)
      // Fallback navigation
      router.push('/dashboard/chat-ui-interface')
    }
  }

  return (
    <aside
      className={`hidden md:flex flex-col bg-gray-900 text-gray-100 h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <AILogo className="mr-2" size={collapsed ? 24 : 32} />
          {!collapsed && <span className="font-bold text-lg">ChatAI</span>}
        </div>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <Button
          className="w-full justify-start"
          variant="secondary"
          onClick={handleNewChat}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          {!collapsed && "New Chat"}
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Chat History Section - Always render but hide when collapsed */}
      <div className={`px-2 pb-4 flex-1 overflow-hidden ${collapsed ? 'hidden' : ''}`}>
        <SidebarChatHistory />
      </div>

      {/* Footer with UserProfile */}
      <div className={`p-4 border-t border-gray-700 ${collapsed ? 'flex justify-center' : ''}`}>
        <UserProfile />
      </div>
    </aside>
  )
}