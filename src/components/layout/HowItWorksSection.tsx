'use client'

import { motion } from 'framer-motion'
import { 
  UserPlus, 
  MessageCircle, 
  Rocket, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Brain,
  Globe,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up instantly with email, Google, or GitHub. No credit card required.',
      icon: UserPlus,
      features: ['Free 14-day trial', 'No setup fees', 'Instant activation'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: 2,
      title: 'Connect & Configure',
      description: 'Integrate with your tools and customize AI models to match your workflow.',
      icon: MessageCircle,
      features: ['50+ integrations', 'Custom workflows', 'Smart suggestions'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: 3,
      title: 'Scale & Optimize',
      description: 'Watch your productivity soar with intelligent automation and insights.',
      icon: Rocket,
      features: ['Real-time analytics', 'Team collaboration', 'Performance insights'],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const benefits = [
    { icon: Clock, title: 'Save 10+ hours/week', description: 'Automate repetitive tasks' },
    { icon: Brain, title: 'Smart Decision Making', description: 'AI-powered insights' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 & GDPR compliant' },
    { icon: Globe, title: 'Global Scale', description: '99.9% uptime guarantee' }
  ]

  return (
    // Changed py-24 md:py-32 to py-16 md:py-24 to reduce height
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 border border-blue-200/50 dark:border-gray-600 mb-8"
            variants={itemVariants}
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Simple Process
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="text-gray-900 dark:text-white">Get Started in</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Three Simple Steps
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your workflow from setup to success. No technical expertise required – 
            our intelligent platform guides you every step of the way.
          </motion.p>
        </motion.div>
        
        {/* Steps */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants} // corrected variant
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 z-0">
                    <div className="w-3/4 h-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Step Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative mb-8">
                    <div className={`bg-gradient-to-r ${step.color} rounded-full w-16 h-16 flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{step.number}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                    </div>

                    <div className="space-y-3">
                      {step.features.map((feature, fIndex) => (
                        <motion.div 
                          key={fIndex}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.2 + fIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose Our Platform?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mb-4 w-fit mx-auto">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        {/* <motion.div 
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join over 50,000 professionals who are already saving time and boosting productivity
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl" asChild>
                <Link href="/demo">
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-blue-100 text-sm">
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />14-day free trial</div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />No credit card required</div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Cancel anytime</div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}