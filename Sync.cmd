@echo off
rem Sync (get the latest from GitHub) - double-click at the start of a session.
rem The same as typing "npm run sync". See docs/rules/WORKFLOW.md.
chcp 65001 >nul
title Sync (get the latest from GitHub)
cd /d "%~dp0"

call npm run sync
echo.
pause
