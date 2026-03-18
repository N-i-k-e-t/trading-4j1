@echo off
setlocal
echo ==========================================
echo    RuleSci - Add Anchor & Push Update
echo ==========================================
echo.

:: Navigate to the project folder
cd /d "c:\Users\user\Downloads\trading j4t\rulesyci"

:: Add new Anchor folder
echo [INFO] Staging 'anchor' folder...
git add anchor

:: Commit changes
echo [INFO] Committing 'Added legacy anchor prototype'...
git commit -m "chore: added legacy anchor prototype"

:: Push to GitHub
echo [INFO] Pushing update to GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed. 
) else (
    echo.
    echo [SUCCESS] Anchor folder added to repository!
)

echo.
pause
