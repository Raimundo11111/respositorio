@echo off
REM Start backend and frontend in separate cmd windows
set BACKEND_DIR=backend\profeiApi-main\assistenciaApi-main
set FRONTEND_DIR=frontend\Simple EJS HTML Page (1)
start cmd /k "cd /d %~dp0%BACKEND_DIR% && mvnw.cmd -Dspring-boot.run.profiles=mysql spring-boot:run"
start cmd /k "cd /d %~dp0%FRONTEND_DIR% && npm run dev"

echo Started backend and frontend in new windows.
pause