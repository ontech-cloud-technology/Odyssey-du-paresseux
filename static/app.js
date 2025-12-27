// Initialisation des données dans localStorage
function initLocalStorage() {
    if (!localStorage.getItem('donateurs')) {
        localStorage.setItem('donateurs', JSON.stringify([
            { nom: 'Ali M.', montant: 60, niveau: 'Fenêtre Hublot' },
            { nom: 'Mariam N.', montant: 55, niveau: 'Fenêtre Hublot' }
        ]));
    }
    
    if (!localStorage.getItem('temoignages')) {
        localStorage.setItem('temoignages', JSON.stringify([
            { nom: 'Mariam N.', texte: 'Le projet Sloth Air est tellement unique ! J\'ai fait un petit don et j\'ai adoré recevoir les photos exclusives du Costa Rica. Ahmad fait un travail incroyable.', ville: 'Laval' },
            { nom: 'Ali M.', texte: 'En tant qu\'admirateur des animaux, je suis ravi de voir une organisation aussi dédiée à la protection des paresseux. J\'ai hâte de voir le \'Sloth Air\' voler !', ville: 'Laval' }
        ]));
    }
    
    // Images de paresseux disponibles
    const imagesParesseux = [
        '/static/images/FG8w5Ji.png',
        '/static/images/LRcBNsj.png',
        '/static/images/TjhXYNc.png'
    ];
    
    if (!localStorage.getItem('galerie')) {
        localStorage.setItem('galerie', JSON.stringify([
            { titre: 'Paresseux dans la Nature', image: '/static/images/FG8w5Ji.png', description: 'Un paresseux dans son habitat naturel, profitant de la tranquillité de la forêt' },
            { titre: 'Paresseux à Trois Doigts', image: '/static/images/LRcBNsj.png', description: 'Un magnifique paresseux à trois doigts observant son environnement' },
            { titre: 'Paresseux dans la Canopée', image: '/static/images/TjhXYNc.png', description: 'Un paresseux se déplaçant avec grâce dans la canopée de la forêt tropicale' }
        ]));
    } else {
        const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
        
        // Fonction pour distribuer les images de manière unique
        function distribuerImagesUniques(galerie, imagesDisponibles) {
            // Trouver les images déjà utilisées
            const imagesUtilisees = new Set();
            galerie.forEach(item => {
                if (item.image && item.image.trim() !== '') {
                    imagesUtilisees.add(item.image);
                }
            });
            
            // Trouver les images disponibles non utilisées
            const imagesNonUtilisees = imagesDisponibles.filter(img => !imagesUtilisees.has(img));
            
            // Trouver les entrées sans image
            const entreesVides = galerie.filter(item => !item.image || item.image.trim() === '');
            
            // Distribuer les images de manière unique
            let indexImage = 0;
            entreesVides.forEach(item => {
                if (indexImage < imagesNonUtilisees.length) {
                    // Utiliser une image non encore utilisée
                    item.image = imagesNonUtilisees[indexImage];
                    indexImage++;
                } else {
                    // Si toutes les images uniques sont utilisées, utiliser les images disponibles de manière équilibrée
                    const imageIndex = (indexImage - imagesNonUtilisees.length) % imagesDisponibles.length;
                    item.image = imagesDisponibles[imageIndex];
                    indexImage++;
                }
            });
        }
        
        // Distribuer les images de manière unique
        distribuerImagesUniques(galerie, imagesParesseux);
        
        localStorage.setItem('galerie', JSON.stringify(galerie));
    }
}

// Niveaux de contribution
const niveaux = [
    { nom: 'Billet Économie', min: 5, max: 25, recompenses: ['Carte d\'Embarquement Numérique "Sloth Air"', 'Vidéos Exclusives'] },
    { nom: 'Valise Cabine', min: 26, max: 50, recompenses: ['Récompenses précédentes', 'Accès au "Journal de Bord" numérique'] },
    { nom: 'Fenêtre Hublot', min: 51, max: 75, recompenses: ['Récompenses précédentes', 'Votre Photo sur la Plaque de Remerciement Virtuelle'] },
    { nom: 'Siège Confort', min: 76, max: 100, recompenses: ['Récompenses précédentes', '10 Cartes de Collection (numérique)', 'Fichiers 3D'] },
    { nom: 'Salon VIP', min: 101, max: 125, recompenses: ['Récompenses précédentes', '2 T-shirts Exclusifs Sloth Air'] },
    { nom: 'Cadeau Gastronomique', min: 126, max: 150, recompenses: ['Toutes les récompenses précédentes', 'Une Tasse personnalisée'] },
    { nom: 'Kit de Voyage', min: 151, max: 175, recompenses: ['Toutes les récompenses précédentes', 'Une Bouteille réutilisable'] },
    { nom: 'Réunion', min: 176, max: 200, recompenses: ['Toutes les récompenses précédentes', 'Discussion Vidéo de 30 min avec Ahmad'] },
    { nom: 'Membre de l\'Équipage', min: 201, max: 225, recompenses: ['Toutes les récompenses précédentes', 'Nom Gravé sur une plaque dans le jet'] },
    { nom: 'Plan de Vol', min: 226, max: 250, recompenses: ['Toutes les récompenses précédentes', 'Statut du Fondateur'] },
    { nom: 'Pilote Privilégié', min: 251, max: 275, recompenses: ['Toutes les récompenses précédentes', 'Discussion vidéo de 1h avec Ahmad'] },
    { nom: 'Héros de la Canopée', min: 276, max: 300, recompenses: ['Toutes les récompenses précédentes', 'Kit d\'aventure complet signé par Ahmad'] }
];

