'use client'

import { useState } from 'react'
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
  TestTube
} from 'lucide-react'
import { UserProfile } from './UserProfile' // Import UserProfile for mobile menu
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleNewChat = () => {
    // Create a new conversation and navigate to it
    // const newConversation = createNewConversation()
    // router.push(`/dashboard/chat-ui-interface?id=${newConversation.id}`)
    setOpen(false)
  }

  const handleHistory = () => {
    // Navigate to chat history
    router.push('/dashboard/conversations')
    setOpen(false)
  }

const handleSettings = () => {
  // default profile section open avvali ante ?section=profile add cheyali
  router.push("/dashboard/settings?section=profile")
  setOpen(false)
}

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    setOpen(false)
  }

  const handleTestResponsive = () => {
    router.push('/dashboard/test-responsive')
    setOpen(false)
  }

  return (
    <header className="border-b p-4 sticky top-0 z-50 mobile-navbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI Assistant
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  {/* User Profile in mobile menu */}
                  <div className="pb-4 border-b">
                    <UserProfile />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={handleNewChat}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={handleHistory}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Chat History
                  </Button>
                  
                  {/* Test Responsive Button - Only shown in mobile menu */}
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={handleTestResponsive}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Responsive
                  </Button>
                  
                  <div className="border-t pt-4 mt-4">
                    <Button 
                      variant="outline" 
                      className="justify-start w-full mb-2" 
                      onClick={handleSettings}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start w-full" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}