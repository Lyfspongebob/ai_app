document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatHistory = document.getElementById('chat-history');

    // 按下发送键后，重置输入框状态的函数
    const resetInput = () => {
        userInput.value = '正在思考...'; // 清空内容
        userInput.style.height = 'auto'; // 重置高度
        userInput.rows = 0; // 重置行数
        userInput.disabled = true;//锁定输入框
    };

    //显示回复内容后，重置输入框状态函数
    const resetInput2 = () => {
        userInput.value = ''; // 清空内容
        userInput.style.height = 'auto'; // 重置高度
        userInput.rows = 0; // 重置行数
        userInput.disabled = false;//解除锁定
    };

    sendButton.addEventListener('click', () => {
        const inputText = userInput.value.trim();
        if (inputText === '') {
            alert('请输入问题！');
            return;
        }

        // 显示用户输入
        chatHistory.innerHTML += `<div class="user-message">${inputText}</div>`;

        // 发送请求到后端
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_input: inputText })
        })
        .then(response => response.json())
        .then(data => {
    if (data.error) {
        alert(`错误: ${data.error}`);
    } else {
        // 创建临时div解析Markdown
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = marked.parse(data.assistant_response);

        // 插入到聊天历史
        const msgDiv = document.createElement('div');
        msgDiv.className = 'assistant-message';
        msgDiv.appendChild(tempDiv);

        //插入聊天内容
        chatHistory.appendChild(msgDiv);

        // 延迟执行高亮（确保DOM更新）
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach(hljs.highlightElement);
        }, 50);
        resetInput2();
    }
})

        .catch(error => {
            console.error('Error:', error);
            alert('无法获取回答，请稍后再试！');
        });
    });

    // 按下回车键发送消息
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
            resetInput();
            chatHistory.scrollTop = chatHistory.scrollHeight;//跳转到文尾
        }
    });

    // 处理Shift+Enter换行
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            // 允许换行
            return;
        }
    });

    // 自动调整输入框高度
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
