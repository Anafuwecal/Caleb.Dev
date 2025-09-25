import json
import os
import threading
from typing import Dict, List

try:
    import redis  # type: ignore
except Exception:  # pragma: no cover - optional
    redis = None

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage


def _message_to_dict(message: BaseMessage) -> Dict[str, str]:
    if isinstance(message, HumanMessage):
        return {"type": "human", "content": message.content}
    if isinstance(message, AIMessage):
        return {"type": "ai", "content": message.content}
    return {"type": "other", "content": message.content}


def _dict_to_message(data: Dict[str, str]) -> BaseMessage:
    if data.get("type") == "human":
        return HumanMessage(content=data.get("content", ""))
    if data.get("type") == "ai":
        return AIMessage(content=data.get("content", ""))
    return AIMessage(content=data.get("content", ""))


class MemoryBackend:
    def __init__(self) -> None:
        self.backend = os.getenv("MEMORY_BACKEND", "memory").lower()
        self._lock = threading.Lock()

        if self.backend == "redis":
            url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
            if not redis:
                raise RuntimeError("redis package not installed; install and set REDIS_URL or use MEMORY_BACKEND=memory")
            self.client = redis.from_url(url)  # type: ignore[attr-defined]
        else:
            self._store: Dict[str, List[BaseMessage]] = {}

    def get_messages(self, session_id: str) -> List[BaseMessage]:
        if self.backend == "redis":
            key = f"chat:sessions:{session_id}"
            raw = self.client.get(key)
            if not raw:
                return []
            data = json.loads(raw)
            return [_dict_to_message(item) for item in data]
        with self._lock:
            return list(self._store.get(session_id, []))

    def append(self, session_id: str, message: BaseMessage) -> None:
        if self.backend == "redis":
            key = f"chat:sessions:{session_id}"
            msgs = self.get_messages(session_id)
            msgs.append(message)
            self.client.set(key, json.dumps([_message_to_dict(m) for m in msgs]))
            return
        with self._lock:
            if session_id not in self._store:
                self._store[session_id] = []
            self._store[session_id].append(message)

    def clear(self, session_id: str) -> None:
        if self.backend == "redis":
            key = f"chat:sessions:{session_id}"
            self.client.delete(key)
            return
        with self._lock:
            self._store.pop(session_id, None)


class ChatLogger:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._logs: List[Dict] = []

    def log(self, record: Dict) -> None:
        with self._lock:
            self._logs.append(record)

    def get_logs(self) -> List[Dict]:
        with self._lock:
            return list(self._logs)


memory_backend = MemoryBackend()
chat_logger = ChatLogger()

