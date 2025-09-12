import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('Setting up database...')
    
    // Test database connection
    await prisma.$connect()
    console.log('Connected to database successfully')
    
    // Create a test conversation
    const conversation = await prisma.conversation.create({
      data: {
        title: 'Test Conversation',
        userId: 'default-user'
      }
    })
    
    console.log('Created test conversation:', conversation.id)
    
    // Create a test message
    const message = await prisma.message.create({
      data: {
        content: 'Hello, this is a test message!',
        role: 'user',
        conversationId: conversation.id
      }
    })
    
    console.log('Created test message:', message.id)
    
    // Create AI response
    const aiMessage = await prisma.message.create({
      data: {
        content: 'Hello! This is a test AI response.',
        role: 'assistant',
        conversationId: conversation.id
      }
    })
    
    console.log('Created test AI message:', aiMessage.id)
    
    // Retrieve conversation with messages
    const retrievedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: { messages: true }
    })
    
    console.log('Retrieved conversation with messages:', retrievedConversation)
    
    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Database setup error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()