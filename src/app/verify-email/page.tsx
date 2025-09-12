'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check for token in URL params
    const token = searchParams.get('token')
    
    if (token) {
      verifyEmail(token)
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    setStatus('verifying')
    setMessage('Verifying your email...')

    try {
      // In a real application, you would call your verification API
      console.log('Verifying email with token:', token)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('success')
      setMessage('Your email has been verified successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to verify email. The link may be invalid or expired.')
    }
  }

  const handleResend = async () => {
    setStatus('verifying')
    setMessage('Sending verification email...')

    try {
      // In a real application, you would call your resend API
      console.log('Resending verification email')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('success')
      setMessage('Verification email has been resent to your inbox.')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to resend verification email.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Please verify your email address to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <div className="text-center">
              <p className="text-muted-foreground">
                Check your email for a verification link. If you haven't received it, you can request a new one.
              </p>
            </div>
          )}
          
          {status === 'verifying' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-green-600">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="text-red-600">{message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {status !== 'success' && (
            <Button 
              onClick={handleResend}
              disabled={status === 'verifying'}
              className="w-full"
            >
              {status === 'verifying' ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}