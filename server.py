from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route("/")
def home():
    return "BugForge Backend is Running Successfully"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    code = data["code"]
    language = data["language"]

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

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen2.5-coder:7b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()["response"].strip()

    result = re.sub(r"```.*?\n", "", result)
    result = result.replace("```", "").strip()

    return jsonify({"fixedCode": result})
import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
