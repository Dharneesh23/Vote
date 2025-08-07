@echo off
title Modern Voting System - Automated Deployment
color 0B

echo.
echo  ====================================================
echo  🚀 MODERN VOTING SYSTEM - AUTOMATED DEPLOYMENT
echo  ====================================================
echo.

echo  📦 Step 1: Checking project files...
if not exist "package.json" (
    echo  ❌ Error: package.json not found
    echo  Please run this script from your Vote directory
    pause
    exit /b 1
)

if not exist "server.js" (
    echo  ❌ Error: server.js not found
    echo  Please run this script from your Vote directory
    pause
    exit /b 1
)

echo  ✅ Project files detected successfully!
echo.

echo  📤 Step 2: GitHub Repository Setup
echo  ====================================
echo.
echo  Please follow these steps:
echo  1. Open: https://github.com/new
echo  2. Repository name: modern-voting-system
echo  3. Description: Modern Online Voting System with React + Node.js
echo  4. Set to PUBLIC (required for free hosting)
echo  5. Do NOT initialize with README
echo  6. Click 'Create Repository'
echo.

set /p github_username="Enter your GitHub username: "
set repo_url=https://github.com/%github_username%/modern-voting-system.git

echo.
echo  ⏸️  Press any key after creating the repository...
pause > nul

echo.
echo  📤 Step 3: Pushing to GitHub...
echo  ================================

git branch -M main
git remote add origin %repo_url%
git push -u origin main

if errorlevel 1 (
    echo  ❌ Failed to push to GitHub
    echo  Please run these commands manually:
    echo  git remote add origin %repo_url%
    echo  git branch -M main
    echo  git push -u origin main
    pause
    exit /b 1
)

echo  ✅ Successfully pushed to GitHub!
echo.

echo  🌐 Step 4: FREE HOSTING OPTIONS
echo  ================================
echo.
echo  🔷 OPTION 1: RAILWAY (RECOMMENDED)
echo  -----------------------------------
echo  1. Go to: https://railway.app
echo  2. Sign up with GitHub
echo  3. Click 'Start a New Project'
echo  4. Select 'Deploy from GitHub repo'
echo  5. Choose: %github_username%/modern-voting-system
echo  6. Railway will auto-deploy!
echo  📱 Live URL: https://[name].up.railway.app
echo.
echo  🔷 OPTION 2: RENDER
echo  --------------------
echo  1. Go to: https://render.com
echo  2. Sign up and click 'New +' → 'Web Service'
echo  3. Connect GitHub: %github_username%/modern-voting-system
echo  4. Settings:
echo     - Name: voting-system
echo     - Environment: Node
echo     - Build: npm install
echo     - Start: npm start
echo  📱 Live URL: https://voting-system-xyz.onrender.com
echo.
echo  🔷 OPTION 3: VERCEL (Frontend Only)
echo  ------------------------------------
echo  1. Go to: https://vercel.com
echo  2. Import GitHub repo
echo  3. Root Directory: client
echo  4. Deploy!
echo  📱 Live URL: https://modern-voting-system.vercel.app
echo.

echo  📋 DEPLOYMENT SUMMARY
echo  =====================
echo  ✅ Project ready and pushed to GitHub
echo  ✅ Repository: %repo_url%
echo  🌐 Choose any hosting option above
echo.
echo  🎯 RECOMMENDED: Use RAILWAY for easiest deployment!
echo.

set /p open_railway="Open Railway deployment page? (y/n): "
if /i "%open_railway%"=="y" (
    start https://railway.app
    start %repo_url%
)

echo.
echo  🎉 DEPLOYMENT READY!
echo  Your voting system is ready to go live! 🚀
echo.
echo  📱 Login credentials for your live site:
echo  Admin: admin / admin123
echo  Users: user1-user20 / password123
echo.
pause
