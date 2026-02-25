import uvicorn
import os
import logging
from logging.handlers import RotatingFileHandler
from fastapi import FastAPI
from init import init_app
import configparser
import fastapi_cdn_host
from core.dmdb import DamengDatabase

# 确保日志目录存在
log_dir = "logs"
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

logger = logging.getLogger(__name__)

app = FastAPI()
fastapi_cdn_host.patch_docs(app)
init_app(app)

# 读取配置文件
config = configparser.ConfigParser()
config.read('.config', encoding='utf-8')

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.get('app', 'host'), port=config.getint('app', 'port'), log_level="warning", reload=True)
