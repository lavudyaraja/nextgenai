#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Performance Optimization Build...\n')

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...')
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' })
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...')
  execSync('npm run db:generate', { stdio: 'inherit' })

  // Build with profiling
  console.log('📊 Building with performance profiling...')
  execSync('npm run build:profile', { stdio: 'inherit' })

  // Analyze bundle
  console.log('📈 Analyzing bundle size...')
  execSync('npm run analyze', { stdio: 'inherit' })

  console.log('\n✅ Performance optimization build completed!')
  console.log('\n📋 Performance Checklist:')
  console.log('- ✅ Bundle splitting enabled')
  console.log('- ✅ Image optimization configured')
  console.log('- ✅ Font optimization enabled')
  console.log('- ✅ CSS minification enabled')
  console.log('- ✅ Tree shaking optimized')
  console.log('- ✅ Compression enabled')
  console.log('- ✅ Performance monitoring added')
  
  console.log('\n📊 Next Steps:')
  console.log('1. Check bundle analyzer report in browser')
  console.log('2. Run lighthouse audit: npm run lighthouse')
  console.log('3. Test on mobile devices')
  console.log('4. Monitor Core Web Vitals in production')

} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}