import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    phone: {
      type: String,
      default: ''
    },
    gmail: {
      type: String,
      default: ''
    },
    photoURL: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    coverURL: {
      type: String,
      default: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200'
    },
    nickname: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    home: {
      type: String,
      default: ''
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials'
    },
    googleId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
)

// Sync photoURL and image fields
UserSchema.pre('save', function(next) {
  if (this.image && !this.photoURL) {
    this.photoURL = this.image;
  } else if (this.photoURL && !this.image) {
    this.image = this.photoURL;
  }
  next();
});

// Index on email for fast lookups
UserSchema.index({ email: 1 }, { unique: true })

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', UserSchema, 'user')
