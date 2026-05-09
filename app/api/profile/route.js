import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

function sanitizeUser(user) {
  if (!user) return null
  const { _id, password, __v, createdAt, updatedAt, ...rest } = user
  return {
    id: _id?.toString() || '',
    ...rest
  }
}

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get('cookie')
    console.log('Profile API: Cookie header present:', !!cookieHeader)

    if (!cookieHeader) {
      console.log('Profile API: No cookies found in headers. Returning 401.')
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const session = await auth.api.getSession({
      headers: await headers()
    })

    console.log('Profile API: Better Auth Session check:', !!session?.user)

    if (!session?.user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const userId = session.user.id
    const user = await User.findById(userId).lean()

    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    console.error('Profile GET error:', error)
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, nickname, address, home, photoURL, coverURL, gmail } = body

    if (!name?.trim() || !phone?.trim() || !gmail?.trim()) {
      return Response.json(
        { success: false, error: 'Name, email and phone are required.' },
        { status: 400 }
      )
    }

    await connectDB()

    const userId = session.user.id
    const user = await User.findById(userId)

    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    user.name = name.trim()
    user.phone = phone.trim()
    user.gmail = gmail.trim().toLowerCase()
    user.nickname = nickname?.trim() || ''
    user.address = address?.trim() || ''
    user.home = home?.trim() || ''
    user.photoURL = photoURL?.trim() || user.photoURL || user.image
    user.image = user.photoURL // Keep Better Auth's image field in sync
    user.coverURL = coverURL?.trim() || user.coverURL

    await user.save()

    return Response.json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return Response.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
