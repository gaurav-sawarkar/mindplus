@echo off
title Deploy TerraWatch to Vercel
echo =====================================================================
echo TERRAWATCH - Deploy to Vercel Setup Helper
echo =====================================================================
echo.

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js and npx detected!
    echo Deploying project to Vercel via npx vercel...
    echo.
    npx vercel
    echo.
    echo Deployment completed! If you want to deploy to production, run:
    echo npx vercel --prod
    pause
    exit /b
)

where vercel >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Vercel CLI detected!
    echo Deploying project to Vercel...
    echo.
    vercel
    pause
    exit /b
)

echo [INFO] Vercel CLI or Node.js not detected in system PATH.
echo.
echo Opening Vercel Dashboard in your browser...
echo You can deploy in 10 seconds by dragging this folder into Vercel!
echo.
start https://vercel.com/new
pause
