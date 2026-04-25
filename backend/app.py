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

    response = handle_command(text)

    speak(response)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)