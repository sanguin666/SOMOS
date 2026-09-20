@echo off
setlocal EnableDelayedExpansion
title SOMOS launcher

REM One-click dev launcher for Windows: starts Postgres (via Docker if
REM available), installs/updates dependencies, seeds the demo data, and
REM launches the backend, admin dashboard, and mobile app each in their
REM own window. Re-run this file any time to restart everything - it
REM closes any windows it previously opened first, so it's always a clean
REM restart regardless of whether you closed them yourself.

cd /d "%~dp0"

echo ================================================
echo   SOMOS - starting everything
echo ================================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js / npm not found on PATH.
    echo Install Node.js from https://nodejs.org and re-run this file.
    pause
    exit /b 1
)

REM Close windows this script opened last time, so re-running it restarts
REM everything instead of piling up duplicate dev servers.
taskkill /F /FI "WINDOWTITLE eq SOMOS Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq SOMOS Admin*"   >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq SOMOS App*"     >nul 2>&1

REM --- Database ---
where docker >nul 2>&1
if errorlevel 1 (
    echo [!] Docker not found on PATH - make sure PostgreSQL is running locally
    echo     ^(see backend\.env.example for the expected connection settings^)
) else (
    echo Starting PostgreSQL via Docker...
    docker compose up -d
    echo Waiting a moment for PostgreSQL to accept connections...
    timeout /t 5 /nobreak >nul
)
echo.

REM --- Backend: env, install, seed ---
echo Setting up backend...
pushd backend
if not exist .env copy .env.example .env >nul
call npm install
call npm run seed
popd
echo.

REM --- Admin dashboard: env, install ---
echo Setting up admin dashboard...
pushd admin
if not exist .env copy .env.example .env >nul
call npm install
popd
echo.

REM --- Mobile app: env, install ---
echo Setting up mobile app...
pushd app
if not exist .env (
    copy .env.example .env >nul
    call :detect_lan_ip
    if defined LAN_IP (
        powershell -NoProfile -Command "(Get-Content .env) -replace 'EXPO_PUBLIC_API_URL=.*', 'EXPO_PUBLIC_API_URL=http://!LAN_IP!:3000' | Set-Content .env" >nul
        echo   Set EXPO_PUBLIC_API_URL to http://!LAN_IP!:3000 ^(this PC's network IP^)
        echo   so Expo Go on a phone can reach the backend over Wi-Fi.
        echo   Wrong network? Edit app\.env by hand, then re-run this file.
    )
)
call npm install
popd
echo.

REM --- Launch everything, each in its own window ---
echo Launching backend, admin dashboard, and mobile app...

pushd backend
start "SOMOS Backend" cmd /k npm run start:dev
popd

pushd admin
start "SOMOS Admin" cmd /k npm run dev
popd

pushd app
start "SOMOS App" cmd /k npm run start
popd

echo.
echo ================================================
echo   All set!
echo     Backend:          http://localhost:3000
echo     Admin dashboard:  http://localhost:5173
echo     Mobile app:       scan the QR code in its window
echo.
echo     Demo admin login: admin@stmarys.example / demo1234
echo.
echo   Closing THIS window does not stop the 3 services -
echo   close their own windows to stop them, or just re-run
echo   this file any time for a full restart.
echo ================================================
pause
exit /b 0

:detect_lan_ip
set "LAN_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4 Address"') do (
    if not defined LAN_IP (
        set "ip=%%a"
        set "ip=!ip: =!"
        if not "!ip!"=="127.0.0.1" set "LAN_IP=!ip!"
    )
)
exit /b 0
