from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app)


# ==========================
# GEMINI CONFIGURATION
# ==========================

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Gemini API Key not found")


model = genai.GenerativeModel("gemini-2.0-flash")


# ==========================
# FRONTEND ROUTES
# ==========================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/login")
def login():
    return send_from_directory(".", "login.html")


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)



# ==========================
# AI BUG ANALYZER
# ==========================

@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        data = request.get_json()

        code = data.get("code", "")
        language = data.get("language", "python")


        prompt = f"""
You are BugForge AI, an expert programmer.

Analyze this {language} code.

Find:
- Syntax errors
- Logical errors
- Runtime errors
- Security issues
- Performance issues

If the code is correct, clearly say no errors found.

Return ONLY JSON in this format:

{{
"title":"",
"description":"",
"severity":"",
"lineInfo":"",
"fixedCode":"",
"status":""
}}

Code:

{code}
"""


        response = model.generate_content(prompt)


        result_text = response.text

        result_text = result_text.replace("```json", "")
        result_text = result_text.replace("```", "")


        result = json.loads(result_text)


        return jsonify(result)


    except Exception as e:

        return jsonify({
            "title": "AI Error",
            "description": str(e),
            "severity": "High",
            "lineInfo": "Unknown",
            "fixedCode": "",
            "status": "failed"
        })



# ==========================
# START SERVER
# ==========================

if __name__ == "__main__":

    port = int(os.environ.get("PORT",5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
