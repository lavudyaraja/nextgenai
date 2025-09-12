'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  Home, 
  Zap, 
  MessageSquare, 
  ChevronDown,
  X,
  CreditCard,
  FileText,
  HelpCircle,
  Shield,
  Code,
  Layers,
  Target,
  Users,
  BarChart3,
  Sparkles,
  Search
} from 'lucide-react'
import { useAuth } from '@/contexts'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { slideInLeftVariant } from '@/lib/animation-utils'

export function Navbar() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home 
    },
    { 
      name: 'Products', 
      href: '#products', 
      icon: Layers,
      dropdown: [
        { name: 'AI Assistant', href: '/products/assistant', icon: MessageSquare },
        { name: 'Analytics', href: '/products/analytics', icon: BarChart3 },
        { name: 'Integrations', href: '/products/integrations', icon: Code },
      ]
    },
    { 
      name: 'Solutions', 
      href: '#solutions', 
      icon: Target,
      dropdown: [
        { name: 'For Enterprise', href: '/solutions/enterprise', icon: Users },
        { name: 'For Developers', href: '/solutions/developers', icon: Code },
        { name: 'For Agencies', href: '/solutions/agencies', icon: Sparkles },
      ]
    },
    { name: 'Features', href: '#features', icon: Zap },
    { name: 'Pricing', href: '#pricing', icon: CreditCard },
    { 
      name: 'Resources', 
      href: '#resources', 
      icon: FileText,
      dropdown: [
        { name: 'Documentation', href: '/docs', icon: FileText },
        { name: 'Help Center', href: '/help', icon: HelpCircle },
        { name: 'Security', href: '/security', icon: Shield },
      ]
    },
  ]

  // Custom Logo Component
  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-lg rounded-full scale-110"></div>
        {/* Main logo container */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-lg flex items-center justify-center">
          {/* Inner geometric pattern */}
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white/20 rounded-md transform rotate-45"></div>
            <div className="absolute inset-1 bg-white/40 rounded-sm"></div>
            <div className="absolute inset-2 bg-white rounded-xs"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          NeuralFlow
        </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wider">
          AI PLATFORM
        </span>
      </div>
    </div>
  )

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="container flex h-auto items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={slideInLeftVariant.visible.transition}
          >
            <Link href="/" className="block">
              <Logo />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              
              if (item.dropdown) {
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200 group"
                        >
                          <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                          {item.name}
                          <ChevronDown className="h-3 w-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50">
                        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {item.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.dropdown.map((subItem) => {
                          const SubIcon = subItem.icon
                          return (
                            <DropdownMenuItem key={subItem.name} asChild>
                              <Link href={subItem.href} className="flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                                <SubIcon className="h-4 w-4 mr-3 text-gray-500" />
                                {subItem.name}
                              </Link>
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200 group"
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Authentication Buttons */}
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50"
            >
              <nav className="flex flex-col space-y-2 pt-16">
                {/* Mobile Search */}
                <div className="px-4 pb-4 mb-4 border-b border-gray-200/50 dark:border-gray-800/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-10 bg-gray-50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                {navItems.map((item) => {
                  const Icon = item.icon
                  
                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center py-3 px-4 text-base font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </div>
                        <div className="ml-8 space-y-1">
                          {item.dropdown.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200"
                                onClick={() => setIsOpen(false)}
                              >
                                <SubIcon className="h-4 w-4 mr-3" />
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center py-3 px-4 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
                
                {/* Mobile Authentication Buttons */}
                <div className="pt-6 mt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                  {user ? (
                    <Button 
                      asChild 
                      className="w-full py-6 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        asChild 
                        className="w-full justify-center py-6 text-base border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-600"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>Sign in</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full py-6 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      >
                        <Link href="/signup" onClick={() => setIsOpen(false)}>Create Account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Search Modal Overlay */}
      {/* <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:block hidden"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                <div className="flex items-center px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <Input
                    placeholder="Search documentation, features, and more..."
                    className="border-0 focus:ring-0 text-base bg-transparent"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                  Start typing to search...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  )
}