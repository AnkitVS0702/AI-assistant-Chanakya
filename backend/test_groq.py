import os
from openai import OpenAI
from dotenv import load_dotenv

# Try to load .env
loaded = load_dotenv()
print(f"Dotenv loaded: {loaded}")

api_key = os.getenv("GROQ_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"API Key starts with: {api_key[:10]}...")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=api_key
)

try:
    print("Attempting test completion...")
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": "Hi"}
        ],
        model="llama-3.3-70b-versatile",
    )
    print("Success!")
    print(chat_completion.choices[0].message.content)
except Exception as e:
    print("\n--- ERROR CAUGHT ---")
    print(type(e).__name__, ":", e)
