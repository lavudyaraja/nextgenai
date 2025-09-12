import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  createdAt: string
}

export const downloadChatAsZip = async (messages: Message[], conversationId?: string | null) => {
  try {
    const zip = new JSZip()
    
    // Create a chat log file
    const chatLog = messages.map(msg => {
      const timestamp = new Date(msg.createdAt).toLocaleString()
      return `[${timestamp}] ${msg.role.toUpperCase()}: ${msg.content}`
    }).join('\n\n')
    
    zip.file('chat-log.txt', chatLog)
    
    // Create a JSON file with full message data
    const jsonData = {
      conversationId: conversationId || 'unknown',
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages
    }
    
    zip.file('chat-data.json', JSON.stringify(jsonData, null, 2))
    
    // Add images if any
    let imageCount = 0
    for (const message of messages) {
      if (message.imageUrl) {
        try {
          // Convert base64 to blob
          const response = await fetch(message.imageUrl)
          const blob = await response.blob()
          zip.file(`image-${imageCount + 1}.png`, blob)
          imageCount++
        } catch (error) {
          console.error('Error adding image to zip:', error)
        }
      }
    }
    
    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' })
    const fileName = `chat-export-${conversationId || Date.now()}.zip`
    saveAs(content, fileName)
    
    return true
  } catch (error) {
    console.error('Error creating zip file:', error)
    throw new Error('Failed to create download file')
  }
}

export const shareChat = async (messages: Message[], conversationId?: string | null) => {
  try {
    // Create a shareable text version
    const shareText = `AI Assistant Chat Export\n\nConversation ID: ${conversationId || 'Unknown'}\nExported: ${new Date().toLocaleString()}\nMessages: ${messages.length}\n\n` +
      messages.map(msg => {
        const timestamp = new Date(msg.createdAt).toLocaleString()
        return `[${timestamp}] ${msg.role.toUpperCase()}: ${msg.content}`
      }).join('\n\n')
    
    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      await navigator.share({
        title: 'AI Assistant Chat',
        text: shareText.substring(0, 500) + (shareText.length > 500 ? '...' : ''),
        url: window.location.href
      })
      return true
    }
    
    // Fallback to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      alert('Chat content copied to clipboard!')
      return true
    }
    
    // Final fallback - create a downloadable text file
    const blob = new Blob([shareText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${conversationId || Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error sharing chat:', error)
    throw new Error('Failed to share chat')
  }
}

export const openFileUpload = () => {
  return new Promise<File[]>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.txt,.pdf,.doc,.docx,.md,.json'
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        resolve(files)
      } else {
        reject(new Error('No files selected'))
      }
    }
    
    input.click()
  })
}