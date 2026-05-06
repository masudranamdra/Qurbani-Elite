import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true
      })

    cached.conn = await cached.promise
    console.log('✅ MongoDB connected successfully')
    return cached.conn
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    // Don't throw - let the app continue but auth endpoints will fail
    // This is better than crashing the entire app
    return null
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

