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

def ask_llm(prompt):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are Chanakya, a concise and helpful AI assistant.
                    
                    CRITICAL: If the user asks for a reminder, alarm, or timer:
                    1. Respond naturally to the user (e.g., "Sure, I'll remind you to drink water in 10 minutes.").
                    2. Append a command block at the very end in this format: [COMMAND: REMINDER | message: <msg> | seconds: <sec>]
                    3. Calculate the seconds from 'now' based on the user's request.
                    
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