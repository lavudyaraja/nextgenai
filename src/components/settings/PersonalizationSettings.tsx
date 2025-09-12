'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PersonalizationSettingsProps {
  onSave?: () => void
}

export function PersonalizationSettings({ onSave }: PersonalizationSettingsProps) {
  const [fontSize, setFontSize] = useState<string>('16')
  const [animation, setAnimation] = useState<boolean>(true)
  const [compactMode, setCompactMode] = useState<boolean>(false)
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left')

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving personalization settings:', { 
      fontSize, 
      animation, 
      compactMode, 
      sidebarPosition 
    })
    onSave?.()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Display</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Font Size</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the font size for better readability
                </p>
              </div>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Small (12px)</SelectItem>
                  <SelectItem value="14">Medium (14px)</SelectItem>
                  <SelectItem value="16">Large (16px)</SelectItem>
                  <SelectItem value="18">X-Large (18px)</SelectItem>
                  <SelectItem value="20">XX-Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable UI animations
                </p>
              </div>
              <Switch
                checked={animation}
                onCheckedChange={setAnimation}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing and element sizes
                </p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Layout</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sidebar Position</Label>
                <p className="text-sm text-muted-foreground">
                  Choose where to position the sidebar
                </p>
              </div>
              <Select value={sidebarPosition} onValueChange={(value: 'left' | 'right') => setSidebarPosition(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}