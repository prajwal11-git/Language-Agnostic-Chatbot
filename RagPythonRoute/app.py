import os
import json
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

from embeddings import process_file_bytes
from rag_pipeline import rag_respond

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client["Ragdb"]

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "no file provided"}), 400

    f = request.files["file"]
    filename = f.filename or "unnamed"
    file_bytes = f.read()
    if not file_bytes:
        return jsonify({"error": "empty file"}), 400

    metadata_raw = request.form.get("metadata")
    metadata = {}
    if metadata_raw:
        try:
            metadata = json.loads(metadata_raw)
        except:
            metadata = {"_raw_metadata": metadata_raw}

    checksum = hashlib.sha256(file_bytes).hexdigest()
    existing = db.documents.find_one({"checksum": checksum})
    if existing:
        return jsonify({"message": "duplicate", "doc_id": existing["doc_id"]}), 200

    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        collection = "embeddings_pdf"
    elif ext in [".png", ".jpg", ".jpeg"]:
        collection = "embeddings_image"
    elif ext in [".txt", ".md", ".csv", ".json"]:
        collection = "embeddings_text"
    else:
        collection = "embeddings_other"

    try:
        result = process_file_bytes(
            file_bytes=file_bytes,
            filename=filename,
            metadata=metadata,
            mongo_db=db,
            embeddings_collection_name=collection
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json(force=True)
    if not data or "query" not in data:
        return jsonify({"error": "missing query"}), 400

    query = data["query"]
    top_k = data.get("top_k", 5)
    collections = data.get("collections")
    metadata = data.get("metadata")

    try:
        answer = rag_respond(query, db, top_k=top_k, collections=collections, metadata_filter=metadata)
        return jsonify({"answer": answer}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
