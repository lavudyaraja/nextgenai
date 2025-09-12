'use client'

import React from 'react'
import { CodeBlock } from '@/components/ui/code-block'

interface MessageContentProps {
  content: string
  className?: string
}

interface CodeBlockMatch {
  fullMatch: string
  language: string
  code: string
  index: number
}

export function MessageContent({ content, className = '' }: MessageContentProps) {
  // Parse content to extract code blocks
  const parseContent = (text: string) => {
    // Regex to match code blocks: ```language\ncode\n```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const codeBlocks: CodeBlockMatch[] = []
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      codeBlocks.push({
        fullMatch: match[0],
        language: match[1] || '',
        code: match[2].trim(),
        index: match.index
      })
    }

    // If no code blocks found, return plain text
    if (codeBlocks.length === 0) {
      return <div className={`whitespace-pre-wrap ${className}`}>{text}</div>
    }

    // Split content by code blocks and render appropriately
    const elements: React.ReactNode[] = []
    let currentIndex = 0

    codeBlocks.forEach((block, blockIndex) => {
      // Add text before the code block
      if (block.index > currentIndex) {
        const beforeText = text.slice(currentIndex, block.index)
        if (beforeText.trim()) {
          elements.push(
            <div key={`text-${blockIndex}`} className="whitespace-pre-wrap">
              {beforeText}
            </div>
          )
        }
      }

      // Add the code block
      elements.push(
        <CodeBlock
          key={`code-${blockIndex}`}
          code={block.code}
          language={block.language}
        />
      )

      currentIndex = block.index + block.fullMatch.length
    })

    // Add remaining text after the last code block
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex)
      if (remainingText.trim()) {
        elements.push(
          <div key="text-final" className="whitespace-pre-wrap">
            {remainingText}
          </div>
        )
      }
    }

    return <div className={className}>{elements}</div>
  }

  return parseContent(content)
}