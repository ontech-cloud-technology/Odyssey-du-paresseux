// Configuration admin (dans un vrai projet, cela devrait être sur le serveur)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Vérifier si l'utilisateur est connecté
function checkAuth() {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (isAuthenticated) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('adminPage').classList.remove('hidden');
        loadAdminData();
    } else {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('adminPage').classList.add('hidden');
    }
}

// Connexion
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('admin_authenticated', 'true');
        checkAuth();
    } else {
        alert('Identifiants incorrects');
    }
});

// Déconnexion
function logout() {
    localStorage.removeItem('admin_authenticated');
    checkAuth();
}

// Gestion des tabs
function showTab(tabName) {
    // Cacher tous les tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Retirer active de tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-white/10');
    });
    
    // Afficher le tab sélectionné
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    // Activer le bouton
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'bg-white/10');
    
    // Recharger les données si nécessaire
    if (tabName === 'donateurs') loadDonateurs();
    if (tabName === 'temoignages') loadTemoignages();
    if (tabName === 'galerie') loadGalerie();
    if (tabName === 'rapports') loadRapports('en_attente');
    if (tabName === 'produits') loadProduits();
    if (tabName === 'commandes') loadCommandes('tous');
}

// Charger les statistiques
function loadStats() {
    const donateurs = JSON.parse(localStorage.getItem('donateurs') || '[]');
    const temoignages = JSON.parse(localStorage.getItem('temoignages') || '[]');
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
    
    const totalMontant = donateurs.reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);
    const rapportsEnAttente = demandesRapport.filter(r => !r.envoye).length;
    
    document.getElementById('totalDonateurs').textContent = donateurs.length;
    document.getElementById('totalTemoignages').textContent = temoignages.length;
    document.getElementById('totalImages').textContent = galerie.length;
    document.getElementById('totalMontant').textContent = totalMontant.toFixed(2) + '$';
    document.getElementById('totalRapports').textContent = rapportsEnAttente;
}

