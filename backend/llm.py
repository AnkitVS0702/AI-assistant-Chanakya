import requests

def ask_llm(prompt):
    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": f"""
                    You are a concise AI assistant.
                    Answer in 1-2 sentences maximum.
                    Do not give long explanations.
                    Be direct and to the point.
                    User: {prompt}
                    """,
                "stream": False
            }
        )
        return res.json()["response"]
    except Exception as e:
        print("Local LLM Error:", e)
        return "Error processing request"