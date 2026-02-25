from fastapi import FastAPI
from app.router import init_router

def init_app(app: FastAPI):
    init_router(app)
