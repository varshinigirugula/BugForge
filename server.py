from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import re
import os

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"


# Serve Frontend
@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/login")
def login():
    return send_from_directory(".", "login.html")


# Serve CSS, JS, images and other frontend files
@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)


# AI Code Analyzer
@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    code = data.get("code", "")
    language = data.get("language", "python")

    # Temporary response for testing
    fixed_code = f"""# Fixed {language} code

{code}
"""

    return jsonify({
        "fixedCode": fixed_code
    })


# Render Deployment
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
