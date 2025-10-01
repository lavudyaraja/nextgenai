import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts";
import { Layout } from "@/components/layout";
import { Suspense } from "react";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

// Optimized font loading with preload and display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['Monaco', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  title: {
    default: "Converstional AI",
    template: "%s | Conversational Ai"
  },
  description: "Advanced Conversational Ai with multi-provider integration, real-time messaging, and intelligent responses",
  keywords: ["Chat", "Messaging", "Real-time", "AI", "Assistant"],
  authors: [{ name: "Conversational Ai Team" }],
  creator: "Conversational Ai",
  publisher: "Conversational Ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Chat Interface',
    description: 'Advanced chat interface with multi-provider integration',
    siteName: 'Chat Interface',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chat Interface',
    description: 'Advanced chat interface with multi-provider integration',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Loading component for Suspense
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

// Component to handle scroll restoration
function ScrollRestoration() {
  // This will scroll to top on initial load
  if (typeof window !== 'undefined') {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Also scroll to top after a short delay to handle any async content
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
  
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
        
        {/* Resource hints */}
        <link rel="preload" href="/fonts" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Performance and SEO meta tags */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-900`}
        suppressHydrationWarning
      >
        <ScrollRestoration />
        <PerformanceMonitor />
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <Layout>
              {children}
            </Layout>
            <Toaster />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}