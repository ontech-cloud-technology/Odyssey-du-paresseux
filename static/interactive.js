// ============================================
// CARTE INTERACTIVE DU COSTA RICA
// ============================================

const zonesConservation = [
    {
        name: 'Manuel Antonio',
        x: 30,
        y: 40,
        description: 'Parc national avec une biodiversité exceptionnelle. Zone de conservation majeure pour les paresseux à trois doigts.',
        slothCount: 45,
        areaSize: 682
    },
    {
        name: 'Tortuguero',
        x: 70,
        y: 20,
        description: 'Région côtière avec forêts tropicales humides. Habitat privilégié pour les paresseux à deux doigts.',
        slothCount: 32,
        areaSize: 312
    },
    {
        name: 'Monteverde',
        x: 25,
        y: 25,
        description: 'Forêt de nuages unique. Zone de recherche active sur le comportement des paresseux.',
        slothCount: 28,
        areaSize: 105
    },
    {
        name: 'Corcovado',
        x: 15,
        y: 60,
        description: 'Parc national isolé avec une population dense de paresseux. Zone de conservation prioritaire.',
        slothCount: 67,
        areaSize: 424
    }
];

function initCostaRicaMap() {
    const mapContainer = document.getElementById('costaRicaMap');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = '<div class="absolute inset-0 flex items-center justify-center"><div class="text-center text-readable"><div class="text-6xl mb-4">🗺️</div><p class="text-xl font-bold mb-2">Carte du Costa Rica</p><p class="text-sm opacity-80">Cliquez sur les zones pour découvrir les paresseux</p></div></div>';
    
    zonesConservation.forEach(zone => {
        const marker = document.createElement('div');
        marker.className = 'absolute cursor-pointer transition-all hover:scale-125';
        marker.style.left = zone.x + '%';
        marker.style.top = zone.y + '%';
        marker.style.width = '40px';
        marker.style.height = '40px';
        marker.innerHTML = '<div class="text-4xl">🦥</div>';
        marker.title = zone.name;
        marker.onclick = () => showZoneInfo(zone);
        mapContainer.appendChild(marker);
    });
}

function showZoneInfo(zone) {
    document.getElementById('mapInfo').classList.remove('hidden');
    document.getElementById('mapZoneName').textContent = zone.name;
    document.getElementById('mapZoneDescription').textContent = zone.description;
    document.getElementById('mapSlothCount').textContent = zone.slothCount;
    document.getElementById('mapAreaSize').textContent = zone.areaSize;
}

// ============================================
// JEUX INTERACTIFS
// ============================================

let currentGame = null;
let gameScore = 0;
let gameInterval = null;

function startSlothGame() {
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('gameTitle').textContent = 'Aide le Paresseux';
    currentGame = 'sloth';
    gameScore = 0;
    updateGameScore();
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div id="sloth" style="position: absolute; left: 50px; top: 200px; font-size: 4rem; transition: all 0.3s ease;">🦥</div>
        <div id="obstacles"></div>
        <div class="absolute top-4 left-4 text-readable">
            <p>Utilisez les flèches pour déplacer le paresseux</p>
        </div>
    `;
    
    const sloth = document.getElementById('sloth');
    let slothX = 50;
    let slothY = 200;
    
    document.addEventListener('keydown', handleSlothGameKey);
    
    gameInterval = setInterval(() => {
        createObstacle();
        moveObstacles();
        checkCollisions();
    }, 2000);
}

function startLeafGame() {
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('gameTitle').textContent = 'Collection de Feuilles';
    currentGame = 'leaf';
    gameScore = 0;
    updateGameScore();
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div id="slothLeaf" style="position: absolute; left: 50%; bottom: 50px; font-size: 4rem; transform: translateX(-50%);">🦥</div>
        <div id="leaves"></div>
        <div class="absolute top-4 left-4 text-readable">
            <p>Utilisez ← → pour attraper les feuilles</p>
        </div>
    `;
    
    const sloth = document.getElementById('slothLeaf');
    let slothX = 50;
    
    document.addEventListener('keydown', handleLeafGameKey);
    
    gameInterval = setInterval(() => {
        createLeaf();
        moveLeaves();
        checkLeafCollection();
    }, 1500);
}

