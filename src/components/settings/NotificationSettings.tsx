'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Bell, Mail, MessageSquare, Phone } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationSettingsProps {
  onSave?: () => void
}

export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true)
  const [pushNotifications, setPushNotifications] = useState<boolean>(false)
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving notification settings:', { 
      emailNotifications, 
      pushNotifications, 
      smsNotifications 
    })
    setMessage('Notification settings updated successfully')
    onSave?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert className="border-green-500 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <ScrollArea className="h-[calc(100vh-350px)] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for comments on your posts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for product updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Promotions</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for promotions and offers
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for reminders and deadlines
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for security-related events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our monthly newsletter
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}