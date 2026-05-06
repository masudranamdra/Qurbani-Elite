import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const usersFilePath = path.join(process.cwd(), 'data', 'users.json')

// Ensure users.json exists
function ensureUsersFile() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2))
  }
}

// Read users from file
function readUsers() {
  ensureUsersFile()
  const data = fs.readFileSync(usersFilePath, 'utf-8')
  return JSON.parse(data).users || []
}

// Write users to file
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2))
}

// Find user by email
export function findUserByEmail(email) {
  const users = readUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Hash password securely
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password with hash
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' }
  }
  return { valid: true }
}

// Create new user (registration)
export async function createUser(email, password, name, phone) {
  // Validation
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format')
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message)
  }

  // Check if user exists
  const existingUser = findUserByEmail(email)
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user object
  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    phone: phone || '',
    hashedPassword,
    photoURL: `https://i.pravatar.cc/150?u=${email}`,
    provider: 'local',
    createdAt: new Date().toISOString(),
    coverURL: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200',
    nickname: '',
    address: '',
    home: '',
    gmail: email
  }

  // Save to file
  const users = readUsers()
  users.push(newUser)
  writeUsers(users)

  // Return user without password hash
  const { hashedPassword: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Authenticate user (login)
export async function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const user = findUserByEmail(email)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.hashedPassword)
  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  // Return user without password hash
  const { hashedPassword: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Get user by email (for NextAuth)
export async function getUserForSession(email) {
  const user = findUserByEmail(email)
  if (!user) return null
  
  const { hashedPassword: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
