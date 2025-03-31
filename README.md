# 基于python flask框架实现的AI智能小助手，后序还将实现知识库的RAG
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
