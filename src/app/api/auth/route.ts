import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, action } = await request.json()

    if (action === 'login') {
      // Validate input
      if (!email || !password) {
        return NextResponse.json({ 
          success: false, 
          message: 'Email and password are required' 
        }, { status: 400 })
      }

      if (!isValidEmail(email)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid email format' 
        }, { status: 400 })
      }

      try {
        // Find user in database
        const user: any = await db.user.findUnique({
          where: { email }
        })

        if (!user) {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid email or password' 
          }, { status: 401 })
        }

        // For now, we'll assume passwords are stored in plain text for demo purposes
        // In a real app, you would hash passwords and compare them
        if (user.password !== password) {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid email or password' 
          }, { status: 401 })
        }

        // Return user without password
        const { password: userPassword, ...userWithoutPassword } = user
        
        return NextResponse.json({ 
          success: true, 
          user: {
            id: userWithoutPassword.id,
            name: userWithoutPassword.name,
            email: userWithoutPassword.email
          },
          message: 'Login successful'
        })
      } catch (error) {
        console.error('Database error during login:', error)
        return NextResponse.json({ 
          success: false, 
          message: 'Internal server error' 
        }, { status: 500 })
      }
    } else if (action === 'signup') {
      // Validate input
      if (!email || !password || !name) {
        return NextResponse.json({ 
          success: false, 
          message: 'Name, email and password are required' 
        }, { status: 400 })
      }

      if (!isValidEmail(email)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid email format' 
        }, { status: 400 })
      }

      if (password.length < 6) {
        return NextResponse.json({ 
          success: false, 
          message: 'Password must be at least 6 characters' 
        }, { status: 400 })
      }

      try {
        // Check if user already exists
        const existingUser = await db.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          return NextResponse.json({ 
            success: false, 
            message: 'User already exists' 
          }, { status: 409 })
        }

        // Create new user using raw query to avoid Prisma type issues
        // Note: In a production app, passwords should be hashed before storage
        const result: any = await db.$executeRaw`
          INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") 
          VALUES (${crypto.randomUUID()}, ${email}, ${name}, ${password}, NOW(), NOW())
        `;

        // Retrieve the created user
        const newUser = await db.user.findUnique({
          where: { email }
        });

        if (!newUser) {
          throw new Error('Failed to retrieve created user');
        }

        return NextResponse.json({ 
          success: true, 
          user: {
            id: newUser.id,
            name: newUser.name || '',
            email: newUser.email
          },
          message: 'Account created successfully. Please check your email for verification.'
        })
      } catch (error) {
        console.error('Database error during signup:', error)
        return NextResponse.json({ 
          success: false, 
          message: 'Internal server error' 
        }, { status: 500 })
      }
    } else if (action === 'forgot-password') {
      // Validate input
      if (!email) {
        return NextResponse.json({ 
          success: false, 
          message: 'Email is required' 
        }, { status: 400 })
      }

      if (!isValidEmail(email)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid email format' 
        }, { status: 400 })
      }

      try {
        const user: any = await db.user.findUnique({
          where: { email }
        })

        if (user) {
          // In a real app, you would send a password reset email here
          console.log(`Password reset email would be sent to ${email}`)
        }

        // For security reasons, we don't reveal if the email exists or not
        return NextResponse.json({ 
          success: true, 
          message: 'Password reset instructions have been sent to your email'
        })
      } catch (error) {
        console.error('Database error during forgot password:', error)
        return NextResponse.json({ 
          success: false, 
          message: 'Internal server error' 
        }, { status: 500 })
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