// Gestion du panier
let cart = JSON.parse(localStorage.getItem('boutique_cart')) || [];
let products = [];
let currentFilter = 'tous';

// Charger les produits au démarrage
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
});

// Charger les produits depuis l'API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        document.getElementById('noProducts').classList.remove('hidden');
    }
}

// Afficher les produits
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    const noProducts = document.getElementById('noProducts');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card glass-card rounded-2xl p-6">
            <div class="mb-4">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 object-cover rounded-lg mb-4"
                     onerror="this.src='/static/images/logo.png'">
                <h3 class="text-xl font-bold text-white mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-bold text-white">${product.price.toFixed(2)}$</span>
                    <span class="text-gray-400 text-sm">
                        <i class="fas fa-box"></i> Stock: ${product.stock || 0}
                    </span>
                </div>
            </div>
            <button onclick="addToCart(${product.id})" 
                    class="btn-primary w-full px-4 py-3 rounded-lg text-white font-bold"
                    ${(product.stock || 0) <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <i class="fas fa-cart-plus mr-2"></i> Ajouter au panier
            </button>
        </div>
    `).join('');
}

// Filtrer les produits
function filterProducts(category) {
    currentFilter = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredProducts = products;
    if (category !== 'tous') {
        filteredProducts = products.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    displayProducts(filteredProducts);
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (product.stock && existingItem.quantity >= product.stock) {
            alert('Stock insuffisant');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Produit ajouté au panier !');
}

// Retirer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Modifier la quantité
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (product && product.stock && newQuantity > product.stock) {
        alert('Stock insuffisant');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('boutique_cart', JSON.stringify(cart));
}

// Mettre à jour l'UI du panier
function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount > 0) {
        badge.textContent = cartCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    
    document.getElementById('cartTotal').textContent = total.toFixed(2) + '$';
    
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4 opacity-50"></i>
                <p class="text-gray-300">Votre panier est vide</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="glass-card rounded-lg p-4">
                <div class="flex gap-4">
                    <img src="${item.image}" alt="${item.name}" 
                         class="w-16 h-16 object-cover rounded-lg"
                         onerror="this.src='/static/images/logo.png'">
                    <div class="flex-1">
                        <h4 class="text-white font-semibold mb-1">${item.name}</h4>
                        <p class="text-gray-400 text-sm mb-2">${item.price.toFixed(2)}$</p>
                        <div class="flex items-center gap-2">
                            <button onclick="updateQuantity(${item.id}, -1)" 
                                    class="glass-card px-2 py-1 rounded text-gray-300 hover:text-white hover:bg-white/5">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="text-white font-semibold px-3">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" 
                                    class="glass-card px-2 py-1 rounded text-gray-300 hover:text-white hover:bg-white/5">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="removeFromCart(${item.id})" 
                                    class="ml-auto text-red-400 hover:text-red-300">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// toggleCart est maintenant défini dans boutique.html

// clearCart est maintenant défini dans boutique.html

// checkout est maintenant défini dans boutique.html

// closeCheckoutModal est maintenant défini dans boutique.html

// Soumettre la commande
document.getElementById('checkoutForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const city = document.getElementById('customerCity').value;
    const address = document.getElementById('customerAddress').value;
    
    if (!city) {
        alert('Veuillez sélectionner votre ville');
        return;
    }
    
    const customer = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        city: city,
        address: address,
        deliveryType: (city === 'Montréal' || city === 'Laval') ? 'livraison' : 'recuperation'
    };
    
    const orderData = {
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        customer: customer
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            showNotification('Commande passée avec succès !', 'success');
            cart = [];
            saveCart();
            updateCartUI();
            closeCheckoutModal();
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de passer la commande'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la commande. Veuillez réessayer.');
    }
});

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer une notification simple
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 glass-strong px-6 py-4 rounded-lg text-readable-strong z-50 animate-slide-in`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

