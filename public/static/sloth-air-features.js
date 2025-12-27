// ===== CARTE INTERACTIVE COSTA RICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les marqueurs de la carte
    const markers = document.querySelectorAll('.map-marker');
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const zone = this.getAttribute('data-zone');
            const infoId = `info-${zone.toLowerCase().replace(' ', '-')}`;
            const info = document.getElementById(infoId);
            
            // Fermer toutes les infos
            document.querySelectorAll('.map-info').forEach(i => i.style.display = 'none');
            
            // Afficher l'info du marqueur cliqué
            if (info) {
                info.style.display = 'block';
                info.style.position = 'absolute';
                info.style.top = this.offsetTop + 40 + 'px';
                info.style.left = this.offsetLeft + 'px';
            }
        });
    });
    
    // Fermer les infos en cliquant ailleurs
    document.getElementById('costaRicaMap')?.addEventListener('click', function(e) {
        if (!e.target.closest('.map-marker')) {
            document.querySelectorAll('.map-info').forEach(i => i.style.display = 'none');
        }
    });
});

// ===== JEU INTERACTIF PARESSEUX =====
let slothPosition = 0;
let gameScore = 0;

function moveSloth() {
    const sloth = document.getElementById('gameSloth');
    if (!sloth) return;
    
    slothPosition += 20;
    if (slothPosition > 350) {
        slothPosition = 350;
        gameScore += 10;
        alert('🎉 Le paresseux a atteint la canopée ! +10 points');
    }
    
    sloth.style.bottom = slothPosition + 'px';
    document.getElementById('gameScore').textContent = `Score: ${gameScore}`;
}

function resetSlothGame() {
    slothPosition = 0;
    gameScore = 0;
    const sloth = document.getElementById('gameSloth');
    if (sloth) {
        sloth.style.bottom = '0px';
    }
    document.getElementById('gameScore').textContent = 'Score: 0';
}

