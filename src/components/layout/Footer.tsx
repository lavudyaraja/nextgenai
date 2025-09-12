'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Mail, 
  CheckCircle, 
  Send, 
  Sparkles, 
  Heart, 
  Shield, 
  Award, 
  Globe, 
  Users, 
  TrendingUp, 
  Star, 
  Clock,
  ExternalLink,
  Zap,
  ArrowUp,
  Twitter,
  Linkedin,
  Github,
  Facebook
} from 'lucide-react'
import { containerVariants, itemVariants, socialVariants } from '@/lib/animation-utils'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const quickLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'AI Chat Models', href: '#features', icon: Zap, badge: 'New' },
        { name: 'Enterprise Suite', href: '#', icon: Shield },
        { name: 'Developer API', href: '#', icon: Globe, badge: 'Popular' },
        { name: 'Integrations Hub', href: '#how-it-works', icon: CheckCircle },
      ]
    },
    {
      title: 'Learn & Grow',
      links: [
        { name: 'Documentation', href: '#', icon: ExternalLink },
        { name: 'Video Tutorials', href: '#', icon: Star, badge: 'Featured' },
        { name: 'AI Blog & Insights', href: '#', icon: TrendingUp },
        { name: 'Developer Community', href: '#', icon: Users, badge: 'Active' },
      ]
    },
    {
      title: 'Support & More',
      links: [
        { name: 'About Our Mission', href: '#', icon: Award },
        { name: 'Join Our Team', href: '#', icon: Heart, badge: 'Hiring' },
        { name: 'Media & Press', href: '#', icon: ExternalLink },
        { name: '24/7 Live Support', href: '#', icon: Clock, badge: 'Live' },
      ]
    }
  ]

  const socialPlatforms = [
    { icon: Twitter, href: '#', name: 'Twitter', color: 'hover:text-sky-500 hover:bg-sky-50', followers: '125K' },
    { icon: Linkedin, href: '#', name: 'LinkedIn', color: 'hover:text-blue-600 hover:bg-blue-50', followers: '89K' },
    { icon: Github, href: '#', name: 'GitHub', color: 'hover:text-gray-700 hover:bg-gray-50', followers: '45K' },
    { icon: Facebook, href: '#', name: 'Facebook', color: 'hover:text-blue-700 hover:bg-blue-50', followers: '78K' }
  ]

  const companyStats = [
    { label: 'Active Users', value: '2M+', icon: Users },
    { label: 'Countries', value: '150+', icon: Globe },
    { label: 'API Calls/Day', value: '50M+', icon: Zap },
    { label: 'Satisfaction', value: '99%', icon: Heart }
  ]

  const handleNewsletterSubscribe = () => {
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 4000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-20">
        {/* Brand & Stats */}
        <motion.div 
          className="mb-20 grid lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.div 
              className="flex items-center space-x-5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Bot className="h-10 w-10 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Assistant
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                  <span className="text-blue-600 font-medium text-sm">
                    Next-Generation AI Platform
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Empowering businesses globally with intelligent AI solutions that transform workflows, enhance productivity, and unlock unprecedented innovation.
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={itemVariants}
            >
              {companyStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div 
                    key={index} 
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -3, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900">Join the AI Revolution</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Get exclusive access to cutting-edge AI insights, product updates, and industry trends. Join 250K+ innovators shaping the future.
            </p>

            <div className="space-y-4">
              <div className="flex rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-300">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com" 
                    className="w-full h-14 pl-12 pr-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
                  />
                </div>
                <motion.button 
                  onClick={handleNewsletterSubscribe}
                  className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-r-lg transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubscribed ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </motion.button>
              </div>

              {isSubscribed && (
                <motion.div 
                  className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Welcome aboard! Check your inbox for confirmation.</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="grid md:grid-cols-3 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {quickLinks.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} className="space-y-6" variants={itemVariants}>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const Icon = link.icon
                  return (
                    <motion.li 
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a 
                        href={link.href} 
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                      >
                        <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                          <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                        </div>
                        <span className="font-medium">{link.name}</span>
                        {link.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            link.badge === 'New' ? 'bg-green-100 text-green-700 border border-green-200' :
                            link.badge === 'Popular' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            link.badge === 'Featured' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            link.badge === 'Live' ? 'bg-red-100 text-red-700 border border-red-200' :
                            link.badge === 'Hiring' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Connect & Follow</h3>
          <div className="flex justify-center gap-4">
            {socialPlatforms.map((platform, index) => {
              const Icon = platform.icon
              return (
                <motion.a
                  key={index}
                  href={platform.href}
                  className={`p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300 ${platform.color} group relative`}
                  variants={socialVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-6 w-6 transition-all duration-300" />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {platform.followers}
                  </div>
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-red-500" />
              </motion.div>
              <span>&copy; {currentYear} AI Assistant. Crafted with passion by innovators.</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-green-700 font-medium text-sm">All systems operational</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security Center'].map((item, index) => (
                <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:underline underline-offset-4">
                  {item}
                </a>
              ))}
            </div>
            <motion.button 
              onClick={scrollToTop}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}