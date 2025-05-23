import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/update', methods=['GET', 'POST'])
def update_position():
    if request.method == 'POST':
        lat = request.form.get('lat') or request.args.get('lat')
        lon = request.form.get('lon') or request.args.get('lon')
    else:
        lat = request.args.get('lat')
        lon = request.args.get('lon')

    if lat and lon:
        with open('backend/position.json', 'w') as f:
            json.dump({"lat": lat, "lon": lon}, f)
        return jsonify(status="ok")
    return jsonify(status="error", message="Missing parameters"), 400

@app.route('/position', methods=['GET'])
def get_position():
    with open('backend/position.json') as f:
        return jsonify(json.load(f))

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # par défaut : 5000
    app.run(debug=True, host='0.0.0.0', port=port)
