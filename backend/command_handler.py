from app_launcher import open_app,open_app_path
from llm import ask_llm
import os
import glob

def handle_command(text):
    text = text.lower()

    # 🔹 App opening
    if "open" in text:
        for app in [
            "chrome", "notepad", "calculator", "cmd",
            "powershell", "vscode", "explorer", "task manager"
        ]:
            if app in text:
                return open_app(app)

    # 🔹 Folder opening
    if "downloads" in text:
        return open_app_path("C:\\Users\\dellc\\Downloads")

    if "documents" in text:
        return open_app_path("C:\\Users\\dellc\\Documents")

    if "desktop" in text:
        return open_app_path("C:\\Users\\dellc\\Desktop")

    # 🔹 File search and opening
    if "open file" in text or "find file" in text:
        # Extract filename from text, e.g., "open file report.pdf"
        parts = text.split()
        if "file" in parts:
            idx = parts.index("file")
            if idx + 1 < len(parts):
                filename = " ".join(parts[idx+1:])
                return search_and_open_file(filename)

    # 🔹 Fallback to LLM
    return ask_llm(text)

def search_and_open_file(filename):
    # Safe directories to search in
    safe_dirs = [
        "C:\\Users\\dellc\\Documents",
        "C:\\Users\\dellc\\Desktop",
        "C:\\Users\\dellc\\Downloads",
        "C:\\Users\\dellc\\Pictures",
        "C:\\Users\\dellc\\Music",
        "C:\\Users\\dellc\\Videos"
    ]
    
    for directory in safe_dirs:
        pattern = os.path.join(directory, "**", filename)
        matches = glob.glob(pattern, recursive=True)
        if matches:
            # Open the first match
            open_app_path(matches[0])
            return f"Opening {filename} from {os.path.dirname(matches[0])}"
    
    return f"File {filename} not found in safe directories."