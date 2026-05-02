@echo off
title Chanakya AI Assistant
echo Starting Chanakya Backend Server...

:: Navigate to backend directory
cd /d "%~dp0backend"

:: Open the frontend in the default browser
echo Opening Chanakya in your browser...
start "" "http://127.0.0.1:5000"

:: Activate virtual environment and run the app
call venv\Scripts\activate
python app.py

pause
