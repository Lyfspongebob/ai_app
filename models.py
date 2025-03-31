from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    assistant_response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    @classmethod
    def get_recent_conversations(cls, limit=30):
        """获取最近的对话记录"""
        return cls.query.order_by(cls.timestamp.desc()).limit(limit*2).all()  # 获取limit轮对话
