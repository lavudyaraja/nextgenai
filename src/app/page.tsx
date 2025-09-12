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
export default function LandingPage() {
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