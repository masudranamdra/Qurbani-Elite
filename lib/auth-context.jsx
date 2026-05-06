'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { signIn, signOut, useSession, SessionProvider } from 'next-auth/react'

const AuthContext = createContext(undefined)

async function fetchProfile() {
  const response = await fetch('/api/profile', {
    cache: 'no-store',
    credentials: 'include'
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Unable to load user profile')
  }
  return response.json()
}

function AuthProviderInner({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      if (status === 'loading') {
        setLoading(true)
        return
      }

      if (!session?.user) {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const profile = await fetchProfile()
        if (mounted) {
          setUser(profile.user)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()
    return () => {
      mounted = false
    }
  }, [session, status])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (!result?.ok) {
        throw new Error(result?.error || 'Login failed')
      }

      const profile = await fetchProfile()
      setUser(profile.user)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, phone, password) => {
    setLoading(true)
    try {
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
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (callbackUrl = `${window.location.origin}/my-profile`) => {
    setLoading(true)
    try {
      await signIn('google', {
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data) => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Could not update profile')
      }

      const result = await response.json()
      setUser(result.user)
      return result.user
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