// ===== CHAT AVEC L'ÉQUIPE =====
const chatResponses = {
    'bonjour': 'Bonjour ! Comment pouvons-nous vous aider aujourd\'hui ? 🦥',
    'salut': 'Salut ! Ravi de vous parler ! 🌿',
    'paresseux': 'Les paresseux sont des créatures fascinantes ! Ils passent la plupart de leur temps dans les arbres et ne descendent qu\'une fois par semaine. 🦥',
    'costa rica': 'Le Costa Rica est un paradis pour la biodiversité ! Nous travaillons dans plusieurs zones de conservation. 🗺️',
    'don': 'Merci de votre intérêt ! Vous pouvez faire un don via le formulaire sur notre site. Chaque contribution compte ! 💚',
    'sloth air': 'Sloth Air est notre projet ambitieux de créer un jet privé dédié à la conservation. C\'est un outil essentiel pour nos missions ! ✈️',
    'ahmad': 'Ahmad est notre directeur passionné par la conservation. Il coordonne toutes nos opérations depuis Laval ! 👨‍💼',
    'conservation': 'La conservation est au cœur de notre mission. Nous protégeons les habitats naturels des paresseux au Costa Rica. 🌳',
    'merci': 'De rien ! N\'hésitez pas si vous avez d\'autres questions ! 😊',
    'default': 'C\'est une excellente question ! Notre équipe travaille dur pour protéger les paresseux. Voulez-vous en savoir plus sur un sujet particulier ? 🦥'
};

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    
    // Ajouter le message de l'utilisateur
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user';
    userMsgDiv.innerHTML = `<p class="text-readable">${userMessage}</p>`;
    messagesContainer.appendChild(userMsgDiv);
    
    // Réponse de l'équipe
    setTimeout(() => {
        const teamMsgDiv = document.createElement('div');
        teamMsgDiv.className = 'chat-message team';
        
        const response = getChatResponse(userMessage);
        teamMsgDiv.innerHTML = `<strong class="text-readable-strong">Équipe Sloth Air:</strong><p class="text-readable">${response}</p>`;
        messagesContainer.appendChild(teamMsgDiv);
        
        // Scroll vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(chatResponses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return chatResponses.default;
}

// Permettre l'envoi avec Enter
document.getElementById('chatInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// ===== VISITE VIRTUELLE =====
const panoramaViews = [
    { name: 'Forêt Tropicale', emoji: '🌿', description: 'La canopée luxuriante du Costa Rica' },
    { name: 'Rivière', emoji: '🌊', description: 'Les rivières qui traversent la forêt' },
    { name: 'Montagne', emoji: '⛰️', description: 'Les montagnes couvertes de forêt nuageuse' },
    { name: 'Plage', emoji: '🏖️', description: 'Les plages où les paresseux descendent parfois' }
];

let currentPanorama = 0;

function changePanorama(direction) {
    const viewer = document.getElementById('panoramaViewer');
    if (!viewer) return;
    
    if (direction === 'left') {
        currentPanorama = (currentPanorama - 1 + panoramaViews.length) % panoramaViews.length;
    } else if (direction === 'right') {
        currentPanorama = (currentPanorama + 1) % panoramaViews.length;
    } else {
        currentPanorama = 0;
    }
    
    const view = panoramaViews[currentPanorama];
    viewer.innerHTML = `
        <div class="text-6xl text-center flex flex-col items-center justify-center h-full text-readable">
            <div class="mb-4">${view.emoji}</div>
            <div class="text-2xl font-bold mb-2">${view.name}</div>
            <div class="text-lg">${view.description}</div>
        </div>
        <div class="panorama-controls">
            <button onclick="changePanorama('left')" class="glass px-4 py-2 rounded-lg text-readable hover:scale-110 transition">
                <i class="fas fa-arrow-left"></i>
            </button>
            <button onclick="changePanorama('center')" class="glass px-4 py-2 rounded-lg text-readable hover:scale-110 transition">
                <i class="fas fa-home"></i>
            </button>
            <button onclick="changePanorama('right')" class="glass px-4 py-2 rounded-lg text-readable hover:scale-110 transition">
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

// ===== QUIZ INTERACTIF =====
const quizQuestions = [
    {
        question: 'Combien de doigts a un paresseux à trois doigts ?',
        options: ['2', '3', '4', '5'],
        correct: 1
    },
    {
        question: 'Combien de temps un paresseux passe-t-il à dormir par jour ?',
        options: ['8 heures', '12 heures', '15-20 heures', '24 heures'],
        correct: 2
    },
    {
        question: 'Quelle est la capitale du Costa Rica ?',
        options: ['San José', 'Cartago', 'Limon', 'Puntarenas'],
        correct: 0
    },
    {
        question: 'Combien de fois par semaine un paresseux descend-il des arbres ?',
        options: ['Tous les jours', '3 fois par semaine', '1 fois par semaine', 'Jamais'],
        correct: 2
    },
    {
        question: 'Quel pourcentage du territoire du Costa Rica est protégé ?',
        options: ['15%', '25%', '30%', '50%'],
        correct: 1
    }
];

let currentQuestion = 0;
let quizScore = 0;
let quizAnswers = [];

function loadQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container || currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    container.innerHTML = `
        <div class="quiz-question">
            <h3 class="text-2xl font-bold text-readable-strong mb-4">Question ${currentQuestion + 1}/${quizQuestions.length}</h3>
            <p class="text-readable text-xl mb-6">${question.question}</p>
            <div class="space-y-2">
                ${question.options.map((option, index) => `
                    <div class="quiz-option glass" onclick="selectQuizAnswer(${index})">
                        <p class="text-readable">${option}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectQuizAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        quizScore++;
    }
    
    quizAnswers.push({ question: currentQuestion, selected: selectedIndex, correct: isCorrect });
    
    // Afficher la réponse
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
        opt.style.pointerEvents = 'none';
        if (idx === question.correct) {
            opt.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
        currentQuestion++;
        loadQuiz();
    }, 2000);
}

function showQuizResults() {
    const container = document.getElementById('quizContainer');
    const results = document.getElementById('quizResults');
    
    if (container) container.classList.add('hidden');
    if (results) {
        results.classList.remove('hidden');
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        document.getElementById('quizScore').textContent = 
            `Vous avez obtenu ${quizScore}/${quizQuestions.length} (${percentage}%)`;
    }
}

function restartQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    quizAnswers = [];
    const container = document.getElementById('quizContainer');
    const results = document.getElementById('quizResults');
    if (container) container.classList.remove('hidden');
    if (results) results.classList.add('hidden');
    loadQuiz();
}

// Charger le quiz au chargement de la page
if (document.getElementById('quizContainer')) {
    loadQuiz();
}

// ===== MÉTÉO COSTA RICA =====
async function loadWeather() {
    const widget = document.getElementById('weatherWidget');
    if (!widget) return;
    
    // Zones de conservation au Costa Rica
    const zones = [
        { name: 'Monteverde', lat: 10.3, lon: -84.8 },
        { name: 'Manuel Antonio', lat: 9.4, lon: -84.1 },
        { name: 'Tortuguero', lat: 10.5, lon: -83.5 }
    ];
    
    // Utiliser une API météo gratuite (OpenWeatherMap nécessite une clé)
    // Pour la démo, on simule les données
    widget.innerHTML = zones.map(zone => {
        // Simulation de données météo (dans un vrai projet, utiliser une API)
        const temp = Math.floor(Math.random() * 5) + 25; // 25-30°C
        const conditions = ['☀️', '⛅', '🌦️', '🌧️'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return `
            <div class="weather-card glass rounded-xl">
                <h3 class="text-readable-strong font-bold mb-2">${zone.name}</h3>
                <div class="text-4xl mb-2">${condition}</div>
                <p class="text-readable text-2xl font-bold">${temp}°C</p>
                <p class="text-readable text-sm mt-2">Tropical</p>
            </div>
        `;
    }).join('');
    
    // Note: Pour une vraie API, utiliser OpenWeatherMap ou WeatherAPI
    // fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric&lang=fr`)
}

// Charger la météo au chargement
if (document.getElementById('weatherWidget')) {
    loadWeather();
    // Recharger toutes les heures
    setInterval(loadWeather, 3600000);
}

