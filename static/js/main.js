document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatHistory = document.getElementById('chat-history');
    const enhancedSearchButton = document.getElementById('enhanced-search-button');

    let isEnhancedSearch = false; // 初始增强搜索按钮为false 静默状态，'let'声明为局部变量

     // 
    enhancedSearchButton.addEventListener('click', function () {
            isEnhancedSearch = !isEnhancedSearch; // 每次点击都更改bool值
            if (isEnhancedSearch) {
                this.classList.add('active'); // 激活状态渲染
            } else {
                this.classList.remove('active'); // 静默状态渲染
            }
    });

    // 锁定发送按钮状态
    const setSendButtonState = (isDisabled) => {
        sendButton.disabled = isDisabled;
        sendButton.style.opacity = isDisabled ? 0.7 : 1;
        sendButton.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
    };

    // 按下发送键后，重置输入框状态的函数
    const resetInput = () => {
        userInput.value = '正在思考...';
        userInput.style.height = 'auto';//重置高度
        userInput.rows = 0;//重置行数
        userInput.disabled = true;//锁定输入框
    };

    // 显示回复内容后，重置输入框状态函数
    const resetInput2 = () => {
        userInput.value = '';
        userInput.style.height = 'auto';
        userInput.rows = 0;
        userInput.disabled = false;
    };

    // 发送消息的函数
    const sendMessage = () => {
        const inputText = userInput.value.trim();
        if (inputText === '') {
            alert('请输入问题！');
            setTimeout(resetInput2, 0);
            return;
        }

        // 锁定发送按钮
        setSendButtonState(true);

        // 显示用户输入
        const formattedInputText = inputText.replace(/\n/g, '<br>');
        chatHistory.innerHTML += `<div class="user-message">${formattedInputText}</div>`;

        // 发送请求到后端
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user_input: inputText,
                enhanced_search: isEnhancedSearch // 向后端传送增强搜索bool值
            })
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

                // 插入聊天内容
                chatHistory.appendChild(msgDiv);

                // 延迟执行高亮（确保DOM更新）
                setTimeout(() => {
                    document.querySelectorAll('pre code').forEach(hljs.highlightElement);
                }, 50);
            }
            // 无论成功或失败，都解锁发送按钮
            setSendButtonState(false);
            resetInput2();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('无法获取回答，请稍后再试！');
            setSendButtonState(false);
            resetInput2();
        });
    };

    // 点击按钮发送消息
    sendButton.addEventListener('click', sendMessage);

    // 键盘事件处理 (enter发送 shift+enter换行)
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
            resetInput();
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    });

    // 自动调整输入框高度
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
