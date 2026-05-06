import { hashPassword } from '@/lib/auth-password'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, phone, password } = body

    // Validation
    if (!email || !password || !name) {
      return Response.json(
        { error: 'Missing required fields: name, email, password' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in MongoDB with Mongoose
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      photoURL: `https://i.pravatar.cc/150?u=${email}`,
      provider: 'credentials'
    })

    return Response.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return Response.json(
        { error: messages.join(', ') },
        { status: 400 }
      )
    }

    return Response.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
