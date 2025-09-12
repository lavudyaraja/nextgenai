'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileText, 
  Shield, 
  Keyboard,
  BookOpen,
  Lock,
  ChevronRight
} from 'lucide-react'

export default function HelpPage() {
  const helpSections = [
    {
      title: 'Release Notes',
      description: 'Stay up to date with the latest features and improvements.',
      icon: FileText,
      href: '/userprofile/help/release-notes'
    },
    {
      title: 'Documents & Resources',
      description: 'Access user guides, manuals, and other helpful resources.',
      icon: BookOpen,
      href: '/userprofile/help/documents'
    },
    {
      title: 'Terms & Policies',
      description: 'Read our terms of service and privacy policies.',
      icon: Shield,
      href: '/userprofile/help/terms-policies'
    },
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      icon: Lock,
      href: '/userprofile/help/privacy'
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Learn keyboard shortcuts to boost your productivity.',
      icon: Keyboard,
      href: '/userprofile/help/keyboard-shortcuts'
    }
  ]

  // Function to handle navigation in new tab
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(href, '_blank');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and learn how to get the most out of AI Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{section.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => handleNavigation(section.href, e)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you can&apos;t find what you&apos;re looking for, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={(e) => handleNavigation('/support/contact', e)}>
                Contact Support
              </Button>
              <Button 
                variant="outline"
                onClick={(e) => handleNavigation('/support/faq', e)}
              >
                Visit FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}