// Charger les donateurs
function loadDonateurs() {
    const donateurs = JSON.parse(localStorage.getItem('donateurs') || '[]');
    const tbody = document.getElementById('donateursTable');
    
    if (donateurs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-readable">Aucun donateur</td></tr>';
        return;
    }
    
    tbody.innerHTML = donateurs.map((donateur, index) => {
        const date = donateur.date ? new Date(donateur.date).toLocaleDateString('fr-FR') : 'N/A';
        const niveau = donateur.niveau || getNiveauByMontant(donateur.montant);
        
        return `
            <tr class="border-b border-white/10 hover:bg-white/5">
                <td class="p-3">${donateur.nom || 'N/A'}</td>
                <td class="p-3">${donateur.email || 'N/A'}</td>
                <td class="p-3 font-bold">${donateur.montant}$</td>
                <td class="p-3">${niveau}</td>
                <td class="p-3">${date}</td>
                <td class="p-3">
                    <button onclick="deleteDonateur(${index})" class="btn-danger px-3 py-1 rounded text-white text-sm hover:scale-105 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Supprimer un donateur
function deleteDonateur(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce donateur ?')) {
        const donateurs = JSON.parse(localStorage.getItem('donateurs') || '[]');
        donateurs.splice(index, 1);
        localStorage.setItem('donateurs', JSON.stringify(donateurs));
        loadDonateurs();
        loadStats();
    }
}

// Charger les témoignages
function loadTemoignages() {
    const temoignages = JSON.parse(localStorage.getItem('temoignages') || '[]');
    const container = document.getElementById('temoignagesList');
    
    if (temoignages.length === 0) {
        container.innerHTML = '<div class="text-readable text-center p-8">Aucun témoignage</div>';
        return;
    }
    
    container.innerHTML = temoignages.map((temoignage, index) => {
        const date = temoignage.date ? new Date(temoignage.date).toLocaleDateString('fr-FR') : 'N/A';
        
        return `
            <div class="glass rounded-2xl p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-readable-strong font-bold text-lg">${temoignage.nom}</h3>
                        <p class="text-readable text-sm">${temoignage.ville || ''} - ${date}</p>
                    </div>
                    <button onclick="deleteTemoignage(${index})" class="btn-danger px-3 py-1 rounded text-white text-sm hover:scale-105 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="text-readable italic">"${temoignage.texte}"</p>
            </div>
        `;
    }).join('');
}

// Supprimer un témoignage
function deleteTemoignage(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
        const temoignages = JSON.parse(localStorage.getItem('temoignages') || '[]');
        temoignages.splice(index, 1);
        localStorage.setItem('temoignages', JSON.stringify(temoignages));
        loadTemoignages();
        loadStats();
    }
}

// Charger la galerie
function loadGalerie() {
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    const container = document.getElementById('galerieList');
    
    // Images de paresseux disponibles pour remplacer les images vides
    const imagesParesseux = [
        '/static/images/FG8w5Ji.png',
        '/static/images/LRcBNsj.png',
        '/static/images/TjhXYNc.png'
    ];
    
    if (galerie.length === 0) {
        container.innerHTML = '<div class="text-readable text-center p-8 col-span-3">Aucune image</div>';
        return;
    }
    
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
    
    container.innerHTML = galerie.map((item, index) => {
        // S'assurer que l'image existe
        const imageSrc = item.image && item.image.trim() !== '' 
            ? item.image 
            : imagesParesseux[0]; // Fallback par défaut
        
        return `
            <div class="glass rounded-2xl p-4">
                <div class="mb-4" style="height: 200px; overflow: hidden; border-radius: 1rem;">
                    <img src="${imageSrc}" alt="${item.titre || 'Paresseux'}" class="w-full h-full object-cover" 
                         onerror="this.onerror=null; this.src='${imagesParesseux[0]}';">
                </div>
                <h3 class="text-readable-strong font-bold mb-2">${item.titre || 'Paresseux'}</h3>
                <p class="text-readable text-sm mb-4">${item.description || 'Un magnifique paresseux'}</p>
                <div class="flex gap-2">
                    <button onclick="editImage(${index})" class="btn-edit flex-1 px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button onclick="deleteImage(${index})" class="btn-danger flex-1 px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Ouvrir le modal d'édition
function editImage(index) {
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    const item = galerie[index];
    
    if (!item) return;
    
    document.getElementById('editImageIndex').value = index;
    document.getElementById('editImageTitre').value = item.titre || '';
    document.getElementById('editImagePath').value = item.image || '';
    document.getElementById('editImageDescription').value = item.description || '';
    
    document.getElementById('editImageModal').classList.add('active');
}

// Fermer le modal d'édition
function closeEditModal() {
    document.getElementById('editImageModal').classList.remove('active');
    document.getElementById('editImageForm').reset();
}

// Sauvegarder les modifications d'une image
document.getElementById('editImageForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = parseInt(document.getElementById('editImageIndex').value);
    const titre = document.getElementById('editImageTitre').value;
    const image = document.getElementById('editImagePath').value;
    const description = document.getElementById('editImageDescription').value;
    
    if (!titre || !image || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    if (galerie[index]) {
        galerie[index] = {
            ...galerie[index],
            titre,
            image,
            description
        };
        localStorage.setItem('galerie', JSON.stringify(galerie));
        alert('Image modifiée avec succès !');
        closeEditModal();
        loadGalerie();
    }
});

// Fermer le modal en cliquant en dehors
document.getElementById('editImageModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditModal();
    }
});

// Supprimer une image
function deleteImage(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
        const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
        galerie.splice(index, 1);
        localStorage.setItem('galerie', JSON.stringify(galerie));
        loadGalerie();
        loadStats();
    }
}

// Ajouter une image
document.getElementById('addImageForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const titre = document.getElementById('newImageTitre').value;
    const image = document.getElementById('newImagePath').value;
    const description = document.getElementById('newImageDescription').value;
    
    if (!titre || !image || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const galerie = JSON.parse(localStorage.getItem('galerie') || '[]');
    galerie.push({ titre, image, description, date: new Date().toISOString() });
    localStorage.setItem('galerie', JSON.stringify(galerie));
    
    alert('Image ajoutée avec succès !');
    this.reset();
    loadGalerie();
    loadStats();
});

