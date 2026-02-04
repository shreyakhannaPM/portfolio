class AISearch {
    constructor() {
        this.modal = document.getElementById('aiSearchModal');
        this.openBtn = document.getElementById('openAISearch');
        this.closeBtn = this.modal.querySelector('.close-modal');
        this.searchInput = document.getElementById('aiSearchInput');
        this.sendBtn = document.getElementById('sendAIRequest');
        this.chatMessages = document.getElementById('aiChatMessages');
        this.suggestions = document.querySelectorAll('.suggestion-chip');

        this.init();
    }

    init() {
        this.openBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        this.sendBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        this.suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                this.searchInput.value = chip.textContent;
                this.handleSearch();
            });
        });
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.searchInput.focus(), 300);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async handleSearch() {
        const question = this.searchInput.value.trim();
        if (!question) return;

        this.addMessage('user', question);
        this.searchInput.value = '';

        const loadingId = this.addMessage('assistant', 'Consulting Shreya\'s resume...', true);

        try {
            const resumeContent = this.getResumeContext();
            const response = await fetch('/api/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    context: resumeContent
                })
            });

            // Remove loading indicator
            document.getElementById(loadingId)?.remove();

            // Check if response is ok
            if (!response.ok) {
                if (response.status === 404) {
                    this.addMessage('error', 'AI feature is only available on the deployed site. Please visit the live portfolio to use this feature.');
                    return;
                }

                // Try to parse error message
                try {
                    const errorData = await response.json();
                    this.addMessage('error', `Error: ${errorData.error || 'Server error'}`);
                } catch {
                    this.addMessage('error', `Server error (${response.status}). Please try again later.`);
                }
                return;
            }

            // Parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                this.addMessage('error', 'Received invalid response from server. The API key may not be configured in Cloudflare.');
                return;
            }

            if (data.error) {
                this.addMessage('error', `Error: ${data.error}`);
            } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                const answer = data.candidates[0].content.parts[0].text;
                this.addMessage('assistant', answer);
            } else {
                this.addMessage('error', 'I couldn\'t find a specific answer for that. Try rephrasing?');
            }
        } catch (error) {
            document.getElementById(loadingId)?.remove();
            this.addMessage('error', `Something went wrong: ${error.message}`);
        }
    }

    getResumeContext() {
        // Collect relevant info from resume-data.js (available globally via window.resumeData)
        if (!window.resumeData) return "Portfolio information not found.";

        const data = window.resumeData;
        return `
            Name: ${data.name}
            Title: ${data.title}
            Summary: ${data.summary}
            Experience: ${data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.period}): ${exp.description}`).join('\n')}
            Skills: ${JSON.stringify(data.skills)}
            Achievements: ${data.achievements.join('\n')}
        `;
    }

    addMessage(type, text, isLoading = false) {
        const messageDiv = document.createElement('div');
        const id = 'msg-' + Math.random().toString(36).substr(2, 9);
        messageDiv.id = id;
        messageDiv.className = `chat-message ${type}-message${isLoading ? ' loading' : ''}`;

        messageDiv.innerHTML = `
            <div class="message-content">
                ${isLoading ? '<div class="loader"></div>' : ''}
                <div class="text">${text}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        return id;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiSearch = new AISearch();
});
