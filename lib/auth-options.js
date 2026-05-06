import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { verifyPassword } from '@/lib/auth-password'

const defaultCoverURL = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200'

export const authOptions = {
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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        if (!user?.email) {
          return false
        }

        await connectDB()

        const email = user.email.toLowerCase()
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
          if (!existingUser.googleId && profile?.sub) {
            existingUser.googleId = profile.sub
          }
          if (!existingUser.photoURL && (user.image || profile?.picture)) {
            existingUser.photoURL = user.image || profile.picture
          }
          if (!existingUser.gmail) {
            existingUser.gmail = email
          }
          await existingUser.save()
        }

        user.id = existingUser._id.toString()
      }

      return true
    },
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }

      if (profile) {
        token.name = profile.name
        token.email = profile.email
        token.picture = profile.picture
      }

      if (user?.id) {
        token.sub = user.id
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub
      if (token.picture) {
        session.user.image = token.picture
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/my-profile`
    }
  }
}
