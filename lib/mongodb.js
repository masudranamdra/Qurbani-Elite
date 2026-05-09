import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  if (cached.conn) {
    return cached.conn
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10s
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to avoid some environment issues
      connectTimeoutMS: 10000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })

    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    console.error('❌ MongoDB connection failed:', error.message)
    throw error // Throwing ensures calling functions know it failed
  }
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
  }
}

// Helper to ensure DB is connected before operations
export async function ensureDB() {
  return connectDB()
}

