'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PawPrint, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] md:mt-30 md:mb-20 flex items-center justify-center px-4 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl relative"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        
        <div className="relative inline-block mb-12">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[200px] font-black text-primary/5 leading-none select-none"
          >
            404
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="bg-primary p-8 rounded-[40px] shadow-2xl shadow-primary/40 rotate-12"
            >
              <PawPrint className="h-20 w-20 text-white" />
            </motion.div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">Lost in the <span className="text-primary">Fields?</span></h1>
        <p className="text-muted-foreground text-xl mb-12 leading-relaxed max-w-lg mx-auto font-medium">
          The page you are looking for has wandered off into the meadows. Let&apos;s get you back to the safety of the farm.
        </p>


        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <Link
            href="/"
            className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
          >
            <Home className="h-6 w-6" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-10 py-5 glass text-foreground rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:bg-primary/5 hover:-translate-y-1"
          >
            <ArrowLeft className="h-6 w-6" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

