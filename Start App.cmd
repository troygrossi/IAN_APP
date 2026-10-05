@echo off
rem Start App - double-click to run the app on this computer.
rem The same as typing "npm run dev". See HELP.md, section 2.
chcp 65001 >nul
title Start App
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node is not installed. Install the LTS version from https://nodejs.org
  echo then restart the computer and double-click this file again. See ONBOARDING.md, step 5.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing packages. This takes a minute...
  call npm install
  if errorlevel 1 goto failed
)
if not exist .env.local call npm run doctor -- --fix

echo.
echo Starting the app. Your browser will open http://localhost:3000 in a few seconds.
echo Leave this window open while you work. To stop the app, close this window.
echo.
start "" /min cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"
call npm run dev

:failed
echo.
echo The app stopped. If that was not what you wanted, double-click Doctor.cmd
pause
