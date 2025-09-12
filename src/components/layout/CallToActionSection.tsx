'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { itemVariants, fadeInVariant } from '@/lib/animation-utils'

export function CallToActionSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Main CTA */}
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-1 backdrop-blur-sm border border-primary/20 mb-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="relative bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-xl rounded-3xl p-10 md:p-16 text-center">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to Transform Your Workflow?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of users who are already experiencing the future of AI conversations.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="text-base md:text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/30 group transition-all duration-300" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base md:text-lg px-8 py-6 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div 
          className="max-w-3xl mx-auto text-center border-t border-primary/20 pt-20 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
         <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
  <div className="bg-white/10 rounded-full px-4 py-2 inline-block backdrop-blur-sm">
    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-full border border-primary/30 inline-block">
      <Send className="h-6 w-6 text-primary" />
    </div>
  </div>
</div>

          
          <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay Updated
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Subscribe to our newsletter for product updates and AI insights.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-12 pl-4 pr-24 rounded-xl border-2 focus:border-primary transition-colors" 
                />
                <Button className="absolute right-1 top-1 h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow hover:shadow-primary/20">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}