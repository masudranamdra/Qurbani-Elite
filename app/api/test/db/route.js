import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    return Response.json({ 
      success: true,
      data: {
        message: 'MongoDB Connected Successfully',
        status: 'connected'
      }
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return Response.json(
      { 
        success: false,
        error: error.message,
        data: {
          message: 'MongoDB Connection Failed',
          status: 'failed'
        }
      },
      { status: 500 }
    )
  }
}
