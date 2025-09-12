'use client'

import { 
  Settings, 
  Bell, 
  Wand2, 
  Grid3X3, 
  Database, 
  Lock, 
  User 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface SettingsMenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface SettingsMenuProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const SettingsMenu = ({ activeTab, onTabChange }: SettingsMenuProps) => {
  const menuItems: SettingsMenuItem[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'personalization', label: 'Personalization', icon: Wand2 },
    { id: 'connected-apps', label: 'Connected apps', icon: Grid3X3 },
    { id: 'data-controls', label: 'Data controls', icon: Database },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: User },
  ]

  return (
    <div className="bg-card rounded-lg border shadow-sm p-2 max-w-md">
      <ScrollArea className="h-full max-h-[calc(100vh-200px)]">
        <nav className="space-y-1 pr-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}