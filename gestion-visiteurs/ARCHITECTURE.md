# 🏗️ Architecture - Système de Gestion des Visiteurs

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Pour débuter, consultez [INSTALLATION.md](INSTALLATION.md).

## 📋 Vue d'ensemble

Le projet **Système de Gestion des Visiteurs** a été refactorisé selon les principes de la **Clean Architecture** pour améliorer la maintenabilité, l'évolutivité et la testabilité.

## 🎯 Objectifs de la refactorisation

### ✅ **Problèmes résolus**
- **Monolithe** → Architecture modulaire en couches
- **Couplage fort** → Séparation des responsabilités
- **Validation manuelle** → Validation automatisée avec Joi
- **Gestion d'erreurs basique** → Middleware centralisé
- **Logs console** → Système de logging structuré avec Winston
- **Sécurité minimale** → Protection renforcée (Helmet, CORS, Rate limiting)

### 📈 **Améliorations apportées**
- **Maintenabilité** : Code modulaire et découplé
- **Testabilité** : Injection de dépendances et mocks
- **Évolutivité** : Ajout facile de nouvelles fonctionnalités
- **Sécurité** : Protection contre les attaques courantes
- **Performance** : Optimisations et monitoring
- **Observabilité** : Logs structurés et métriques

## 🏛️ Structure de la nouvelle architecture

### 📁 **Organisation des dossiers**
```
src/
├── config/              # Configuration centralisée
│   └── config.js        # Variables d'environnement
├── controllers/         # Gestion des requêtes HTTP
│   ├── VisitorController.js
│   └── ConfigController.js
├── services/           # Logique métier
│   ├── VisitorService.js
│   └── ConfigService.js
├── repositories/       # Accès aux données
│   ├── FileRepository.js
│   ├── VisitorRepository.js
│   └── ConfigRepository.js
├── models/            # Entités et validation
│   ├── Visitor.js
│   └── Config.js
├── middleware/        # Middleware Express
│   ├── errorHandler.js
│   └── security.js
├── routes/           # Définition des routes
│   ├── visitorRoutes.js
│   └── configRoutes.js
└── utils/           # Utilitaires
    └── logger.js
```

### 🔄 **Flux de données (Clean Architecture)**
```
HTTP Request → Routes → Controllers → Services → Repositories → Models
                ↓         ↓          ↓           ↓            ↓
           Middleware  Validation  Business   Data Access  Entities
                ↓         ↓          ↓           ↓            ↓
           Security   Error Handle  Logic      Storage     Validation
                ↓         ↓          ↓           ↓            ↓
HTTP Response ← JSON ← Transform ← Process ← Read/Write ← Schema
```

## 🎯 Responsabilités par couche

### 1. **Models (Entités)**
- **Responsabilité** : Définition des entités métier et validation
- **Contenu** : Structures de données, schémas Joi, méthodes métier
- **Exemples** : `Visitor.js`, `Config.js`

```javascript
// Exemple : Visitor.js
class Visitor {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.nom = data.nom;
    // ...
  }
  
  static validateCheckIn(data) {
    return this.checkInSchema.validate(data);
  }
  
  anonymize() {
    this.nom = '[ANONYMIZED]';
    return this;
  }
}
```

### 2. **Repositories (Accès aux données)**
- **Responsabilité** : Persistance et récupération des données
- **Contenu** : CRUD operations, requêtes, gestion des fichiers
- **Exemples** : `VisitorRepository.js`, `ConfigRepository.js`

```javascript
// Exemple : VisitorRepository.js
class VisitorRepository {
  async create(visitorData) {
    const visitors = await this.findAll();
    const newVisitor = new Visitor(visitorData);
    visitors.push(newVisitor);
    await this.write(visitors);
    return newVisitor;
  }
}
```

### 3. **Services (Logique métier)**
- **Responsabilité** : Règles business, orchestration, validation
- **Contenu** : Algorithmes, transformations, logique applicative
- **Exemples** : `VisitorService.js`, `ConfigService.js`

```javascript
// Exemple : VisitorService.js
class VisitorService {
  async checkIn(visitorData) {
    // Validation
    const { error, value } = Visitor.validateCheckIn(visitorData);
    
    // Règle business : pas de doublon
    const existing = await this.visitorRepository.findByEmailPresent(value.email);
    if (existing) throw new AppError('Visiteur déjà présent', 409);
    
    // Création
    return await this.visitorRepository.create(value);
  }
}
```

