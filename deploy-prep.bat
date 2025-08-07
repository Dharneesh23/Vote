@echo off
echo 🚀 Preparing your voting system for deployment...
echo.

echo 📦 Installing dependencies...
call npm run install-deps
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🏗️ Building production frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

echo ✅ Build complete! Your app is ready for deployment.
echo.
echo 📋 Next steps:
echo 1. Create a GitHub repository
echo 2. Upload your project files
echo 3. Choose a hosting platform (see DEPLOYMENT_GUIDE.md)
echo 4. Follow the deployment instructions
echo.
echo 🌐 Recommended free hosting platforms:
echo - Render.com (Full-stack)
echo - Vercel.com (Frontend) + Railway.app (Backend)
echo - Netlify.com (Frontend) + Heroku.com (Backend)
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions.
echo.
pause
