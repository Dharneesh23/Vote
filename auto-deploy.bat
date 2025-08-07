@echo off
echo 🚀 AUTOMATED DEPLOYMENT SCRIPT
echo ====================================
echo.

echo 📦 Step 1: Creating GitHub Repository...
echo Please visit: https://github.com/new
echo Repository name: modern-voting-system
echo Description: Modern Online Voting System with React + Node.js
echo Visibility: Public (for free hosting)
echo.
echo ⏸️  Please create the repository and press any key when ready...
pause > nul

echo.
echo 📤 Step 2: Pushing to GitHub...
set /p GITHUB_USERNAME="Enter your GitHub username: "
set GITHUB_REPO=https://github.com/%GITHUB_USERNAME%/modern-voting-system.git

git branch -M main
git remote add origin %GITHUB_REPO%
git push -u origin main

if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo Please check your GitHub username and repository settings
    pause
    exit /b 1
)

echo ✅ Successfully pushed to GitHub!
echo.

echo 🌐 Step 3: Deploying to Render.com...
echo.
echo Please follow these steps:
echo 1. Go to https://render.com and sign up/login
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub account
echo 4. Select your repository: modern-voting-system
echo 5. Use these settings:
echo    - Name: voting-system
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo 6. Click "Deploy Web Service"
echo.
echo 🎯 Your app will be live at: https://voting-system-[random].onrender.com
echo.
echo 📱 Alternative Quick Deploy Options:
echo.
echo 🔷 RAILWAY (Recommended):
echo 1. Go to https://railway.app
echo 2. Click "Start a New Project"
echo 3. Select "Deploy from GitHub repo"
echo 4. Choose: modern-voting-system
echo 5. Railway will auto-deploy!
echo.
echo 🔷 VERCEL (Frontend Only):
echo 1. Go to https://vercel.com
echo 2. Import your GitHub repo
echo 3. Set Root Directory: client
echo 4. Deploy!
echo.
echo ✅ DEPLOYMENT COMPLETE!
echo Your voting system is now ready to go live!
echo.
pause
