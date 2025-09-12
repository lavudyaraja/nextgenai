'use client'

import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  User,
  Crown,
  Bot,
  Settings as SettingsIcon,
  LogOut,
  X,
  Settings as Gear,
  Bell,
  Clock,
  Grid3X3,
  Database,
  Lock,
} from 'lucide-react'

// Import settings components
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { PersonalizationSettings } from '@/components/settings/PersonalizationSettings'
import { ConnectedAppsSettings } from '@/components/settings/ConnectedAppsSettings'
import { DataControlsSettings } from '@/components/settings/DataControlsSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { AccountSettings } from '@/components/settings/AccountSettings'

interface AccountMenuProps {
  userEmail?: string
  userName?: string
  userAvatar?: string
}

export function AccountMenu({ 
  userEmail = "user@example.com", 
  userName = "User", 
  userAvatar 
}: AccountMenuProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('general')

  const handleUpgradePlan = () => {
    console.log('Upgrade plan clicked')
    // Implement upgrade plan logic
  }

  const handleCustomizeAi = () => {
    console.log('Customize AI clicked')
    // Implement AI customization logic
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // Implement logout logic
  }

  const settingsOptions = [
    { id: 'general', label: 'General', icon: Gear },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'personalization', label: 'Personalization', icon: Clock },
    { id: 'connected-apps', label: 'Connected apps', icon: Grid3X3 },
    { id: 'data-controls', label: 'Data controls', icon: Database },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: User },
  ]

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'general':
        return <GeneralSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'personalization':
        return <PersonalizationSettings />
      case 'connected-apps':
        return <ConnectedAppsSettings />
      case 'data-controls':
        return <DataControlsSettings />
      case 'security':
        return <SecuritySettings />
      case 'account':
        return <AccountSettings />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUpgradePlan}>
            <Crown className="mr-2 h-4 w-4" />
            <span>Upgrade plan</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCustomizeAi}>
            <Bot className="mr-2 h-4 w-4" />
            <span>Customize AI</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <div className="flex h-[600px]">
            {/* Settings Sidebar */}
            <div className="w-64 border-r bg-muted/10">
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle>Settings</DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <div className="px-3 pb-3">
                <nav className="space-y-1">
                  {settingsOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <Button
                        key={option.id}
                        variant={activeSettingsTab === option.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveSettingsTab(option.id)}
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {renderSettingsContent()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}