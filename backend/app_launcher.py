import subprocess
import os

apps = {
    "chrome": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "notepad": "notepad.exe",
    "calculator": "calc.exe",
    "cmd": "cmd.exe",
    "powershell": "powershell.exe",
    "vscode": "C:\\Users\\dellc\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
    "explorer": "explorer.exe",
    "task manager": "taskmgr.exe"
}

def open_app(app_name):
    try:
        subprocess.Popen(apps[app_name])
        return f"Opening {app_name}"
    except:
        return "App not found"
    
def open_app_path(path):
    try:
        os.startfile(path)
        return f"Opening {path}"
    except:
        return "Path not found"