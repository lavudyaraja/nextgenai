'use client'

import { ReactNode } from 'react'

interface HelpLayoutProps {
  children: ReactNode
}

export default function HelpLayout({ children }: HelpLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* No navbar or footer for help pages */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}