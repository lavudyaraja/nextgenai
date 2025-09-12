import { databaseService as db } from '@/lib/database-service';

export async function GET() {
  try {
    // Test database connection by fetching conversations
    const conversations = await db.conversation.findMany({});
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        conversationCount: conversations.length,
        message: 'Database connection successful'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database connection failed'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}