function handleSlothGameKey(e) {
    const sloth = document.getElementById('sloth');
    if (!sloth) return;
    
    let x = parseInt(sloth.style.left) || 50;
    let y = parseInt(sloth.style.top) || 200;
    
    if (e.key === 'ArrowLeft' && x > 0) x -= 20;
    if (e.key === 'ArrowRight' && x < 600) x += 20;
    if (e.key === 'ArrowUp' && y > 0) y -= 20;
    if (e.key === 'ArrowDown' && y < 350) y += 20;
    
    sloth.style.left = x + 'px';
    sloth.style.top = y + 'px';
}

function handleLeafGameKey(e) {
    const sloth = document.getElementById('slothLeaf');
    if (!sloth) return;
    
    let x = parseInt(sloth.style.left) || 300;
    
    if (e.key === 'ArrowLeft' && x > 0) x -= 30;
    if (e.key === 'ArrowRight' && x < 600) x += 30;
    
    sloth.style.left = x + 'px';
}

function createObstacle() {
    const obstacles = document.getElementById('obstacles');
    if (!obstacles) return;
    
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.position = 'absolute';
    obstacle.style.left = Math.random() * 600 + 'px';
    obstacle.style.top = '-50px';
    obstacle.style.fontSize = '3rem';
    obstacle.textContent = '🌳';
    obstacles.appendChild(obstacle);
}

function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const top = parseInt(obstacle.style.top) || 0;
        obstacle.style.top = (top + 5) + 'px';
        
        if (top > 400) {
            obstacle.remove();
            gameScore += 10;
            updateGameScore();
        }
    });
}

function checkCollisions() {
    const sloth = document.getElementById('sloth');
    const obstacles = document.querySelectorAll('.obstacle');
    
    if (!sloth) return;
    
    const slothRect = {
        x: parseInt(sloth.style.left) || 50,
        y: parseInt(sloth.style.top) || 200,
        width: 60,
        height: 60
    };
    
    obstacles.forEach(obstacle => {
        const obsRect = {
            x: parseInt(obstacle.style.left) || 0,
            y: parseInt(obstacle.style.top) || 0,
            width: 50,
            height: 50
        };
        
        if (slothRect.x < obsRect.x + obsRect.width &&
            slothRect.x + slothRect.width > obsRect.x &&
            slothRect.y < obsRect.y + obsRect.height &&
            slothRect.y + slothRect.height > obsRect.y) {
            endGame('Collision !');
        }
    });
}

function createLeaf() {
    const leaves = document.getElementById('leaves');
    if (!leaves) return;
    
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.position = 'absolute';
    leaf.style.left = Math.random() * 600 + 'px';
    leaf.style.top = '-50px';
    leaf.style.fontSize = '2rem';
    leaf.textContent = '🍃';
    leaves.appendChild(leaf);
}

function moveLeaves() {
    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach(leaf => {
        const top = parseInt(leaf.style.top) || 0;
        leaf.style.top = (top + 8) + 'px';
        
        if (top > 400) {
            leaf.remove();
        }
    });
}

function checkLeafCollection() {
    const sloth = document.getElementById('slothLeaf');
    const leaves = document.querySelectorAll('.leaf');
    
    if (!sloth) return;
    
    const slothX = parseInt(sloth.style.left) || 300;
    
    leaves.forEach(leaf => {
        const leafX = parseInt(leaf.style.left) || 0;
        const leafY = parseInt(leaf.style.top) || 0;
        
        if (Math.abs(slothX - leafX) < 50 && leafY > 300) {
            leaf.remove();
            gameScore += 20;
            updateGameScore();
        }
    });
}

