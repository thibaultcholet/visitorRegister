# 🏗️ PLANNING.md - Architecture et Planification

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Consultez le [README.md](README.md) pour une vue d'ensemble.

## 📋 Vue d'ensemble du projet

**Nom** : Système de Gestion des Visiteurs  
**Version** : 2.0.0  
**Stack** : Node.js, Express, HTML5, CSS3, JavaScript ES6+  
**Architecture** : MVC avec séparation des responsabilités  
**Objectif** : Application web complète pour la gestion des flux de visiteurs en entreprise

## 🎯 Objectifs principaux

### Fonctionnels
- ✅ Enregistrement simplifié des arrivées/départs
- ✅ Interface administrative sécurisée
- ✅ Statistiques en temps réel
- ✅ Conformité RGPD avec anonymisation
- ✅ Système de debug intégré

### Techniques
- ✅ Architecture MVC moderne avec séparation des responsabilités
- ✅ API REST complète avec middleware de sécurité
- ✅ Sécurité avec hachage SHA-256, CORS, Rate limiting
- ✅ Interface responsive avec validation temps réel
- ✅ Persistance des données JSON avec repositories
- ✅ Tests unitaires avec Jest
- ✅ Logging avec Winston

## 🏛️ Architecture du système

### Structure des fichiers
```
gestion-visiteurs/
├── server.js              # 🚀 Serveur Express principal
├── package.json           # 📦 Configuration npm
├── src/                   # 💼 Code source organisé
│   ├── config/            # ⚙️ Configuration système
│   │   └── config.js      # Configuration principale
│   ├── controllers/       # 🎮 Contrôleurs métier
│   │   ├── VisitorController.js
│   │   └── ConfigController.js
│   ├── middleware/        # 🚫 Middleware de sécurité
│   │   ├── security.js    # CORS, Rate limiting
│   │   └── errorHandler.js # Gestion d'erreurs
│   ├── models/            # 📊 Modèles de données
│   │   ├── Visitor.js
│   │   └── Config.js
│   ├── repositories/      # 💾 Accès aux données
│   │   ├── VisitorRepository.js
│   │   ├── ConfigRepository.js
│   │   └── FileRepository.js
│   ├── routes/            # 🛼 Définition des routes
│   │   ├── visitorRoutes.js
│   │   └── configRoutes.js
│   ├── services/          # 🛠️ Services applicatifs
│   │   ├── VisitorService.js
│   │   └── ConfigService.js
│   └── utils/             # 🔧 Utilitaires
│       └── logger.js      # Winston logging
├── data/
│   ├── config.json        # ⚙️ Configuration système
│   └── visitors.json      # 💾 Base de données visiteurs
├── public/
│   ├── index.html         # 🏠 Interface visiteurs
│   ├── admin.html         # 👤 Interface administration
│   ├── app.js             # 🧠 Logique métier frontend
│   ├── style.css          # 🎨 Styles et design system
│   └── images/
│       └── logo.png       # 🖼️ Logo d'entreprise
├── tests/                 # 🧪 Tests unitaires
│   ├── app.test.js        # Tests d'intégration
│   └── server.test.js     # Tests serveur
└── logs/                  # 📝 Logs d'application
```

### Couches applicatives (Architecture MVC)

#### 1. **Couche Présentation** (Frontend)
- **index.html** : Interface utilisateur visiteurs
- **admin.html** : Dashboard administrateur
- **app.js** : Logique client, validation, animations
- **style.css** : Design system moderne avec variables CSS

#### 2. **Couche Contrôle** (Controllers)
- **VisitorController.js** : Gestion des visiteurs (check-in/out)
- **ConfigController.js** : Configuration système et admin
- **Routes** : `/api/visitors/*`, `/api/admin/*`
- **Middleware** : Sécurité, validation, gestion d'erreurs

#### 3. **Couche Service** (Business Logic)
- **VisitorService.js** : Logique métier visiteurs
- **ConfigService.js** : Logique configuration
- **Validation** : Joi pour validation des données
- **Sécurité** : Hachage, authentification

#### 4. **Couche Persistance** (Repositories)
- **VisitorRepository.js** : Accès aux données visiteurs
- **ConfigRepository.js** : Accès à la configuration
- **FileRepository.js** : Gestion des fichiers JSON
- **Modèles** : Visitor.js, Config.js

#### 5. **Couche Infrastructure** (Utils)
- **logger.js** : Winston logging
- **security.js** : Middleware CORS, Rate limiting
- **errorHandler.js** : Gestion centralisée des erreurs

## 📐 Patterns et conventions

### Conventions de code
- **Nommage** : camelCase pour JS, kebab-case pour CSS
- **Structure** : Séparation claire logique/présentation
- **Validation** : Double validation client/serveur
- **Sécurité** : Hachage SHA-256, validation stricte

