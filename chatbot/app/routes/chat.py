from fastapi import APIRouter, Depends, HTTPException

from app.models.schemas import ChatRequest, ChatResponse
from app.utils.security import api_key_auth, rate_limiter
from app.services.ai_service import ai_service


router = APIRouter(prefix="", tags=["chat"])


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(api_key_auth), Depends(rate_limiter)])
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    try:
        response_text, session_id = ai_service.chat(
            message=payload.message,
            session_id=payload.session_id,
            model_name=payload.model_name,
            temperature=payload.temperature,
            max_tokens=payload.max_tokens,
        )
        return ChatResponse(response=response_text, session_id=session_id)
    except Exception as exc:  # noqa: BLE001 - return safe error
        raise HTTPException(status_code=500, detail=str(exc)) from exc

