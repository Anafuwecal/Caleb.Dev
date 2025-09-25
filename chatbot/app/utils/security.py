import os
import time
from typing import Dict

from fastapi import Header, HTTPException


_RATE_BUCKET: Dict[str, Dict[str, float]] = {}
_RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "120"))


async def api_key_auth(x_api_key: str | None = Header(default=None)) -> None:
    expected = os.getenv("API_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="Server not configured: API_KEY missing")
    if x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


async def rate_limiter(x_api_key: str | None = Header(default=None)) -> None:
    # Very simple token bucket per API key
    key = x_api_key or "anonymous"
    now = time.time()
    window = 60.0
    bucket = _RATE_BUCKET.get(key)
    if not bucket or now - bucket["start"] > window:
        _RATE_BUCKET[key] = {"start": now, "count": 1}
        return
    if bucket["count"] >= _RATE_LIMIT_PER_MINUTE:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    bucket["count"] += 1

