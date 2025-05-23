from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/update', methods=['GET'])
def update_position():
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
    app.run(debug=True)
