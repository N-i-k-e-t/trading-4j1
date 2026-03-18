@echo off
echo Initializing RuleSci Git Repository...

:: Navigate to project directory
cd /d "c:\Users\user\Downloads\trading j4t\rulesyci"

:: Initialize Git
call git init
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed or not in your PATH. Please install Git to proceed.
    pause
    exit /b
)

:: Add all files
echo Adding files...
call git add .

:: Commit
echo Committing changes...
call git commit -m "chore: initial production-ready scaffold for RuleSci"

:: Rename branch to main
call git branch -M main

:: Add remote origin (if it doesn't exist, ignore error)
call git remote add origin https://github.com/N-i-k-e-t/Rulesyci.git 2>nul
if %ERRORLEVEL% NEQ 0 (
   echo Remote potentially already exists, updating url...
   call git remote set-url origin https://github.com/N-i-k-e-t/Rulesyci.git
)

:: Push to GitHub
echo Pushing to GitHub...
call git push -u origin main

echo.
echo ==========================================
echo RuleSci deployment script finished.
echo ==========================================
pause
