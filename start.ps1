Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "         MED-LINK - FEDERATED RESEARCH PLATFORM" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Starting Python FastAPI AI Backend & React Web Frontend simultaneously..." -ForegroundColor Yellow

# Start Python FastAPI Backend process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\genomicsecure; python backend/app.py"

# Start Vite React Frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -ErrorAction SilentlyContinue
cmd /c npm run dev
