'use client'

import { useState } from 'react'
import { 
  Brain, 
  Zap, 
  MessageSquare, 
  Users, 
  Globe, 
  Lock, 
  Cloud, 
  Database,
  Cpu,
  Shield,
  BarChart3,
  Workflow,
  FileText,
  Mic,
  Eye,
  Code,
  Palette,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react'

export default function AdvancedFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('core')

  const categories = {
    core: {
      title: 'Core Intelligence',
      subtitle: 'Foundation AI capabilities',
      color: 'blue'
    },
    productivity: {
      title: 'Productivity Suite',
      subtitle: 'Enhance your workflow',
      color: 'purple'
    },
    enterprise: {
      title: 'Enterprise Ready',
      subtitle: 'Built for scale and security',
      color: 'green'
    },
    creative: {
      title: 'Creative Tools',
      subtitle: 'Unleash your creativity',
      color: 'pink'
    }
  }

  const features = {
    core: [
      {
        icon: Brain,
        title: 'GPT-4 Powered Intelligence',
        description: 'Advanced reasoning capabilities with multi-step problem solving and contextual understanding',
        highlight: 'Industry Leading',
        stats: '99.5% Accuracy'
      },
      {
        icon: Zap,
        title: 'Lightning Response Times',
        description: 'Sub-second response times with globally distributed edge computing infrastructure',
        highlight: 'Ultra Fast',
        stats: '<200ms Response'
      },
      {
        icon: MessageSquare,
        title: 'Multi-Modal Conversations',
        description: 'Seamlessly handle text, images, voice, and documents in a single conversation',
        highlight: 'Versatile',
        stats: '10+ Input Types'
      },
      {
        icon: Globe,
        title: 'Universal Language Support',
        description: 'Communicate in 100+ languages with real-time translation and cultural context',
        highlight: 'Global Ready',
        stats: '100+ Languages'
      }
    ],
    productivity: [
      {
        icon: FileText,
        title: 'Document Intelligence',
        description: 'Analyze, summarize, and extract insights from PDFs, presentations, and spreadsheets',
        highlight: 'Smart Analysis',
        stats: '50+ File Types'
      },
      {
        icon: Workflow,
        title: 'Automated Workflows',
        description: 'Create custom AI-powered workflows that integrate with your favorite tools',
        highlight: 'No-Code Setup',
        stats: '500+ Integrations'
      },
      {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Track conversation insights, productivity metrics, and AI performance analytics',
        highlight: 'Data Driven',
        stats: 'Real-time Insights'
      },
      {
        icon: Clock,
        title: 'Smart Scheduling',
        description: 'AI assistant that manages your calendar, finds optimal meeting times, and sets reminders',
        highlight: 'Time Saver',
        stats: '40% Time Saved'
      }
    ],
    enterprise: [
      {
        icon: Shield,
        title: 'Military-Grade Security',
        description: 'End-to-end encryption, zero-trust architecture, and compliance with SOC2, HIPAA, GDPR',
        highlight: 'Bank Level',
        stats: 'SOC2 Certified'
      },
      {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Share AI conversations, create team workspaces, and collaborate on projects in real-time',
        highlight: 'Team Ready',
        stats: 'Unlimited Users'
      },
      {
        icon: Database,
        title: 'Enterprise Data Management',
        description: 'Secure data lakes, automatic backup, version control, and audit trails for all interactions',
        highlight: 'Compliant',
        stats: '99.99% Uptime'
      },
      {
        icon: Cloud,
        title: 'Hybrid Cloud Deployment',
        description: 'Deploy on-premises, in the cloud, or hybrid environments with seamless synchronization',
        highlight: 'Flexible',
        stats: 'Multi-Cloud'
      }
    ],
    creative: [
      {
        icon: Palette,
        title: 'Creative Content Generation',
        description: 'Generate marketing copy, blog posts, social media content, and creative writing',
        highlight: 'AI Powered',
        stats: '10x Faster'
      },
      {
        icon: Code,
        title: 'Advanced Code Assistant',
        description: 'Write, debug, and optimize code in 30+ programming languages with best practices',
        highlight: 'Developer Ready',
        stats: '30+ Languages'
      },
      {
        icon: Eye,
        title: 'Visual Content Analysis',
        description: 'Analyze images, create descriptions, extract text, and generate visual insights',
        highlight: 'Computer Vision',
        stats: 'Multi-format'
      },
      {
        icon: Mic,
        title: 'Voice & Audio Processing',
        description: 'Transcribe, translate, and analyze audio content with advanced speech recognition',
        highlight: 'Voice Ready',
        stats: '95% Accuracy'
      }
    ]
  }

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'gradient') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-cyan-500'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-pink-500'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-200',
        gradient: 'from-green-500 to-emerald-500'
      },
      pink: {
        bg: 'bg-pink-500',
        text: 'text-pink-600',
        border: 'border-pink-200',
        gradient: 'from-pink-500 to-rose-500'
      }
    }
    return colorMap[color]?.[variant] || colorMap.blue[variant]
  }

  return (
    // Changed py-24 to py-16 to reduce height
    <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full mb-8 shadow-lg">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 tracking-wide">ADVANCED AI FEATURES</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 leading-tight">
            Next-Generation
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              AI Capabilities
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Discover the most advanced AI features designed to transform how you work, create, and collaborate. 
            Built for the future, available today.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`group px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${getColorClasses(category.color, 'gradient')} text-white shadow-lg`
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{category.title}</span>
                  {activeCategory === key && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {categories[activeCategory].title}
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categories[activeCategory].subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features[activeCategory].map((feature, index) => {
            const Icon = feature.icon
            const categoryColor = categories[activeCategory].color
            
            return (
              <div
                key={`${activeCategory}-${index}`}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-gray-300 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getColorClasses(categoryColor, 'gradient')} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`relative p-4 bg-gradient-to-br ${getColorClasses(categoryColor, 'gradient')} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${getColorClasses(categoryColor, 'gradient')} text-white text-xs font-semibold rounded-full shadow-sm`}>
                      <Check className="h-3 w-3" />
                      {feature.highlight}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">
                      {feature.stats}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h4 className={`text-xl font-bold text-gray-900 group-hover:${getColorClasses(categoryColor, 'text')} transition-colors duration-300`}>
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className={`group/btn flex items-center gap-2 text-sm font-medium ${getColorClasses(categoryColor, 'text')} hover:gap-3 transition-all duration-300`}>
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:${getColorClasses(categoryColor, 'border')} transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100`} />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 max-w-3xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience Next-Gen AI?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who are already transforming their workflow with our advanced AI capabilities.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group">
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                Schedule Demo
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        [style*="animation-delay"] {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}