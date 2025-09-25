import math
import operator
import os
import re
import urllib.parse
from typing import Any, Callable, Dict, List

import requests


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: Dict[str, Callable[..., str]] = {}

    def register(self, name: str, func: Callable[..., str]) -> None:
        self._tools[name] = func

    def get(self, name: str) -> Callable[..., str]:
        return self._tools[name]

    def list(self) -> List[str]:
        return list(self._tools.keys())


tool_registry = ToolRegistry()


def safe_calculator(expression: str) -> str:
    # Evaluate arithmetic expressions safely using AST-like whitelist via eval with restricted globals
    # Supports +, -, *, /, **, %, //, parentheses, math functions like sqrt, log
    allowed_names: Dict[str, Any] = {k: getattr(math, k) for k in (
        "sqrt",
        "log",
        "log10",
        "exp",
        "sin",
        "cos",
        "tan",
        "pi",
        "e",
        "fabs",
        "factorial",
    )}
    allowed_names.update({
        "abs": abs,
        "round": round,
        "min": min,
        "max": max,
    })
    # Disallow double underscores and other suspicious patterns
    if "__" in expression or re.search(r"[A-Za-z_][A-Za-z0-9_]*\s*=", expression):
        return "Error: invalid expression"
    try:
        result = eval(expression, {"__builtins__": {}}, allowed_names)
    except Exception as ex:  # noqa: BLE001
        return f"Error: {ex}"
    return str(result)


def simple_web_search(query: str, top_k: int = 3) -> str:
    # Extremely lightweight DDG HTML scrape. No API key required.
    q = urllib.parse.quote_plus(query)
    url = f"https://duckduckgo.com/html/?q={q}"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
    except Exception as ex:  # noqa: BLE001
        return f"Search error: {ex}"

    # Extract result titles and links
    titles = re.findall(r'class="result__a"[^>]*>(.*?)<', resp.text)
    links = re.findall(r'class="result__a"\s+href="([^"]+)"', resp.text)
    results: List[str] = []
    for i, title in enumerate(titles[:top_k]):
        link = links[i] if i < len(links) else ""
        # Strip HTML entities
        clean_title = re.sub(r"<.*?>", "", title)
        results.append(f"{clean_title} - {link}")
    if not results:
        return "No results found."
    return "\n".join(results)


# Register default tools
tool_registry.register("calc", safe_calculator)
tool_registry.register("search", simple_web_search)


def get_registered_tools() -> List[str]:
    return tool_registry.list()

