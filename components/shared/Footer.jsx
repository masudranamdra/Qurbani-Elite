'use client'

import Link from 'next/link'
import { PawPrint, Mail, Phone, MapPin, Globe, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

// Custom Brand Icons
const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export default function Footer() {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Your message has been received. Thank you!', {
      style: {
        borderRadius: '12px',
        background: '#059669',
        color: '#fff',
      },
    })
    setFeedback({ name: '', email: '', message: '' })
    setLoading(false)
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Animals', href: '/animals' },
    { name: 'Traditional Roots', href: '/about' },
    { name: 'Market Insight', href: '/market' },
  ]

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Qurbani Guide', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ]

  const socialLinks = [
    { Icon: FacebookIcon, href: '#', label: 'Facebook' },
    { Icon: TwitterIcon, href: '#', label: 'Twitter' },
    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
    { Icon: Globe, href: '#', label: 'Website' },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border bg-slate-50/50 pt-20 dark:bg-slate-950/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                <PawPrint className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-foreground leading-none">
                  Qurbani<span className="text-primary">Hat</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-none mt-1">
                  Sacred Tradition
                </span>
              </div>
            </Link>
            <p className="mt-6 text-sm leading-7 text-muted-foreground max-w-sm">
              Experience the convergence of ancient tradition and modern transparency. We provide verified, healthy livestock with premium logistics and care.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:-translate-y-1 shadow-sm"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation & Support */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-6">Navigation</h3>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-6">Support</h3>
              <ul className="space-y-4">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Feedback */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-6">Contact Elite</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-bold text-foreground">Headquarters</p>
                    <p className="text-muted-foreground">Basudebpur, Chirirbandar, Dinajpur</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-foreground">Concierge Line</p>
                    <p className="text-muted-foreground">01877-080660</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Form Section */}
        <div className="mt-16 rounded-[32px] border border-border bg-card p-1 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="rounded-[30px] bg-slate-50 p-8 dark:bg-slate-900/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-md">
                <h3 className="text-xl font-black tracking-tight text-foreground">Send Your Feedback</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your insights help us maintain the elite standards of our marketplace.</p>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                    className="w-full rounded-2xl border-transparent bg-white px-5 py-3 text-sm font-semibold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800"
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    value={feedback.email}
                    onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                    className="w-full rounded-2xl border-transparent bg-white px-5 py-3 text-sm font-semibold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800"
                    required
                  />
                </div>
                <div className="relative lg:col-span-1">
                  <input
                    placeholder="Your Message"
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    className="w-full rounded-2xl border-transparent bg-white px-5 py-3 text-sm font-semibold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 mb-10 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Qurbani Elite Marketplace. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Cookies', 'Security', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
