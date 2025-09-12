'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings, HelpCircle, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

export function UserProfile() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleSettings = () => {
    router.push('/preferences')
  }

  // Handle Help section navigation - open in new tab
  const openHelpLink = (path: string) => {
    // Use router.push for client-side navigation within the same app
    router.push(path);
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ''} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium text-sm">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Help Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => openHelpLink('/userprofile/help/documents')}>
              Documents
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openHelpLink('/userprofile/help/keyboard-shortcuts')}>
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openHelpLink('/userprofile/help/privacy')}>
              Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openHelpLink('/userprofile/help/release-notes')}>
              Release Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openHelpLink('/userprofile/help/terms-policies')}>
              Terms & Policies
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}