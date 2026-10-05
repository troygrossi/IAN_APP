@echo off
rem Doctor - double-click to check that this computer is ready, and repair what can be repaired.
rem The same as typing "npm run doctor -- --fix". See HELP.md, section 7.
chcp 65001 >nul
title Doctor
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node is not installed. Install the LTS version from https://nodejs.org
  echo then double-click this file again.
  pause
  exit /b 1
)

call npm run doctor -- --fix
echo.
pause
