'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { signIn, useSession, SessionProvider } from 'next-auth/react'

const AuthContext = createContext(undefined)

// Inner component that uses useSession hook
function AuthProviderInner({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  // Sync NextAuth session with auth context
  useEffect(() => {
    if (session?.user) {
      const nextAuthUser = {
        id: session.user.id,
        name: session.user.name || 'User',
        email: session.user.email,
        photoURL: session.user.image || 'https://i.pravatar.cc/150?u=' + session.user.email,
        coverURL: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200',
        nickname: '',
        address: '',
        home: '',
        phone: '',
        gmail: session.user.email,
        provider: session.user.provider || 'unknown'
      }
      setUser(nextAuthUser)
      localStorage.setItem('qurbani_user', JSON.stringify(nextAuthUser))
      setLoading(false)
    } else if (status === 'unauthenticated') {
      setUser(null)
      localStorage.removeItem('qurbani_user')
      setLoading(false)
    }
  }, [session, status])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Use NextAuth CredentialsProvider for secure validation
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (!result?.ok) {
        throw new Error(result?.error || 'Login failed')
      }

      return result
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const register = async (name, email, phone, password) => {
    setLoading(true)
    try {
      // Call registration API with validation
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      return { ok: true }
    } catch (error) {
      setLoading(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (callbackUrl = '/my-profile') => {
    setLoading(true)
    try {
      const result = await signIn('google', { callbackUrl, redirect: false })
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('qurbani_user')
  }

  const updateProfile = async (data) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (user) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem('qurbani_user', JSON.stringify(updatedUser))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// Outer component that provides SessionProvider
export function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

