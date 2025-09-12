import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // In a real application, you would:
    // 1. Check if the user exists
    // 2. Generate a password reset token
    // 3. Send an email with a reset link
    
    // For this demo, we'll check if the user exists in our array
    const user = users.find(u => u.email === email)
    
    if (user) {
      // In a real app, you would generate a token and send an email
      console.log(`Password reset requested for email: ${email}`)
      
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
  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}