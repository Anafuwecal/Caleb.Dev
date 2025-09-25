import os
import uuid
from typing import List, Optional, Tuple

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda

from app.services.memory_service import memory_backend, chat_logger
from app.services.tools_service import tool_registry


class AIService:
    def __init__(self) -> None:
        self.default_model_name = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")
        self.default_temperature = float(os.getenv("TEMPERATURE", "0.2"))
        self.default_max_tokens = int(os.getenv("MAX_TOKENS", "512"))
        self.provider = os.getenv("LLM_PROVIDER", "openai").lower()

    # Lazy imports for provider packages to keep startup fast
    def _get_llm(self, model_name: str, temperature: float, max_tokens: int):  # type: ignore[override]
        provider = self.provider
        if provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                # Fallback lightweight echo LLM for tests/offline environments
                class _EchoLLM:
                    def invoke(self, data):  # noqa: ANN001 - simple stub
                        try:
                            msgs = data.to_messages()  # type: ignore[attr-defined]
                            last_human = next((m for m in reversed(msgs) if getattr(m, "type", "") == "human"), None)
                            content = getattr(last_human, "content", "")
                            return f"AI:{content}"
                        except Exception:
                            if isinstance(data, dict) and "input" in data:
                                return f"AI:{data['input']}"
                            return "AI:"

                return _EchoLLM()
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model=model_name, temperature=temperature, max_tokens=max_tokens)
        if provider == "huggingface":
            from langchain_huggingface import HuggingFaceEndpoint

            token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
            if not token:
                raise RuntimeError("HUGGINGFACEHUB_API_TOKEN not set for huggingface provider")
            repo_id = model_name or os.getenv("HF_MODEL_NAME", "mistralai/Mixtral-8x7B-Instruct-v0.1")
            return HuggingFaceEndpoint(repo_id=repo_id, temperature=temperature, max_new_tokens=max_tokens)
        raise ValueError(f"Unsupported LLM provider: {provider}")

    def _build_chain(self, llm):
        system_text = (
            "You are a helpful, concise assistant. Use the provided conversation history to maintain context. "
            "If the user asks factual questions, be accurate and cite assumptions briefly."
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_text),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        # Wrap arbitrary LLM-like objects into a Runnable
        wrapped_llm = RunnableLambda(lambda x: llm.invoke(x))
        return prompt | wrapped_llm | StrOutputParser()

    def _call_chain(self, chain, history: List[BaseMessage], user_input: str) -> str:
        return chain.invoke({"history": history, "input": user_input})

    def _handle_tool_commands(self, message: str) -> Optional[str]:
        # Simple convention: /calc <expr> or /search <query>
        parts = message.strip().split(" ", 1)
        if not parts:
            return None
        command = parts[0]
        arg = parts[1] if len(parts) > 1 else ""
        if command.startswith("/"):
            name = command[1:]
            if name in tool_registry.list():
                func = tool_registry.get(name)
                return func(arg)
        return None

    def chat(
        self,
        message: str,
        session_id: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> Tuple[str, str]:
        if not session_id:
            session_id = str(uuid.uuid4())

        # Tooling shortcut path
        tool_result = self._handle_tool_commands(message)
        if tool_result is not None:
            # Persist tool interaction as a turn in the conversation
            memory_backend.append(session_id, HumanMessage(content=message))
            memory_backend.append(session_id, AIMessage(content=tool_result))
            chat_logger.log({
                "session_id": session_id,
                "user": message,
                "response": tool_result,
                "provider": "tool",
            })
            return tool_result, session_id

        history = memory_backend.get_messages(session_id)

        chosen_model = model_name or self.default_model_name
        chosen_temp = temperature if temperature is not None else self.default_temperature
        chosen_max = max_tokens if max_tokens is not None else self.default_max_tokens
        # Support monkeypatching where _get_llm may be attached directly to the instance
        _getter = getattr(self, "_get_llm")
        try:
            llm = _getter(model_name=chosen_model, temperature=chosen_temp, max_tokens=chosen_max)
        except TypeError:
            llm = _getter(self, chosen_model, chosen_temp, chosen_max)
        chain = self._build_chain(llm)

        # Add the new human message to the working history for context
        working_history = history + [HumanMessage(content=message)]
        response_text = self._call_chain(chain, working_history, message)

        # Persist messages
        memory_backend.append(session_id, HumanMessage(content=message))
        memory_backend.append(session_id, AIMessage(content=response_text))

        chat_logger.log({
            "session_id": session_id,
            "user": message,
            "response": response_text,
            "provider": self.provider,
            "model": chosen_model,
        })

        return response_text, session_id


ai_service = AIService()

