# 🍃 MongoDB Setup Guide for LifeSaver

## ⚠️ Important: MongoDB is Required

The LifeSaver application requires MongoDB to store emergency contact information. Without it, you'll see connection errors when submitting forms.

---

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED** ✅

**Easiest and fastest option - No installation needed!**

#### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account (use Google/GitHub for quick signup)
4. Create a **FREE** cluster:
   - Choose "M0 Sandbox" (FREE forever)
   - Select a region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

5. **Set up database access:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `lifesaver` (or your choice)
   - Password: Generate a secure password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

6. **Set up network access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

7. **Get connection string:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://lifesaver:<password>@cluster0.xxxxx.mongodb.net/
     ```
   - Replace `<password>` with your actual password

8. **Update backend `.env` file:**
   ```bash
   cd C:\Users\golde\Documents\LifeSaver-Fullstack\backend
   notepad .env
   ```
   
   Change the MONGO_URL line to:
   ```
   MONGO_URL="mongodb+srv://lifesaver:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lifesaver_db?retryWrites=true&w=majority"
   ```

9. **Restart backend:**
   ```powershell
   # Stop python processes
   Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
   
   # Start backend
   cd C:\Users\golde\Documents\LifeSaver-Fullstack\backend
   python start.py
   ```

10. **Test it!**
    - Go to http://localhost:3000
    - Fill and submit the form
    - Should work! ✅

---

### Option 2: Local MongoDB Installation

**For development without internet dependency**

#### Windows Installation:

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Version: MongoDB Community Server (latest)
   - OS: Windows
   - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important**: Check "Install MongoDB as a Service"
   - **Important**: Check "Install MongoDB Compass" (GUI tool)
   - Click "Install"

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Should show: Status = Running
   ```

4. **Start MongoDB (if not running):**
   ```powershell
   net start MongoDB
   ```

5. **Verify Connection:**
   ```powershell
   # Test connection
   mongosh
   
   # You should see MongoDB shell
   # Type: exit
   ```

6. **Your backend is already configured for local MongoDB:**
   ```
   MONGO_URL="mongodb://localhost:27017"
   ```

7. **Restart backend and test:**
   ```powershell
   cd C:\Users\golde\Documents\LifeSaver-Fullstack\backend
   python start.py
   ```

---

## 🧪 Test Your MongoDB Connection

### Method 1: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017` (local) or your Atlas string
3. Click "Connect"
4. You should see databases listed

### Method 2: Using Backend API
1. Start backend: `python start.py`
2. Check the terminal output:
   - ✅ "Successfully connected to MongoDB!" = Working!
   - ❌ "Failed to connect to MongoDB" = Problem

### Method 3: Using API Docs
1. Open: http://localhost:8000/docs
2. Try the POST `/api/details` endpoint
3. Fill sample data and execute
4. If successful = MongoDB is working!

---

## 🔧 Troubleshooting

### Issue: "Failed to connect to MongoDB"

**For Local MongoDB:**
```powershell
# Check if service is running
Get-Service MongoDB

# Start service if stopped
net start MongoDB

# Check if port 27017 is listening
netstat -ano | findstr :27017
```

**For MongoDB Atlas:**
- Check your connection string is correct
- Password must match exactly (no < > brackets)
- Ensure IP address is whitelisted
- Check cluster is not paused (free clusters pause after inactivity)

### Issue: "Connection refused"
- **Local**: MongoDB service isn't running → `net start MongoDB`
- **Atlas**: Wrong connection string or credentials

### Issue: "Authentication failed"
- **Atlas**: Wrong username/password in connection string
- **Local**: If you set up authentication, update connection string

---

## 📊 Which Option Should I Choose?

| Feature | MongoDB Atlas (Cloud) | Local MongoDB |
|---------|----------------------|---------------|
| **Setup Time** | 5 minutes ⚡ | 10-15 minutes |
| **Installation** | None needed ✅ | Download & install |
| **Internet Required** | Yes 🌐 | No ❌ |
| **Free Tier** | 512 MB storage 💾 | Unlimited |
| **Best For** | Quick start, demos | Development, testing |
| **Automatic Backups** | Yes ✅ | No (manual) |

**Recommendation:** Start with **MongoDB Atlas** (cloud) - it's faster to set up and requires no installation!

---

## 🎯 Quick Start Summary

**Fastest way to get running:**

1. Sign up for MongoDB Atlas (5 min)
2. Create free cluster (3-5 min wait)
3. Get connection string
4. Update `backend/.env`
5. Restart backend
6. Done! ✅

---

## 📝 Current Configuration

Your backend is currently configured for:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="lifesaver_db"
```

To use MongoDB Atlas, just change the MONGO_URL!

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend starts without errors
- [ ] Terminal shows "✅ Successfully connected to MongoDB!"
- [ ] Frontend form submission works
- [ ] Data appears in MongoDB (use Compass to check)
- [ ] PDF download works

---

**Need Help?** 
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/getting-started/
- MongoDB Installation: https://docs.mongodb.com/manual/installation/

---

Made with ❤️ for LifeSaver Development
