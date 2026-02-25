import sys
import os

# 将项目根目录添加到 sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI, Request
from typing import TypedDict, List, Optional
from fastapi.responses import StreamingResponse
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.messages import SystemMessage
from sse_starlette.sse import EventSourceResponse
from langgraph.graph import START, StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from pydantic import BaseModel
from typing import TypedDict, List
from langchain_community.chat_models import ChatZhipuAI
from langchain_openai import ChatOpenAI
from langchain.chat_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from api.ai_api.model.user import User
from api.ai_api.model.product import Product
from api.ai_api.model.order import Order
from dataclasses import dataclass
from api.ai_api.db import init_db, TORTOISE_ORM
from tortoise import Tortoise
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
    model="glm-4.7",
    openai_api_key=os.getenv("ZHIPUAI_API_KEY"),
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)

# ========== 2. 定义状态 ==========
class ChatState(TypedDict):
    messages: List[str]
    current_question: str
    current_answer: str
    route: str

# ========== agent定义工具 ===========
@tool(description="获取用户信息")
async def get_user_info(
    email: Optional[str] = None,
    name: Optional[str] = None,
    user_id: Optional[int] = None,
):
    """获取用户信息

    Args:
        email (Optional[str]): 用户邮箱
        name (Optional[str]): 用户名
        user_id (Optional[int]): 用户ID
    
    Returns:
        dict: 
            "user_id": int, 用户ID
            "name": str, 用户名
            "email": str, 用户邮箱
        | dict: 用户信息或错误提示
    """
    if email:
        user = await User.get_or_none(email=email)
        if user:
            return {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
            }
        else:
            return {"err": "用户不存在"}
    elif name:
        user = await User.get_or_none(name=name)
        if user:
            return {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
            }
        else:
            return {"err": "用户不存在"}
    elif user_id:
        user = await User.get_or_none(id=user_id)
        if user:
            return {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
            }
        else:
            return {"err": "用户不存在"}
    else:
        return {"err": "请提供邮箱、姓名或用户ID"}

@tool(description="获取产品信息")
async def get_product_info(
    product_id: Optional[int] = None,
    product_name: Optional[str] = None,
):
    """获取产品信息
    Args:
        product_id (Optional[int]): 产品ID
        product_name (Optional[str]): 产品名称
    
    Returns:
        dict: 
            "product_id": int, 产品ID
            "name": str, 产品名称
            "amount": str, 产品金额
        | dict: 产品信息或错误提示
    """
    if product_id:
        product = await Product.get_or_none(id=product_id)
        if product:
            return {
                "product_id": product.id,
                "name": product.name,
                "amount": product.amount,
            }
        else:
            return {"err": "产品不存在"}
    elif product_name:
        product = await Product.get_or_none(name=product_name)
        if product:
            return {
                "product_id": product.id,
                "name": product.name,
                "amount": product.amount,
            }
        else:
            return {"err": "产品不存在"}
    else:
        return {"err": "请提供产品ID或产品名称"}

@tool(description="获取订单信息")
async def get_order_info(
    order_id: Optional[int] = None,
    user_id: Optional[int] = None,
    product_id: Optional[int] = None,
):
    """获取订单信息
    Args:
        order_id (Optional[int]): 订单ID
        user_id (Optional[int]): 用户ID
        product_id (Optional[int]): 产品ID
    
    Returns:
        dict: 
            "order_id": int, 订单ID
            "order_num": str, 订单号
            "user_id": int, 用户ID
            "user_name": str, 用户名
            "amount": str, 订单金额
        | dict: 订单信息或错误提示
    """
    if order_id:
        order = await Order.get_or_none(id=order_id)
        if order:
            return {
                "order_id": order.id,
                "order_num": order.order_num,
                "user_id": order.user_id,
                "user_name": order.user_name,
                "amount": order.amount,
            }
        else:
            return {"err": "订单不存在"}
    elif user_id:
        orders = await Order.filter(user_id=user_id).all()
        if orders:
            return [
                {
                    "order_id": order.id,
                    "order_num": order.order_num,
                    "user_id": order.user_id,
                    "user_name": order.user_name,
                    "amount": order.amount,
                }
                for order in orders
            ]
        else:
            return {"err": "用户不存在订单"}
    elif product_id:
        orders = await Order.filter(product_id=product_id).all()
        if orders:
            return [
                {
                    "order_id": order.id,
                    "order_num": order.order_num,
                    "user_id": order.user_id,
                    "user_name": order.user_name,
                    "amount": order.amount,
                }
                for order in orders
            ]
        else:
            return {"err": "产品不存在订单"}
    else:
        return {"err": "请提供订单ID、用户ID或产品ID"}

