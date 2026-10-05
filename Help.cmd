@echo off
rem Help - double-click to read the map of the project.
rem The same as typing "npm run help". The words live in HELP.md.
chcp 65001 >nul
title Help
cd /d "%~dp0"

call npm run help
:ask
set "TOPIC="
set /p "TOPIC=Type a section number (or press Enter to close): "
if not defined TOPIC exit /b 0
call npm run help -- %TOPIC%
goto ask
