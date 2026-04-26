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

def open_in_chrome(query):
    chrome_path = apps["chrome"]
    
    # If it looks like a URL (contains a dot and no spaces) or ends with common TLDs
    if "." in query and " " not in query:
        url = query if query.startswith("http") else f"https://{query}"
    # If it's a single word, guess .com
    elif " " not in query:
        url = f"https://www.{query}.com"
    # Otherwise, search on Google
    else:
        url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
        
    try:
        subprocess.Popen([chrome_path, url])
        return f"Opening {query} in Chrome"
    except Exception as e:
        return f"Error opening Chrome: {e}"