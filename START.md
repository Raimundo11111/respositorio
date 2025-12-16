# Start project (backend + frontend)

Use one of the following options to start both backend and frontend:

PowerShell (open a PowerShell terminal in the repo root):

```powershell
# Runs backend (profile 'mysql') and frontend in separate windows
./start-all.ps1
```

On Windows (cmd):

```bat
start-all.bat
```

VS Code tasks:
- Open Command Palette (Ctrl+Shift+P) -> Tasks: Run Task -> Select "Start: Full Stack" to start backend and frontend in separate terminals.

Notes:
- Backend will use the MySQL configuration defined in `backend/profeiApi-main/assistenciaApi-main/src/main/resources/application.properties`.
- Ensure your MySQL server is running and accessible at `127.0.0.1` and that a database named `repositorio` exists, or create it before starting.
- Backend depends on `mvnw.cmd` being executable; frontend uses `npm run dev` (install dependencies with `npm install` inside the frontend folder).
