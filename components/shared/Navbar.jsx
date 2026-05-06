'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut, PawPrint, Moon, Sun, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTimeout(() => {
        setIsDark(true)
        document.documentElement.classList.add('dark')
      }, 0)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Animals', href: '/animals' },
    { name: 'About Tradition', href: '/about' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 transition-all duration-500">
      <nav 
        className={cn(
          "max-w-7xl mx-auto transition-all duration-700 ease-in-out",
          scrolled 
            ? "glass rounded-[32px] border-white/10 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] py-4 px-8" 
            : "bg-transparent py-2 px-4"
        )}
      >
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-primary p-2.5 rounded-[18px] shadow-2xl shadow-primary/40 group-hover:shadow-primary/60 transition-all duration-500"
            >
              <PawPrint className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none gradient-text">
                Qurbani<span className="text-foreground dark:text-white">Elite</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-none mt-1">
                Sacred Tradition
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-6 py-2.5 text-sm font-black text-foreground/60 hover:text-primary transition-all rounded-xl hover:bg-primary/5 tracking-tight"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-border/40 mx-4" />

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-3 text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-[18px] transition-all duration-300 shadow-sm"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-6 pl-2">
                  <Link href="/my-profile" className="flex items-center gap-3 group px-2 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black text-foreground leading-none">{user.name}</span>
                      <span className="text-[10px] font-bold text-primary leading-none mt-1 flex items-center justify-end gap-1">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        Verified
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-[18px] p-0.5 border-2 border-primary/20 group-hover:border-primary transition-all shadow-xl shadow-primary/5 overflow-hidden">
                      <img
                        src={user.photoURL || 'https://i.pravatar.cc/150?u=default'}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-3 text-foreground/40 hover:text-destructive transition-colors rounded-[18px] hover:bg-destructive/5"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="px-6 py-3 text-sm font-black text-foreground/70 hover:text-primary transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-8 py-3.5 bg-secondary dark:bg-primary text-white rounded-[20px] hover:bg-primary-hover dark:hover:bg-primary-hover transition-all shadow-2xl shadow-primary/20 font-black text-sm tracking-tight"
                  >
                    Registration
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-3 text-foreground/70">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-primary/10 text-primary rounded-[18px]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="lg:hidden mt-4 glass rounded-[40px] border border-border shadow-3xl overflow-hidden max-w-7xl mx-auto"
          >
            <div className="p-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-8 py-5 text-xl font-black text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-3xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border/60 mx-4" />
              {user ? (
                <div className="space-y-4 pt-4">
                  <Link
                    href="/my-profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 bg-primary/5 rounded-3xl"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20">
                       <img src={user.photoURL} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-foreground">{user.name}</p>
                      <p className="text-xs text-primary font-bold">Elite Member</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex w-full items-center gap-4 px-8 py-5 text-xl font-black text-destructive hover:bg-destructive/5 rounded-3xl"
                  >
                    <LogOut className="h-6 w-6" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-5 border-2 border-primary/20 text-primary rounded-[28px] font-black text-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-5 bg-primary text-white rounded-[28px] font-black text-lg shadow-2xl shadow-primary/20"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


