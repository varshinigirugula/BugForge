from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


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
# BUG ANALYZER API
# ==========================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    code = data.get("code", "")
    language = data.get("language", "python")

    fixed_code = f"""# Fixed {language} code

{code}
"""

    return jsonify({
        "fixedCode": fixed_code
    })


# ==========================
# RENDER SERVER
# ==========================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
