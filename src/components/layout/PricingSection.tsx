'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals getting started',
      features: [
        'Up to 100 messages per day',
        'Basic AI models',
        'Standard response speed',
        'Email support',
        'Mobile app access'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '$19',
      period: 'per month',
      description: 'For professionals and small teams',
      features: [
        'Unlimited messages',
        'Advanced AI models',
        'Priority response speed',
        '24/7 chat support',
        'Mobile & desktop apps',
        'Document analysis (50 pages/day)',
        'Voice input/output'
      ],
      cta: 'Try Free for 14 Days',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited everything',
        'Premium AI models',
        'Highest response speed',
        '24/7 dedicated support',
        'All apps + custom integrations',
        'Unlimited document analysis',
        'Voice & video interactions',
        'Custom AI model training',
        'SSO & advanced security',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="container mx-auto px-4 py-20 md:py-28 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-20">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Choose the plan that works best for you and your team
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="h-full"
          >
            <Card className={`h-full flex flex-col border-2 ${plan.popular ? 'border-primary shadow-xl relative' : 'border-primary/20'}`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/30' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}