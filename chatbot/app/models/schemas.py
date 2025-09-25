from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="User's input message")
    session_id: Optional[str] = Field(None, description="Conversation/session identifier")
    model_name: Optional[str] = Field(None, description="LLM model name override")
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0, description="Sampling temperature override")
    max_tokens: Optional[int] = Field(None, gt=0, description="Max tokens override")


class ChatResponse(BaseModel):
    response: str
    session_id: str

