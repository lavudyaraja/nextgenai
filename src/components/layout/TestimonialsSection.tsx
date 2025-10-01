'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, CheckCircle, ArrowLeft, ArrowRight, Play, TrendingUp, Shield, Award } from 'lucide-react'

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Alexandra Rodriguez',
      role: 'Chief Technology Officer',
      company: 'TechForward Inc.',
      content: 'The AI integration has revolutionized our entire product development cycle. We\'ve seen a 300% increase in efficiency and our time-to-market has improved dramatically. This isn\'t just a tool—it\'s a competitive advantage.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      metrics: {
        improvement: '300%',
        metric: 'Efficiency Gain'
      },
      verified: true
    },
    {
      id: 2,
      name: 'Marcus Thompson',
      role: 'Head of Data Science',
      company: 'Analytics Pro',
      content: 'The precision and contextual understanding of this AI system is unprecedented. It has transformed how we approach complex data analysis, providing insights that would have taken our team weeks to uncover.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      metrics: {
        improvement: '85%',
        metric: 'Analysis Speed'
      },
      verified: true
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      role: 'VP of Engineering',
      company: 'Innovation Labs',
      content: 'Implementation was seamless, and the ROI was immediate. Our engineering team\'s productivity has soared, and the quality of our code reviews has never been higher. This is the future of software development.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      metrics: {
        improvement: '250%',
        metric: 'Code Quality'
      },
      verified: true
    },
    {
      id: 4,
      name: 'James Mitchell',
      role: 'Director of Operations',
      company: 'Global Dynamics',
      content: 'What impressed me most was not just the technology, but the strategic thinking it enables. Our decision-making process has become more data-driven and significantly faster, giving us a real edge in the market.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      metrics: {
        improvement: '180%',
        metric: 'Decision Speed'
      },
      verified: true
    }
  ]

  const stats = [
    { value: '50K+', label: 'Enterprise Users', icon: TrendingUp },
    { value: '99.9%', label: 'Uptime SLA', icon: Shield },
    { value: '4.9★', label: 'Average Rating', icon: Award },
    { value: '24/7', label: 'Expert Support', icon: CheckCircle }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    // Changed py-24 md:py-32 to py-16 md:py-24 to reduce height
    <section id="testimonials" className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-purple-500/30 mb-6">
            <Star className="h-4 w-4 text-yellow-500 mr-2 fill-current" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Trusted by Industry Leaders
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
              Powering Success
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Across Industries
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            See how forward-thinking companies are transforming their operations with our AI solutions
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mb-4 w-fit mx-auto">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl mx-4">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      {/* Content Side */}
                      <div className="md:col-span-2 space-y-6">
                        <div className="flex items-start justify-between">
                          <Quote className="h-16 w-16 text-blue-500/30 flex-shrink-0" />
                          {testimonial.verified && (
                            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                Verified Customer
                              </span>
                            </div>
                          )}
                        </div>

                        <blockquote className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              +{testimonial.metrics.improvement}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.metrics.metric}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Side */}
                      <div className="text-center md:text-left space-y-4">
                        <div className="relative inline-block">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-1">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {testimonial.company}
                          </p>
                        </div>

                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105">
                          <Play className="h-4 w-4" />
                          Watch Story
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={prevSlide}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              
              <button 
                onClick={nextSlide}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isAutoPlaying ? 'Auto-play On' : 'Auto-play Off'}
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Join these industry leaders and transform your business today
          </p>
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
            Start Your Success Story
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}