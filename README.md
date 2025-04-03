# 基于python flask框架实现的AI智能小助手，并可添加知识库实现知识库的(RAG)
***
项目推荐使用智谱清言的大模型和知识库
***
## 1. 使用MySQL数据库存储对话内容

### 1.1 建立数据库命令行代码：
```
CREATE DATABASE ai_assistant;
USE ai_assistant;
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_input LONGTEXT NOT NULL,
    assistant_response LONGTEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