tools = [get_user_info, get_product_info, get_order_info]

agent = create_react_agent(llm, tools)
# ========== 3. 定义节点 ==========
def should_use_agent(state: ChatState) -> ChatState:
    """判断是否需要调用 Agent"""
    question = state["current_question"]

    # 方案A：规则判断（简单快速）
    complex_keywords = ["订单", "用户", "产品"]
    for kw in complex_keywords:
        if kw in question:
            return {**state, "route": "agent"}   # 需要 Agent

    # 方案B：LLM 判断（更准确）
    # prompt = f"""判断以下问题是否需要查询数据库：
    # 问题：{question}
    # 需要查询数据回答：yes / no"""
    # result = llm.invoke(prompt)
    # return "agent" if "yes" in result.content.lower() else "direct"

    return {**state, "route": "llm"}


async def agent_handle(state: ChatState) -> ChatState:
    """生成回答"""
    question = state["current_question"]

    result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})
    final_result = result["messages"][-1].content if result.get("messages") else "无回复"
    return {**state, "current_answer": final_result}

async def llm_handle(state: ChatState) -> ChatState:
    """生成回答"""
    question = state["current_question"]
    history = state["messages"]

    # 构建提示词
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"你是智能客服，请简洁回答问题。"),
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


# ========== 4. 创建图 ==========
graph = StateGraph(ChatState)

graph.add_node("should_use_agent", should_use_agent)
graph.add_node("agent_handle", agent_handle)
graph.add_node("llm_handle", llm_handle)
graph.add_node("update", update)

# 定义路由函数
def route_based_on_condition(state: ChatState) -> str:
    """根据条件路由到不同节点"""
    return state.get("route", "llm")

graph.set_entry_point("should_use_agent")
graph.add_conditional_edges(
    "should_use_agent",
    route_based_on_condition,
    {
        "agent": "agent_handle",
        "llm": "llm_handle",
    },
)
graph.add_edge("llm_handle", "update")
graph.add_edge("agent_handle", END)
graph.add_edge("update", END)

# checkpointer = MemorySaver()
# app_graph = graph.compile(checkpointer=checkpointer)
graph = graph.compile()

# ========== 5. SSE流式生成器 ==========
async def chat_stream(question: str, thread_id: str):
    """SSE流式生成器"""
    # config = {"configurable": {"thread_id": thread_id}}

    # 获取历史消息
    # prev = graph.get_state(config)
    # messages = prev.values.get("messages", []) if prev else []
    messages = []

    state = {
        "messages": messages,
        "current_question": question,
        "current_answer": "",
        "route": "llm",
    }

    try:
        result = await graph.ainvoke(state)
        if "current_answer" in result:
            answer = result['current_answer']
            for char in answer:
                yield f"data: {char}\n\n"
                await asyncio.sleep(0.05)

        # 发送完成信号
        yield "data: [DONE]\n\n"
    except asyncio.CancelledError:
        # 客户端断开连接，安静地终止
        raise
    except Exception:
        # 静默处理其他连接错误
        pass

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

if __name__ == "__main__":
    import uvicorn

    init_db(app)
    uvicorn.run(app, host="0.0.0.0", port=8000)
