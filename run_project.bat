@echo off
title TeddyPups Fullstack Launcher
echo ============================================================
echo   TeddyPups U.A.E. Fullstack Application Launcher
echo ============================================================
echo.
echo [1/2] Starting Backend API Server (Port 5000)...
start "TeddyPups Backend" cmd /k "cd /d %~dp0backend && node dist/server.js"

echo [2/2] Starting Frontend Dev Server (Port 3000)...
start "TeddyPups Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 3000"

echo.
echo ============================================================
echo   Both servers are starting!
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo ============================================================
