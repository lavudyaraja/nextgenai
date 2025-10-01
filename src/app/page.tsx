'use client'

import { 
  HeroSection,
  // FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CallToActionSection,
  // DemoSection,
  PricingSection
} from '@/components/layout'
import DemoSection from '@/components/layout/DemoSection'
import FeaturesSection from '@/components/layout/FeaturesSection'
import { useEffect } from 'react'

export default function LandingPage() {
  useEffect(() => {
    // Ensure we're at the top of the page when component mounts
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background to-muted">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoSection />
      <PricingSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  )
}