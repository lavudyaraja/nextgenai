'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function TwoFactorAuthPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'disabled' | 'setup' | 'verify' | 'enabled'>('disabled')
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleEnable2FA = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // In a real app, this would call your 2FA API
      console.log('Enabling 2FA')
      
      // Mock response
      const mockSecret = 'JBSWY3DPEHPK3PXP'
      const mockQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:${user?.email}?secret=${mockSecret}&issuer=Example`
      
      setSecret(mockSecret)
      setQrCodeUrl(mockQrCodeUrl)
      setStep('setup')
    } catch (err) {
      setError('Failed to enable 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // In a real app, this would call your 2FA API
      console.log('Verifying 2FA code:', code)
      
      // Mock verification
      if (code === '123456') {
        setStep('enabled')
        setMessage('Two-factor authentication has been enabled successfully!')
      } else {
        setError('Invalid code. Please try again.')
      }
    } catch (err) {
      setError('Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // In a real app, this would call your 2FA API
      console.log('Disabling 2FA')
      
      setStep('disabled')
      setMessage('Two-factor authentication has been disabled.')
    } catch (err) {
      setError('Failed to disable 2FA')
    } finally {
      setIsLoading(false)
    }
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Add an extra layer of security to your account
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
          
          {step === 'disabled' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Two-factor authentication adds an extra layer of security to your account by requiring 
                more than just a password to sign in.
              </p>
              <Button 
                onClick={handleEnable2FA}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Enabling...' : 'Enable 2FA'}
              </Button>
            </div>
          )}
          
          {step === 'setup' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Scan this QR code with your authenticator app:
                </p>
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="2FA QR Code" 
                    className="mx-auto border rounded-lg p-2"
                  />
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Or enter this code manually: <strong>{secret}</strong>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Enter 6-digit code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                />
              </div>
              
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          )}
          
          {step === 'enabled' && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">2FA Enabled</h3>
                <p className="text-muted-foreground">
                  Two-factor authentication is now active on your account.
                </p>
              </div>
              
              <Button 
                variant="destructive"
                onClick={handleDisable2FA}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Disabling...' : 'Disable 2FA'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}