'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Github, Mail, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts'

export default function SignupPage() {
  const router = useRouter()
  const { signup, socialLogin } = useAuth()
  
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Validation state
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  // Validation helpers
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }
  }

  const passwordValidation = validatePassword(password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  // Field validation errors
  const getFieldError = (field: string) => {
    if (!touched[field as keyof typeof touched]) return ''
    
    switch (field) {
      case 'name':
        return name.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !validateEmail(email) ? 'Please enter a valid email address' : ''
      case 'password':
        return password.length > 0 && password.length < 6 ? 'Password must be at least 6 characters' : ''
      case 'confirmPassword':
        return confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''
      default:
        return ''
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    })
    
    // Validation checks
    if (name.trim().length < 2) {
      setError('Please enter your full name')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await signup(name.trim(), email.trim().toLowerCase(), password)
      
      if (result.success) {
        setMessage('Account created successfully! Redirecting to login...')
        
        // Clear form
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false
        })
        
        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(result.message || 'Failed to create account. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      setError('')

      // In production, this would redirect to OAuth provider
      const result = await socialLogin(provider, `mock-${provider}-token`)
      
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.message || `${provider} signup failed. Please try again.`)
      }
    } catch (err) {
      console.error(`${provider} signup error:`, err)
      setError(`${provider} signup failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert className="mb-4 border-green-500 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                disabled={isLoading}
                required
                className={getFieldError('name') ? 'border-destructive' : ''}
              />
              {getFieldError('name') && (
                <p className="text-xs text-destructive">{getFieldError('name')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
                required
                className={getFieldError('email') ? 'border-destructive' : ''}
              />
              {getFieldError('email') && (
                <p className="text-xs text-destructive">{getFieldError('email')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={isLoading}
                  required
                  minLength={6}
                  className={getFieldError('password') ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {password.length > 0 && (
                <div className="space-y-1 text-xs">
                  <p className={passwordValidation.length ? 'text-green-600' : 'text-muted-foreground'}>
                    ✓ At least 6 characters
                  </p>
                  <p className={passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}>
                    ✓ One uppercase letter
                  </p>
                  <p className={passwordValidation.hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}>
                    ✓ One lowercase letter
                  </p>
                  <p className={passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                    ✓ One number
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  disabled={isLoading}
                  required
                  className={getFieldError('confirmPassword') ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="text-xs text-destructive">{getFieldError('confirmPassword')}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}