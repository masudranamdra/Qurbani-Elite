🐄 Qurbani Livestock Marketplace

A modern, scalable, and production-ready livestock marketplace built with Next.js (App Router). This platform enables users to seamlessly browse, compare, and book premium livestock (cows, goats) for the sacred occasion of Qurbani.

🌟 Overview

Qurbani Livestock Marketplace is designed to simplify the traditional livestock purchasing process through a clean digital experience. It bridges the gap between sellers and buyers by offering a responsive, intuitive, and feature-rich platform.

✨ Core Features
🐐 Animal Marketplace
Browse a curated collection of livestock with:
High-resolution images
Detailed descriptions
Transparent pricing
Optimized grid layout for fast scanning and selection
🔍 Smart Filtering & Sorting
Sort livestock by:
Price (Low → High)
Price (High → Low)
Quickly find animals within your budget
📅 Booking System
Authenticated users can:
Place booking requests
Select preferred livestock
Real-time UI feedback with toast notifications
🔐 Authentication System
Email & Password login
Google OAuth login (simulated or integrated)
Persistent authentication state
👤 User Profile Management
View user information
Update profile details
Personalized user experience
🎨 Premium UI/UX
Fully responsive (Mobile, Tablet, Desktop)
Smooth animations powered by Framer Motion
Clean and modern design system
Interactive toast notifications
Custom 404 page experience
🧱 Tech Stack
Category	Technology
Framework	Next.js 14+ (App Router)
Styling	Tailwind CSS
Icons	Lucide React
Animations	Framer Motion
Notifications	React Hot Toast
State Management	React Context API & Hooks
Language	JavaScript / TypeScript (optional)
📁 Project Structure
├── app/                # App Router pages & layouts
│   ├── (public)/       # Public routes
│   ├── (auth)/         # Authentication routes
│   ├── (protected)/    # Protected user routes
│
├── components/         # Reusable UI components
│   ├── shared/
│   ├── home/
│   ├── animals/
│   ├── booking/
│
├── data/               # Static JSON data (animals)
├── hooks/              # Custom React hooks
├── lib/                # Utilities & context providers
├── public/             # Static assets
└── styles/             # Global styles
⚙️ Getting Started
1️⃣ Clone the Repository
Not Use
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create a .env.local file and configure:

NEXT_PUBLIC_APP_URL=http://localhost:3000

(Add authentication & database configs if integrated)

4️⃣ Run Development Server
npm run dev
5️⃣ Open in Browser
http://localhost:3000
🚀 Deployment

This application is optimized for deployment on:

Vercel (Recommended)
Netlify
Any Node.js hosting platform
Deploy on Vercel
npm run build

Then connect your GitHub repository to Vercel and deploy instantly.

🔒 Future Enhancements
🔗 Real backend integration (MongoDB / PostgreSQL)
💳 Online payment gateway integration
📦 Order tracking system
🧑‍🌾 Seller dashboard
📊 Admin panel with analytics
🌐 Multi-language support
📸 Screenshots (Optional)

Add your UI screenshots here for better presentation

🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Make your changes
Submit a pull request
📄 License

This project is licensed under the Programming Hero Community License.

💡 Author

MD. Masud Rana
Frontend Developer | Next.js Enthusiast

❤️ Acknowledgement

Built with dedication to enhance the Qurbani experience through technology.










# 🔐 Secure Authentication System (MongoDB + NextAuth + Bcrypt)

## 📌 Overview

This project implements a **production-ready authentication system** using:

* **MongoDB** → Persistent user database
* **Bcrypt** → Secure password hashing
* **NextAuth** → Authentication & session management

---

## 🚨 Problem (Before)

The previous authentication system was **critically vulnerable**:

* ❌ Accepted **any email + any password**
* ❌ No password validation
* ❌ Used `localStorage` (insecure)
* ❌ No database

### Example (Insecure)

```javascript
const login = async (email, _password) => {
  const newUser = { name: 'User', email }
  setUser(newUser) // Login succeeds with ANY password!
}
```

---

## ✅ Solution (After)

### 🔐 Secure Flow

1. User enters email & password
2. Server checks MongoDB
3. Password verified with bcrypt
4. If valid → session created
5. If invalid → error returned

---

## 🏗️ Architecture

```
Client (React)
   ↓
NextAuth (Server)
   ↓
API Routes (Validation)
   ↓
MongoDB (Database)
```

---

## 🔑 Key Features

* ✅ Bcrypt password hashing (10-round salt)
* ✅ MongoDB database storage
* ✅ Secure login with NextAuth
* ✅ JWT session (httpOnly cookies)
* ✅ Email uniqueness validation
* ✅ Server-side authentication
* ✅ Generic error messages (no hacking clues)

---

## 📁 Important Files

### New Files

* `lib/mongodb.js` → Database connection
* `lib/auth-password.js` → Password hashing
* `app/api/auth/register/route.js` → Registration API

### Updated Files

* `app/api/auth/[...nextauth]/route.js`
* `app/(auth)/login/page.jsx`
* `app/(auth)/register/page.jsx`

---

## 🔄 Authentication Flow

### Login

```
User → Login Form
   ↓
NextAuth authorize()
   ↓
MongoDB lookup
   ↓
bcrypt compare
   ↓
✔ Success → Session created
❌ Fail → Error shown
```

### Registration

```
User → Register Form
   ↓
Validate input
   ↓
Hash password (bcrypt)
   ↓
Store in MongoDB
   ↓
Auto login
```

---

## ⚙️ Setup Guide

### 1. Install Dependencies

```bash
npm install bcryptjs mongodb
```

---

### 2. Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

MONGODB_URI=mongodb://localhost:27017/your-db
```

---

### 3. Run Project

```bash
npm run dev
```

---

## 🧪 Testing

### ✅ Valid Login

* Correct email + password → Success

### ❌ Invalid Login

* Wrong password → Error
* Fake email → Error

---

## 🔐 Security Checklist

* ✅ Password hashing (bcrypt)
* ✅ No plaintext passwords
* ✅ MongoDB storage
* ✅ Server-side validation
* ✅ Secure session handling
* ✅ Generic error messages

---

## 📊 Before vs After

| Feature        | Before         | After     |
| -------------- | -------------- | --------- |
| Password Check | ❌ None         | ✅ Bcrypt  |
| Storage        | ❌ localStorage | ✅ MongoDB |
| Security       | 🚨 Broken      | 🟢 Secure |
| Authentication | ❌ Fake         | ✅ Real    |

---

## 🚀 Production Checklist

Before deployment:

* Set strong `NEXTAUTH_SECRET`
* Use MongoDB Atlas
* Enable HTTPS
* Add rate limiting
* Enable backups

---

## ⚠️ Notes

* Bcrypt takes **1–2 seconds** → This is normal (security feature)
* Never store plain passwords
* Always validate on server-side

---

## 🎯 Final Status

🟢 **Authentication system is now secure and production-ready**

---
