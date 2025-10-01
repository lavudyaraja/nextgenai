'use client'

import { useState } from 'react'
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Shield, 
  Clock, 
  Layers, 
  Star,
  CheckCircle,
  Zap,
  Globe,
  Users
} from 'lucide-react'

export function HeroSection() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    // Changed min-h-screen to min-h-[calc(100vh-4rem)] to prevent scroll jumping
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-500/30 rounded-full animate-bounce" />
        <div className="absolute top-1/3 left-1/3 w-6 h-6 bg-purple-500/40 rotate-45 animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/5 w-3 h-3 bg-pink-500/50 rounded-full animate-bounce" style={{animationDelay: '2s'}} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Enhanced Logo/Icon */}
          {/* <div className="relative group">
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-3xl border border-blue-200/50 dark:border-gray-600 shadow-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 animate-pulse" />
                  <Bot className="relative h-16 w-16 text-blue-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-sm"></div>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Enhanced Heading */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-gray-600 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Powered by Advanced AI Technology
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-5xl leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
                Transform Your Business with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative">
                Intelligent AI Solutions
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
              </span>
            </h1>
          </div>
          
          {/* Enhanced Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl leading-relaxed font-medium">
            Harness the power of cutting-edge artificial intelligence to streamline your workflow, 
            enhance decision-making, and unlock unprecedented productivity across your organization.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="text-base md:text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 group transition-all duration-300 rounded-xl font-semibold text-white hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-3 h-5 w-5 inline transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="text-base md:text-lg px-10 py-7 border-2 border-gray-300 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group rounded-xl font-semibold text-gray-900 dark:text-white hover:scale-105">
              <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Trusted by 10,000+ companies worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Microsoft', 'Google', 'Amazon', 'Meta', 'Apple'].map((company, index) => (
                <div 
                  key={company}
                  className="text-xl font-bold text-gray-400 dark:text-gray-500 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Feature Grid */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full">
            {[
              { 
                title: '99.9% Uptime', 
                subtitle: 'Always Available',
                icon: Shield, 
                color: 'from-green-500 to-emerald-600',
                bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
                shadowColor: 'hover:shadow-green-500/10'
              },
              { 
                title: '24/7 Support', 
                subtitle: 'Expert Help',
                icon: Clock, 
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
                shadowColor: 'hover:shadow-blue-500/10'
              },
              { 
                title: '100+ Models', 
                subtitle: 'AI Variety',
                icon: Layers, 
                color: 'from-purple-500 to-violet-600',
                bgColor: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
                shadowColor: 'hover:shadow-purple-500/10'
              },
              { 
                title: 'Enterprise Ready', 
                subtitle: 'Scale Globally',
                icon: Globe, 
                color: 'from-orange-500 to-red-600',
                bgColor: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
                shadowColor: 'hover:shadow-orange-500/10'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index} 
                  className="group cursor-pointer hover:-translate-y-2 transition-all duration-300"
                  // onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`bg-gradient-to-br ${item.bgColor} p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 group-hover:shadow-2xl ${item.shadowColor} transition-all duration-500 h-full`}>
                    <div className={`bg-gradient-to-r ${item.color} p-3 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
              <span className="font-medium">50,000+ active users</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-medium">4.9/5 rating</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}