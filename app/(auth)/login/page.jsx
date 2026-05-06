'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, PawPrint, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [redirect, setRedirect] = useState('/my-profile')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setTimeout(() => {
      setRedirect(params.get('redirect') || '/my-profile')
    }, 0)
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password.')
      return
    }
    
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.ok) {
        toast.success('Welcome back!')
        setTimeout(() => {
          router.push(redirect)
        }, 500)
      } else {
        const errorMessage = result?.error || 'Invalid email or password.'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signIn('google', { 
        callbackUrl: '/my-profile',
        redirect: true
      })
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass rounded-[48px] shadow-2xl shadow-primary/5 p-10 lg:p-12 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 blur-3xl" />
          
          <div className="text-center mb-12 relative z-10">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="inline-flex p-4 bg-primary rounded-2xl mb-6 shadow-xl shadow-primary/30"
            >
              <PawPrint className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground font-bold">Access your Qurbani Marketplace account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-xs font-black text-foreground/60 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="email"
                  className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-foreground/60 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs font-black text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  required
                  type="password"
                  className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-bold text-foreground shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 hover:-translate-y-1"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-12 relative z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="px-4 bg-transparent text-muted-foreground/60">Or connect with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 glass border-primary/10 text-foreground rounded-2xl font-black text-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-4 hover:-translate-y-1"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6" alt="Google" />
            Google Account
          </button>

          <p className="mt-12 text-center text-muted-foreground font-bold relative z-10">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
              Create one now
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

