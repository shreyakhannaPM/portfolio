// AI Search functionality using Google Gemini API
class AISearch {
    constructor() {
        this.apiKey = 'AIzaSyAw0hzMfijrIXmdR4yXOsY8ueqa0ouRXkc';
        this.conversationHistory = [];
        this.isProcessing = false;

        // Example questions
        this.exampleQuestions = [
            "Tell me about Shreya's e-commerce experience",
            "What tools and technologies does she use?",
            "What are her key achievements at Global Holdings?",
            "What is her educational background?",
            "Tell me about her product management philosophy"
        ];
    }

    // Initialize with API key
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    // Load API key from storage
    loadApiKey() {
        const stored = localStorage.getItem('gemini_api_key');
        if (stored) {
            this.apiKey = stored;
            return true;
        }
        return false;
    }

    // Send question to Gemini API
    async askQuestion(question) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        if (this.isProcessing) {
            throw new Error('Already processing a question');
        }

        this.isProcessing = true;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: systemPrompt
                                    },
                                    {
                                        text: `User question: ${question}`
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const answer = data.candidates[0].content.parts[0].text;

            // Add to conversation history
            this.conversationHistory.push({
                question,
                answer,
                timestamp: new Date()
            });

            return answer;
        } catch (error) {
            console.error('AI Search Error:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }

    // Get random example question
    getRandomExample() {
        return this.exampleQuestions[Math.floor(Math.random() * this.exampleQuestions.length)];
    }
}

// Initialize AI Search
const aiSearch = new AISearch();

// DOM Elements
let searchModal, searchInput, searchButton, chatContainer, apiKeyInput, apiKeySection;

// Initialize search UI
function initializeSearchUI() {
    // API key is pre-configured, no need to load
    const hasKey = true;

    // Get DOM elements
    searchModal = document.getElementById('searchModal');
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    chatContainer = document.getElementById('chatContainer');
    apiKeyInput = document.getElementById('apiKeyInput');
    apiKeySection = document.getElementById('apiKeySection');

    // Always hide API key section since we have a pre-configured key
    if (apiKeySection) {
        apiKeySection.style.display = 'none';
    }

    // Event listeners
    document.getElementById('aiSearchBtn').addEventListener('click', openSearchModal);
    document.getElementById('closeSearch').addEventListener('click', closeSearchModal);
    document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    });

    // Example questions
    document.querySelectorAll('.example-question').forEach(btn => {
        btn.addEventListener('click', () => {
            searchInput.value = btn.textContent;
            handleSearch();
        });
    });

    // Close modal on outside click
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });
}

// Open search modal
function openSearchModal() {
    searchModal.classList.add('active');
    searchInput.focus();
}

// Close search modal
function closeSearchModal() {
    searchModal.classList.remove('active');
}

// Save API key
function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) {
        showError('Please enter an API key');
        return;
    }

    aiSearch.setApiKey(key);
    apiKeySection.style.display = 'none';
    showSuccess('API key saved! You can now ask questions.');
}

// Handle search
async function handleSearch() {
    const question = searchInput.value.trim();

    if (!question) {
        return;
    }

    // API key is pre-configured, no need to check

    // Add user message to chat
    addMessageToChat('user', question);
    searchInput.value = '';

    // Show loading
    const loadingId = addMessageToChat('assistant', 'Thinking...', true);

    try {
        const answer = await aiSearch.askQuestion(question);

        // Remove loading message
        document.getElementById(loadingId)?.remove();

        // Add assistant response
        addMessageToChat('assistant', answer);
    } catch (error) {
        // Remove loading message
        document.getElementById(loadingId)?.remove();

        // Show error
        addMessageToChat('error', `Error: ${error.message}`);
    }
}

// Add message to chat
function addMessageToChat(type, content, isLoading = false) {
    const messageId = `msg-${Date.now()}`;
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message ${isLoading ? 'loading' : ''}`;
    messageDiv.id = messageId;

    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">👤</div>
                <div class="message-text">${escapeHtml(content)}</div>
            </div>
        `;
    } else if (type === 'assistant') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">🤖</div>
                <div class="message-text">${isLoading ? content : formatMarkdown(content)}</div>
            </div>
        `;
    } else if (type === 'error') {
        messageDiv.innerHTML = `
            <div class="message-content error">
                <div class="message-icon">⚠️</div>
                <div class="message-text">${escapeHtml(content)}</div>
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageId;
}

// Format markdown-like text
function formatMarkdown(text) {
    // Simple markdown formatting
    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    addMessageToChat('error', message);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    apiKeySection.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearchUI);
} else {
    initializeSearchUI();
}
