// Global variables
let chatMessages = [];
let isTyping = false;

// Initialize the chat page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupAutoScroll();
    focusMessageInput();
});

// Setup event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        messageInput.addEventListener('input', function() {
            // Auto-resize textarea if needed
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

// Setup auto-scroll for chat messages
function setupAutoScroll() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Scroll to bottom initially
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Focus message input
function focusMessageInput() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
    }
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable send button temporarily
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.disabled = true;
    }
    
    try {
        // Add user message to chat
        addMessage(message, 'user');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        const result = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add bot response to chat
        addMessage(result.response, 'bot');
        
    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    } finally {
        // Re-enable send button
        if (sendButton) {
            sendButton.disabled = false;
        }
        
        // Focus input
        messageInput.focus();
    }
}

// Send quick message
function sendQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = message;
        sendMessage();
    }
}

// Add message to chat
function addMessage(message, sender) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message fade-in`;
    
    const avatar = sender === 'bot' ? 
        '<i class="fas fa-robot"></i>' : 
        '<i class="fas fa-user"></i>';
    
    messageElement.innerHTML = `
        <div class="message-content">
            <div class="avatar">
                ${avatar}
            </div>
            <div class="message-text">
                ${formatMessage(message)}
            </div>
        </div>
    `;
    
    chatContainer.appendChild(messageElement);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Store message
    chatMessages.push({ message, sender, timestamp: new Date() });
}

// Format message with proper line breaks and structure
function formatMessage(message) {
    // Replace newlines with <br> tags
    let formattedMessage = message.replace(/\n/g, '<br>');
    
    // Convert bullet points to HTML lists
    if (formattedMessage.includes('- ')) {
        const lines = formattedMessage.split('<br>');
        let inList = false;
        let result = [];
        
        for (let line of lines) {
            if (line.trim().startsWith('- ')) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                result.push(`<li>${line.replace('- ', '')}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (line.trim()) {
                    result.push(`<p>${line}</p>`);
                }
            }
        }
        
        if (inList) {
            result.push('</ul>');
        }
        
        formattedMessage = result.join('');
    } else {
        // Convert to paragraphs
        const paragraphs = formattedMessage.split('<br>').filter(p => p.trim());
        if (paragraphs.length > 1) {
            formattedMessage = paragraphs.map(p => `<p>${p}</p>`).join('');
        } else {
            formattedMessage = `<p>${formattedMessage}</p>`;
        }
    }
    
    return formattedMessage;
}

// Show typing indicator
function showTypingIndicator() {
    if (isTyping) return;
    
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot-message typing-indicator';
    typingElement.id = 'typingIndicator';
    
    typingElement.innerHTML = `
        <div class="message-content">
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-text">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    isTyping = true;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingElement = document.getElementById('typingIndicator');
    if (typingElement) {
        typingElement.remove();
        isTyping = false;
    }
}

// Clear chat
function clearChat() {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        // Keep the initial bot message
        const initialMessage = chatContainer.querySelector('.message.bot-message');
        chatContainer.innerHTML = '';
        if (initialMessage) {
            chatContainer.appendChild(initialMessage);
        }
    }
    
    chatMessages = [];
}

// Export chat history
function exportChat() {
    const chatHistory = chatMessages.map(msg => 
        `${msg.sender.toUpperCase()}: ${msg.message}`
    ).join('\n\n');
    
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Add typing animation CSS
const style = document.createElement('style');
style.textContent = `
    .typing-indicator .message-text {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 15px;
        min-height: 60px;
        display: flex;
        align-items: center;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #007bff;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) {
        animation-delay: 0s;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
        }
        40% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .message.fade-in {
        animation: fadeInUp 0.3s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Handle window resize
window.addEventListener('resize', function() {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        focusMessageInput();
    }
});