// Fonction pour déterminer le niveau selon le montant
function getNiveauByMontant(montant) {
    for (let niveau of niveaux) {
        if (montant >= niveau.min && montant <= niveau.max) {
            return niveau.nom;
        }
    }
    if (montant > 300) {
        return 'Héros de la Canopée';
    }
    return 'Billet Économie';
}

// Charger les témoignages
function loadTemoignages() {
    const temoignages = JSON.parse(localStorage.getItem('temoignages') || '[]');
    const container = document.getElementById('temoignagesContainer');
    
    container.innerHTML = temoignages.map(t => `
        <div class="glass rounded-2xl p-6 card-hover">
            <div class="text-4xl mb-4">💬</div>
            <p class="text-readable italic mb-4">"${t.texte}"</p>
            <p class="text-readable-strong font-bold">- ${t.nom}${t.ville ? ', ' + t.ville : ''}</p>
        </div>
    `).join('');
}

// Charger la galerie
function loadGalerie() {
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    const container = document.getElementById('galerieContainer');
    
    // Images de paresseux disponibles
    const imagesParesseux = [
        '/static/images/FG8w5Ji.png',
        '/static/images/LRcBNsj.png',
        '/static/images/TjhXYNc.png'
    ];
    
    // Fonction pour distribuer les images de manière unique
    function distribuerImagesUniques(galerie, imagesDisponibles) {
        // Trouver les images déjà utilisées
        const imagesUtilisees = new Set();
        galerie.forEach(item => {
            if (item.image && item.image.trim() !== '') {
                imagesUtilisees.add(item.image);
            }
        });
        
        // Trouver les images disponibles non utilisées
        const imagesNonUtilisees = imagesDisponibles.filter(img => !imagesUtilisees.has(img));
        
        // Trouver les entrées sans image
        const entreesVides = galerie.filter(item => !item.image || item.image.trim() === '');
        
        // Distribuer les images de manière unique
        let indexImage = 0;
        entreesVides.forEach(item => {
            if (indexImage < imagesNonUtilisees.length) {
                // Utiliser une image non encore utilisée
                item.image = imagesNonUtilisees[indexImage];
                indexImage++;
            } else {
                // Si toutes les images uniques sont utilisées, utiliser les images disponibles de manière équilibrée
                const imageIndex = (indexImage - imagesNonUtilisees.length) % imagesDisponibles.length;
                item.image = imagesDisponibles[imageIndex];
                indexImage++;
            }
        });
    }
    
    // Distribuer les images de manière unique avant d'afficher
    const galerieAvant = JSON.stringify(galerie);
    distribuerImagesUniques(galerie, imagesParesseux);
    
    // Sauvegarder seulement si des changements ont été faits
    if (JSON.stringify(galerie) !== galerieAvant) {
        localStorage.setItem('galerie', JSON.stringify(galerie));
    }
    
    container.innerHTML = galerie.map((item) => {
        // S'assurer que l'image existe
        const imageSrc = item.image && item.image.trim() !== '' 
            ? item.image 
            : imagesParesseux[0]; // Fallback par défaut
        
        const imageHtml = `
            <div class="relative mb-4" style="height: 250px; overflow: hidden; border-radius: 1rem;">
                <img src="${imageSrc}" alt="${item.titre || 'Paresseux'}" class="gallery-image" 
                     onerror="this.onerror=null; this.src='${imagesParesseux[0]}';">
            </div>
        `;
        
        return `
        <div class="glass rounded-2xl p-6 card-hover text-center gallery-item">
            ${imageHtml}
            <h3 class="text-xl font-bold text-readable-strong mb-2">${item.titre || 'Paresseux'}</h3>
            <p class="text-readable">${item.description || 'Un magnifique paresseux'}</p>
        </div>
    `;
    }).join('');
}

