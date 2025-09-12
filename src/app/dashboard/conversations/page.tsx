'use client'

import { ChatHistory } from '@/components/chat'

export default function ConversationsPage() {
  return (
    <div className="flex flex-col h-full">
      <ChatHistory />
    </div>
  )
}
