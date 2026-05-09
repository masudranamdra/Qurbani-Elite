'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, UserPlus, PawPrint, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function RegisterPage() {
  const router = useRouter()
  const session = authClient.useSession()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.data) {
      router.replace('/my-profile')
    }
  }, [session, router])

  if (session?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <LoadingSpinner />
      </div>
    )
  }

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
      const { name, email, phone, password } = formData
      const result = await register(name, email, phone, password)

      if (result.ok) {
        toast.success('Account created successfully! Logging you in...')
        
        // Better Auth signup often logs the user in automatically or we sign them in
        const loginResult = await authClient.api.signInEmail({
          email,
          password
        })

        if (loginResult?.user) {
          router.push('/my-profile')
        } else {
          router.push('/login')
        }
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
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/my-profile`
      })
    } catch (error) {
      console.error('Google registration error:', error)
      toast.error('Google registration failed. Please try again.')
    } finally {
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
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
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

