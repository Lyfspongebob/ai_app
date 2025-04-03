import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('YOUR_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://your_username:your_password@your_sql_url:port/your_database_name'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 会话配置
    SESSION_TYPE = 'sqlalchemy'
    SESSION_SQLALCHEMY_TABLE = 'sessions'  # 自定义会话表名
    PERMANENT_SESSION_LIFETIME = timedelta(hours=10)

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 3600,
        "max_overflow": 10
    }

    #你使用的大模型的api_url/api_key/knowledge_base_id
    MODEL_API_URL = 'YOUR_MODEL_API_URL'
    MODEL_API_KEY = 'YOUR_MODEL_API_KEY'
    KNOWLEDGE_BASE_ID = 'YOUR_KNOWLEDGE_BASE_ID'
