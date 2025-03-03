from flask import Flask, jsonify
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

# ランダムにコードを表示する
chords = ["C", "G", "D", "Em"]
# chords = ["C", "G", "D", "Am", "Em", "F", "Bm"]

@app.route("/random_chord", methods=["GET"])
def get_random_chord():
    random_chord = random.choice(chords)
    return jsonify({"chord": random_chord})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)  # Reactとは別ポートで起動