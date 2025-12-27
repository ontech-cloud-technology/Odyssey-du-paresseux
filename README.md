# L'Odyssée du Paresseux - Site Web Vitrine

Site web vitrine moderne pour "L'Odyssée du Paresseux" avec design luxueux, enfantin et glassmorphisme.

## 🎨 Caractéristiques

- **Design Luxueux & Enfantin** : Interface moderne avec décorations animées
- **Glassmorphisme** : Effets de verre dépoli avec transparence
- **Tailwind CSS** : Framework CSS utilitaire pour un design responsive
- **LocalStorage** : Toutes les données (donateurs, témoignages, galerie) stockées localement
- **Animations** : Éléments flottants, animations douces et interactives
- **Responsive** : Design adaptatif pour tous les écrans

## 🚀 Installation

1. Installer les dépendances Python :
```bash
pip install -r requirements.txt
```

2. Lancer le serveur :
```bash
python app.py
```

Le serveur démarre sur le port **5001** (configurable via la variable d'environnement `PORT`).

## 📁 Structure du Projet

```
Mimo/
├── app.py                 # Serveur Flask
├── requirements.txt       # Dépendances Python
├── templates/
│   └── index.html        # Page principale
├── static/
│   ├── app.js            # JavaScript avec gestion localStorage
│   └── images/           # Dossier des images
│       ├── logo.png      # Logo principal
│       └── README.md     # Instructions pour les images
└── README.md             # Ce fichier
```

## 💾 Gestion des Données

Toutes les données sont stockées dans le **localStorage** du navigateur :

- **Donateurs** : Liste des contributeurs avec montants et niveaux
- **Témoignages** : Témoignages des supporters
- **Galerie** : Images et descriptions de la galerie

## 🎯 Fonctionnalités

- Formulaire de don sécurisé
- Système de niveaux de contribution (12 niveaux)
- Plaque virtuelle de remerciement
- Galerie interactive avec images de paresseux
- Section témoignages
- Formulaire de demande de rapport
- Logo intégré dans la navigation et le footer
- Ajout dynamique d'images à la galerie

## 🖼️ Images

Le logo est déjà intégré dans le site. Pour ajouter des images de paresseux :

1. Placez vos images dans le dossier `static/images/`
2. Nommez-les selon vos préférences (ex: `sloth1.jpg`, `sloth2.jpg`)
3. Utilisez le formulaire dans la section Galerie pour ajouter les images avec leurs descriptions
4. Ou modifiez directement le localStorage dans la console du navigateur

Voir `static/images/README.md` pour plus de détails.

## 🌐 Accès

Une fois le serveur lancé, accédez au site via :
```
http://localhost:5001
```

## 📧 Contact

Directeur : Ahmad
Email : info.ahmadnature@gmail.com
Bureau : Laval

© 2025 L'Odyssée du Paresseux. Tous droits réservés.
