from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.request_models import ReviewRequest
from models.response_models import ReviewResponse, Issue
from utils.parser import extract_added_lines
from agents.security import security_review
from services.review_service import run_review
from models.request_models import ChatRequest
from services.bob_service import bob_chat

app = FastAPI(
    title="PR Guardian AI",
    description="AI-powered Pull Request Reviewer using IBM Bob",
    version="1.0.0"
)

# Allow VS Code extension (Person B) to connect to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "PR Guardian AI Backend is Running 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/review", response_model=ReviewResponse)
def review_pr(request: ReviewRequest):

    (
        score,
        merge_ready,
        issues,
        summary,
        recommendation,
        bob_review_text,
    ) = run_review(request.diff)

    return ReviewResponse(
        review_score=score,
        merge_ready=merge_ready,
        summary=summary,
        recommendation=recommendation,
        issues=issues,
        ai_review=bob_review_text,
    )

@app.post("/chat")
def chat_with_bob(request: ChatRequest):
    answer = bob_chat(
        question=request.question,
        context=request.context
    )

    return {"answer": answer}