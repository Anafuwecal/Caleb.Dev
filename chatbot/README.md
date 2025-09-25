## LangChain Chatbot (FastAPI)

A modular, production-ready AI chatbot built with Python 3.10+, FastAPI, and LangChain. It supports multiple LLM providers (OpenAI, Hugging Face), conversation memory, simple tool integrations, and API key authentication.

### Features
- **FastAPI backend** with `/chat` and `/health` endpoints
- **LangChain pipeline** with configurable model, temperature, and max tokens
- **Conversation memory** per session (in-memory or Redis)
- **Tools integration**: calculator and web search (DuckDuckGo HTML)
- **Security**: API key auth header `x-api-key` and basic rate limiting
- **Testing** with pytest (mocked LLM)
- **Docker** multi-stage build

### Project Structure
```
chatbot/
├── app/
│   ├── main.py
│   ├── routes/
│   │   └── chat.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── memory_service.py
│   │   └── tools_service.py
│   ├── models/
│   │   └── schemas.py
│   └── utils/
│       └── security.py
├── tests/
│   └── test_chat.py
├── .env.example
├── requirements.txt
├── Dockerfile
└── README.md
```

### Setup (Local)
1. Python 3.10+
2. Create and activate venv
```bash
python -m venv .venv
. .venv/bin/activate
```
3. Install dependencies
```bash
pip install -r requirements.txt
```
4. Copy env
```bash
cp .env.example .env
```
5. Set required variables in `.env`:
   - `API_KEY` for API authentication
   - `LLM_PROVIDER` = `openai` or `huggingface`
   - For OpenAI: `OPENAI_API_KEY`, `OPENAI_MODEL_NAME`
   - For Hugging Face: `HUGGINGFACEHUB_API_TOKEN`, `HF_MODEL_NAME`

6. Run server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### API
- `GET /health` → `{ "status": "ok" }`
- `POST /chat` with header `x-api-key: <API_KEY>`
```json
{
  "message": "Hello",
  "session_id": "optional-uuid",
  "model_name": "optional-model",
  "temperature": 0.2,
  "max_tokens": 256
}
```
Response:
```json
{ "response": "...", "session_id": "uuid" }
```

Tool commands inside messages:
- `/calc 1+2*3`
- `/search best python web framework`

### Memory Backends
- Default in-memory store (thread-safe)
- Redis: set `MEMORY_BACKEND=redis` and `REDIS_URL`, and ensure `redis` package is installed

### Testing
```bash
pytest -q
```
Tests mock the LLM provider and verify API validation, memory persistence, and tools.

### Docker
Build and run:
```bash
docker build -t langchain-chatbot .
docker run --rm -p 8000:8000 \
  -e API_KEY=change-me \
  -e OPENAI_API_KEY=sk-... \
  langchain-chatbot
```

### Cloud Deployment
- Heroku: use a container deployment. Set required env vars and map port 8000.
- Render: create a web service from repo. Start command:
  `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- AWS ECS/Fargate: push image to ECR and run a service exposing port 8000. Provide env vars in task definition or Secrets Manager.

### Extending Tools
Add a new function to `app/services/tools_service.py` and register it via `tool_registry.register("name", func)`. Users invoke via `/name <args>`.

### Notes
- For production, restrict CORS origins, strengthen rate limiting, and consider persistent logs.
- Consider structured logging, tracing, and monitoring.

