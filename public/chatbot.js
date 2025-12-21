(function () {
    const CHATBOT_WIDTH = "350px";
    const CHATBOT_HEIGHT = "450px";
    const PRIMARY_COLOR = "#007bff"; 

    const ORDER_QUERY_TEMPLATE = [
        { sender: "bot", text: "Hello! I am your order assistant. How can I help you today?" },
        { sender: "bot", text: "Please select a query or enter your <b>Order Number</b>." },
        { sender: "user-template", text: "Where is my order?" },
        { sender: "user-template", text: "I need to change my delivery address." },
        { sender: "user-template", text: "I want to cancel an item." }
    ];

    const container = document.createElement("div");
    container.id = "my-chatbot-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    const style = document.createElement("style");
    style.innerHTML = `
        /* General Reset for Chat Elements */
        #my-chatbot-container * {
            box-sizing: border-box;
            font-family: sans-serif;
        }

        /* Chat Icon/Button */
        #chatbot-icon {
            width: 50px;
            height: 50px;
            background-color: ${PRIMARY_COLOR};
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s;
            user-select: none; /* Prevent text selection */
        }
        #chatbot-icon:hover {
            transform: scale(1.05);
        }

        /* Chat Window */
        #chatbot-window {
            width: ${CHATBOT_WIDTH};
            height: ${CHATBOT_HEIGHT};
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            margin-bottom: 10px;
            overflow: hidden;
            display: none; /* Initially hidden */
            flex-direction: column;
        }

        /* Chat Header */
        .chat-header {
            background-color: ${PRIMARY_COLOR};
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Message Area */
        .message-area {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            background-color: #f7f9fc;
        }

        /* Message Styling */
        .message {
            margin-bottom: 10px;
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 18px;
            line-height: 1.4;
        }
        .bot-message {
            background-color: #e9e9eb;
            color: #333;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .user-template-message {
            background-color: ${PRIMARY_COLOR};
            color: white;
            cursor: pointer;
            display: inline-block;
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }
        .user-template-message:hover {
            opacity: 0.9;
        }

        /* Input Area (Simple placeholder for now) */
        .input-area {
            padding: 10px 15px;
            border-top: 1px solid #ddd;
            background-color: #fff;
            text-align: center;
            color: #777;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
        <div id="chatbot-window">
            <div class="chat-header">
                <span>Order Help Chatbot</span>
                <span id="close-chat" style="cursor: pointer;">&times;</span>
            </div>
            <div class="message-area" id="message-area">
                </div>
            <div class="input-area">
                Type your order number or click a template...
            </div>
        </div>
        <div id="chatbot-icon">💬</div>
    `;

    const chatIcon = document.getElementById("chatbot-icon");
    const chatWindow = document.getElementById("chatbot-window");
    const closeChat = document.getElementById("close-chat");
    const messageArea = document.getElementById("message-area");

    function renderMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");

        if (sender === "bot") {
            msgDiv.classList.add("bot-message");
        } else if (sender === "user-template") {
            msgDiv.classList.add("user-template-message");
            msgDiv.setAttribute('data-template', text); 
            msgDiv.onclick = function() {
                alert(`Query submitted: "${text.replace(/<[^>]*>/g, '')}"`); 
                chatWindow.style.display = 'none'; 
                // chatIcon.innerHTML = '✅';
                setTimeout(() => chatIcon.innerHTML = '💬', 1500);
            };
        }
        
        msgDiv.innerHTML = text;
        messageArea.appendChild(msgDiv);
    }

    function loadTemplateMessages() {
        messageArea.innerHTML = ""; 
        ORDER_QUERY_TEMPLATE.forEach(msg => {
            renderMessage(msg.sender, msg.text);
        });
        messageArea.scrollTop = messageArea.scrollHeight;
    }


    function toggleChat() {
        if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
            chatWindow.style.display = 'flex';
            loadTemplateMessages(); 
            chatIcon.innerHTML = '−'; 
        } else {
            chatWindow.style.display = 'none';
            chatIcon.innerHTML = '💬'; 
        }
    }

    chatIcon.addEventListener("click", toggleChat);
    closeChat.addEventListener("click", toggleChat);

    chatWindow.style.display = 'none';
})();