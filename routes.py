from flask import Blueprint, request, jsonify, session
from models import db, Conversation
import requests
import re
import json
from config import Config

api_bp = Blueprint('api', __name__)

def clean_markdown(text):
    # 只处理加粗和换行，保留```代码块```
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)  # 加粗转HTML
    text = text.replace('\n', '<br>')  # 换行符转HTML
    return text

@api_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        user_input = data.get('user_input')
        enhanced_search = data.get('enhanced_search',False)

        if not user_input:
            return jsonify({'error': 'No input'}), 400

        # 从数据库获取最近30轮对话作为上下文
        recent_messages = Conversation.get_recent_conversations(limit=30)

        # 构建消息历史 (按时间升序排列)
        messages = []
        for conv in reversed(recent_messages):  # 从旧到新排序
            messages.append({"role": "user", "content": conv.user_input})
            messages.append({"role": "assistant", "content": conv.assistant_response})

        # 添加当前用户消息
        messages.append({"role": "user", "content": user_input})

        # 调用模型API（按DeepSeek API文档构造请求体）
        headers = {
            'Authorization': f'Bearer {Config.MODEL_API_KEY}',
            'Content-Type': 'application/json'
        }

        data = {
            "model": "glm-4-plus",
            "messages": messages,
            "temperature": 0.8
        }

        if enhanced_search:
            data['tools'] = [
                    {
                        "type": "retrieval",
                        "retrieval": {
                            "knowledge_id": Config.KNOWLEDGE_BASE_ID,
                            # "prompt_template": "请从文档:\n\"\"\"\n{{knowledge}}\n\"\"\"\n中回答:\n\"\"\"\n{{question}}\n\"\"\""
                        }
                    }
                ]
        
        response = requests.post(
            Config.MODEL_API_URL,
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()  # 自动抛出HTTP错误

        # 解析响应（按DeepSeek响应格式调整）
        response_data = response.json()
        assistant_response = response_data['choices'][0]['message']['content']  # 关键解析路径

        # 预处理Markdown → 纯文本
        cleaned_response = clean_markdown(assistant_response)

        # 安全截断（保留前10000字符）
        if len(assistant_response) > 10000:
            assistant_response = assistant_response[:10000] + "\n...(内容过长自动截断)"

        # 保存到数据库
        conversation = Conversation(
            user_input=user_input,
            assistant_response=assistant_response #数据库还是存储未修改格式的字符串
        )
        db.session.add(conversation)
        db.session.commit()

        return jsonify({
            'user_input': user_input,
            'assistant_response': assistant_response
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    except requests.exceptions.RequestException as e:
        db.session.rollback()
        return jsonify({'error': f'模型API错误: {str(e)}'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'服务器内部错误: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        db.session.rollback()
        # 添加响应内容输出
        error_detail = f"API错误: {str(e)} | 响应状态码: {e.response.status_code if e.response else '无'}"
        print(f"Debug - 模型API错误详情: {error_detail}")  # 控制台输出详细日志
        return jsonify({'error': error_detail}), 500