// Fonction pour déterminer le niveau selon le montant
function getNiveauByMontant(montant) {
    const niveaux = [
        { nom: 'Billet Économie', min: 5, max: 25 },
        { nom: 'Valise Cabine', min: 26, max: 50 },
        { nom: 'Fenêtre Hublot', min: 51, max: 75 },
        { nom: 'Siège Confort', min: 76, max: 100 },
        { nom: 'Salon VIP', min: 101, max: 125 },
        { nom: 'Cadeau Gastronomique', min: 126, max: 150 },
        { nom: 'Kit de Voyage', min: 151, max: 175 },
        { nom: 'Réunion', min: 176, max: 200 },
        { nom: 'Membre de l\'Équipage', min: 201, max: 225 },
        { nom: 'Plan de Vol', min: 226, max: 250 },
        { nom: 'Pilote Privilégié', min: 251, max: 275 },
        { nom: 'Héros de la Canopée', min: 276, max: 300 }
    ];
    
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

// Charger les rapports
let currentRapportFilter = 'en_attente';

function loadRapports(filter = 'en_attente') {
    currentRapportFilter = filter;
    const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
    const container = document.getElementById('rapportsList');
    
    let rapportsFiltres = demandesRapport;
    
    if (filter === 'en_attente') {
        rapportsFiltres = demandesRapport.filter(r => !r.envoye);
    } else if (filter === 'envoyes') {
        rapportsFiltres = demandesRapport.filter(r => r.envoye);
    }
    
    // Trier par date (plus récent en premier)
    rapportsFiltres.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (rapportsFiltres.length === 0) {
        container.innerHTML = '<div class="text-readable text-center p-8">Aucune demande de rapport</div>';
        return;
    }
    
    container.innerHTML = rapportsFiltres.map((rapport, index) => {
        const date = rapport.date ? new Date(rapport.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A';
        
        const originalIndex = demandesRapport.findIndex(r => r.email === rapport.email && r.date === rapport.date);
        
        return `
            <div class="glass rounded-2xl p-6 ${rapport.envoye ? 'opacity-60' : ''}">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fas fa-envelope text-2xl text-green-300"></i>
                            <h3 class="text-readable-strong font-bold text-lg">${rapport.email}</h3>
                            ${rapport.envoye ? '<span class="glass px-3 py-1 rounded-full text-green-200 text-sm"><i class="fas fa-check"></i> Envoyé</span>' : '<span class="glass px-3 py-1 rounded-full text-yellow-200 text-sm"><i class="fas fa-clock"></i> En attente</span>'}
                        </div>
                        <p class="text-readable text-sm">Demandé le : ${date}</p>
                    </div>
                    <div class="flex gap-2">
                        ${!rapport.envoye ? `
                            <button onclick="marquerRapportEnvoye(${originalIndex})" class="btn-success px-4 py-2 rounded text-white text-sm hover:scale-105 transition" title="Marquer comme envoyé">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : `
                            <button onclick="marquerRapportEnAttente(${originalIndex})" class="glass px-4 py-2 rounded text-readable text-sm hover:scale-105 transition" title="Marquer comme en attente">
                                <i class="fas fa-undo"></i>
                            </button>
                        `}
                        <button onclick="deleteRapport(${originalIndex})" class="btn-danger px-4 py-2 rounded text-white text-sm hover:scale-105 transition" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Marquer un rapport comme envoyé
function marquerRapportEnvoye(index) {
    const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
    if (demandesRapport[index]) {
        demandesRapport[index].envoye = true;
        localStorage.setItem('demandesRapport', JSON.stringify(demandesRapport));
        loadRapports(currentRapportFilter);
        loadStats();
    }
}

// Marquer un rapport comme en attente
function marquerRapportEnAttente(index) {
    const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
    if (demandesRapport[index]) {
        demandesRapport[index].envoye = false;
        localStorage.setItem('demandesRapport', JSON.stringify(demandesRapport));
        loadRapports(currentRapportFilter);
        loadStats();
    }
}

// Supprimer un rapport
function deleteRapport(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande de rapport ?')) {
        const demandesRapport = JSON.parse(localStorage.getItem('demandesRapport') || '[]');
        demandesRapport.splice(index, 1);
        localStorage.setItem('demandesRapport', JSON.stringify(demandesRapport));
        loadRapports(currentRapportFilter);
        loadStats();
    }
}

// Charger toutes les données admin
function loadAdminData() {
    loadStats();
    loadDonateurs();
    loadTemoignages();
    loadGalerie();
    loadProduits();
    loadCommandes('tous');
}

// ========== GESTION DES PRODUITS ==========

// Charger les produits
async function loadProduits() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProduits(products);
        updateProduitsStats(products);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        document.getElementById('produitsList').innerHTML = 
            '<div class="text-readable text-center p-8 col-span-3">Erreur lors du chargement</div>';
    }
}

// Afficher les produits
function displayProduits(products) {
    const container = document.getElementById('produitsList');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="text-readable text-center p-8 col-span-3">Aucun produit</div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="glass rounded-2xl p-4">
            <div class="mb-4" style="height: 200px; overflow: hidden; border-radius: 1rem;">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-full object-cover"
                     onerror="this.src='/static/images/logo.png'">
            </div>
            <h3 class="text-readable-strong font-bold mb-2">${product.name}</h3>
            <p class="text-readable text-sm mb-2">${product.description}</p>
            <div class="flex justify-between items-center mb-4">
                <span class="text-xl font-bold text-readable-strong">${product.price.toFixed(2)}$</span>
                <span class="text-readable text-sm">
                    <i class="fas fa-box"></i> ${product.stock || 0}
                </span>
            </div>
            <p class="text-readable text-xs mb-4">
                <i class="fas fa-tag"></i> ${product.category}
            </p>
            <div class="flex gap-2">
                <button onclick="editProduct(${product.id})" class="btn-edit flex-1 px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button onclick="deleteProduct(${product.id})" class="btn-danger flex-1 px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// Mettre à jour les stats produits
function updateProduitsStats(products) {
    document.getElementById('totalProduits').textContent = products.length;
}

// Ajouter un produit
document.getElementById('addProductForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('newProductName').value,
        price: parseFloat(document.getElementById('newProductPrice').value),
        category: document.getElementById('newProductCategory').value,
        description: document.getElementById('newProductDescription').value,
        image: document.getElementById('newProductImage').value,
        stock: parseInt(document.getElementById('newProductStock').value) || 0
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Produit ajouté avec succès !');
            this.reset();
            loadProduits();
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible d\'ajouter le produit'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du produit');
    }
});

