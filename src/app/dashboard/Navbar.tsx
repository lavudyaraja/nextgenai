'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  Menu, 
  Bot, 
  Plus, 
  History, 
  Settings, 
  LogOut,
  TestTube,
  Sparkles
} from 'lucide-react'
import { UserProfile } from './UserProfile'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

// Helper component for cleaner mobile navigation links
const NavLink = ({ icon: Icon, text, onClick }: { icon: React.ElementType, text: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-3 text-base font-medium rounded-lg text-slate-300 group hover:bg-slate-800 hover:text-cyan-300 transition-all duration-200"
  >
    <Icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
    <span>{text}</span>
  </button>
);

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const createNewChat = () => {
    // This would typically involve an API call to create a new conversation
    // For now, it just navigates to the base chat interface
    router.push('/dashboard/chat-ui-interface')
    setOpen(false)
  }
  
  const navigateTo = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    navigateTo('/login')
  }

  return (
    // Glassmorphism header with a neon bottom border
    <header className="sticky top-0 z-50 w-full border-b bg-slate-900/80 border-cyan-500/20 backdrop-blur-lg">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Brand/Logo with Neon effect */}
        <a href="/dashboard" className="flex items-center gap-3 group">
          <Bot className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Assistant
          </h1>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="items-center hidden gap-4 md:flex">
          {/* <Button 
            variant="ghost" 
            onClick={createNewChat} 
            className="text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigateTo('/dashboard/conversations')}
            className="text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <History className="w-4 h-4 mr-2" />
            Chat History
          </Button> */}
          <UserProfile />
        </nav>
        
        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-slate-900/80 border-l border-cyan-500/30 text-white backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full py-6">
                <nav className="flex flex-col gap-2">
                  <NavLink icon={Plus} text="New Chat" onClick={createNewChat} />
                  <NavLink icon={History} text="Chat History" onClick={() => navigateTo('/dashboard/conversations')} />
                  <NavLink icon={TestTube} text="Test Responsive" onClick={() => navigateTo('/dashboard/test-responsive')} />
                </nav>

                <div className="mt-auto">
                  <div className="pt-6 border-t border-slate-700">
                    <NavLink icon={Settings} text="Settings" onClick={() => navigateTo('/dashboard/settings?section=profile')} />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-3 mt-2 text-base font-medium text-red-400 rounded-lg group hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-3 text-red-400/80 group-hover:text-red-400 transition-colors" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}