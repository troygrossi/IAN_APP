@echo off
rem Deploy (deploy to Vercel) - double-click when the work is ready for visitors.
rem The same as typing "npm run deploy". See docs/rules/WORKFLOW.md.
chcp 65001 >nul
title Deploy (deploy to Vercel)
cd /d "%~dp0"

echo Deploy (deploy to Vercel)
echo.
echo This makes the live site match what you last published.
echo Visitors will see the change in about two minutes.
echo.
set "OK="
set /p "OK=Type yes and press Enter to continue: "
if /i not "%OK%"=="yes" (
  echo Nothing was deployed.
  echo.
  pause
  exit /b 0
)
call npm run deploy
echo.
pause
