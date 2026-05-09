import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

function mapOrder(order) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    animalId: order.animalId,
    animalName: order.animalName,
    animalImage: order.animalImage,
    animalPrice: order.animalPrice,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    preferredDate: order.preferredDate,
    additionalInfo: order.additionalInfo,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }
}

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    console.log('Bookings API: Session found:', !!session?.user, session?.user?.id)

    if (!session?.user?.id) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    console.log('Bookings API: DB connected')

    const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean()
    return Response.json({ success: true, data: orders.map(mapOrder) })
  } catch (error) {
    console.error('Bookings GET error:', error)
    return Response.json({ success: false, error: error.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      animalId,
      animalName,
      animalImage,
      animalPrice,
      name,
      email,
      phone,
      address,
      preferredDate,
      additionalInfo,
      paymentMethod
    } = body

    if (
      !animalId ||
      !animalName ||
      !animalImage ||
      !animalPrice ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !preferredDate
    ) {
      return Response.json(
        { success: false, error: 'All booking fields are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const order = await Order.create({
      user: session.user.id,
      orderNumber: `QUR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      animalId,
      animalName,
      animalImage,
      animalPrice,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      preferredDate: preferredDate.trim(),
      additionalInfo: additionalInfo?.trim() || '',
      paymentMethod: paymentMethod || 'pay_later',
      paymentStatus: 'pending'
    })

    return Response.json({ success: true, data: mapOrder(order) }, { status: 201 })
  } catch (error) {
    console.error('Bookings POST error:', error)
    return Response.json({ success: false, error: 'Booking failed' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, action } = body

    if (!orderId || action !== 'cancel') {
      return Response.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    await connectDB()

    const order = await Order.findOne({ _id: orderId, user: session.user.id })
    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'Cancelled') {
      return Response.json({ success: false, error: 'Order is already cancelled' }, { status: 400 })
    }

    order.status = 'Cancelled'
    order.paymentStatus = 'failed'
    await order.save()

    return Response.json({ success: true, data: mapOrder(order) })
  } catch (error) {
    console.error('Bookings PATCH error:', error)
    return Response.json({ success: false, error: 'Action failed' }, { status: 500 })
  }
}
