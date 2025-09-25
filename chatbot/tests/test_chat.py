import os
import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("API_KEY", "test-key")
os.environ.setdefault("OPENAI_API_KEY", "dummy")
os.environ.setdefault("LLM_PROVIDER", "openai")

from app.main import app  # noqa: E402
from app.services.ai_service import ai_service  # noqa: E402


@pytest.fixture(autouse=True)
def mock_llm(monkeypatch):
    class DummyLLM:
        def __init__(self, *args, **kwargs):
            pass

        def invoke(self, data):
            # Accept LCEL prompt values or dicts
            try:
                msgs = data.to_messages()  # type: ignore[attr-defined]
                last_human = next((m for m in reversed(msgs) if getattr(m, "type", "") == "human"), None)
                content = getattr(last_human, "content", "")
                return f"AI:{content}"
            except Exception:
                if isinstance(data, dict) and "input" in data:
                    return f"AI:{data['input']}"
                return "AI:"

    def fake_get_llm(self, model_name, temperature, max_tokens):
        return DummyLLM()

    monkeypatch.setattr(ai_service, "_get_llm", fake_get_llm)
    yield


client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_chat_requires_api_key():
    r = client.post("/chat", json={"message": "Hello"})
    assert r.status_code == 401


def test_chat_basic_response():
    r = client.post(
        "/chat",
        headers={"x-api-key": os.environ["API_KEY"]},
        json={"message": "Hello"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["response"].startswith("AI:")
    assert "session_id" in data


def test_memory_persists_session(monkeypatch):
    headers = {"x-api-key": os.environ["API_KEY"]}
    r1 = client.post("/chat", headers=headers, json={"message": "First"})
    sid = r1.json()["session_id"]
    r2 = client.post("/chat", headers=headers, json={"message": "Second", "session_id": sid})
    assert r2.status_code == 200
    assert r2.json()["session_id"] == sid


def test_tools_calc():
    r = client.post(
        "/chat",
        headers={"x-api-key": os.environ["API_KEY"]},
        json={"message": "/calc 1+2*3"},
    )
    assert r.status_code == 200
    assert r.json()["response"] == "7"

