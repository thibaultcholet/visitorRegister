# 🏢 Système de Gestion des Visiteurs

Une application web moderne et intuitive pour la gestion des arrivées et départs des visiteurs en entreprise, développée avec **Context Engineering** et **Claude Code**.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)
![Architecture](https://img.shields.io/badge/architecture-MVC-orange.svg)

## 🎯 Vue d'ensemble

Cette application permet de gérer efficacement les flux de visiteurs avec une interface utilisateur moderne, des animations engageantes et un système d'administration complet.

**🔒 Conformité RGPD** : Conçue spécialement pour aider les entreprises à respecter le Règlement Général sur la Protection des Données (RGPD). L'application offre une solution simple et sécurisée pour l'enregistrement des visiteurs, idéale pour déploiement sur tablette en réception d'entreprise.

### ✨ Fonctionnalités principales

- **🚪 Enregistrement d'arrivée** : Formulaire intelligent avec pré-remplissage automatique
- **🚶 Signalement de départ** : Interface simple pour l'enregistrement des sorties
- **🎉 Feedback utilisateur** : Popup de confirmation avec confettis animés
- **📊 Dashboard administrateur** : Statistiques en temps réel et gestion complète
- **🔒 Sécurité** : Authentification par code PIN et conformité RGPD
- **🛠️ Module Debug** : Outils de développement intégrés

## 📚 Documentation complète

Ce projet dispose d'une documentation exhaustive organisée en plusieurs fichiers :

### 📖 **Documentation utilisateur**
- **[📋 README.md](README.md)** - Vue d'ensemble et démarrage rapide
- **[🚀 INSTALLATION.md](INSTALLATION.md)** - Guide d'installation détaillé  
- **[👥 GUIDE-UTILISATEUR.md](GUIDE-UTILISATEUR.md)** - Manuel utilisateur complet
- **[🧪 TESTS.md](TESTS.md)** - Guide des tests et validation

### 🏗️ **Documentation technique**
- **[🏛️ ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture et design patterns
- **[🔄 MIGRATION.md](MIGRATION.md)** - Guide de migration entre versions
- **[📝 CHANGELOG.md](CHANGELOG.md)** - Historique des versions
- **[🔧 RESTART-PROCEDURE.md](RESTART-PROCEDURE.md)** - Procédures de redémarrage

### 🤝 **Documentation développeur**
- **[🤝 CONTRIBUTING.md](CONTRIBUTING.md)** - Guide de contribution
- **[📋 PLANNING.md](PLANNING.md)** - Planification et roadmap
- **[✅ TASK.md](TASK.md)** - Gestion des tâches
- **[📊 tests/TEST_SUMMARY.md](tests/TEST_SUMMARY.md)** - Résumé des tests

> **💡 Conseil :** Commencez par [INSTALLATION.md](INSTALLATION.md) pour une configuration optimale, puis consultez [GUIDE-UTILISATEUR.md](GUIDE-UTILISATEUR.md) pour découvrir toutes les fonctionnalités.

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Clone du projet
git clone https://github.com/thibaultcholet/Context-Engineering-Intro.git
cd Context-Engineering-Intro/projets/gestion-visiteurs

# Installation des dépendances (initialise automatiquement l'application)
npm install

# Démarrage du serveur
npm start

# Ou en mode développement
npm run dev
```

**📋 Note importante :** Le script `npm install` initialise automatiquement l'application en créant les fichiers de configuration nécessaires à partir des modèles.

L'application sera accessible sur http://localhost:3001

### 🔧 Configuration initiale

Après l'installation, personnalisez votre application :

1. **Configuration** : Éditez `data/config.json` pour personnaliser :
   - Message d'accueil
   - Délai d'anonymisation des données
   - Taille maximale des fichiers

2. **Logo** : Ajoutez votre logo d'entreprise dans `public/images/logo.png`

3. **Sécurité** : Connectez-vous à l'admin avec le code PIN `123456` et changez-le immédiatement

### 🔒 Premier démarrage

1. Démarrez l'application : `npm start`
2. Ouvrez http://localhost:3001 dans votre navigateur
3. Accédez à l'administration via le bouton "Admin" (code PIN : `123456`)
4. **IMPORTANT** : Changez immédiatement le code PIN par défaut dans "Paramètres → Sécurité"

## 🏗️ Architecture du projet

```
gestion-visiteurs/
├── server.js              # Serveur Express principal
├── package.json           # Dépendances et scripts
├── src/                   # Code source organisé (MVC)
│   ├── config/            # Configuration système
│   ├── controllers/       # Contrôleurs métier
│   ├── middleware/        # Middleware de sécurité
│   ├── models/            # Modèles de données
│   ├── repositories/      # Accès aux données
│   ├── routes/            # Définition des routes
│   ├── services/          # Services applicatifs
│   └── utils/             # Utilitaires (logger, etc.)
├── data/
│   ├── config.json        # Configuration système
│   └── visitors.json      # Base de données des visiteurs
├── public/
│   ├── index.html         # Page d'accueil (visiteurs)
│   ├── admin.html         # Interface d'administration
│   ├── app.js             # Logique JavaScript principale
│   └── style.css          # Styles CSS modernes
└── tests/                 # Tests unitaires
    ├── app.test.js        # Tests d'intégration
    └── server.test.js     # Tests serveur
```

## 🎨 Interface utilisateur

### Page d'accueil (Visiteurs)

**Design moderne avec :**
- Horloge en temps réel avec dégradé coloré
- Boutons d'action avec icônes Font Awesome
- Formulaires avec validation en temps réel
- Popup de confirmation avec confettis animés

**Workflow utilisateur :**
1. Clic sur "Enregistrer mon arrivée"
2. Remplissage du formulaire (avec validation)
3. Soumission → Popup de célébration avec confettis
4. Compteur de 5 secondes avec fermeture automatique
5. Retour automatique à l'accueil

### Interface d'administration

**Authentification sécurisée :**
- Code PIN de 4 à 6 chiffres (par défaut : 123456)
- Validation côté client et serveur

**Dashboard organisé :**
- **📊 Statistiques** : Visiteurs actuels, aujourd'hui, 7 jours, 30 jours
- **👥 Visiteurs actuels** : Liste en temps réel avec bouton de départ
- **📋 Historique** : Tableau complet des visites passées

**Paramètres avancés :**
- **⚙️ Configuration** : Message d'accueil, anonymisation
- **🔒 Sécurité** : Changement de code PIN
- **🖼️ Logo** : Upload du logo d'entreprise
- **🧪 Debug & Tests** : Outils de développement

## 🛠️ Fonctionnalités techniques

### Architecture MVC moderne

- **Séparation des responsabilités** : Controllers, Services, Repositories
- **Middleware de sécurité** : Helmet, CORS, Rate limiting
- **Gestion d'erreurs centralisée** avec Winston logging
- **Validation des données** avec Joi
- **Tests unitaires** avec Jest

### Sécurité et conformité

- **Hachage SHA-256** pour les codes PIN
- **Validation stricte** des entrées (regex, longueur)
- **Protection CORS** et headers de sécurité
- **Rate limiting** pour prévenir les attaques
- **Réinitialisation automatique** des formulaires (RGPD)
- **Anonymisation programmée** des données anciennes

### Système de debug

**Module Debug intégré :**
- **Bouton de test** : Pré-remplissage automatique avec données fictives
- **Génération de visiteurs** : Création de données de test
- **Nettoyage de base** : Suppression de tous les visiteurs
- **Contrôle localStorage** : Affichage/masquage du bouton de test

### Design system

**Palette de couleurs moderne :**
```css
--primary-color: #4f46e5    /* Indigo moderne */
--secondary-color: #6366f1  /* Violet */
--success-color: #10b981    /* Vert émeraude */
--danger-color: #ef4444     /* Rouge corail */
```

**Composants stylisés :**
- Boutons avec dégradés et animations
- Formulaires avec icônes intégrées
- Cartes avec ombres et hover effects
- Animations fluides (CSS transitions)

## 📡 API Endpoints

### Visiteurs
- `POST /api/visitors/check-in` - Enregistrement d'arrivée
- `POST /api/visitors/check-out` - Enregistrement de départ
- `GET /api/visitors` - Liste des visiteurs
- `GET /api/visitors/stats` - Statistiques

### Administration
- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/config` - Mise à jour configuration
- `POST /api/admin/change-pin` - Changement de PIN
- `POST /api/admin/anonymize` - Anonymisation des données
- `POST /api/admin/clear-visitors` - Nettoyage debug

### Compatibilité (Legacy)
- `POST /api/check-in` - Compatibilité V1
- `POST /api/check-out` - Compatibilité V1
- `GET /api/admin/stats` - Compatibilité V1

## 🎯 Données de test

Le système inclut 5 jeux de données fictives pour les tests :

```javascript
// Exemples de visiteurs de test
Jean Martin - Tech Solutions SARL
Sophie Lefebvre - Digital Consulting  
Thomas Rousseau - Innovation Labs
Maria Garcia - Global Services Inc
Alexandre Durand - StartUp360
```

**Activation du mode test :**
1. Se connecter à l'admin (PIN : 123456)
2. Aller dans Paramètres → Debug & Tests
3. Cliquer sur "Afficher bouton de test"
4. Le bouton apparaît sur le formulaire d'arrivée

## 🔧 Configuration

### Fichier `data/config.json`

```json
{
  "pinCodeHash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "requirePinChange": true,
  "welcomeMessage": "Bienvenue chez Société X",
  "logoPath": "/images/logo_default.png",
  "anonymizationDays": 30
}
```

### Variables modifiables

- **Code PIN par défaut** : 123456 (hash SHA-256)
- **Message d'accueil** : Personnalisable via l'admin
- **Délai d'anonymisation** : 30 jours par défaut
- **Logo** : Upload via interface admin

## 🧪 Tests et développement

### Tests unitaires

```bash
# Exécuter tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage

# Linting du code
npm run lint
```

### Fonctionnalités de debug

**Bouton de pré-remplissage :**
- Sélection aléatoire de données fictives
- Animation de remplissage des champs
- Contrôlable depuis l'admin

**Outils d'administration :**
- Génération automatique de visiteurs test
- Nettoyage complet de la base
- Gestion de l'affichage du bouton de test

### Logs et debugging

**Winston Logger** pour le serveur :
- Logs d'application dans `logs/app.log`
- Logs d'erreurs dans `logs/error.log`
- Niveaux : error, warn, info, debug

**Console du navigateur** :
- Countdown du timer de popup
- État des éléments DOM
- Étapes de redirection
- Erreurs de validation

## 🎨 Personnalisation

### Modification des couleurs

Éditer les variables CSS dans `public/style.css` :

```css
:root {
    --primary-color: #votre-couleur;
    --secondary-color: #votre-couleur;
    /* ... */
}
```

### Ajout de nouvelles données de test

Modifier le tableau `testData` dans `public/app.js` :

```javascript
const testData = [
    {
        nom: "Nouveau",
        prenom: "Visiteur", 
        societe: "Nouvelle Société",
        email: "visiteur@societe.com",
        telephone: "01 23 45 67 89",
        personneVisitee: "Contact Interne"
    }
    // ...
];
```

## 🚀 Déploiement

### Production

1. **Configuration** :
   - Modifier le code PIN par défaut
   - Personnaliser le message d'accueil
   - Upload du logo d'entreprise

2. **Sécurité** :
   - Utiliser HTTPS en production
   - Configurer un reverse proxy (nginx)
   - Restreindre l'accès à l'admin

3. **Performance** :
   - Compression gzip
   - Cache des assets statiques
   - Monitoring des performances

## 📈 Évolutions futures

- **📧 Notifications email** pour les arrivées/départs
- **📱 Application mobile** avec QR codes
- **🔗 Intégration Active Directory** pour l'authentification
- **📊 Rapports avancés** avec graphiques
- **🌐 Multi-langues** (i18n)
- **📷 Capture photo** des visiteurs
- **✍️ Signature numérique** pour la conformité

## 🤝 Contribution

Ce projet a été développé avec **Context Engineering** et **Claude Code**, démontrant l'efficacité de cette approche pour le développement rapide d'applications complètes.

### Technologies utilisées

- **Backend** : Node.js, Express.js
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Design** : Font Awesome, CSS Grid/Flexbox
- **Sécurité** : SHA-256, validation côté client/serveur
- **Développement** : Claude Code, Context Engineering

---

**Développé avec ❤️ par Context Engineering et Claude Code**