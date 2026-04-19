# ⚡ The Flashcard Engine

An AI-powered web application that instantly transforms any study material (PDFs) into interactive, practice-ready flashcards. Built for the Cuemath AI Builder Challenge.

---
## 🔗 Live Demo
**https://joyful-beijinho-b394b7.netlify.app**

---
## 🚀 Features
* **Intelligent Document Parsing:** Upload any PDF document, and the backend extracts the text automatically.
* **AI Generation:** Powered by Google's Gemini 2.5 Flash model, the system intelligently identifies key concepts and generates question/answer pairs.
* **Spaced Repetition UI:** Interactive frontend allowing users to flip cards and rate difficulty (Hard, Good, Easy).

---
## 💻 Tech Stack
* **Frontend:** Vanilla HTML, CSS, JavaScript (Deployed on Netlify)
* **Backend:** Python, FastAPI, PyPDF (Deployed on Render)
* **AI Model:** Google Gemini 2.5 Flash API

---
## 🛠️ Local Setup
To run this project locally:

1. Clone the repository
2. Install backend dependencies: `pip install -r backend/requirements.txt`
3. Set your `GEMINI_API_KEY` as an environment variable.
4. Run the backend server: `python -m uvicorn backend.main:app --reload`
5. Open `frontend/index.html` in your browser.
