DEPLOYMENT INSTRUCTIONS (READ ME)

ERROR DIAGNOSIS:
1. "Set-Location" error: You used a command meant for the old Command Prompt (cmd) in PowerShell.
   - Solution: In PowerShell, just use `cd "path"` (no /d needed).

2. "git is not recognized" error: This means GIT IS NOT INSTALLED or not in your system settings.
   - Solution: You must install Git to push code to GitHub.

-------------------------------------------------------------------------
STEP 1: INSTALL GIT
1. Download Git for Windows: https://git-scm.com/download/win
2. Run the installer and click "Next" through all defaults.
3. IMPORTANT: Once installed, close ALL terminal/VS Code windows and re-open them.

STEP 2: DEPLOY
Once Git is installed and you have restarted your terminal:
1. Double-click the file "DEPLOY_TO_GITHUB.bat" in this folder.
   (It contains all the code you tried to type, but automated).

OR

Run these commands in PowerShell (after installing Git):
   cd "c:\Users\user\Downloads\trading j4t\rulesyci"
   git init
   git add .
   git commit -m "chore: initial production-ready scaffold for RuleSci"
   git branch -M main
   git remote add origin https://github.com/N-i-k-e-t/Rulesyci.git
   git push -u origin main
