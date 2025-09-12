'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Shield, Key, Lock, Smartphone } from 'lucide-react'

interface SecuritySettingsProps {
  onSave?: () => void
}

export function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false)
  const [loginAlerts, setLoginAlerts] = useState<boolean>(true)
  const [secureSession, setSecureSession] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving security settings:', { twoFactorAuth, loginAlerts, secureSession })
    setMessage('Security settings updated successfully')
    onSave?.()
  }

  const handleEnable2FA = () => {
    // In a real app, this would open a 2FA setup flow
    console.log('Enabling 2FA')
  }

  const handleManageDevices = () => {
    // In a real app, this would show device management
    console.log('Managing devices')
  }

  const handleChangePassword = () => {
    // In a real app, this would open password change flow
    console.log('Changing password')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className="border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Two-factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorAuth && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Enabled
                    </span>
                  )}
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
              </div>
              
              {!twoFactorAuth && (
                <div className="flex justify-end">
                  <Button onClick={handleEnable2FA} variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Session Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Secure Session</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after periods of inactivity
                    </p>
                  </div>
                </div>
                <Switch
                  checked={secureSession}
                  onCheckedChange={setSecureSession}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when someone logs into your account
                    </p>
                  </div>
                </div>
                <Switch
                  checked={loginAlerts}
                  onCheckedChange={setLoginAlerts}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleChangePassword} variant="outline" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
              <Button onClick={handleManageDevices} variant="outline" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Manage Devices
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}