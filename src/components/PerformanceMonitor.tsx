'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric = entry as any

        switch (metric.name) {
          case 'FCP':
            metrics.fcp = metric.value
            break
          case 'LCP':
            metrics.lcp = metric.value
            break
          case 'FID':
            metrics.fid = metric.value
            break
          case 'CLS':
            metrics.cls = metric.value
            break
          case 'TTFB':
            metrics.ttfb = metric.value
            break
        }

        // Log metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Performance Metric - ${metric.name}:`, metric.value)
        }
      }
    })

    // Observe various metric types
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource', 'paint'] })
    } catch (e) {
      // Fallback for older browsers
      console.warn('Performance Observer not fully supported')
    }

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming
        
        // Log slow resources in development
        if (process.env.NODE_ENV === 'development' && resource.duration > 1000) {
          console.warn(`Slow resource detected: ${resource.name} (${resource.duration}ms)`)
        }
      }
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.warn('Resource Performance Observer not supported')
    }

    // Memory usage monitoring (Chrome only)
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        if (process.env.NODE_ENV === 'development') {
          console.log('Memory Usage:', {
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
          })
        }
      }
    }

    // Monitor memory every 30 seconds in development
    let memoryInterval: NodeJS.Timeout
    if (process.env.NODE_ENV === 'development') {
      memoryInterval = setInterval(monitorMemory, 30000)
    }

    // Cleanup
    return () => {
      observer.disconnect()
      resourceObserver.disconnect()
      if (memoryInterval) clearInterval(memoryInterval)
    }
  }, [])

  // This component doesn't render anything
  return null
}

// Web Vitals reporting function
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
  
  // You can send metrics to analytics service here
  // Example: analytics.track('Web Vital', metric)
}

// Performance utilities
export const performanceUtils = {
  // Preload critical resources
  preloadResource: (url: string, type: 'script' | 'style' | 'font' | 'image') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    link.as = type
    if (type === 'font') {
      link.crossOrigin = 'anonymous'
    }
    document.head.appendChild(link)
  },

  // Lazy load non-critical resources
  lazyLoadScript: (src: string, onLoad?: () => void) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = onLoad || (() => {})
    document.head.appendChild(script)
  },

  // Measure function execution time
  measureFunction: <T extends (...args: any[]) => any>(fn: T, name: string): T => {
    return ((...args: any[]) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name} execution time: ${end - start}ms`)
      }
      
      return result
    }) as T
  },

  // Debounce function for performance
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function for performance
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}