'use client'

import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  
  // Hide navbar and footer on dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard')
  
  // Hide navbar and footer on help pages
  const isHelpPage = pathname?.startsWith('/userprofile/help')

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isDashboardPage && !isHelpPage && <Navbar />}
      <main className={`flex-1 ${!isDashboardPage && !isHelpPage ? 'pt-16' : ''}`}>{children}</main>
      {!isDashboardPage && !isHelpPage && <Footer />}
    </div>
  )
}