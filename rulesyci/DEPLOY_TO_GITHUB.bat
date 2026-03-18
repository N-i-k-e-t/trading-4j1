@echo off
setlocal
echo ==========================================
echo    RuleSci - GitHub Deployment Script
echo ==========================================
echo.

:: Navigate to the project folder
cd /d "c:\Users\user\Downloads\trading j4t\rulesyci"

:: Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not found in your system PATH.
    echo Please install Git or add it to your PATH to continue.
    pause
    exit /b
)

:: 1. Initialize Git if not already initialized
if not exist ".git" (
    echo [INFO] Initializing new Git repository...
    git init
) else (
    echo [INFO] Git repository already initialized.
)

:: 2. Add all files
echo [INFO] Adding files to staging...
git add .

:: 3. Commit changes
echo [INFO] Committing files...
git commit -m "chore: initial production-ready scaffold for RuleSci"

:: 4. Rename branch to main
echo [INFO] Renaming branch to 'main'...
git branch -M main

:: 5. Add or Update Remote Origin
echo [INFO] Configuring remote origin (https://github.com/N-i-k-e-t/Rulesyci.git)...
git remote add origin https://github.com/N-i-k-e-t/Rulesyci.git 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Remote 'origin' already exists. Updating URL...
    git remote set-url origin https://github.com/N-i-k-e-t/Rulesyci.git
)

:: 6. Push to GitHub
echo [INFO] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed. 
    echo Possible reasons:
    echo  - You are not logged in (Git credential manager will pop up).
    echo  - The repository 'Rulesyci' does not exist on GitHub yet.
    echo  - You don't have permission to write to this repository.
) else (
    echo.
    echo [SUCCESS] RuleSci has been deployed to GitHub!
)

echo.
pause
