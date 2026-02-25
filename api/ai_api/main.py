from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from pydantic import BaseModel
from typing import TypedDict, List
from langchain_community.chat_models import ChatZhipuAI
from langchain_openai import ChatOpenAI
from langchain.chat_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
import time


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 1. 初始化LLM ==========
llm = ChatOpenAI(
    temperature=0.7,
    model="glm-4.6v",
    openai_api_key=os.getenv("ZHIPUAI_API_KEY"),
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)

# ========== 2. 定义状态 ==========
class ChatState(TypedDict):
    messages: List[str]
    current_question: str
    current_answer: str
    turn: int


# ========== 3. 定义节点 ==========
async def generate(state: ChatState) -> ChatState:
    """生成回答（LLM）"""
    question = state["current_question"]
    turn = state["turn"]
    history = state["messages"]

    # 构建提示词
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"你是智能客服，这是第{turn}轮对话。请简洁回答问题。"),
        ("human", f"问题：{question}\n历史对话：{history}")
    ])

    chain = prompt | llm | StrOutputParser()
    answer = await chain.ainvoke({
        "question": question,
        "history": history
    })

    return {**state, "current_answer": answer}


def update(state: ChatState) -> ChatState:
    """更新历史"""
    new_messages = state["messages"] + [
        f"用户: {state['current_question']}",
        f"客服: {state['current_answer']}"
    ]
    return {**state, "messages": new_messages}


def should_continue(state: ChatState) -> str:
    """判断是否继续（最多3轮）"""
    if state["turn"] >= 3:
        return "end"
    return "continue"


# ========== 4. 创建图 ==========
graph = StateGraph(ChatState)

graph.add_node("generate", generate)
graph.add_node("update", update)

graph.set_entry_point("generate")
graph.add_edge("generate", "update")
# graph.add_conditional_edges(
#     "update",
#     should_continue,
#     {"continue": "generate", "end": END}
# )
graph.add_edge("update", END)

checkpointer = MemorySaver()
app_graph = graph.compile(checkpointer=checkpointer)


# ========== 5. SSE流式生成器 ==========
async def chat_stream(question: str, thread_id: str):
    """SSE流式生成器"""
    config = {"configurable": {"thread_id": thread_id}}

    # 获取历史消息
    prev = app_graph.get_state(config)
    messages = prev.values.get("messages", []) if prev else []
    turn = len(messages) // 2 + 1

    state = {
        "messages": messages,
        "current_question": question,
        "current_answer": "",
        "turn": turn
    }

    result = await app_graph.ainvoke(state, config=config)
    if "current_answer" in result:
        answer = result['current_answer']
        for char in answer:
            yield f"data: {char}\n\n"
            time.sleep(0.5)

    # 发送完成信号
    yield "data: [DONE]\n\n"


# ========== 6. API接口 ==========
class ChatRequest(BaseModel):
    message: str


@app.post("/chat/{thread_id}")
async def chat(thread_id: str, request: ChatRequest):
    """聊天接口"""
    return StreamingResponse(
        chat_stream(request.message, thread_id),
        media_type="text/event-stream"
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
