// Widget de chat flottant avec AI
let chatOpen = false;
let chatMessages = [];
let isAIEnabled = true;

function toggleChat() {
    chatOpen = !chatOpen;
    const chatWidget = document.getElementById('chatWidget');
    const chatPopup = document.getElementById('chatPopup');
    
    if (chatOpen) {
        chatPopup.classList.remove('hidden');
        chatPopup.classList.add('flex');
        document.getElementById('chatInput').focus();
    } else {
        chatPopup.classList.add('hidden');
        chatPopup.classList.remove('flex');
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    chatMessages.push({ type: 'user', text: userMessage, time: new Date() });
    
    // Ajouter le message de l'utilisateur
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user';
    userMsgDiv.innerHTML = `
        <div class="flex justify-end">
            <div class="bg-green-500/30 rounded-lg px-4 py-2 max-w-[80%]">
                <p class="text-readable text-sm">${escapeHtml(userMessage)}</p>
            </div>
        </div>
    `;
    messagesContainer.appendChild(userMsgDiv);
    
    // Afficher un indicateur de chargement
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message team';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="flex items-start gap-2">
            <div class="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                🦥
            </div>
            <div class="bg-white/10 rounded-lg px-4 py-2 max-w-[80%]">
                <p class="text-readable text-sm"><strong class="text-green-300">Équipe Sloth Air:</strong></p>
                <p class="text-readable text-sm mt-1">Réflexion en cours... <span class="animate-pulse">💭</span></p>
            </div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Réinitialiser le champ de saisie
    input.value = '';
    input.disabled = true;
    
    try {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/476dbfcd-be7f-4e55-87ca-f67a69dfc239',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat-widget.js:sendChatMessage','message':'Calling /api/chat endpoint',data:{user_message_length:userMessage.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        // Appel à l'API AI
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/476dbfcd-be7f-4e55-87ca-f67a69dfc239',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat-widget.js:sendChatMessage','message':'API response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        const data = await response.json();
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/476dbfcd-be7f-4e55-87ca-f67a69dfc239',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat-widget.js:sendChatMessage','message':'Parsed response data',data:{has_response:!!data.response,response_preview:data.response ? data.response.substring(0,50) : 'None'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        const aiResponse = data.response || 'Désolé, je n\'ai pas pu générer de réponse.';
        
        // Remplacer le message de chargement par la réponse
        loadingDiv.innerHTML = `
            <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    🦥
                </div>
                <div class="bg-white/10 rounded-lg px-4 py-2 max-w-[80%]">
                    <p class="text-readable text-sm"><strong class="text-green-300">Équipe Sloth Air (AI):</strong></p>
                    <p class="text-readable text-sm mt-1">${escapeHtml(aiResponse)}</p>
                </div>
            </div>
        `;
        
        chatMessages.push({ type: 'team', text: aiResponse, time: new Date() });
        
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/476dbfcd-be7f-4e55-87ca-f67a69dfc239',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat-widget.js:sendChatMessage','message':'Error in chat API call',data:{error_name:error.name,error_message:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        console.error('Erreur chat:', error);
        // Réponse de fallback
        loadingDiv.innerHTML = `
            <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    🦥
                </div>
                <div class="bg-white/10 rounded-lg px-4 py-2 max-w-[80%]">
                    <p class="text-readable text-sm"><strong class="text-green-300">Équipe Sloth Air:</strong></p>
                    <p class="text-readable text-sm mt-1">Désolé, le service est temporairement indisponible. Veuillez réessayer plus tard. 🦥</p>
                </div>
            </div>
        `;
    } finally {
        input.disabled = false;
        input.focus();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Permettre l'envoi avec Enter
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    // Message de bienvenue
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer && chatMessages.length === 0) {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'chat-message team';
        welcomeMsg.innerHTML = `
            <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    🦥
                </div>
                <div class="bg-white/10 rounded-lg px-4 py-2 max-w-[80%]">
                    <p class="text-readable text-sm"><strong class="text-green-300">Équipe Sloth Air (AI):</strong></p>
                    <p class="text-readable text-sm mt-1">Bonjour ! 👋 Je suis votre assistant AI spécialisé dans L'Odyssée du Paresseux. Je connais tout sur notre projet Sloth Air, les paresseux, le Costa Rica, et la conservation. Posez-moi vos questions ! 🦥</p>
                </div>
            </div>
        `;
        messagesContainer.appendChild(welcomeMsg);
    }
});