// Modifier un produit
async function editProduct(productId) {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductImage').value = product.image;
        document.getElementById('editProductStock').value = product.stock || 0;
        
        document.getElementById('editProductModal').classList.add('active');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du produit');
    }
}

// Fermer le modal d'édition de produit
function closeEditProductModal() {
    document.getElementById('editProductModal').classList.remove('active');
    document.getElementById('editProductForm').reset();
}

// Sauvegarder les modifications d'un produit
document.getElementById('editProductForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('editProductId').value);
    const productData = {
        name: document.getElementById('editProductName').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        category: document.getElementById('editProductCategory').value,
        description: document.getElementById('editProductDescription').value,
        image: document.getElementById('editProductImage').value,
        stock: parseInt(document.getElementById('editProductStock').value) || 0
    };
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Produit modifié avec succès !');
            closeEditProductModal();
            loadProduits();
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de modifier le produit'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la modification du produit');
    }
});

// Supprimer un produit
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Produit supprimé avec succès !');
            loadProduits();
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de supprimer le produit'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du produit');
    }
}

// Fermer le modal en cliquant en dehors
document.getElementById('editProductModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditProductModal();
    }
});

// ========== GESTION DES COMMANDES ==========

let currentCommandeFilter = 'tous';

// Charger les commandes
async function loadCommandes(filter = 'tous') {
    currentCommandeFilter = filter;
    
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        let filteredOrders = orders;
        if (filter === 'en_attente') {
            filteredOrders = orders.filter(o => o.status === 'en_attente' && !o.deleted);
        } else if (filter === 'traitee') {
            filteredOrders = orders.filter(o => o.status === 'traitee' && !o.deleted);
        } else if (filter === 'supprimees') {
            filteredOrders = orders.filter(o => o.deleted === true);
        } else {
            // Toutes sauf supprimées
            filteredOrders = orders.filter(o => !o.deleted);
        }
        
        displayCommandes(filteredOrders, filter === 'supprimees');
        updateCommandesStats(orders.filter(o => !o.deleted));
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        document.getElementById('commandesList').innerHTML = 
            '<div class="text-readable text-center p-8">Erreur lors du chargement</div>';
    }
}

