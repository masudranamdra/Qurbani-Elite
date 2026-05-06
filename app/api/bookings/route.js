import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

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

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean()
  return Response.json({ orders: orders.map(mapOrder) })
}

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
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
      { error: 'All booking fields are required' },
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

  return Response.json({ order: mapOrder(order) }, { status: 201 })
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { orderId, action } = body

  if (!orderId || action !== 'cancel') {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  await connectDB()

  const order = await Order.findOne({ _id: orderId, user: session.user.id })
  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status === 'Cancelled') {
    return Response.json({ error: 'Order is already cancelled' }, { status: 400 })
  }

  order.status = 'Cancelled'
  order.paymentStatus = 'failed'
  await order.save()

  return Response.json({ order: mapOrder(order) })
}
