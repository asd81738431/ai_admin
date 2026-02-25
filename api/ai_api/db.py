import configparser
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
import os

config = configparser.ConfigParser()

db_user = "root"
db_host = "localhost"
db_port = 3306
db_password = "root123"
db_database = "ai_admin"

def discover_models():
    """发现指定目录下的模型"""
    model_modules = []

    try:
        # 使用相对路径
        model_dir = os.path.join(os.path.dirname(__file__), "model")
        if os.path.exists(model_dir):
            for filename in os.listdir(model_dir):
                if filename.endswith('.py') and filename != '__init__.py':
                    module_name = filename[:-3]
                    # 使用相对导入路径
                    model_modules.append(f"api.ai_api.model.{module_name}")
    except Exception as e:
        print(f"Discover models error: {e}")

    return model_modules

# 动态获取模型配置
model_modules = discover_models()

# 使用完整的配置字典
TORTOISE_ORM = {
    "connections": {
        "default": f"mysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_database}"
    },
    "apps": {
        "models": {
            "models": ["api.ai_api.model.user", "api.ai_api.model.product", "api.ai_api.model.order"],
            "default_connection": "default",
        }
    },
    "use_tz": False,
    "timezone": "UTC",
    "db_pool": {
        "max_size": 100,
        "min_size": 5,
        "idle_timeout": 300,
        "max_inactive_connection_lifetime": 3600,
    }
}

def init_db(app: FastAPI):
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=True, # 暂时不自动生成数据库表
        add_exception_handlers=True,
    )
