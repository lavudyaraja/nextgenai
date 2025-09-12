'use client'

import React, { memo, lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loaded components with loading fallbacks
export const LazyCodeBlock = lazy(() => 
  import('@/components/ui/code-block').then(module => ({
    default: module.CodeBlock
  }))
)

// Optimized loading components
export const CodeBlockSkeleton = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-md">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
    <Skeleton className="h-32 w-full rounded-b-md" />
  </div>
))

CodeBlockSkeleton.displayName = 'CodeBlockSkeleton'

export const MessageSkeleton = memo(() => (
  <div className="flex gap-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
))

MessageSkeleton.displayName = 'MessageSkeleton'

// HOC for performance optimization
export function withPerformanceOptimization<T extends object>(
  Component: React.ComponentType<T>
) {
  const OptimizedComponent = memo((props: T) => {
    return (
      <Suspense fallback={<MessageSkeleton />}>
        <Component {...props} />
      </Suspense>
    )
  })
  
  OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`
  
  return OptimizedComponent
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  
  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options
      }
    )
    
    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])
  
  return isIntersecting
}

// Virtual scrolling component for large lists
export const VirtualizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 60,
  containerHeight = 400 
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(startIndex, endIndex)
  
  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
})

VirtualizedList.displayName = 'VirtualizedList'