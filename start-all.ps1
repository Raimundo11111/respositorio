# Start both backend and frontend in separate PowerShell windows
# Usage: .\start-all.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptDir "backend\profeiApi-main\assistenciaApi-main"
$frontendPath = Join-Path $scriptDir "frontend\Simple EJS HTML Page (1)"

Write-Output "Starting backend in new window..."
Start-Process -FilePath "pwsh" -ArgumentList "-NoExit","-Command","cd '$backendPath'; ./mvnw.cmd -Dspring-boot.run.profiles=mysql spring-boot:run" -WorkingDirectory $backendPath

Start-Sleep -Milliseconds 500
Write-Output "Starting frontend in new window..."
Start-Process -FilePath "pwsh" -ArgumentList "-NoExit","-Command","cd '$frontendPath'; npm run dev" -WorkingDirectory $frontendPath

Write-Output "Both commands launched. Check the new windows for logs."
