@echo off
rem Publish (save to GitHub) - double-click when a piece of work is finished.
rem The same as typing: npm run publish -- "what changed". See docs/rules/WORKFLOW.md.
chcp 65001 >nul
title Publish (save to GitHub)
cd /d "%~dp0"

echo Publish (save to GitHub)
echo.
echo Describe what changed in a few plain words, then press Enter.
echo Example: Add a phone number to the sign-up form
echo.
set "MSG="
set /p "MSG=What changed? "
if not defined MSG goto nomessage
rem A quotation mark inside the description would end it early, so they are removed.
set "MSG=%MSG:"=%"
call npm run publish -- "%MSG%"
goto finish

:nomessage
call npm run publish

:finish
echo.
pause
