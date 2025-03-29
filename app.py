from flask import Flask, render_template, session
from config import Config
from models import db
from routes import api_bp
from flask_session import Session

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

app.config['SESSION_SQLALCHEMY'] = db
Session(app)  # 确保在注册蓝图前初始化
app.register_blueprint(api_bp,url_prefix='/api')

@app.before_request
def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
