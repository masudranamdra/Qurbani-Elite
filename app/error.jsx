'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled production error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
          <h1 className="relative text-9xl font-black text-slate-200 dark:text-slate-800">500</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-slate-600 dark:text-slate-400">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={reset}
            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
