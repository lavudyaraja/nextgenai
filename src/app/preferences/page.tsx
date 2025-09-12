'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface Preferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    searchVisibility: boolean
  }
}

export default function PreferencesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      searchVisibility: true
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchPreferences()
  }, [user, router])

  const fetchPreferences = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // In a real app, this would call your preferences API
      console.log('Fetching preferences')
      
      // Mock preferences
      const mockPreferences: Preferences = {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        privacy: {
          profileVisibility: 'public',
          searchVisibility: true
        }
      }
      
      setPreferences(mockPreferences)
    } catch (err) {
      setError('Failed to fetch preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      setIsSaving(true)
      setError('')
      setMessage('')
      
      // In a real app, this would call your preferences API
      console.log('Saving preferences:', preferences)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Preferences saved successfully')
    } catch (err) {
      setError('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({
      ...prev,
      theme: value
    }))
  }

  const handleLanguageChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      language: value
    }))
  }

  const handleNotificationChange = (type: keyof Preferences['notifications'], checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }))
  }

  const handlePrivacyChange = (field: keyof Preferences['privacy'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }))
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not logged in</h2>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Preferences</CardTitle>
          <CardDescription className="text-center">
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert className="border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred theme
                      </p>
                    </div>
                    <Select value={preferences.theme} onValueChange={handleThemeChange}>
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
                    <Select value={preferences.language} onValueChange={handleLanguageChange}>
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
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Who can see your profile
                      </p>
                    </div>
                    <Select 
                      value={preferences.privacy.profileVisibility} 
                      onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Search Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your profile to appear in search results
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.searchVisibility}
                      onCheckedChange={(checked) => handlePrivacyChange('searchVisibility', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={savePreferences}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}