import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { verifyPassword } from '@/lib/auth-password'

const handler = NextAuth({
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

        try {
          // Connect to database
          await connectDB()

          // Find user in MongoDB with Mongoose
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password')
          
          if (!user) {
            throw new Error('Invalid email or password')
          }

          // Verify password with bcrypt
          const isPasswordValid = await verifyPassword(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Invalid email or password')
          }

          // Return user object without sensitive data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.photoURL
          }
        } catch (error) {
          console.error('Credentials authorization error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.name = profile.name
        token.email = profile.email
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/my-profile`
    },
  },
})

export { handler as GET, handler as POST }
