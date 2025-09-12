import { NextRequest, NextResponse } from 'next/server'
import { users } from './users'

// This is a mock authentication API for demonstration purposes
// In a real application, you would integrate with a proper authentication system

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, action } = await request.json()

    if (action === 'login') {
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Remove password from response
        const { password, ...userWithoutPassword } = user
        return NextResponse.json({ 
          success: true, 
          user: userWithoutPassword,
          message: 'Login successful'
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid email or password' 
        }, { status: 401 })
      }
    } else if (action === 'signup') {
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        return NextResponse.json({ 
          success: false, 
          message: 'User already exists' 
        }, { status: 409 })
      }
      
      // Create new user
      const newUser = {
        id: (users.length + 1).toString(),
        name: name || email.split('@')[0], // Simple name from email
        email,
        password, // In a real app, this would be hashed
        verified: false // New users need email verification
      }
      
      users.push(newUser)
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser
      
      // In a real app, you would send a verification email here
      console.log(`Verification email would be sent to ${email}`)
      
      return NextResponse.json({ 
        success: true, 
        user: userWithoutPassword,
        message: 'Account created successfully. Please check your email for verification.'
      })
    } else if (action === 'forgot-password') {
      const user = users.find(u => u.email === email)
      
      if (user) {
        // In a real app, you would send a password reset email here
        console.log(`Password reset email would be sent to ${email}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Password reset instructions have been sent to your email'
        })
      } else {
        // For security reasons, we don't reveal if the email exists or not
        return NextResponse.json({ 
          success: true, 
          message: 'Password reset instructions have been sent to your email'
        })
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid action' 
    }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}