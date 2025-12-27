// Gestion de la sidebar
let sidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.classList.remove('hidden');
    } else {
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }
}

function closeSidebar() {
    if (sidebarOpen) {
        toggleSidebar();
    }
}

// Fermer la sidebar en cliquant sur l'overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Fermer la sidebar en cliquant sur un lien
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Ne fermer que sur mobile
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });
});

// Fermer la sidebar avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
    }
});

