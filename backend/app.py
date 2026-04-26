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

    # Now handle_command returns (response_text, optional_data)
    response_data = handle_command(text)
    
    if isinstance(response_data, tuple):
        response, hotels = response_data
    else:
        response, hotels = response_data, []

    speak(response)

    return jsonify({
        "response": response,
        "hotels": hotels
    })

if __name__ == "__main__":
    app.run(debug=True)