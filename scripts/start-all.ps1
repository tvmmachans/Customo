# One-click start script for Windows PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1

$ErrorActionPreference = 'Stop'
# Compute repo root (parent of the scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $scriptDir
Write-Host "Starting one-click script from $root"

# Ensure dependencies installed
if (-not (Test-Path (Join-Path $root 'node_modules'))) {
  Write-Host "node_modules not found at root. Installing dependencies (this may take a while)..."
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
  } else {
    npm install
  }
} else {
  Write-Host "Root node_modules found. Skipping install."
}

# Backend prisma generate
Write-Host "Generating Prisma client..."
Push-Location (Join-Path $root 'backend')
try {
  npx prisma generate --schema=prisma/schema.prisma
} catch {
  Write-Warning "prisma generate failed: $_"
}
Pop-Location

# Start backend in new PowerShell window
Write-Host "Starting backend dev server in new window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $root 'backend')`"; npm run dev" -WindowStyle Normal

# Start frontend in new PowerShell window
Write-Host "Starting frontend dev server in new window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$root`"; npm run dev" -WindowStyle Normal

Write-Host "One-click start executed. Check the new windows for logs."