// Charger la plaque virtuelle
function loadPlaque() {
    const donateurs = JSON.parse(localStorage.getItem('donateurs') || '[]');
    const container = document.getElementById('plaqueContainer');
    
    // Filtrer les donateurs du niveau "Fenêtre Hublot"
    const fenetreHublot = donateurs.filter(d => {
        const niveau = getNiveauByMontant(d.montant);
        return niveau === 'Fenêtre Hublot' || (d.montant >= 51 && d.montant <= 75);
    });
    
    container.innerHTML = fenetreHublot.map(d => `
        <div class="glass rounded-xl p-4 text-center card-hover">
            <div class="text-4xl mb-2">⭐</div>
            <p class="text-readable-strong font-bold">${d.nom}</p>
        </div>
    `).join('');
    
    // Ajouter le placeholder si moins de 3 donateurs
    if (fenetreHublot.length < 3) {
        container.innerHTML += `
            <div class="glass rounded-xl p-4 text-center card-hover opacity-60">
                <div class="text-4xl mb-2">✨</div>
                <p class="text-readable-strong font-bold">Votre nom ici ?</p>
                <p class="text-readable text-sm">Donnez entre 51$ et 75$ !</p>
            </div>
        `;
    }
}

// Charger les niveaux de contribution
function loadNiveaux() {
    const container = document.getElementById('niveauxContainer');
    
    container.innerHTML = niveaux.map(niveau => `
        <div class="glass rounded-2xl p-6 card-hover">
            <h3 class="text-2xl font-bold text-readable-strong mb-3 flex items-center gap-2">
                <span class="text-3xl">${niveau.nom.includes('Économie') ? '🎫' : niveau.nom.includes('Cabine') ? '🧳' : niveau.nom.includes('Hublot') ? '🪟' : niveau.nom.includes('Confort') ? '💺' : niveau.nom.includes('VIP') ? '👑' : niveau.nom.includes('Gastronomique') ? '🍽️' : niveau.nom.includes('Voyage') ? '🎒' : niveau.nom.includes('Réunion') ? '🤝' : niveau.nom.includes('Équipage') ? '👨‍✈️' : niveau.nom.includes('Vol') ? '📋' : niveau.nom.includes('Pilote') ? '✈️' : '🦸'}</span>
                ${niveau.nom}
            </h3>
            <p class="text-green-200 font-bold mb-4">${niveau.min}$-${niveau.max}$</p>
            <ul class="text-readable space-y-2 text-sm">
                ${niveau.recompenses.map(r => `<li>• ${r}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Gestion du formulaire de don
document.getElementById('donForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('donateurNom').value;
    const email = document.getElementById('donateurEmail').value;
    const montant = parseFloat(document.getElementById('donateurMontant').value);
    
    if (!nom || !email || !montant || montant < 5) {
        alert('Veuillez remplir tous les champs avec un montant minimum de 5$.');
        return;
    }
    
    const niveau = getNiveauByMontant(montant);
    const donateurs = JSON.parse(localStorage.getItem('donateurs') || '[]');
    donateurs.push({ nom, email, montant, niveau, date: new Date().toISOString() });
    localStorage.setItem('donateurs', JSON.stringify(donateurs));
    
    alert(`Merci ${nom} pour votre don de ${montant}$ ! Vous avez atteint le niveau "${niveau}".`);
    
    // Réinitialiser le formulaire
    this.reset();
    
    // Recharger la plaque
    loadPlaque();
});

// Gestion du formulaire de témoignage
document.getElementById('temoignageForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('temoignageNom').value;
    const texte = document.getElementById('temoignageTexte').value;
    
    if (!nom || !texte) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    const temoignages = JSON.parse(localStorage.getItem('temoignages') || '[]');
    temoignages.push({ nom, texte, date: new Date().toISOString() });
    localStorage.setItem('temoignages', JSON.stringify(temoignages));
    
    alert('Merci pour votre témoignage !');
    
    // Réinitialiser le formulaire
    this.reset();
    
    // Recharger les témoignages
    loadTemoignages();
});

// Gestion du formulaire de rapport
document.getElementById('rapportForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('rapportEmail').value;
    
    if (!email) {
        alert('Veuillez entrer votre email.');
        return;
    }
    
    // Stocker la demande de rapport
    const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
    demandesRapport.push({
        email: email,
        date: new Date().toISOString(),
        envoye: false
    });
    localStorage.setItem('demandesRapport', JSON.stringify(demandesRapport));
    
    alert(`Merci ! Le rapport sera envoyé à ${email} sous peu.`);
    this.reset();
});

// Gestion du formulaire de galerie
document.getElementById('galerieForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const titre = document.getElementById('galerieTitre').value;
    const image = document.getElementById('galerieImage').value;
    const description = document.getElementById('galerieDescription').value;
    
    if (!titre || !image || !description) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    galerie.push({ titre, image, description, date: new Date().toISOString() });
    localStorage.setItem('galerie', JSON.stringify(galerie));
    
    alert('Image ajoutée à la galerie !');
    
    // Réinitialiser le formulaire
    this.reset();
    
    // Recharger la galerie
    loadGalerie();
});

// Fonction de scroll fluide
function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    initLocalStorage();
    loadTemoignages();
    loadGalerie();
    loadPlaque();
    loadNiveaux();
    
    // Animation des liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

