@echo off
title HeritageGuardian AI

echo Starting HeritageGuardian AI...
echo.

:: Start backend in a new terminal window
start "HeritageGuardian Backend" cmd /k "cd /d %~dp0 && uvicorn backend.main:app --reload --port 8000"

:: Give backend a moment to initialize
timeout /t 3 /nobreak >nul

:: Install frontend deps if needed, then start frontend in a new terminal window
start "HeritageGuardian Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

:: Wait a few seconds then open browser
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo Both servers are starting in separate windows.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Close the two terminal windows to stop the servers.
pause