### Design patterns utilisés
- **MVC** : Séparation modèle/vue/contrôleur
- **Observer** : Événements DOM et callbacks
- **Strategy** : Gestion des différents modes (normal/debug)
- **Singleton** : Configuration globale

### Architecture API REST
```
# Nouvelles routes (V2)
POST /api/visitors/check-in    # Enregistrement arrivée
POST /api/visitors/check-out   # Enregistrement départ
GET  /api/visitors             # Liste visiteurs
GET  /api/visitors/stats       # Statistiques
POST /api/admin/login          # Authentification admin
POST /api/admin/config         # Configuration système

# Routes de compatibilité (V1)
POST /api/check-in             # Compatibilité V1
POST /api/check-out            # Compatibilité V1
GET  /api/admin/stats          # Compatibilité V1
```

## 🔧 Contraintes techniques

### Environnement
- **Node.js** : Version 18+ requise
- **Navigateurs** : Support modern browsers (ES6+)
- **Dépendances** : Minimales (4 packages npm)
- **Performance** : < 100ms temps de réponse

### Sécurité
- **Authentification** : PIN hashé SHA-256
- **Validation** : Regex strictes pour entrées
- **RGPD** : Anonymisation automatique après 30 jours
- **XSS** : Échappement des entrées utilisateur

### Limitations actuelles
- **Stockage** : Fichiers JSON (pas de BDD)
- **Concurrent** : Pas de gestion multi-utilisateurs
- **Offline** : Pas de support hors ligne
- **Backup** : Pas de sauvegarde automatique

## 🎨 Design System

### Palette de couleurs
```css
--primary-color: #4f46e5    /* Indigo - Actions principales */
--secondary-color: #6366f1  /* Violet - Éléments secondaires */
--success-color: #10b981    /* Vert - Succès et validation */
--danger-color: #ef4444     /* Rouge - Erreurs et alertes */
--warning-color: #f59e0b    /* Orange - Avertissements */
--info-color: #3b82f6       /* Bleu - Informations */
```

### Composants standardisés
- **Boutons** : Dégradés, hover effects, icônes
- **Formulaires** : Validation temps réel, feedback visuel
- **Cartes** : Ombres, bordures arrondies
- **Animations** : Transitions fluides, confettis

## 📊 Modèle de données

### Visiteur
```json
{
  "id": "UUID",
  "nom": "string",
  "prenom": "string", 
  "societe": "string",
  "email": "string",
  "telephone": "string",
  "personneVisitee": "string",
  "heureArrivee": "ISO timestamp",
  "heureDepart": "ISO timestamp | null",
  "statut": "present | parti"
}
```

### Configuration
```json
{
  "pinCodeHash": "SHA-256 hash",
  "requirePinChange": "boolean",
  "welcomeMessage": "string",
  "logoPath": "string",
  "anonymizationDays": "number"
}
```

## 🚀 Stratégie de déploiement

### Environnements
- **Développement** : `npm start` sur localhost:3000
- **Test** : Mode debug activé avec données fictives
- **Production** : HTTPS, reverse proxy, monitoring

### Processus de déploiement
1. **Préparation** : Modifier PIN par défaut
2. **Configuration** : Personnaliser message et logo
3. **Sécurité** : HTTPS, restrictions d'accès
4. **Monitoring** : Logs, métriques, alertes

## 📈 Évolution et maintenance

### Prochaines versions
- **v2.1** : Notifications email, rapports PDF
- **v2.2** : Application mobile, QR codes
- **v3.0** : Base de données relationnelle, multi-entreprises

### Maintenance
- **Logs** : Rotation automatique
- **Backup** : Sauvegarde données JSON
- **Updates** : Mises à jour sécurité
- **Monitoring** : Surveillance performances

## 🧪 Stratégie de tests

### Tests unitaires
- **Fonctions** : Validation, hachage, formatage
- **API** : Endpoints, codes de retour
- **Sécurité** : Tentatives d'intrusion, validation

### Tests d'intégration
- **Workflow** : Arrivée → Statistiques → Départ
- **Admin** : Authentification → Configuration → Logout
- **Performance** : Charge, concurrence

### Tests utilisateur
- **Ergonomie** : Parcours utilisateur fluide
- **Accessibilité** : Contraste, navigation clavier
- **Responsive** : Mobile, tablette, desktop

---

## 🎯 Philosophie du projet

Ce projet démontre l'efficacité du **Context Engineering** avec **Claude Code** :
- Développement rapide et itératif
- Code propre et maintenable
- Documentation complète et à jour
- Architecture évolutive et modulaire

**Dernière mise à jour** : 2025-07-17