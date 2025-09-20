import os
import hashlib
import uuid
from datetime import datetime
import tempfile

from pymongo import MongoClient
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings

# MongoDB connection
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["Ragdb"]

# OpenAI embeddings
OPENAI_KEY = os.getenv("openai_embedding_3")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=OPENAI_KEY)


def checksum_bytes(data: bytes):
    return hashlib.sha256(data).hexdigest()


def process_file_bytes(file_bytes: bytes, filename: str, metadata: dict, mongo_db, embeddings_collection_name: str):
    cs = checksum_bytes(file_bytes)

    # Check for duplicate
    existing = mongo_db.documents.find_one({"checksum": cs})
    if existing:
        return {"message": "duplicate", "doc_id": existing["doc_id"]}

    ext = os.path.splitext(filename)[1].lower()

    # Save file temporarily for loaders (they require file paths, not BytesIO)
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    # Select proper loader
    if ext == ".pdf":
        loader = PyPDFLoader(tmp_path)
    elif ext in [".txt", ".md", ".csv", ".json"]:
        loader = TextLoader(tmp_path, encoding="utf-8")
    elif ext in [".png", ".jpg", ".jpeg"]:
        loader = UnstructuredImageLoader(tmp_path)
    else:
        return {"message": "unsupported file"}

    # Load docs
    docs = loader.load()

    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64)
    chunks = splitter.split_documents(docs)

    if len(chunks) == 0:
        return {"message": "no_text_extracted"}

    # Create doc record
    doc_id = str(uuid.uuid4())
    now = datetime.utcnow()
    doc_record = {
        "doc_id": doc_id,
        "filename": filename,
        "checksum": cs,
        "metadata": metadata,
        "created_at": now,
        "chunk_count": len(chunks),
        "collection": embeddings_collection_name,
    }
    mongo_db.documents.insert_one(doc_record)

    # Generate embeddings for chunks
    texts = [chunk.page_content for chunk in chunks]
    vectors = embeddings.embed_documents(texts)

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        mongo_db[embeddings_collection_name].insert_one({
            "chunk_id": str(uuid.uuid4()),
            "doc_id": doc_id,
            "chunk_index": i,
            "text": chunk.page_content,
            "metadata": metadata,
            "embedding": vector,
            "created_at": now
        })

    return {"message": "ok", "doc_id": doc_id, "chunk_count": len(chunks)}
