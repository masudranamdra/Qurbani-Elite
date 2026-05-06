import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    return Response.json({ 
      message: 'MongoDB Connected Successfully',
      status: 'connected'
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return Response.json(
      { 
        message: 'MongoDB Connection Failed',
        error: error.message,
        status: 'failed'
      },
      { status: 500 }
    )
  }
}
