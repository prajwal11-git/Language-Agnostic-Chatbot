import os
import numpy as np
from langchain_community.llms import Ollama
from langchain_openai import OpenAIEmbeddings

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
from pymongo import MongoClient
client = MongoClient(MONGO_URI)
db = client["Ragdb"]

llm = Ollama(model="llama3.2:3b")

OPENAI_KEY = os.getenv("openai_embedding_3")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=OPENAI_KEY)

def cosine_similarity(a, b):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def rag_respond(query: str, db, top_k: int = 5, collections=None, metadata_filter=None):

    query_vector = embeddings.embed_query(query)

    if collections is None:
        cols = ["embeddings_pdf", "embeddings_text", "embeddings_image", "embeddings_other"]
    else:
        cols = collections

    candidates = []
    for col in cols:
        if col not in db.list_collection_names():
            continue
        if metadata_filter:
            cursor = db[col].find(metadata_filter)
        else:
            cursor = db[col].find()
        for doc in cursor:
            if "embedding" in doc:
                candidates.append(doc)

    if len(candidates) == 0:
        return llm.invoke(query)

    scored = []
    for c in candidates:
        try:
            score = cosine_similarity(query_vector, c["embedding"])
            scored.append((score, c))
        except:
            pass

    scored.sort(key=lambda x: x[0], reverse=True)

    top_chunks = scored[:top_k]
    context_texts = [c[1]["text"] for c in top_chunks]

    prompt = "Use the context below to answer the question. If not in context, say you don't know.\n\n"
    for ctx in context_texts:
        prompt += ctx + "\n\n"
    prompt += "Question: " + query + "\nAnswer:"

    answer = llm.invoke(prompt)
    return answer
