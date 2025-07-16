import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase setup
supabase_url = os.getenv("SUPABASE_URL")
supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_anon_key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required")

# LangChain setup
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Check for OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY not found. Please set it in your .env file.")

llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    model="google/gemma-3-12b-it:free",
    temperature=0.2,
<<<<<<< HEAD
    api_key=openai_api_key or "dummy-key",
=======
    api_key=openai_api_key or "dummy-key"
>>>>>>> 61c0689124276422fb62bfd1b67cfe2b1f4045ab
)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
prompt = PromptTemplate(
    template="""
      You are a helpful assistant.
      Answer ONLY from the provided transcript context.
      If the context is insufficient, just say you don't know.

      {context}
      Question: {question}
    """,
    input_variables = ['context', 'question']
)

def get_youtube_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        transcript = " ".join(chunk["text"] for chunk in transcript_list)
        return transcript
    except TranscriptsDisabled:
        return None

def summarize_video(transcript, question):
    chunks = text_splitter.create_documents([transcript])
    vector_store = FAISS.from_documents(chunks, embeddings)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 4})
    retrieved_docs = retriever.invoke(question)
    context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
    final_prompt = prompt.invoke({"context": context_text, "question": question})
    answer = llm.invoke(final_prompt)
    return answer.content

@app.route("/api/summarize-youtube", methods=["POST"])
def summarize_youtube():
    data = request.json
    video_url = data.get("video_url")
    question = data.get("question", "Summarize this video")
    user_id = data.get("user_id")  # get user_id from request
    match = re.search(r"(?:v=|youtu\.be/|embed/)([A-Za-z0-9_-]{11})", video_url)
    video_id = match.group(1) if match else None
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400
    transcript = get_youtube_transcript(video_id)
    if not transcript:
        return jsonify({"error": "No transcript available"}), 400
    answer = summarize_video(transcript, question)
    # Store in Supabase (with user_id if provided)
    supabase = create_client(supabase_url, supabase_anon_key)
    insert_data = {
        "video_url": video_url,
        "video_id": video_id,
        "question": question,
        "answer": answer,
        "source_type": "youtube"
    }
    if user_id:
        insert_data["user_id"] = user_id
    supabase.table("video_summaries").insert(insert_data).execute()
    return jsonify({"summary": answer})

@app.route("/api/history", methods=["GET"])
def get_history():
    supabase = create_client(supabase_url, supabase_anon_key)
    res = supabase.table("video_summaries").select("*").order("created_at", desc=True).execute()
    return jsonify(res.data)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)