# 🚀 START SERVERS - Step-by-Step Guide

## The Problem
Your Next.js app is running, but it can't connect to the MongoDB backend because the backend server is NOT running yet. You need BOTH servers running.

## Solution: Start Both Servers

### ✅ Step 1: Start MongoDB Backend (FIRST!)

**Open a NEW PowerShell terminal** and run:

```powershell
cd "C:\Users\G00414989@atu.ie\OneDrive - Atlantic TU\Full Stack Engineering\Week11Lab2\Week11Lab2\node\microservices"
npm start
```

**Expected output:**
```
> microservices@0.0.0 start
> node ./bin/www
```

✅ **Leave this terminal running!** (Don't close it)

The backend should now be running on: `http://localhost:8000`

---

### ✅ Step 2: Check Next.js Frontend (Already Running)

Your Next.js app is already running on: `http://localhost:3000`

If it's NOT running, open another PowerShell terminal:

```powershell
cd "C:\Users\G00414989@atu.ie\OneDrive - Atlantic TU\Full Stack Engineering\Week11Lab2\Week11Lab2\next\fullStackWeek11lab2"
npm run dev
```

---

### ✅ Step 3: Test the Connection

1. Go to your browser: `http://localhost:3000`
2. Try to add a new meetup:
   - Click "Add New" in the navigation
   - Fill in the form
   - Click "Add Meetup"
3. You should see a success notification!

---

## 🔍 Troubleshooting

### Problem: Backend won't start

**Error: "EADDRINUSE - Port 8000 is already in use"**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Then try starting the backend again
```

---

### Problem: MongoDB not connected

**Error: "Could not connect to MongoDB"**

1. **Check if MongoDB is installed:**
   ```powershell
   mongod --version
   ```

2. **Start MongoDB service:**
   ```powershell
   # Option 1: As a service
   net start MongoDB

   # Option 2: Manual start
   mongod --dbpath "C:\data\db"
   ```

3. **Or install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation wizard
   - Make sure to install as a service

---

### Problem: "Module not found" errors

```powershell
# In the backend directory
cd "C:\Users\G00414989@atu.ie\OneDrive - Atlantic TU\Full Stack Engineering\Week11Lab2\Week11Lab2\node\microservices"
npm install

# In the frontend directory
cd "C:\Users\G00414989@atu.ie\OneDrive - Atlantic TU\Full Stack Engineering\Week11Lab2\Week11Lab2\next\fullStackWeek11lab2"
npm install
```

---

## ✅ Quick Status Check

Run this to see if servers are running:

```powershell
# Check if port 8000 is listening (backend)
netstat -ano | findstr :8000

# Check if port 3000 is listening (frontend)
netstat -ano | findstr :3000
```

If you see output for both ports, both servers are running! ✅

---

## 📝 Summary

**You MUST have 2 terminals running:**

| Terminal | Location | Command | Port |
|----------|----------|---------|------|
| Terminal 1 | `node/microservices` | `npm start` | 8000 |
| Terminal 2 | `next/fullStackWeek11lab2` | `npm run dev` | 3000 |

**Only then will the app work!**

---

## 🎯 Once Both Are Running

Your browser should show:
- ✅ No "Could not establish connection" errors
- ✅ Meetups load from database
- ✅ Can add new meetups
- ✅ Can delete meetups
- ✅ Statistics dashboard shows data

---

## Need More Help?

If you're still having issues:

1. **Check Backend Terminal** - Look for any error messages
2. **Check Browser Console** (F12) - Look for network errors
3. **Check MongoDB** - Make sure it's running
4. **Restart Both Servers** - Sometimes a fresh start helps

Good luck! 🚀
