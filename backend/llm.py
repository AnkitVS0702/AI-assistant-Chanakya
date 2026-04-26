import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Groq client
# Groq uses the OpenAI-compatible API
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

from datetime import datetime

def ask_llm(prompt):
    # Get current time for the LLM to calculate absolute alarm times
    current_time = datetime.now().strftime("%I:%M %p, %A, %d %B %Y")
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"""You are Chanakya, a concise and helpful AI assistant.
                    
                    CURRENT TIME: {current_time}
                    
                    CRITICAL: If the user asks for a reminder, alarm, or timer (e.g., "in 5 mins" OR "at 8:54 AM"):
                    1. Respond naturally to the user.
                    2. Append a command block at the very end: [COMMAND: REMINDER | message: <msg> | seconds: <sec>]
                    3. Calculate <sec> by finding the difference between CURRENT TIME and the requested time.
                    4. If the requested time is earlier than the current time, assume they mean tomorrow.
                    
                    Otherwise, answer in 1-2 sentences maximum. Be direct."""
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print("Groq API Error:", e)
        return "Error processing request with Groq"