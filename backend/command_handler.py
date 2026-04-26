from app_launcher import open_app, open_app_path, open_in_chrome
from llm import ask_llm
from scheduler import schedule_reminder
import os
import glob
import re

def handle_command(text):
    text = text.lower()

    # 🔹 "Open" Command Logic
    if text.startswith("open"):
        # ... (keep existing app/folder/file logic)
        # 1. Check for Apps
        for app in [
            "chrome", "notepad", "calculator", "cmd",
            "powershell", "vscode", "explorer", "task manager"
        ]:
            if app in text:
                return open_app(app)

        # 2. Check for Safe Folders
        if "downloads" in text:
            return open_app_path("C:\\Users\\dellc\\Downloads")
        if "documents" in text:
            return open_app_path("C:\\Users\\dellc\\Documents")
        if "desktop" in text:
            return open_app_path("C:\\Users\\dellc\\Desktop")

        # 3. Check for File Search
        if "file" in text or "find file" in text:
            parts = text.split()
            if "file" in parts:
                idx = parts.index("file")
                if idx + 1 < len(parts):
                    filename = " ".join(parts[idx+1:])
                    return search_and_open_file(filename)

        # 4. Fallback: Open as Website or Search Google
        query = text.replace("open", "", 1).strip()
        if query:
            return open_in_chrome(query)

    # 🔹 Fallback to LLM (Handles chat, Reminders, and Hotels)
    response = ask_llm(text)
    hotels = []
    
    # 🏨 Hotel Logic: Check if the LLM is suggesting hotels
    # We'll teach the LLM to include [HOTEL: ...] blocks
    if "hotel" in text.lower() or "stay" in text.lower():
        # Re-query the LLM specifically for structured hotel data if it looks like a request
        hotel_data_query = f"Provide a list of 3 real hotels in '{text}' with name, price per night, and star rating. Format: [HOTEL: name | price: <price> | rating: <stars>]"
        raw_hotels = ask_llm(hotel_data_query)
        
        hotel_matches = re.findall(r"\[HOTEL: (.*?) \| price: (.*?) \| rating: (.*?)\]", raw_hotels)
        for h_match in hotel_matches:
            hotels.append({
                "name": h_match[0],
                "price": h_match[1],
                "rating": float(h_match[2]) if h_match[2].strip().replace('.','',1).isdigit() else 5.0
            })

    # ⏰ Reminder Logic: Check if the LLM output contains a reminder command
    match = re.search(r"\[COMMAND: REMINDER \| message: (.*?) \| seconds: (\d+)\]", response)
    
    if match:
        msg = match.group(1)
        sec = int(match.group(2))
        schedule_reminder(msg, sec)
        response = re.sub(r"\[COMMAND: REMINDER .*?\]", "", response).strip()
        
    return response, hotels

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