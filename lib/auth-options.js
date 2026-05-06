import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { verifyPassword } from '@/lib/auth-password'

const defaultCoverURL = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password')

        if (!user) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.photoURL
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV !== 'production',
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user?.email?.toLowerCase() || profile?.email?.toLowerCase()
        if (!email) {
          console.warn('Google sign-in missing email address')
          return false
        }

        await connectDB()

        let existingUser = await User.findOne({ email })

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name || profile?.name || 'Google User',
            email,
            googleId: profile?.sub || null,
            provider: 'google',
            photoURL: user.image || profile?.picture || null,
            gmail: email,
            coverURL: defaultCoverURL
          })
        } else {
          // Update existing user with latest Google info
          if (!existingUser.googleId && profile?.sub) existingUser.googleId = profile.sub
          if (!existingUser.photoURL && (user.image || profile?.picture)) existingUser.photoURL = user.image || profile.picture
          if (!existingUser.gmail) existingUser.gmail = email
          existingUser.provider = 'google'
          await existingUser.save()
        }
      }

      return true
    },
    async jwt({ token, user, account, profile }) {
      // Always look up user by email to ensure token.id is set correctly
      if (user?.email || token?.email) {
        try {
          await connectDB()
          const email = (user?.email || token?.email)?.toLowerCase()
          const dbUser = await User.findOne({ email })
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.email = dbUser.email
            token.name = dbUser.name
            token.picture = dbUser.photoURL
          }
        } catch (error) {
          console.error('JWT callback database error:', error)
        }
      }

      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }

      if (profile) {
        token.name = profile.name || token.name
        token.email = profile.email || token.email
        token.picture = profile.picture || token.picture
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id || token.sub,
        name: token.name,
        email: token.email,
        image: token.picture
      }
      session.accessToken = token.accessToken
      session.provider = token.provider
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/my-profile`
    }
  }
}
