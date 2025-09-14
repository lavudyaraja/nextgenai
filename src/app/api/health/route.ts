import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables (don't expose actual values)
    const envCheck = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here',
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here',
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-your-anthropic-api-key-here',
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key-here',
      XAI_API_KEY: !!process.env.XAI_API_KEY && process.env.XAI_API_KEY !== 'your-xai-api-key-here',
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    }

    // Test OpenAI API connection if key is available
    let openaiTest: { status: string; response?: string; error?: any } | null = null
    if (envCheck.OPENAI_API_KEY) {
      try {
        const { GPTService } = await import('@/services/gptService')
        const gptService = new GPTService()
        
        // Try a simple test message
        const testResponse = await gptService.generateResponse([
          { role: 'user', content: 'Say "test successful" and nothing else.' }
        ])
        
        openaiTest = {
          status: 'success',
          response: testResponse.substring(0, 50) + (testResponse.length > 50 ? '...' : '')
        }
      } catch (error: any) {
        openaiTest = {
          status: 'error',
          error: error?.message || 'Unknown error'
        }
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      openaiTest,
      message: 'Environment check complete'
    })
    
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { error: 'Failed to check environment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}