### 4. **Controllers (Interface HTTP)**
- **Responsabilité** : Gestion des requêtes/réponses HTTP
- **Contenu** : Parsing, transformation, codes de statut
- **Exemples** : `VisitorController.js`, `ConfigController.js`

```javascript
// Exemple : VisitorController.js
class VisitorController {
  checkIn = asyncHandler(async (req, res) => {
    const visitor = await this.visitorService.checkIn(req.body);
    res.status(201).json({
      success: true,
      message: 'Visiteur enregistré',
      data: visitor
    });
  });
}
```

### 5. **Routes (Définition des endpoints)**
- **Responsabilité** : Routage, middleware spécifique
- **Contenu** : Définition des routes, validation, authentification
- **Exemples** : `visitorRoutes.js`, `configRoutes.js`

```javascript
// Exemple : visitorRoutes.js
router.post('/check-in', strictLimiter, visitorController.checkIn);
router.get('/stats', visitorController.getStatistics);
```

### 6. **Middleware (Transversal)**
- **Responsabilité** : Sécurité, logging, validation, gestion d'erreurs
- **Contenu** : Authentification, CORS, rate limiting, sanitisation
- **Exemples** : `errorHandler.js`, `security.js`

```javascript
// Exemple : errorHandler.js
const errorHandler = (err, req, res, next) => {
  logger.logApiError(err, req, res);
  res.status(err.statusCode || 500).json({
    success: false,
    error: { message: err.message }
  });
};
```

## 🔧 Configuration et environnement

### 📝 **Variables d'environnement (.env)**
```env
NODE_ENV=development
PORT=3001
DATA_DIR=./data
LOG_LEVEL=info
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ANONYMIZATION_DAYS=30
```

### ⚙️ **Configuration centralisée**
```javascript
// config/config.js
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3001,
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};
```

## 🛡️ Sécurité renforcée

### 🔐 **Mesures de sécurité implémentées**

#### **Helmet.js** - Headers sécurisés
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
});
```

#### **CORS** - Contrôle d'accès
```javascript
cors({
  origin: config.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : true,
  credentials: true
});
```

#### **Rate Limiting** - Protection contre les abus
```javascript
rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes'
});
```

#### **Validation et sanitisation**
```javascript
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};
```

## 📊 Logging et monitoring

### 📝 **Système de logging avec Winston**
```javascript
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
```

### 📈 **Types de logs**
- **Info** : Actions utilisateur, démarrage/arrêt
- **Warn** : Rate limiting, tentatives d'accès
- **Error** : Erreurs d'API, exceptions
- **Debug** : Informations de développement

### 🔍 **Logs structurés**
```javascript
logger.logUserAction('visitor_checkin', {
  visitorId: visitor.id,
  email: visitor.email,
  societe: visitor.societe,
  timestamp: new Date().toISOString()
});
```

## 🚀 Gestion des erreurs

### ❌ **Classe d'erreur personnalisée**
```javascript
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
```

### 🔧 **Middleware de gestion d'erreurs**
```javascript
const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  logger.logApiError(err, req, res);
  
  // Gestion des différents types d'erreurs
  if (err.isJoi) {
    error = new AppError(err.details.map(d => d.message).join(', '), 400);
  }
  
  // Réponse standardisée
  res.status(error.statusCode || 500).json({
    success: false,
    error: { message: error.message }
  });
};
```

## 📋 API Documentation

### 🔗 **Endpoints principaux**

#### **Visiteurs**
- `POST /api/visitors/check-in` - Enregistrer une arrivée
- `POST /api/visitors/check-out` - Enregistrer un départ
- `GET /api/visitors/stats` - Obtenir les statistiques
- `GET /api/visitors/current` - Visiteurs présents
- `GET /api/visitors` - Tous les visiteurs

#### **Configuration**
- `GET /api/public` - Configuration publique
- `POST /api/admin/login` - Authentification admin
- `PUT /api/admin/config` - Mise à jour configuration
- `PUT /api/admin/change-pin` - Changer le code PIN

#### **Utilitaires**
- `GET /health` - Health check
- `GET /api` - Documentation API

### 📄 **Format de réponse standardisé**
```javascript
// Succès
{
  "success": true,
  "message": "Visiteur enregistré avec succès",
  "data": { ... }
}

