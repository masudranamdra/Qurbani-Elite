'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, UserPlus, PawPrint, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.phone, formData.password)
      
      toast.success('Account created successfully! Logging you in...')
      
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (loginResult?.ok) {
        setTimeout(() => {
          router.push('/my-profile')
        }, 500)
      } else {
        toast.success('Registration successful! Please login now.')
        router.push('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    try {
      const callbackUrl = `${window.location.origin}/my-profile`
      await signIn('google', {
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error('Google registration error:', error)
      toast.error('Google registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full -z-10">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass rounded-[48px] shadow-2xl shadow-primary/5 p-10 lg:p-12 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 -ml-16 -mt-16 blur-3xl" />
          
          <div className="text-center mb-12 relative z-10">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="inline-flex p-4 bg-primary rounded-2xl mb-6 shadow-xl shadow-primary/30"
            >
              <PawPrint className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Join Us</h1>
            <p className="text-muted-foreground font-bold">Create your account to start booking livestock</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <label className="text-xs font-black text-foreground/60 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="text"
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-foreground/60 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="email"
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-foreground/60 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="tel"
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="+880 1XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-foreground/60 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="password"
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 mt-6 hover:-translate-y-1"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-6 w-6" />
                  Create Account
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-12 text-center text-muted-foreground font-bold relative z-10">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>

        </div>
        
        <Link href="/" className="flex items-center justify-center gap-2 mt-10 text-muted-foreground hover:text-primary font-black transition-all group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  )
}

