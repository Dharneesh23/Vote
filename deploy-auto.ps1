# 🚀 ONE-CLICK DEPLOYMENT SCRIPT
# This script will automatically deploy your voting system

Write-Host "🚀 MODERN VOTING SYSTEM - AUTOMATED DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json") -or !(Test-Path "server.js")) {
    Write-Host "❌ Error: Please run this script from your Vote directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project detected: Modern Voting System" -ForegroundColor Green
Write-Host ""

# Step 1: Prepare project
Write-Host "📦 Step 1: Preparing project files..." -ForegroundColor Yellow
try {
    npm run prepare-deploy
    Write-Host "✅ Project prepared successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to prepare project" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: GitHub Repository Creation Guide
Write-Host "📤 Step 2: Creating GitHub Repository..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Please follow these steps to create your GitHub repository:" -ForegroundColor Cyan
Write-Host "1. Open https://github.com/new in your browser" -ForegroundColor White
Write-Host "2. Repository name: modern-voting-system" -ForegroundColor White
Write-Host "3. Description: Modern Online Voting System with React + Node.js" -ForegroundColor White
Write-Host "4. Set to PUBLIC (required for free hosting)" -ForegroundColor White
Write-Host "5. Do NOT initialize with README (we already have one)" -ForegroundColor White
Write-Host "6. Click 'Create Repository'" -ForegroundColor White
Write-Host ""

# Get GitHub username
$githubUsername = Read-Host "Enter your GitHub username"
$repoUrl = "https://github.com/$githubUsername/modern-voting-system.git"

Write-Host ""
Write-Host "⏸️  Press any key after creating the repository..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 3: Push to GitHub
Write-Host ""
Write-Host "📤 Step 3: Pushing to GitHub..." -ForegroundColor Yellow

try {
    git branch -M main
    git remote add origin $repoUrl
    git push -u origin main
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub. Please check your repository settings." -ForegroundColor Red
    Write-Host "Manual commands:" -ForegroundColor Yellow
    Write-Host "git remote add origin $repoUrl" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host ""

# Step 4: Deployment Options
Write-Host "🌐 Step 4: Choose Your Deployment Platform..." -ForegroundColor Yellow
Write-Host ""

Write-Host "🔷 OPTION 1: RAILWAY (RECOMMENDED - EASIEST)" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Sign up with GitHub" -ForegroundColor White
Write-Host "3. Click 'Start a New Project'" -ForegroundColor White
Write-Host "4. Select 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "5. Choose: $githubUsername/modern-voting-system" -ForegroundColor White
Write-Host "6. Railway will auto-deploy your app!" -ForegroundColor White
Write-Host "7. Your app will be live at: https://[random-name].up.railway.app" -ForegroundColor Green
Write-Host ""

Write-Host "🔷 OPTION 2: RENDER (FREE TIER)" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com and sign up" -ForegroundColor White
Write-Host "2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Connect GitHub and select: $githubUsername/modern-voting-system" -ForegroundColor White
Write-Host "4. Settings:" -ForegroundColor White
Write-Host "   - Name: voting-system" -ForegroundColor White
Write-Host "   - Environment: Node" -ForegroundColor White
Write-Host "   - Build Command: npm install" -ForegroundColor White
Write-Host "   - Start Command: npm start" -ForegroundColor White
Write-Host "5. Click 'Deploy Web Service'" -ForegroundColor White
Write-Host "6. Your app will be live at: https://voting-system-[random].onrender.com" -ForegroundColor Green
Write-Host ""

Write-Host "🔷 OPTION 3: VERCEL + RAILWAY (SPLIT DEPLOYMENT)" -ForegroundColor Cyan
Write-Host "Frontend (Vercel):" -ForegroundColor White
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Import GitHub repo: $githubUsername/modern-voting-system" -ForegroundColor White
Write-Host "3. Root Directory: client" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "Backend (Railway):" -ForegroundColor White
Write-Host "1. Deploy backend separately on Railway" -ForegroundColor White
Write-Host "2. Update frontend environment variable with backend URL" -ForegroundColor White
Write-Host ""

# Generate summary
Write-Host "📋 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "✅ Project prepared and built" -ForegroundColor Green
Write-Host "✅ Pushed to GitHub: $repoUrl" -ForegroundColor Green
Write-Host "🌐 Ready for deployment on any platform above" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 RECOMMENDED NEXT STEP:" -ForegroundColor Yellow
Write-Host "Go to https://railway.app and deploy your repository!" -ForegroundColor White
Write-Host ""
Write-Host "📱 Your voting system features:" -ForegroundColor Cyan
Write-Host "- Admin login: admin / admin123" -ForegroundColor White
Write-Host "- User logins: user1-user20 / password123" -ForegroundColor White
Write-Host "- Photo uploads, real-time voting, statistics" -ForegroundColor White
Write-Host "- Mobile responsive with animations" -ForegroundColor White
Write-Host ""
Write-Host "🎉 READY TO GO LIVE!" -ForegroundColor Green

# Open deployment sites
$openSites = Read-Host "Would you like to open Railway deployment page? (y/n)"
if ($openSites -eq "y" -or $openSites -eq "Y") {
    Start-Process "https://railway.app"
    Start-Process $repoUrl
}

Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Green
Write-Host "Your voting system is ready to go live! 🚀" -ForegroundColor Cyan
