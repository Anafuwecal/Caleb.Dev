import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.chat import router as chat_router


load_dotenv()


def create_app() -> FastAPI:
    app = FastAPI(title="LangChain Chatbot", version="1.0.0")

    # Basic CORS (adjust as needed)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(chat_router)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()

