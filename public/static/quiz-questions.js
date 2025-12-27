// Base de données de questions pour le quiz
const QUIZ_QUESTIONS = [
    // Questions sur les paresseux
    { question: 'Combien de doigts a un paresseux à trois doigts ?', options: ['2', '3', '4', '5'], correct: 1 },
    { question: 'Combien de temps un paresseux passe-t-il à dormir par jour ?', options: ['8 heures', '12 heures', '15-20 heures', '24 heures'], correct: 2 },
    { question: 'Combien de fois par semaine un paresseux descend-il des arbres ?', options: ['Tous les jours', '3 fois par semaine', '1 fois par semaine', 'Jamais'], correct: 2 },
    { question: 'Quelle est la vitesse maximale d\'un paresseux au sol ?', options: ['0.24 km/h', '2.4 km/h', '24 km/h', '240 km/h'], correct: 0 },
    { question: 'Combien d\'espèces de paresseux existent dans le monde ?', options: ['2', '4', '6', '8'], correct: 2 },
    { question: 'Quel est le principal prédateur du paresseux ?', options: ['Jaguar', 'Aigle', 'Serpent', 'Humain'], correct: 0 },
    { question: 'De quelle couleur est généralement la fourrure d\'un paresseux ?', options: ['Noir', 'Brun-vert', 'Blanc', 'Rouge'], correct: 1 },
    { question: 'Pourquoi la fourrure du paresseux est-elle verte ?', options: ['Pigmentation naturelle', 'Algues qui y poussent', 'Reflet de la forêt', 'Teinture'], correct: 1 },
    { question: 'Combien de vertèbres cervicales a un paresseux ?', options: ['5', '7', '9', '11'], correct: 2 },
    { question: 'Quel est le poids moyen d\'un paresseux adulte ?', options: ['2-3 kg', '4-5 kg', '6-8 kg', '10-12 kg'], correct: 1 },
    { question: 'Combien de temps dure la gestation d\'un paresseux ?', options: ['3 mois', '6 mois', '9 mois', '12 mois'], correct: 1 },
    { question: 'Où vit principalement le paresseux à deux doigts ?', options: ['Costa Rica', 'Amazonie', 'Afrique', 'Asie'], correct: 1 },
    { question: 'Quel est le régime alimentaire principal du paresseux ?', options: ['Viande', 'Feuilles', 'Fruits', 'Insectes'], correct: 1 },
    { question: 'Combien de temps un paresseux peut-il retenir sa respiration ?', options: ['10 secondes', '40 secondes', '2 minutes', '5 minutes'], correct: 1 },
    { question: 'Quel est le nom scientifique du paresseux à trois doigts ?', options: ['Bradypus', 'Choloepus', 'Megatherium', 'Eremotherium'], correct: 0 },
    
    // Questions sur le Costa Rica
    { question: 'Quelle est la capitale du Costa Rica ?', options: ['San José', 'Cartago', 'Limon', 'Puntarenas'], correct: 0 },
    { question: 'Quel pourcentage du territoire du Costa Rica est protégé ?', options: ['15%', '25%', '30%', '50%'], correct: 1 },
    { question: 'Combien de parcs nationaux compte le Costa Rica ?', options: ['15', '25', '30', '35'], correct: 1 },
    { question: 'Quelle est la monnaie du Costa Rica ?', options: ['Peso', 'Colón', 'Dollar', 'Euro'], correct: 1 },
    { question: 'Quelle est la langue officielle du Costa Rica ?', options: ['Anglais', 'Espagnol', 'Français', 'Portugais'], correct: 1 },
    { question: 'Quel océan borde le Costa Rica à l\'ouest ?', options: ['Atlantique', 'Pacifique', 'Indien', 'Arctique'], correct: 1 },
    { question: 'Quel océan borde le Costa Rica à l\'est ?', options: ['Atlantique', 'Pacifique', 'Indien', 'Arctique'], correct: 0 },
    { question: 'Quelle est la population approximative du Costa Rica ?', options: ['2 millions', '5 millions', '8 millions', '12 millions'], correct: 1 },
    { question: 'Quel est le point culminant du Costa Rica ?', options: ['Cerro Chirripó', 'Volcan Arenal', 'Mont Irazú', 'Volcan Poás'], correct: 0 },
    { question: 'Combien de volcans actifs compte le Costa Rica ?', options: ['3', '5', '7', '10'], correct: 2 },
    { question: 'Quelle est la saison des pluies au Costa Rica ?', options: ['Décembre-Avril', 'Mai-Novembre', 'Juin-Septembre', 'Toute l\'année'], correct: 1 },
    { question: 'Quel est le nom du parc national le plus visité du Costa Rica ?', options: ['Manuel Antonio', 'Tortuguero', 'Monteverde', 'Corcovado'], correct: 0 },
    { question: 'Combien d\'espèces d\'oiseaux peut-on trouver au Costa Rica ?', options: ['300', '600', '900', '1200'], correct: 2 },
    { question: 'Quel est le nom du volcan le plus actif du Costa Rica ?', options: ['Arenal', 'Irazú', 'Poás', 'Rincón de la Vieja'], correct: 0 },
    { question: 'Quelle est la température moyenne au Costa Rica ?', options: ['15-20°C', '20-25°C', '25-30°C', '30-35°C'], correct: 1 },
    
    // Questions sur la conservation
    { question: 'Quel est le nom du projet de conservation des paresseux ?', options: ['Sloth Flight', 'Sloth Air', 'Sloth Express', 'Sloth Conservation'], correct: 1 },
    { question: 'Où se trouve le bureau principal de L\'Odyssée du Paresseux ?', options: ['San José', 'Laval', 'Montréal', 'Paris'], correct: 1 },
    { question: 'Qui est le directeur de L\'Odyssée du Paresseux ?', options: ['Jean', 'Ahmad', 'Maria', 'Carlos'], correct: 1 },
    { question: 'Quel est l\'objectif principal du projet Sloth Air ?', options: ['Élever des paresseux', 'Créer un jet privé', 'Protéger l\'habitat', 'Vendre des souvenirs'], correct: 2 },
    { question: 'Combien de zones de conservation sont mentionnées sur la carte ?', options: ['1', '2', '3', '4'], correct: 2 },
    
    // Questions générales sur la faune
    { question: 'Quel animal est le symbole national du Costa Rica ?', options: ['Paresseux', 'Toucan', 'Jaguar', 'Quetzal'], correct: 0 },
    { question: 'Combien d\'espèces de mammifères vivent au Costa Rica ?', options: ['100', '200', '250', '300'], correct: 2 },
    { question: 'Quel est le plus grand prédateur du Costa Rica ?', options: ['Jaguar', 'Puma', 'Ocelot', 'Crocodile'], correct: 0 },
    { question: 'Combien d\'espèces de reptiles peut-on trouver au Costa Rica ?', options: ['150', '200', '250', '300'], correct: 1 },
    { question: 'Quel est le nom de la grenouille emblématique du Costa Rica ?', options: ['Grenouille bleue', 'Grenouille rouge', 'Grenouille dorée', 'Grenouille verte'], correct: 2 },
    
    // Questions supplémentaires sur les paresseux
    { question: 'Quel est le sens le plus développé chez le paresseux ?', options: ['Vue', 'Ouïe', 'Odorat', 'Toucher'], correct: 2 },
    { question: 'Combien de dents a un paresseux ?', options: ['16', '18', '20', '22'], correct: 1 },
    { question: 'Quel est le nom du bébé paresseux ?', options: ['Paresselet', 'Paresseuxon', 'Paresseux bébé', 'Jeune paresseux'], correct: 0 },
    { question: 'Combien de temps un bébé paresseux reste-t-il avec sa mère ?', options: ['1 mois', '3 mois', '6 mois', '1 an'], correct: 2 },
    { question: 'Quelle est la température corporelle normale d\'un paresseux ?', options: ['30-32°C', '33-35°C', '36-38°C', '39-41°C'], correct: 0 },
    { question: 'Combien de temps un paresseux peut-il vivre ?', options: ['10-15 ans', '20-30 ans', '30-40 ans', '40-50 ans'], correct: 1 },
    { question: 'Quel est le principal danger pour les paresseux aujourd\'hui ?', options: ['Prédateurs', 'Maladies', 'Déforestation', 'Chasse'], correct: 2 },
    { question: 'Combien de temps un paresseux met-il à digérer un repas ?', options: ['1 jour', '1 semaine', '2 semaines', '1 mois'], correct: 3 },
    { question: 'Quel est le nom du paresseux le plus rapide ?', options: ['Paresseux à deux doigts', 'Paresseux à trois doigts', 'Paresseux nain', 'Paresseux géant'], correct: 0 },
    { question: 'Où vit le paresseux nain ?', options: ['Costa Rica', 'Panama', 'Colombie', 'Équateur'], correct: 1 },
    
    // Questions sur la géographie du Costa Rica
    { question: 'Quelle est la superficie du Costa Rica ?', options: ['30 000 km²', '50 000 km²', '70 000 km²', '90 000 km²'], correct: 1 },
    { question: 'Combien de provinces compte le Costa Rica ?', options: ['5', '7', '9', '11'], correct: 1 },
    { question: 'Quel est le nom de la péninsule la plus célèbre du Costa Rica ?', options: ['Nicoya', 'Osa', 'Burica', 'Santa Elena'], correct: 0 },
    { question: 'Quelle est la plus grande ville du Costa Rica ?', options: ['San José', 'Cartago', 'Alajuela', 'Heredia'], correct: 0 },
    { question: 'Quel est le nom du plus grand lac du Costa Rica ?', options: ['Lac Arenal', 'Lac Cote', 'Lac Nicaragua', 'Lac Tortuguero'], correct: 0 },
    
    // Questions sur la biodiversité
    { question: 'Combien d\'espèces de plantes peut-on trouver au Costa Rica ?', options: ['5 000', '10 000', '15 000', '20 000'], correct: 1 },
    { question: 'Quel pourcentage de la biodiversité mondiale se trouve au Costa Rica ?', options: ['2%', '4%', '6%', '8%'], correct: 1 },
    { question: 'Combien d\'espèces de papillons vit au Costa Rica ?', options: ['500', '1000', '1500', '2000'], correct: 2 },
    { question: 'Quel est le nom de la réserve biologique la plus célèbre ?', options: ['Monteverde', 'Corcovado', 'Tortuguero', 'Manuel Antonio'], correct: 0 },
    { question: 'Combien d\'espèces de grenouilles peut-on trouver au Costa Rica ?', options: ['100', '150', '200', '250'], correct: 1 },
    
    // Questions sur le climat
    { question: 'Quel est le climat principal du Costa Rica ?', options: ['Tropical', 'Tempéré', 'Désertique', 'Polaire'], correct: 0 },
    { question: 'Quelle est la saison sèche au Costa Rica ?', options: ['Décembre-Avril', 'Mai-Novembre', 'Juin-Septembre', 'Toute l\'année'], correct: 0 },
    { question: 'Quelle est la température moyenne en saison sèche ?', options: ['20-25°C', '25-30°C', '30-35°C', '35-40°C'], correct: 1 },
    { question: 'Combien de mm de pluie tombe en moyenne par an au Costa Rica ?', options: ['1000', '2000', '3000', '4000'], correct: 2 },
    { question: 'Quel est le mois le plus pluvieux ?', options: ['Septembre', 'Octobre', 'Novembre', 'Décembre'], correct: 1 },
    
    // Questions sur la culture
    { question: 'Quel est le sport national du Costa Rica ?', options: ['Football', 'Baseball', 'Basketball', 'Volleyball'], correct: 0 },
    { question: 'Quel est le plat national du Costa Rica ?', options: ['Gallo Pinto', 'Casado', 'Ceviche', 'Tamal'], correct: 0 },
    { question: 'Quelle est la religion principale au Costa Rica ?', options: ['Catholicisme', 'Protestantisme', 'Islam', 'Bouddhisme'], correct: 0 },
    { question: 'Quel est le nom du café costaricien le plus célèbre ?', options: ['Tarrazú', 'Central Valley', 'Guanacaste', 'Limón'], correct: 0 },
    { question: 'Quelle est la fête nationale du Costa Rica ?', options: ['15 septembre', '25 décembre', '1er janvier', '1er mai'], correct: 0 },
    
    // Questions supplémentaires sur les paresseux (suite)
    { question: 'Quel est le nom scientifique du paresseux à deux doigts ?', options: ['Bradypus', 'Choloepus', 'Megatherium', 'Eremotherium'], correct: 1 },
    { question: 'Combien de doigts a un paresseux à deux doigts ?', options: ['2', '3', '4', '5'], correct: 0 },
    { question: 'Quel est le principal moyen de défense du paresseux ?', options: ['Course', 'Camouflage', 'Combat', 'Cri'], correct: 1 },
    { question: 'Combien de temps un paresseux peut-il rester suspendu ?', options: ['Plusieurs heures', 'Plusieurs jours', 'Plusieurs semaines', 'Plusieurs mois'], correct: 0 },
    { question: 'Quel est le nom de la griffe spéciale du paresseux ?', options: ['Griffe de suspension', 'Griffe de préhension', 'Griffe de défense', 'Griffe de chasse'], correct: 0 },
    
    // Questions sur les zones de conservation
    { question: 'Quel est le nom de la zone de conservation mentionnée sur la carte ?', options: ['Monteverde', 'Manuel Antonio', 'Tortuguero', 'Toutes les réponses'], correct: 3 },
    { question: 'Combien de paresseux sont observés à Monteverde ?', options: ['10', '12', '15', '20'], correct: 2 },
    { question: 'Combien de paresseux sont observés à Manuel Antonio ?', options: ['5', '8', '10', '12'], correct: 1 },
    { question: 'Combien de paresseux sont observés à Tortuguero ?', options: ['10', '12', '15', '18'], correct: 1 },
    { question: 'Quel type de forêt caractérise Monteverde ?', options: ['Forêt sèche', 'Forêt nuageuse', 'Forêt tropicale', 'Forêt de mangrove'], correct: 1 },
    
    // Questions sur le projet Sloth Air
    { question: 'Quel est l\'objectif du projet Sloth Air ?', options: ['Élever des paresseux', 'Créer un jet privé', 'Protéger l\'habitat', 'Vendre des billets'], correct: 2 },
    { question: 'Quel est le montant minimum pour le niveau "Fenêtre Hublot" ?', options: ['25$', '51$', '75$', '100$'], correct: 1 },
    { question: 'Combien de niveaux de contribution existe-t-il ?', options: ['3', '4', '5', '6'], correct: 2 },
    { question: 'Quel est le nom du directeur du projet ?', options: ['Jean', 'Ahmad', 'Maria', 'Carlos'], correct: 1 },
    { question: 'Où se trouve le bureau principal ?', options: ['San José', 'Laval', 'Montréal', 'Paris'], correct: 1 },
    
    // Questions supplémentaires sur la faune
    { question: 'Combien d\'espèces de singes vit au Costa Rica ?', options: ['2', '4', '6', '8'], correct: 1 },
    { question: 'Quel est le nom du singe le plus célèbre du Costa Rica ?', options: ['Singe hurleur', 'Singe capucin', 'Singe araignée', 'Singe écureuil'], correct: 1 },
    { question: 'Combien d\'espèces de serpents peut-on trouver au Costa Rica ?', options: ['100', '130', '150', '180'], correct: 1 },
    { question: 'Quel est le nom du serpent le plus venimeux du Costa Rica ?', options: ['Fer de lance', 'Boa constricteur', 'Serpent corail', 'Python'], correct: 0 },
    { question: 'Combien d\'espèces de tortues marines nidifient au Costa Rica ?', options: ['2', '4', '6', '8'], correct: 1 },
    
    // Questions sur l\'écologie
    { question: 'Quel est le principal défi écologique du Costa Rica ?', options: ['Pollution', 'Déforestation', 'Surpopulation', 'Sécheresse'], correct: 1 },
    { question: 'Quel pourcentage d\'énergie renouvelable utilise le Costa Rica ?', options: ['50%', '75%', '90%', '100%'], correct: 2 },
    { question: 'Quel est l\'objectif du Costa Rica en matière de carbone ?', options: ['Neutre en 2020', 'Neutre en 2025', 'Neutre en 2030', 'Neutre en 2050'], correct: 1 },
    { question: 'Combien de réserves biologiques compte le Costa Rica ?', options: ['20', '30', '40', '50'], correct: 1 },
    { question: 'Quel est le nom du programme de conservation le plus célèbre ?', options: ['Pagos por Servicios', 'Conservación Verde', 'Protección Natural', 'Eco Costa Rica'], correct: 0 },
    
    // Questions finales sur les paresseux
    { question: 'Quel est le nom de la maladie qui affecte les paresseux ?', options: ['Paresseuxite', 'Bradypus disease', 'Sloth syndrome', 'Aucune maladie spécifique'], correct: 3 },
    { question: 'Combien de temps un paresseux peut-il rester sans manger ?', options: ['1 jour', '1 semaine', '2 semaines', '1 mois'], correct: 1 },
    { question: 'Quel est le nom du centre de réhabilitation le plus célèbre ?', options: ['Sloth Sanctuary', 'Paresseux Rescue', 'Bradypus Center', 'Sloth Care'], correct: 0 },
    { question: 'Combien de paresseux sont sauvés chaque année au Costa Rica ?', options: ['50', '100', '200', '300'], correct: 1 },
    { question: 'Quel est le principal danger pour les paresseux urbains ?', options: ['Voitures', 'Chiens', 'Fils électriques', 'Tous les réponses'], correct: 3 }
];

// Fonction pour obtenir des questions aléatoires
function getRandomQuestions(count = 5) {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, QUIZ_QUESTIONS.length));
}

