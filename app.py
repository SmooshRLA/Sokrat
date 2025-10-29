from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/topics")
def get_topics():
    with open("topics.json") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
