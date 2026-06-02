const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Create a unique random session identifier for this browser tab instance
const sessionId = "session-" + Math.random().toString(36).substring(2, 11);

// Helper function to append a message bubble into the window interface
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scrolls to the newest message
}

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Show user message instantly on screen
    appendMessage(text, 'user');
    userInput.value = '';

    // 2. Add a loading placeholder for the AI
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = 'Thinking...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Make the API network request directly to your local Node server running on port 3000
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message: text })
        });

        const data = await response.json();
        
        // 4. Clean up loader and swap with actual AI response string data
        loadingDiv.remove();
        if (data.success) {
            appendMessage(data.reply, 'bot');
        } else {
            appendMessage("Sorry, I encountered an error. Please try again.", 'bot');
        }

    } catch (error) {
        console.error("Network Communication Error:", error);
        loadingDiv.remove();
        appendMessage("Could not connect to the backend server. Make sure your server is running!", 'bot');
    }
}

// Event Listeners for Clicking the button or pressing "Enter" key
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