// Afficher les commandes
function displayCommandes(orders, isDeleted = false) {
    const container = document.getElementById('commandesList');
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="text-readable text-center p-8">Aucune commande</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A';
        
        const deletedDate = order.deleted_at ? new Date(order.deleted_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '';
        
        const statusClass = order.status === 'traitee' ? 'text-green-300' : 'text-yellow-300';
        const statusIcon = order.status === 'traitee' ? 'fa-check' : 'fa-clock';
        const city = order.customer.city || '';
        const deliveryType = order.customer.deliveryType || '';
        
        return `
            <div class="glass rounded-2xl p-6 ${isDeleted ? 'opacity-60 border-2 border-red-500/30' : ''} ${order.status === 'traitee' ? 'opacity-75' : ''}">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 class="text-readable-strong font-bold text-lg">Commande #${order.id}</h3>
                            <span class="${statusClass}">
                                <i class="fas ${statusIcon}"></i> ${order.status === 'traitee' ? 'Traitée' : 'En attente'}
                            </span>
                            ${isDeleted ? '<span class="text-red-300"><i class="fas fa-trash"></i> Supprimée</span>' : ''}
                            ${deliveryType === 'recuperation' ? '<span class="text-blue-300"><i class="fas fa-hand-paper"></i> Récupération</span>' : ''}
                        </div>
                        <p class="text-readable text-sm mb-2">
                            <i class="fas fa-user"></i> ${order.customer.name}
                        </p>
                        <p class="text-readable text-sm mb-2">
                            <i class="fas fa-envelope"></i> ${order.customer.email}
                        </p>
                        <p class="text-readable text-sm mb-2">
                            <i class="fas fa-phone"></i> ${order.customer.phone}
                        </p>
                        ${city ? `<p class="text-readable text-sm mb-2">
                            <i class="fas fa-map-marker-alt"></i> ${city}
                        </p>` : ''}
                        <p class="text-readable text-sm mb-4">
                            <i class="fas fa-home"></i> ${order.customer.address}
                        </p>
                        <p class="text-readable text-xs mb-2">Date: ${date}</p>
                        ${isDeleted && deletedDate ? `<p class="text-readable text-xs text-red-300 mb-4">Supprimée le: ${deletedDate}</p>` : ''}
                        ${order.notes ? `
                            <div class="glass rounded-lg p-3 mt-3 bg-blue-500/10 border border-blue-500/30">
                                <div class="flex items-start gap-2">
                                    <i class="fas fa-sticky-note text-blue-300 mt-1"></i>
                                    <div>
                                        <p class="text-readable-strong text-sm font-semibold mb-1">Notes:</p>
                                        <p class="text-readable text-sm">${order.notes}</p>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="text-right ml-4">
                        <div class="text-2xl font-bold text-readable-strong mb-2">${order.total.toFixed(2)}$</div>
                        <div class="text-readable text-sm">${order.items.length} article(s)</div>
                    </div>
                </div>
                <div class="border-t border-white/20 pt-4 mb-4">
                    <h4 class="text-readable-strong font-semibold mb-2">Articles:</h4>
                    <div class="space-y-2">
                        ${order.items.map(item => `
                            <div class="flex justify-between text-readable text-sm">
                                <span>${item.name} x${item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}$</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${!isDeleted ? `
                    <div class="flex gap-2 flex-wrap">
                        ${order.status === 'en_attente' ? `
                            <button onclick="updateOrderStatus(${order.id}, 'traitee')" class="btn-success px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                                <i class="fas fa-check"></i> Marquer comme traitée
                            </button>
                        ` : `
                            <button onclick="updateOrderStatus(${order.id}, 'en_attente')" class="glass px-4 py-2 rounded text-readable text-sm hover:scale-105 transition">
                                <i class="fas fa-undo"></i> Remettre en attente
                            </button>
                        `}
                        <button onclick="openNotesModal(${order.id})" class="btn-edit px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                            <i class="fas fa-sticky-note"></i> Notes
                        </button>
                        <button onclick="deleteOrder(${order.id})" class="btn-danger px-4 py-2 rounded text-white text-sm hover:scale-105 transition">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Mettre à jour les stats commandes
function updateCommandesStats(orders) {
    document.getElementById('totalCommandes').textContent = orders.length;
}

// Mettre à jour le statut d'une commande
async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Statut de la commande mis à jour !');
            loadCommandes(currentCommandeFilter);
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de mettre à jour le statut'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

// Supprimer une commande
async function deleteOrder(orderId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Elle sera déplacée dans les commandes supprimées.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/orders/${orderId}/delete`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            alert('Commande supprimée !');
            loadCommandes(currentCommandeFilter);
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de supprimer la commande'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de la commande');
    }
}

// Ouvrir le modal de notes
async function openNotesModal(orderId) {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;
        
        document.getElementById('editOrderNotesId').value = orderId;
        document.getElementById('editOrderNotes').value = order.notes || '';
        document.getElementById('editOrderNotesModal').classList.add('active');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des notes');
    }
}

// Fermer le modal de notes
function closeNotesModal() {
    document.getElementById('editOrderNotesModal').classList.remove('active');
    document.getElementById('editOrderNotesForm').reset();
}

// Sauvegarder les notes
document.getElementById('editOrderNotesForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const orderId = parseInt(document.getElementById('editOrderNotesId').value);
    const notes = document.getElementById('editOrderNotes').value;
    
    try {
        const response = await fetch(`/api/orders/${orderId}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
        });
        
        if (response.ok) {
            alert('Notes enregistrées !');
            closeNotesModal();
            loadCommandes(currentCommandeFilter);
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible d\'enregistrer les notes'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement des notes');
    }
});

// Fermer le modal en cliquant en dehors
document.getElementById('editOrderNotesModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeNotesModal();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    // Afficher le premier tab par défaut
    showTab('donateurs');
});