function updateGameScore() {
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = gameScore;
}

function closeGame() {
    document.getElementById('gameContainer').classList.add('hidden');
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    document.removeEventListener('keydown', handleSlothGameKey);
    document.removeEventListener('keydown', handleLeafGameKey);
}

function resetGame() {
    closeGame();
    if (currentGame === 'sloth') startSlothGame();
    if (currentGame === 'leaf') startLeafGame();
}

function endGame(message) {
    closeGame();
    alert(message + ' Score final: ' + gameScore);
}

// ============================================
// CHAT AVEC L'ÉQUIPE
// ============================================

function initChat() {
    const chatForm = document.getElementById('chatForm');
    if (!chatForm) return;
    
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        addChatMessage(message, 'user');
        input.value = '';
        
        // Réponse automatique simulée
        setTimeout(() => {
            const responses = [
                "Merci pour votre question ! Notre équipe vous répondra bientôt.",
                "Excellente question ! Ahmad et son équipe sont actuellement au Costa Rica, ils répondront lors de leur prochaine connexion.",
                "Nous avons bien reçu votre message. L'équipe vous répondra dans les plus brefs délais !",
                "Votre message a été enregistré. Restez connecté pour la réponse de l'équipe !"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage(randomResponse, 'team');
        }, 1500);
    });
    
    // Charger les messages sauvegardés
    loadChatMessages();
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'glass rounded-xl p-4';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex items-start gap-3 justify-end">
                <div class="flex-1 text-right">
                    <div class="flex items-center gap-2 justify-end mb-2">
                        <span class="text-xs text-readable opacity-70">Vous</span>
                        <span class="font-bold text-readable-strong">${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <p class="text-readable">${message}</p>
                </div>
                <div class="text-2xl">👤</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl">🦥</div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-bold text-readable-strong">Équipe L'Odyssée</span>
                        <span class="text-xs text-readable opacity-70">${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <p class="text-readable">${message}</p>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Sauvegarder le message
    saveChatMessage(message, sender);
}

function saveChatMessage(message, sender) {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.push({
        message,
        sender,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadChatMessages() {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.forEach(msg => {
        addChatMessage(msg.message, msg.sender, false);
    });
}

// ============================================
// VISITE VIRTUELLE
// ============================================

const tourViews = {
    canopee: {
        emoji: '🌳',
        name: 'Canopée de la Forêt',
        description: 'À 30 mètres de hauteur, observez la vie dans la canopée où les paresseux passent la plupart de leur temps.'
    },
    sol: {
        emoji: '🍃',
        name: 'Sol Forestier',
        description: 'Le sol de la forêt tropicale, riche en biodiversité. Les paresseux descendent une fois par semaine pour leurs besoins.'
    },
    riviere: {
        emoji: '🌊',
        name: 'Rivière Tropicale',
        description: 'Les rivières du Costa Rica sont essentielles à l\'écosystème. Les paresseux vivent près de ces cours d\'eau.'
    }
};

function changeView(viewName) {
    const view = tourViews[viewName];
    if (!view) return;
    
    const tourContainer = document.getElementById('virtualTour');
    const tourInfo = document.getElementById('tourInfo');
    
    if (tourContainer) {
        tourContainer.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-readable">
                    <div class="text-8xl mb-4 floating">${view.emoji}</div>
                    <p class="text-2xl font-bold mb-2">${view.name}</p>
                    <p class="text-sm opacity-80 mb-4">Visite interactive 360°</p>
                    <div class="flex gap-4 justify-center">
                        <button onclick="changeView('canopee')" class="glass px-6 py-3 rounded-lg text-readable hover:bg-white/10 transition">
                            <i class="fas fa-tree"></i> Canopée
                        </button>
                        <button onclick="changeView('sol')" class="glass px-6 py-3 rounded-lg text-readable hover:bg-white/10 transition">
                            <i class="fas fa-leaf"></i> Sol Forestier
                        </button>
                        <button onclick="changeView('riviere')" class="glass px-6 py-3 rounded-lg text-readable hover:bg-white/10 transition">
                            <i class="fas fa-water"></i> Rivière
                        </button>
                    </div>
                </div>
            </div>
            <div id="tourInfo" class="absolute bottom-4 left-4 right-4 glass rounded-xl p-4">
                <h3 class="text-lg font-bold text-readable-strong mb-2">${view.name}</h3>
                <p class="text-readable text-sm">${view.description}</p>
            </div>
        `;
    }
}

// ============================================
// TEST INTERACTIF
// ============================================

const quizQuestions = [
    {
        question: "Combien de doigts a un paresseux à trois doigts ?",
        options: ["2", "3", "4", "5"],
        correct: 1
    },
    {
        question: "À quelle vitesse moyenne se déplace un paresseux ?",
        options: ["5 km/h", "0.24 km/h", "10 km/h", "1 km/h"],
        correct: 1
    },
    {
        question: "Combien de temps un paresseux dort-il par jour ?",
        options: ["8 heures", "12 heures", "15-20 heures", "24 heures"],
        correct: 2
    },
    {
        question: "Quelle est la capitale du Costa Rica ?",
        options: ["Manuel Antonio", "San José", "Tortuguero", "Monteverde"],
        correct: 1
    },
    {
        question: "Pourquoi les paresseux descendent-ils au sol ?",
        options: ["Pour manger", "Pour se reproduire", "Pour déféquer (une fois par semaine)", "Pour jouer"],
        correct: 2
    },
    {
        question: "Combien d'espèces de paresseux existent ?",
        options: ["2", "4", "6", "8"],
        correct: 2
    },
    {
        question: "Quel est le principal prédateur du paresseux ?",
        options: ["Le jaguar", "L'aigle harpie", "Le serpent", "L'homme"],
        correct: 1
    },
    {
        question: "Le Costa Rica produit combien de son électricité à partir d'énergies renouvelables ?",
        options: ["50%", "75%", "98%", "100%"],
        correct: 2
    },
    {
        question: "Quel pourcentage du territoire du Costa Rica est protégé ?",
        options: ["15%", "25%", "30%", "50%"],
        correct: 1
    },
    {
        question: "Combien de temps peut vivre un paresseux en captivité ?",
        options: ["10-15 ans", "20-30 ans", "30-40 ans", "40-50 ans"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let quizScore = 0;
let selectedQuestions = [];

function startQuiz() {
    document.getElementById('quizStart').classList.add('hidden');
    document.getElementById('quizQuestions').classList.remove('hidden');
    currentQuestionIndex = 0;
    quizScore = 0;
    
    // Sélectionner 10 questions aléatoires
    selectedQuestions = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = selectedQuestions[currentQuestionIndex];
    const questionsContainer = document.getElementById('quizQuestions');
    
    questionsContainer.innerHTML = `
        <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
                <span class="text-readable text-sm">Question ${currentQuestionIndex + 1} / ${selectedQuestions.length}</span>
                <span class="text-readable text-sm">Score: ${quizScore}</span>
            </div>
            <h3 class="text-2xl font-bold text-readable-strong mb-6">${question.question}</h3>
            <div class="space-y-3">
                ${question.options.map((option, index) => `
                    <button onclick="selectAnswer(${index})" class="w-full glass rounded-xl p-4 text-left text-readable hover:bg-white/10 transition text-lg">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectAnswer(selectedIndex) {
    const question = selectedQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        quizScore += 10;
    }
    
    // Afficher la réponse
    const questionsContainer = document.getElementById('quizQuestions');
    const buttons = questionsContainer.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('bg-green-500/30');
        }
        if (index === selectedIndex && !isCorrect) {
            btn.classList.add('bg-red-500/30');
        }
    });
    
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function showQuizResults() {
    document.getElementById('quizQuestions').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    const percentage = (quizScore / (selectedQuestions.length * 10)) * 100;
    let level = '';
    let emoji = '';
    
    if (percentage >= 90) {
        level = 'Expert des Paresseux !';
        emoji = '🏆';
    } else if (percentage >= 70) {
        level = 'Connaisseur';
        emoji = '🌟';
    } else if (percentage >= 50) {
        level = 'Apprenti';
        emoji = '📚';
    } else {
        level = 'Débutant';
        emoji = '🌱';
    }
    
    document.getElementById('quizResults').innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-4">${emoji}</div>
            <h3 class="text-3xl font-bold text-readable-strong mb-4">${level}</h3>
            <p class="text-2xl text-readable mb-4">Score: ${quizScore} / ${selectedQuestions.length * 10}</p>
            <p class="text-xl text-readable mb-6">${percentage.toFixed(0)}% de bonnes réponses</p>
            <button onclick="location.reload()" class="btn-glow glass-strong px-8 py-4 rounded-lg text-readable-strong font-bold text-lg hover:scale-110 transition-transform">
                <i class="fas fa-redo"></i> Refaire le Test
            </button>
        </div>
    `;
}

// ============================================
// MÉTÉO COSTA RICA
// ============================================

const weatherLocations = {
    'San José': { lat: 9.9281, lon: -84.0907 },
    'Manuel Antonio': { lat: 9.3920, lon: -84.1392 },
    'Tortuguero': { lat: 10.5444, lon: -83.5028 }
};

async function loadWeather() {
    // Simulation de données météo (dans un vrai projet, utiliser une API comme OpenWeatherMap)
    const weatherData = {
        'San José': { temp: 22, condition: 'Ensoleillé', emoji: '☀️', humidity: 65 },
        'Manuel Antonio': { temp: 28, condition: 'Nuageux', emoji: '⛅', humidity: 75 },
        'Tortuguero': { temp: 26, condition: 'Pluvieux', emoji: '🌧️', humidity: 85 }
    };
    
    Object.keys(weatherLocations).forEach(location => {
        const data = weatherData[location];
        const container = document.getElementById(`weather${location.replace(' ', '')}`);
        if (container) {
            container.innerHTML = `
                <div class="text-5xl mb-4">${data.emoji}</div>
                <p class="text-2xl font-bold mb-2">${data.temp}°C</p>
                <p class="text-sm opacity-80 mb-2">${data.condition}</p>
                <p class="text-xs opacity-70">Humidité: ${data.humidity}%</p>
            `;
        }
    });
    
    // Mettre à jour l'impact sur les paresseux
    updateWeatherImpact(weatherData);
}

function updateWeatherImpact(weatherData) {
    const impactEl = document.getElementById('weatherImpact');
    if (!impactEl) return;
    
    const avgTemp = Object.values(weatherData).reduce((sum, w) => sum + w.temp, 0) / Object.values(weatherData).length;
    const avgHumidity = Object.values(weatherData).reduce((sum, w) => sum + w.humidity, 0) / Object.values(weatherData).length;
    
    let impact = '';
    if (avgTemp > 25) {
        impact = 'Les températures élevées incitent les paresseux à descendre plus souvent au sol pour se rafraîchir.';
    } else if (avgTemp < 20) {
        impact = 'Par temps plus frais, les paresseux restent plus longtemps dans la canopée pour conserver leur chaleur.';
    } else {
        impact = 'Conditions idéales pour les paresseux ! Ils sont actifs et se déplacent normalement.';
    }
    
    if (avgHumidity > 80) {
        impact += ' L\'humidité élevée est favorable à leur alimentation (feuilles plus tendres).';
    }
    
    impactEl.textContent = impact;
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initCostaRicaMap();
    initChat();
    loadWeather();
    
    // Rafraîchir la météo toutes les heures
    setInterval(loadWeather, 3600000);
});

