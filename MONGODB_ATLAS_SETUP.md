# 🔧 MongoDB Atlas Connection Setup

## Current Status

Your MongoDB connection string is configured in `.env.local`, but the connection is failing with an **SSL/TLS error**.

### Error
```
tlsv1 alert internal error:openssl\ssl\record\rec_layer_s3.c:916:SSL alert number 80
```

This typically means:
1. ❌ Your IP address is **NOT whitelisted** in MongoDB Atlas firewall
2. ❌ Network access rule doesn't allow your connection
3. ✅ The connection string and credentials are correct

---

## ✅ Fix: Enable Network Access in MongoDB Atlas

### Step 1: Go to MongoDB Atlas
```
1. Open: https://cloud.mongodb.com
2. Login to your account
3. Go to "Deployments" → "Clusters"
4. Click on your cluster: "Cluster0"
```

### Step 2: Configure Network Access
```
1. In the left sidebar, find "SECURITY" section
2. Click "Network Access"
3. Click the "+ ADD IP ADDRESS" button
```

### Step 3: Add Your IP Address
```
Option A: Allow Your Specific IP
- Click "ADD CURRENT IP ADDRESS"
- This adds your current computer's IP (recommended for development)

Option B: Allow All IPs (NOT RECOMMENDED for production)
- Click "EDIT"
- Change "X.X.X.X" to "0.0.0.0/0"
- Add comment: "Development - Allow all"
- ⚠️ Only use this for development, not production!

Option C: Add IP Range
- Enter: 0.0.0.0/0 for anywhere
- Or enter your company's IP range
```

### Step 4: Confirm Changes
```
1. MongoDB will show: "Network access rule added"
2. It may take 1-2 minutes to apply
3. Wait for status to show "ACTIVE"
```

---

## 🧪 Test Connection After Changes

### Option 1: Test via API Endpoint
```bash
# Wait 1-2 minutes for MongoDB to apply changes
# Then visit: http://localhost:3000/api/test/db
# 
# Should show:
# {
#   "message": "MongoDB Connected Successfully",
#   "status": "connected"
# }
```

### Option 2: Test via Registration
```bash
1. Go to: http://localhost:3000/register
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: TestPass123
3. Click "Create Account"
4. If successful:
   - ✅ User created in MongoDB Atlas
   - ✅ Auto-redirected to /my-profile
```

### Option 3: Test via Login
```bash
1. Go to: http://localhost:3000/login
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPass123
3. Click "Login"
4. If successful:
   - ✅ Password verified with bcrypt
   - ✅ Session created
   - ✅ Redirected to /my-profile
```

---

## 📋 MongoDB Atlas Checklist

- ❓ Is your cluster running? (Status should be "Active")
  ```
  Go to Clusters → Check if green checkmark visible
  ```

- ❓ Is Network Access configured?
  ```
  Go to Security → Network Access → Check if your IP listed
  ```

- ❓ Are credentials correct?
  ```
  Username: masuddev01_db_user
  Password: YahDR1GR6xV0daem
  Cluster: cluster0
  ```

- ❓ Is the connection string correct in `.env.local`?
  ```
  MONGODB_URI=mongodb+srv://masuddev01_db_user:YahDR1GR6xV0daem@cluster0.linujrc.mongodb.net/?appName=Cluster0
  ```

---

## 🔐 Security Best Practices

### ⚠️ For Development
```env
# Add all IPs (NOT SAFE for production)
0.0.0.0/0
```

### ✅ For Production
```
1. Use specific IP whitelisting
2. Use VPN/proxy for server access
3. Rotate credentials regularly
4. Enable IP access history logging
5. Use read-only credentials for app
6. Store credentials in secure vault (not .env)
```

---

## 🚨 Troubleshooting

### "Network access rule not found"
```
→ You haven't added an IP address yet
→ Go to Security → Network Access → Add IP
```

### "Connection timeout"
```
→ Wait 2-3 minutes for Atlas to apply changes
→ Try again after waiting
```

### "Authentication failed"
```
→ Check username/password in connection string
→ Go to Database → Click "Connect"
→ Copy connection string again
```

### "SSL/TLS error" (current issue)
```
→ IP address is not whitelisted
→ Go to Security → Network Access
→ Add your current IP: https://whatismyipaddress.com
```

---

## 📍 Finding Your IP Address

### If behind corporate firewall:
```
Your IP might be your company's proxy IP
Contact IT department for your outbound IP
```

### If home connection:
```
Visit: https://www.whatismyipaddress.com
Copy the IPv4 address
Add to MongoDB Atlas Network Access
```

### If VPN:
```
Connect to VPN first
Visit: https://www.whatismyipaddress.com
Add that IP to MongoDB Atlas
```

---

## ✅ Once Connected, Test All Features

### 1. Registration (Creates user with bcrypt)
```bash
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass123"
}

Expected: 201 Created
```

### 2. Login (Validates password with bcrypt)
```bash
POST /api/auth/callback/credentials
Body: {
  "email": "john@example.com",
  "password": "SecurePass123"
}

Expected: Success + Session created
```

### 3. Invalid Login (Password mismatch)
```bash
POST /api/auth/callback/credentials
Body: {
  "email": "john@example.com",
  "password": "WrongPassword"
}

Expected: 401 Unauthorized + Error message
```

### 4. MongoDB Check
```bash
GET /api/test/db

Expected: {
  "message": "MongoDB Connected Successfully",
  "status": "connected"
}
```

---

## 📊 MongoDB Atlas Cluster Info

**Current Setup:**
- Cluster: Cluster0
- Provider: Atlas
- Region: Check in Dashboard
- Tier: (Check in Dashboard)

**Database:**
- Name: qurbani-marketplace (auto-created on first insert)
- Collections: users (auto-created on first registration)

**Connection:**
- Protocol: mongodb+srv
- Auth: Yes (username/password)
- TLS/SSL: Yes (required)

---

## 🎯 Next Steps

1. ✅ Go to MongoDB Atlas Security → Network Access
2. ✅ Add your IP address (or 0.0.0.0/0 for dev)
3. ✅ Wait 1-2 minutes for changes to apply
4. ✅ Refresh dev server (or restart: npm run dev)
5. ✅ Test registration at http://localhost:3000/register
6. ✅ Test login at http://localhost:3000/login
7. ✅ Check API /api/test/db for connection status

---

## 💡 Pro Tips

- **Auto-restart dev server:** The `.next` folder will auto-rebuild when you fix MongoDB
- **Check logs:** Open http://localhost:3000 and check browser console for detailed errors
- **MongoDB Compass:** Use MongoDB Compass app to inspect data directly
- **Connection pooling:** Mongoose handles connection pooling automatically

---

## 📞 Still Having Issues?

1. ✅ Verify Network Access rule is "ACTIVE" (green checkmark)
2. ✅ Check connection string in `.env.local` matches MongoDB Atlas
3. ✅ Restart dev server after making changes
4. ✅ Wait 1-2 minutes for MongoDB to apply changes
5. ✅ Clear browser cache and cookies
6. ✅ Try incognito/private browser window

**Connection Guide:** https://docs.mongodb.com/atlas/security/add-ip-address-to-list/

---

**Status:** Once Network Access is configured, authentication will work perfectly! 🎉
