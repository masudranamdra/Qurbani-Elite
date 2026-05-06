'use client'

import Link from 'next/link'
import { PawPrint, Mail, Phone, MapPin, Globe, Send } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

// Custom Brand Icons since Lucide v1 removed them
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
  const [feedback, setFeedback] = useState({ name: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Thank you for your feedback!')
    setFeedback({ name: '', message: '' })
    setLoading(false)
  }

  const socialLinks = [
    { Icon: FacebookIcon, href: '#' },
    { Icon: TwitterIcon, href: '#' },
    { Icon: InstagramIcon, href: '#' },
    { Icon: Globe, href: '#' },
  ]

  return (
    <footer className="bg-secondary text-slate-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                QurbaniMarket
              </span>
            </Link>
            <p className="text-base leading-relaxed text-slate-400">
              We provide the healthiest and best-bred livestock for your sacred Qurbani.
              Connecting farmers directly with buyers with transparency and trust since 2018.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-3 bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-lg"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-8">Navigation</h3>
            <ul className="space-y-4 text-base">
              {['Home', 'Browse Animals', 'Verified Farms', 'Market Trends'].map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="h-1 w-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8">Support</h3>
            <ul className="space-y-4 text-base">
              {['FAQs', 'Qurbani Tips', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="h-1 w-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-8">Get in Touch</h3>
              <ul className="space-y-6 text-base">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span>Dinajpur, Chirirbandar,<br />6NO Basudebpur</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>01877080660</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <a href="mailto:masud.dev01@gmail.com" className="hover:text-primary transition-colors">
                    masud.dev01@gmail.com
                  </a>
                </li>
              </ul>
            </div>     
          </div>
        </div>


            <div className="mt-16 md:mt-20 lg:mt-24 bg-white/5 p-8 rounded-lg shadow-lg">
              <h3 className="text-white font-bold text-lg mb-6">Send Feedback</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 md:flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                  value={feedback.name}
                  onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-primary focus:outline-none transition-colors resize-none"
                  value={feedback.message}
                  onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-0 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="w-4 h-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </button>
              </form>
            </div>

        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Qurbani Livestock Marketplace. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

