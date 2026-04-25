import pyttsx3
import threading

lock = threading.Lock()

def speak(text):
    def run():
        with lock:
            engine = pyttsx3.init()
            engine.say(text)
            engine.runAndWait()
            engine.stop()

    t = threading.Thread(target=run)
    t.start()