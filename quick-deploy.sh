#!/bin/bash
# Quick deployment commands for your voting system

echo "🚀 MODERN VOTING SYSTEM - QUICK DEPLOY"
echo "======================================"
echo ""

# Get correct GitHub username
read -p "Enter your GitHub username (no spaces): " github_user

# Set repository URL
repo_url="https://github.com/$github_user/modern-voting-system.git"

echo ""
echo "📤 Setting up Git repository..."

# Remove existing origin if any
git remote remove origin 2>/dev/null || true

# Add correct origin
git remote add origin $repo_url
git branch -M main

echo ""
echo "🔄 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 INSTANT DEPLOYMENT OPTIONS:"
    echo ""
    echo "🔷 RAILWAY (FASTEST - RECOMMENDED):"
    echo "1. Go to: https://railway.app"
    echo "2. Sign up with GitHub"
    echo "3. Click 'Start a New Project'"
    echo "4. Select 'Deploy from GitHub repo'"
    echo "5. Choose: $github_user/modern-voting-system"
    echo "6. Railway auto-deploys in 2 minutes!"
    echo "📱 Live URL: https://[random-name].up.railway.app"
    echo ""
    echo "🔷 RENDER (FREE FOREVER):"
    echo "1. Go to: https://render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect: $github_user/modern-voting-system"
    echo "4. Use settings: Node, npm install, npm start"
    echo "📱 Live URL: https://voting-system-xyz.onrender.com"
    echo ""
    echo "✅ Your repository: $repo_url"
    echo "🎉 Ready to go live!"
else
    echo "❌ Push failed. Please check your GitHub username and repository."
    echo "Manual commands:"
    echo "git remote add origin $repo_url"
    echo "git branch -M main" 
    echo "git push -u origin main"
fi
