'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GeneralSettingsProps {
  onSave?: () => void
}

export function GeneralSettings({ onSave }: GeneralSettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [language, setLanguage] = useState<string>('en')
  const [autoSave, setAutoSave] = useState<boolean>(true)
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true)

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving general settings:', { theme, language, autoSave, autoUpdate })
    onSave?.()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your general preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme
                </p>
              </div>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred language
                </p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Behavior</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your work
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-update</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update the application
                </p>
              </div>
              <Switch
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}