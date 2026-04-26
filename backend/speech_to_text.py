import speech_recognition as sr

def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Adjusting for ambient noise... Please wait.")
        r.adjust_for_ambient_noise(source, duration=1)
        print("Listening for your command...")
        
        try:
            # timeout: max time to wait for speech to start
            # phrase_time_limit: max duration of the speech
            audio = r.listen(source, timeout=5, phrase_time_limit=10)
            print("Processing speech...")
            text = r.recognize_google(audio)
            print(f"Recognized: {text}")
            return text
        except sr.WaitTimeoutError:
            print("Listening timed out: No speech detected.")
            return "TIMEOUT_ERROR"
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio.")
            return "UNKNOWN_VALUE_ERROR"
        except Exception as e:
            print(f"Speech recognition error: {e}")
            return ""
