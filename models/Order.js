import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    animalId: {
      type: String,
      required: true
    },
    animalName: {
      type: String,
      required: true
    },
    animalImage: {
      type: String,
      required: true
    },
    animalPrice: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: String,
      required: true
    },
    additionalInfo: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending Verification', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending Verification'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'bank_transfer', 'pay_later'],
      default: 'pay_later'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
