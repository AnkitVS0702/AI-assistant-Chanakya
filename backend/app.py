from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from command_handler import handle_command
from text_to_speech import speak

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return send_from_directory("../frontend", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory("../frontend", filename)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    text = data.get("text")

    # Now handle_command returns (response_text, hotels, alarms)
    result = handle_command(text)
    
    if isinstance(result, tuple) and len(result) == 3:
        response, hotels, alarms = result
    else:
        # Fallback for old tuple format or single string
        response = result[0] if isinstance(result, tuple) else result
        hotels = result[1] if isinstance(result, tuple) and len(result) > 1 else []
        alarms = []

    speak(response)

    return jsonify({
        "response": response,
        "hotels": hotels,
        "alarms": alarms
    })

if __name__ == "__main__":
    app.run(debug=True)