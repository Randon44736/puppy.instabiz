@echo off
setlocal
echo ===================================================
echo   TeddyPups U.A.E. — Automated CI/CD Deployer
echo ===================================================
echo.

set "commit_msg=%~1"
if "%commit_msg%"=="" (
    set /p "commit_msg=Enter description of your update (or press Enter): "
)
if "%commit_msg%"=="" (
    set "commit_msg=Update website content and features"
)

echo.
echo [1/3] Staging all modified files...
git add .

echo.
echo [2/3] Creating commit: "%commit_msg%"...
git commit -m "%commit_msg%"

echo.
echo [3/3] Pushing to GitHub main branch...
git push origin main

echo.
echo ===================================================
echo   SUCCESS: Changes pushed to GitHub!
echo   Vercel / Netlify CI/CD will automatically build
echo   and publish your live website in ~30 seconds.
echo ===================================================
echo.
pause
