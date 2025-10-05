@echo off
echo 🚀 Starting Audit Bud deployment...

REM Check if gh-pages is installed globally
npm list -g gh-pages >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing gh-pages globally...
    npm install -g gh-pages
)

REM Build the project
echo 🔨 Building project...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to GitHub Pages
    echo 🚀 Deploying to GitHub Pages...
    call npm run deploy
    
    if %errorlevel% equ 0 (
        echo 🎉 Deployment successful!
        echo 🌐 Your app is live at: https://araviiiman.github.io/audit-bud
    ) else (
        echo ❌ Deployment failed!
        exit /b 1
    )
) else (
    echo ❌ Build failed!
    exit /b 1
)

pause
