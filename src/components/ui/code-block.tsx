'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language = '', showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className="relative group my-4">
      {/* Language label and copy button header */}
      <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-md border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy code
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <pre className="bg-muted/50 p-4 rounded-b-md overflow-x-auto">
        <code className="text-sm font-mono">
          {showLineNumbers ? (
            <div className="grid grid-cols-[auto_1fr] gap-4">
              {/* Line numbers */}
              <div className="text-muted-foreground select-none">
                {lines.map((_, index) => (
                  <div key={index} className="text-right">
                    {index + 1}
                  </div>
                ))}
              </div>
              {/* Code lines */}
              <div>
                {lines.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{code}</div>
          )}
        </code>
      </pre>
    </div>
  )
}