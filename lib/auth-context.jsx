'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

const AuthContext = createContext(undefined)

async function fetchProfile() {
  const response = await fetch('/api/profile', {
    cache: 'no-store',
    credentials: 'include'
  })

  const text = await response.text()
  
  if (!response.ok) {
    try {
      const errorData = JSON.parse(text)
      throw new Error(errorData.error || 'Unable to load user profile')
    } catch (e) {
      throw new Error(text || 'Unable to load user profile')
    }
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error('Invalid JSON response from server')
  }
}

function AuthProviderInner({ children }) {
  const session = authClient.useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      // 1. If session is still loading, wait
      if (session?.isPending) return

      // 2. If no session data, user is definitely logged out
      if (!session?.data) {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      // 3. Attempt to fetch extended profile from our API
      try {
        const profile = await fetchProfile()
        if (mounted && profile.success) {
          setUser(profile.data)
        }
      } catch (error) {
        // 4. Handle Unauthorized gracefully without console error spam
        if (error.message.includes('Unauthorized')) {
          if (mounted) {
            setUser(null)
          }
        } else {
          console.error('Profile Load Error:', error)
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
  }, [session.data, session.isPending])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await authClient.api.signInEmail({
        email,
        password
      })

      if (!result?.user) {
        throw new Error(result.error?.message || 'Login failed')
      }

      const profile = await fetchProfile()
      if (profile.success) {
        setUser(profile.data)
      }
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
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        phone
      })

      if (result.error) {
        throw new Error(result.error.message || 'Registration failed')
      }

      return { ok: true, user: result.user }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (callbackUrl = `${window.location.origin}/my-profile`) => {
    setLoading(true)
    try {
      const response = await authClient.api.signInSocial({
        provider: 'google',
        callbackURL: callbackUrl,
        disableRedirect: false
      })

      if (response?.url) {
        window.location.href = response.url
      } else {
        throw new Error('Google login failed')
      }
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
      await authClient.signOut()
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
      if (result.success) {
        setUser(result.data)
        return result.data
      }
      throw new Error(result.error || 'Update failed')
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
    <AuthProviderInner>
      {children}
    </AuthProviderInner>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

