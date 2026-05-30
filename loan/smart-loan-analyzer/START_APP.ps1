#!/usr/bin/env powershell
# Smart Loan Analyzer - One-Click Startup Script (PowerShell)
# This script starts both Backend and Frontend servers in separate windows

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   SMART LOAN & DEBT STRESS ANALYZER" -ForegroundColor Cyan
Write-Host "   One-Click Startup" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Set project path dynamically to the directory containing this script
$PROJECT_PATH = $PSScriptRoot

# Check if project exists
if (-not (Test-Path $PROJECT_PATH)) {
    Write-Host "ERROR: Project path not found: $PROJECT_PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
$nodeCheck = node --version 2>$null
if ($null -eq $nodeCheck) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Node.js found: $nodeCheck" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host "Please ensure MongoDB Atlas is connected and running" -ForegroundColor Yellow
Write-Host ""

Write-Host "[3/4] Installing dependencies (if needed)..." -ForegroundColor Yellow
Push-Location "$PROJECT_PATH\backend"
npm install *> $null
Pop-Location

Push-Location "$PROJECT_PATH\frontend"
npm install *> $null
Pop-Location
Write-Host "[OK] Dependencies ready" -ForegroundColor Green
Write-Host ""

Write-Host "[4/4] Starting servers..." -ForegroundColor Yellow
Write-Host ""

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   STARTING BACKEND (Port 5000)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Start Backend
Push-Location "$PROJECT_PATH\backend"
$backendProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "npm run dev" `
    -PassThru `
    -WindowStyle Normal

Write-Host "[OK] Backend process started" -ForegroundColor Green
Pop-Location

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   STARTING FRONTEND (Port 5173)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Start Frontend
Push-Location "$PROJECT_PATH\frontend"
$frontendProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "npm run dev" `
    -PassThru `
    -WindowStyle Normal

Write-Host "[OK] Frontend process started" -ForegroundColor Green
Pop-Location

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "   [OK] BOTH SERVERS STARTING" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting for servers to compile..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds on first startup" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 5

Write-Host "Opening application in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host '====================================================' -ForegroundColor Green
Write-Host 'STARTUP COMPLETE!' -ForegroundColor Green
Write-Host ''
Write-Host 'Your application is running at:' -ForegroundColor Green
Write-Host '-> http://localhost:5173' -ForegroundColor Cyan
Write-Host ''
Write-Host 'MongoDB Atlas Database:' -ForegroundColor Green
Write-Host '-> smart-loan-db (Cluster0)' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Use MongoDB Compass to view data in real-time' -ForegroundColor Green
Write-Host 'Connection: mongodb+srv://harsh22:harsh1322@cluster0.okbifga.mongodb.net/loandb?retryWrites=true&w=majority&appName=Cluster0' -ForegroundColor Cyan
Write-Host ''
Write-Host 'TIP: Keep both terminal windows open while developing' -ForegroundColor Yellow
Write-Host '====================================================' -ForegroundColor Green
Write-Host ''
