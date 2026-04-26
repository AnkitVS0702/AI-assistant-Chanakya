import threading
import time
from text_to_speech import speak
try:
    from win10toast import ToastNotifier
    toaster = ToastNotifier()
except ImportError:
    toaster = None
    print("Warning: win10toast not installed. Install with 'pip install win10toast'")

def schedule_reminder(message, seconds):
    """Handles voice and toast notification backup on the backend."""
    def run():
        print(f"Backend reminder set: '{message}' in {seconds} seconds.")
        time.sleep(seconds)
        
        # 1. Speak the reminder
        alert_text = f"Reminder: {message}"
        speak(alert_text)
        
        # 2. Show Windows Notification (Toast)
        if toaster:
            toaster.show_toast(
                "Chanakya Reminder",
                message,
                duration=10,
                threaded=True
            )
        else:
            print(f"\n--- REMINDER: {message} ---")

    t = threading.Thread(target=run)
    t.daemon = True
    t.start()
