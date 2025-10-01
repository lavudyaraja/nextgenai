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
  DropdownMenuSubTrigger,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu'
import { 
  LogOut, 
  User, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink,
  FileText,
  Keyboard,
  GitMerge,
  Shield,
  FileBadge
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserProfile() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary transition-colors">
            <AvatarImage src={user.avatar || ''} alt={user.name || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
            {/* <ChevronRight className="ml-auto h-4 w-4" /> */}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuItem onClick={() => router.push('/userprofile/help/documents')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Documents</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/userprofile/help/keyboard-shortcuts')}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/userprofile/help/release-notes')}>
              <GitMerge className="mr-2 h-4 w-4" />
              <span>Release Notes</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* External links open in a new tab */}
            <DropdownMenuItem onClick={() => openInNewTab('/userprofile/help/privacy')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Privacy Policy</span>
              <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openInNewTab('/userprofile/help/terms-policies')}>
              <FileBadge className="mr-2 h-4 w-4" />
              <span>Terms & Policies</span>
              <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}