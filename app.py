import os
import re
import json
import http.client
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from supabase import create_client
from langchain_core.embeddings import Embeddings
from dotenv import load_dotenv
from gradio_client import Client

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# === Environment Variables ===
supabase_url = os.getenv("SUPABASE_URL")
supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")
RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY")

if not supabase_url or not supabase_anon_key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY are required")

# === Gradio Embedding Client ===
SPACE_NAME = "asr3232/Youtube_summarizer_model"
client = Client(SPACE_NAME, hf_token=HF_TOKEN)

class RemoteGradioEmbeddings(Embeddings):
    def __init__(self, client, normalize=True):
        self.client = client
        self.normalize = normalize

    def embed_documents(self, texts):
        text_input = json.dumps(texts) if isinstance(texts, list) else texts
        return self.client.predict(text_input, self.normalize, api_name="/embed")

    def embed_query(self, text):
        return self.embed_documents([text])[0]

embeddings = RemoteGradioEmbeddings(client)

# === OpenAI LLM ===
llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    model="google/gemma-3-12b-it:free",
    temperature=0.2,
    api_key=openai_api_key or "dummy-key",
)

# === Text Splitter and Prompt ===
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
prompt = PromptTemplate(
    template="""
      You are a helpful assistant.
      Answer ONLY from the provided transcript context.
      If the context is insufficient, just say you don't know.

      {context}
      Question: {question}
    """,
    input_variables=['context', 'question']
)

# === Transcript Fetching (RapidAPI first, fallback to YouTubeTranscriptApi) ===
def get_youtube_transcript(video_id, lang="en"):
    # Try RapidAPI first
    try:
        conn = http.client.HTTPSConnection("youtube-transcriptor.p.rapidapi.com")
        headers = {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': "youtube-transcriptor.p.rapidapi.com"
        }
        conn.request("GET", f"/transcript?video_id={video_id}&lang={lang}", headers=headers)
        res = conn.getresponse()
        data = res.read()
        json_data = json.loads(data.decode("utf-8"))

        if isinstance(json_data, list):
            json_data = json_data[0]

        if "transcription" in json_data:
            raw_text = " ".join(item["subtitle"] for item in json_data["transcription"])
            cleaned_text = re.sub(r"\s+", " ", raw_text)
            cleaned_text = cleaned_text.replace("&#39;", "'").replace("&quot;", '"')
            language_code = json_data.get("availableLangs", [lang])[0]
            return cleaned_text.strip(), language_code
    except Exception as e:
        print("RapidAPI transcript fetch failed:", e)

    # Fallback: YouTubeTranscriptApi
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        transcript = " ".join(chunk["text"] for chunk in transcript_list)
        return transcript, "en"
    except Exception:
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            first_transcript = next(iter(transcript_list))
            transcript = " ".join(chunk["text"] for chunk in first_transcript.fetch())
            return transcript, first_transcript.language_code
        except Exception:
            return None, None

# === Translation if needed ===
def translate_to_english(text, src_lang):
    if src_lang == "en":
        return text
    translation_prompt = f"Translate the following text to English (original language: {src_lang}):\n\n{text}"
    translation = llm.invoke(translation_prompt)
    return translation.content.strip()

# === Summarization Pipeline ===
def summarize_video(transcript, question):
    chunks = text_splitter.create_documents([transcript])
    vector_store = FAISS.from_documents(chunks, embeddings)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 4})
    retrieved_docs = retriever.invoke(question)
    context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
    final_prompt = prompt.invoke({"context": context_text, "question": question})
    answer = llm.invoke(final_prompt)
    return answer.content

# === API Endpoints ===
@app.route("/api/summarize-youtube", methods=["POST"])
def summarize_youtube():
    data = request.json
    video_url = data.get("video_url")
    question = data.get("question", "Summarize this video")
    user_id = data.get("user_id")

    match = re.search(r"(?:v=|youtu\.be/|embed/)([A-Za-z0-9_-]{11})", video_url)
    video_id = match.group(1) if match else None
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    transcript, lang = get_youtube_transcript(video_id)
    if not transcript:
        return jsonify({"error": f"No transcript available {video_id}"}), 400

    if lang != "en":
        transcript = translate_to_english(transcript, lang)

    answer = summarize_video(transcript, question)

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
