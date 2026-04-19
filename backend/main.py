from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import google.generativeai as genai
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- IMPORTANT: PASTE YOUR API KEY HERE ---
# Put your key inside the quotes below!
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
# ------------------------------------------

@app.get("/")
def home():
    return {"status": "success", "message": "Backend is running!"}

@app.post("/generate")
async def generate_flashcards(file: UploadFile = File(...)):
    # 1. Read the PDF
    pdf = PdfReader(file.file)
    text = ""
    for page in pdf.pages:
        if page.extract_text():
            text += page.extract_text()
            
    # To keep things fast, we will only send the first 15,000 characters to the AI
    short_text = text[:15000]

    # 2. Ask the AI to make flashcards
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert tutor. I am giving you text from a student's document.
    Create 5 high-quality flashcards from this text to help them study.
    
    CRITICAL INSTRUCTION: You must return ONLY a raw JSON array. Do not include markdown, code blocks, or the word 'json'.
    Format exactly like this:
    [
      {{"question": "What is X?", "answer": "X is..."}},
      {{"question": "How does Y work?", "answer": "Y works by..."}}
    ]
    
    Text to read: {short_text}
    """
    
    try:
        response = model.generate_content(prompt)
        
        # Clean up the AI's response to ensure it's pure JSON
        raw_output = response.text.strip().replace('```json', '').replace('```', '')
        
        # Convert the text into a real list of cards
        flashcards = json.loads(raw_output)
        
        return {"flashcards": flashcards}
        
    except Exception as e:
        # If the AI gets confused or the internet drops, send a fallback card so the app doesn't crash
        return {
            "flashcards": [
                {"question": "Oops! There was an AI error.", "answer": f"Error details: {str(e)}"}
            ]
        }
