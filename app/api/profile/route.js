import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

function sanitizeUser(user) {
  const { _id, password, __v, createdAt, updatedAt, ...rest } = user
  return {
    id: _id.toString(),
    ...rest
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const userId = session.user.id || null
  const userEmail = session.user.email || null
  const user = userId
    ? await User.findById(userId).lean()
    : userEmail
      ? await User.findOne({ email: userEmail.toLowerCase() }).lean()
      : null

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({ user: sanitizeUser(user) })
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, nickname, address, home, photoURL, coverURL, gmail } = body

  if (!name?.trim() || !phone?.trim() || !gmail?.trim() || !photoURL?.trim() || !coverURL?.trim()) {
    return Response.json(
      { error: 'Name, contact email, phone, profile photo and cover image are required.' },
      { status: 400 }
    )
  }

  await connectDB()

  const userId = session.user.id || null
  const userEmail = session.user.email || null
  const user = userId
    ? await User.findById(userId)
    : userEmail
      ? await User.findOne({ email: userEmail.toLowerCase() })
      : null

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  user.name = name.trim()
  user.phone = phone.trim()
  user.gmail = gmail.trim().toLowerCase()
  user.nickname = nickname?.trim() || ''
  user.address = address?.trim() || ''
  user.home = home?.trim() || ''
  user.photoURL = photoURL.trim()
  user.coverURL = coverURL.trim()

  await user.save()

  return Response.json({ user: sanitizeUser(user) })
}