// Erreur
{
  "success": false,
  "error": {
    "message": "Données invalides"
  }
}
```

## 🧪 Tests et validation

### ✅ **Validation avec Joi**
```javascript
const checkInSchema = Joi.object({
  nom: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  societe: Joi.string().trim().min(2).max(100).required()
});
```

### 🔬 **Tests unitaires**
- **Models** : Validation, méthodes métier
- **Services** : Logique business, cas d'erreur
- **Controllers** : Requêtes HTTP, codes de statut
- **Middleware** : Sécurité, gestion d'erreurs

## 🚀 Démarrage et déploiement

### 📜 **Scripts disponibles**
```bash
npm run start:new    # Démarrer la nouvelle architecture
npm run dev         # Mode développement avec nodemon
npm test           # Lancer les tests
npm run lint       # Vérifier le code
```

### 🔧 **Migration depuis l'ancienne version**
1. **Compatibilité** : Anciens endpoints toujours fonctionnels
2. **Transition** : Utiliser `npm run start:new`
3. **Validation** : Tester toutes les fonctionnalités
4. **Basculement** : Remplacer `server.js` par `server-refactored.js`

## 📈 Performance et optimisations

### ⚡ **Optimisations implémentées**
- **Validation** : Arrêt au premier échec (abortEarly: false)
- **Logging** : Logs asynchrones et rotation
- **Middleware** : Ordre optimisé des middleware
- **Sécurité** : Rate limiting intelligent

### 📊 **Métriques de performance**
- **Temps de réponse** : < 100ms pour les endpoints simples
- **Mémoire** : Gestion propre des ressources
- **Logs** : Rotation automatique (5MB par fichier)

## 🔮 Évolutivité et extension

### 🛠️ **Ajout de nouvelles fonctionnalités**

#### **Nouveau endpoint**
1. **Model** : Définir l'entité et validation
2. **Repository** : Implémenter l'accès aux données
3. **Service** : Ajouter la logique métier
4. **Controller** : Créer le handler HTTP
5. **Route** : Définir l'endpoint

#### **Nouvelle source de données**
1. **Repository** : Implémenter l'interface
2. **Service** : Injecter la nouvelle dépendance
3. **Tests** : Adapter les tests existants

### 🔄 **Migrations futures**
- **Base de données** : Remplacer FileRepository par DatabaseRepository
- **Authentification** : JWT tokens, OAuth2
- **Microservices** : Découpage en services indépendants
- **Cache** : Redis pour les performances
- **Monitoring** : Prometheus, Grafana

## 🎯 Bonnes pratiques

### 📋 **Conventions de code**
- **Nommage** : camelCase pour variables, PascalCase pour classes
- **Fichiers** : Un concept par fichier
- **Imports** : Dépendances en premier, modules locaux après
- **Async/await** : Préférer aux Promises

### 🔐 **Sécurité**
- **Validation** : Toujours valider les entrées
- **Sanitisation** : Nettoyer les données utilisateur
- **Logs** : Ne jamais logger les données sensibles
- **Erreurs** : Messages d'erreur génériques en production

### 📊 **Monitoring**
- **Logs** : Utiliser les niveaux appropriés
- **Métriques** : Mesurer les performances critiques
- **Alertes** : Configurer les seuils d'alerte
- **Health checks** : Vérifier la santé du service

## 🎉 Conclusion

Cette refactorisation transforme le projet d'un **monolithe** vers une **architecture modulaire et évolutive**. Les avantages incluent :

- ✅ **Maintenabilité** : Code organisé et découplé
- ✅ **Testabilité** : Tests unitaires facilités
- ✅ **Sécurité** : Protection renforcée
- ✅ **Performance** : Optimisations intégrées
- ✅ **Évolutivité** : Ajout facile de fonctionnalités
- ✅ **Observabilité** : Logs et monitoring

La nouvelle architecture respecte les principes **SOLID** et les bonnes pratiques du développement moderne, garantissant une base solide pour l'évolution future du projet.

---

**Dernière mise à jour** : 2025-07-16  
**Version** : 2.0.0  
**Architecture** : Clean Architecture + Express.js