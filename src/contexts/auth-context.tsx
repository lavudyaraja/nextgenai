'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  socialLogin: (provider: string, token: string) => Promise<{ success: boolean; message?: string }>
  refreshToken: () => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in by checking localStorage
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Validate that the parsed user has the required fields
          if (parsedUser.id && parsedUser.email) {
            // Check if user data has expired
            if (parsedUser.expiresAt && Date.now() > parsedUser.expiresAt) {
              // Clear expired user data
              localStorage.removeItem('user')
            } else {
              setUser(parsedUser)
            }
          } else {
            // Clear invalid user data
            localStorage.removeItem('user')
          }
        }
      } catch (e) {
        console.error('Failed to parse user data', e)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, action: 'login' }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        // Store user with an expiration time (24 hours)
        const userData = {
          ...data.user,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
        }
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, action: 'signup' }),
      })

      const data = await response.json()

      if (data.success) {
        // Don't automatically log in the user after signup
        // Just return success so the UI can redirect to login page
        return { success: true, message: 'Account created successfully. Please login with your credentials.' }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const socialLogin = async (provider: string, token: string) => {
    try {
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, token }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Social login error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        throw new Error('No refresh token found')
      }
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (data.success) {
        // Store new tokens
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local state regardless of API result
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const value = {
    user,
    login,
    logout,
    signup,
    socialLogin,
    refreshToken
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}