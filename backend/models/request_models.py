from pydantic import BaseModel
from typing import List

class ReviewRequest(BaseModel):
    pr_title: str
    pr_description: str
    changed_files: List[str]
    diff: str

class ChatRequest(BaseModel):
    question: str
    context: str