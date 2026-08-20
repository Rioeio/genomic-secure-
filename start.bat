@echo off
echo ========================================================================
echo          MED-LINK - FEDERATED RESEARCH PLATFORM
echo ========================================================================
echo Starting Python FastAPI AI Backend & React Web Frontend simultaneously...
echo.

:: Start Python Backend in background
start "Med-Link Python Backend (Port 8000)" cmd /k "cd /d C:\genomicsecure && python backend/app.py"

:: Start React Frontend in main window
cd /d C:\genomicsecure
echo Launching React Frontend at http://localhost:5173/ ...
cmd /c npm run dev
