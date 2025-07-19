# 🤝 Guide de Contribution

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Consultez le [README.md](README.md) pour une vue d'ensemble.

Merci de votre intérêt pour contribuer au **Système de Gestion des Visiteurs** ! Ce projet a été développé avec **Context Engineering** et **Claude Code**, et nous accueillons toutes les contributions qui respectent cette approche.

## 🎯 Types de contributions acceptées

- 🐛 **Corrections de bugs** - Résolution de problèmes identifiés
- ✨ **Nouvelles fonctionnalités** - Améliorations de l'application
- 📚 **Documentation** - Amélioration des guides et README
- 🧪 **Tests** - Ajout ou amélioration des tests unitaires
- 🔒 **Sécurité** - Renforcement de la sécurité
- 🎨 **Interface** - Améliorations UX/UI
- ⚡ **Performance** - Optimisations

## 🚀 Démarrage rapide

### 1. Configuration de l'environnement

```bash
# Fork et clone du projet
git clone https://github.com/votre-username/Context-Engineering-Intro.git
cd Context-Engineering-Intro/projets/gestion-visiteurs

# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev
```

### 2. Structure du projet

Familiarisez-vous avec l'architecture MVC :

```
src/
├── controllers/    # Gestion des requêtes HTTP
├── services/      # Logique métier
├── repositories/  # Accès aux données
├── models/        # Entités et validation
├── middleware/    # Sécurité et validation
├── routes/        # Définition des endpoints
└── utils/         # Utilitaires (logger, etc.)
```

## 📋 Processus de contribution

### 1. **Issues et discussions**

- 🔍 **Vérifiez les issues existantes** avant de créer une nouvelle
- 💡 **Proposez vos idées** via les GitHub Issues
- 🗣️ **Discutez** des changements majeurs avant implémentation

### 2. **Branches et commits**

```bash
# Créer une branche feature
git checkout -b feature/nom-de-votre-feature

# Ou pour un bugfix
git checkout -b fix/description-du-bug
```

**Convention de nommage des commits :**
```
type(scope): description

# Exemples :
feat(auth): add PIN complexity validation
fix(api): resolve visitor duplicate check
docs(readme): update installation guide
test(visitor): add checkout validation tests
```

### 3. **Développement**

#### 🧪 **Tests obligatoires**
Tous les nouveaux développements doivent inclure des tests :

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

**Critères de qualité :**
- ✅ Tous les tests passent
- ✅ Coverage > 80%
- ✅ Aucun linting error

#### 🔒 **Sécurité**
- Utilisez **Joi** pour toute validation d'entrée
- Suivez les principes OWASP
- Ne jamais logger de données sensibles
- Testez contre les injections et XSS

#### 📝 **Documentation du code**
```javascript
/**
 * Description de la fonction
 * 
 * @param {Object} data - Données d'entrée
 * @param {string} data.email - Email du visiteur
 * @returns {Promise<Visitor>} Visiteur créé
 * @throws {AppError} Si validation échoue
 */
async function createVisitor(data) {
  // Implémentation...
}
```

### 4. **Pull Request**

#### 📄 **Template de PR**
```markdown
## 🎯 Description
Brief description of the changes

## ✨ Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Performance improvement
- [ ] Security enhancement

## 🧪 Tests
- [ ] Tous les tests existants passent
- [ ] Nouveaux tests ajoutés si nécessaire
- [ ] Coverage maintenu > 80%

## 📋 Checklist
- [ ] Code suit les conventions du projet
- [ ] Documentation mise à jour
- [ ] Changements testés manuellement
- [ ] Pas de données sensibles commitées
```

#### 🔍 **Critères d'acceptation**
- ✅ **Tests** : Tous les tests passent
- ✅ **Linting** : Code conforme aux standards
- ✅ **Sécurité** : Aucune vulnérabilité introduite
- ✅ **Documentation** : README et docs à jour
- ✅ **Architecture** : Respect des patterns MVC

## 🛠️ Standards de développement

### 📝 **Style de code**

```javascript
// ✅ Bon : Nommage explicite
const getCurrentVisitors = async () => {
  const visitors = await visitorRepository.findPresent();
  return visitors.filter(v => !v.hasLeft);
};

// ❌ Mauvais : Nommage peu clair
const getVis = async () => {
  const v = await repo.find();
  return v.filter(x => !x.left);
};
```

### 🏗️ **Architecture**

**Respectez la séparation des responsabilités :**

1. **Controllers** → Gestion HTTP uniquement
2. **Services** → Logique métier
3. **Repositories** → Accès aux données
4. **Models** → Validation et entités

### 🔐 **Sécurité**

```javascript
// ✅ Bon : Validation avec Joi
const { error, value } = visitorSchema.validate(req.body);
if (error) throw new AppError('Invalid data', 400);

// ❌ Mauvais : Pas de validation
const visitor = await createVisitor(req.body); // Dangereux !
```

## 🐛 Signalement de bugs

### 📋 **Template d'issue**

```markdown
## 🐛 Description du bug
Description claire et concise du problème

## 🔄 Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## ✅ Comportement attendu
Ce qui devrait se passer

## 📱 Environnement
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 91]
- Version Node.js: [ex: 18.17.0]
- Version de l'app: [ex: 2.0.0]

## 📎 Captures d'écran
Si applicable
```

### 🚨 **Bugs de sécurité**

Pour les vulnérabilités de sécurité, **NE PAS** créer d'issue publique.
Contactez-nous directement à : [email-sécurité]

## ✨ Nouvelles fonctionnalités

### 💡 **Template de feature request**

```markdown
## 🎯 Résumé de la fonctionnalité
Description courte et claire

## 🔥 Motivation
Pourquoi cette fonctionnalité est nécessaire

## 📋 Solution proposée
Comment vous envisagez l'implémentation

## 🔄 Alternatives considérées
Autres approches possibles

## 📎 Contexte additionnel
Informations supplémentaires
```

## 📚 Ressources

### 🔗 **Documentation technique**
- [Architecture du projet](ARCHITECTURE.md)
- [Guide d'installation](INSTALLATION.md)
- [Guide utilisateur](GUIDE-UTILISATEUR.md)

### 🛠️ **Outils de développement**
- **ESLint** : `npm run lint`
- **Jest** : Tests unitaires
- **Winston** : Logging
- **Joi** : Validation

### 🎓 **Context Engineering**
Ce projet utilise les principes du **Context Engineering** :
- Instructions complètes dans `CLAUDE.md`
- Architecture organisée et modulaire
- Tests automatisés et validation
- Documentation exhaustive

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

### 🏆 **Contributeurs**
- Développement initial : **Context Engineering + Claude Code**
- Maintenance : [Liste des contributeurs]

---

**Questions ?** Ouvrez une issue ou contactez les mainteneurs.

**Développé avec ❤️ par la communauté Context Engineering**