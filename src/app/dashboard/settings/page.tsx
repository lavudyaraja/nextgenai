'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SettingsMenu } from '@/components/settings'
import {
  GeneralSettings,
  AccountSettings,
  PersonalizationSettings,
  SecuritySettings,
  NotificationSettings,
  DataControlsSettings,
  ConnectedAppsSettings
} from '@/components/settings'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('general')

  const handleClose = () => {
    router.back()
  }

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />
      case 'account':
        return <AccountSettings />
      case 'personalization':
        return <PersonalizationSettings />
      case 'security':
        return <SecuritySettings />
      case 'notifications':
        return <NotificationSettings />
      case 'data-controls':
        return <DataControlsSettings />
      case 'connected-apps':
        return <ConnectedAppsSettings />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={handleClose}
          >
            <span className="text-lg font-bold">×</span>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Menu */}
          <div className="lg:w-1/4">
            <SettingsMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Settings Content */}
          <div className="lg:w-3/4">
            <div className="bg-card rounded-lg border shadow-sm">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}