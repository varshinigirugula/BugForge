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

    data = request.json

    code = data.get("code", "")
    language = data.get("language", "")

    prompt = f"""
You are a professional code auto-fixer.

STRICT RULES:
- Output ONLY corrected {language} code
- No explanation
- No comments
- No markdown
- No triple backticks
- No extra words

INPUT CODE:
{code}

FINAL FIXED CODE:
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "qwen2.5-coder:7b",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        result = response.json()["response"].strip()

        result = re.sub(r"```.*?\n", "", result)
        result = result.replace("```", "").strip()

        return jsonify({
            "fixedCode": result
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500



# Render Deployment
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
