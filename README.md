# Application d’Enregistrement des Visiteurs – RGPD

## Présentation

Cette application web permet aux visiteurs d’une société de s’enregistrer à leur arrivée et de déclarer leur départ, en conformité avec le Règlement Général sur la Protection des Données (RGPD). Conçue pour être utilisée sur tablette à l’accueil, elle vise à simplifier la gestion des flux de visiteurs tout en respectant la vie privée.

## Fonctionnalités principales

- **Enregistrement des visiteurs** : formulaire d’arrivée simple et rapide
- **Déclaration de départ** : possibilité pour le visiteur de signaler son départ
- **Consentement RGPD** : collecte du consentement explicite et information sur les droits
- **Gestion sécurisée des données** : stockage chiffré, accès restreint, suppression sur demande
- **Interface administrateur** : consultation, export et suppression des enregistrements (accès protégé)
- **Responsive Design** : expérience utilisateur optimale sur tablette
- **Automatisation assistée par IA** (optionnel) : anonymisation automatique, détection d’anomalies, génération de rapports anonymisés

## Architecture technique

- **Frontend** : Angular (TypeScript) – application web responsive optimisée pour tablette
- **Backend** : Symfony (PHP) – API REST sécurisée, gestion RGPD avancée
- **Base de données** : PostgreSQL (recommandé), chiffrée côté serveur
- **Sécurité** : HTTPS, gestion fine des rôles, journalisation des accès, conformité RGPD

## Conformité RGPD

- **Minimisation des données** : collecte uniquement des informations nécessaires
- **Information et consentement** : affichage clair de la politique de confidentialité et recueil du consentement
- **Droit à l’oubli** : procédure simple pour demander la suppression des données
- **Durée de conservation limitée** : suppression ou anonymisation automatique après la période définie
- **Accès restreint** : seules les personnes autorisées accèdent aux données

## Installation et déploiement

### 1. Cloner le dépôt
```bash
git clone https://github.com/thibaultcholet/visitorRegister.git
```

### 2. Installer et configurer le backend (Symfony)
```bash
cd visitorRegister/backend
composer install
cp .env.example .env # Adapter la configuration (DB, clés secrètes)
```

#### Installer l’extension PostgreSQL pour Symfony/Doctrine
```bash
composer require doctrine/doctrine-bundle doctrine/orm doctrine/doctrine-migrations-bundle doctrine/dbal
```

#### Configurer PostgreSQL dans le fichier `.env`
Exemple de ligne à adapter dans `.env` :
```
DATABASE_URL="postgresql://<user>:<password>@127.0.0.1:5432/<dbname>?serverVersion=15&charset=utf8"
```

#### Créer la base et appliquer les migrations
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 3. Lancer le backend
```bash
symfony server:start # ou php -S localhost:8000 -t public
```

### 4. Installer et configurer le frontend (Angular)
```bash
cd ../frontend
npm install
```

### 5. Lancer le frontend
```bash
ng serve --open
```

### 6. Accéder à l’application
- Frontend : http://localhost:4200
- Backend API : http://localhost:8000/api

### 7. Variables d’environnement
- Adapter les fichiers `.env` (backend) et `environment.ts` (frontend) selon vos besoins (URLs, clés, etc.)
- Pour PostgreSQL, vérifier que la variable `DATABASE_URL` pointe bien vers votre instance PostgreSQL locale ou distante.

**Exemple PostgreSQL dans .env :**
```
DATABASE_URL="postgresql://postgres:motdepasse@127.0.0.1:5432/visitor_register?serverVersion=15&charset=utf8"
```

## Structure du projet

```
/visitorRegister
│
├── README.md           Présentation du projet
├── TASK.md             Cahier des charges et suivi des tâches
├── backend/            Code source Symfony (API, entités, sécurité)
│   ├── config/
│   ├── src/
│   ├── public/
│   └── ...
├── frontend/           Code source Angular (UI, services)
│   ├── src/
│   ├── e2e/
│   └── ...
└── tests/              Tests unitaires et d’intégration
```

- **backend/** : Application Symfony (API REST, sécurité, gestion RGPD)
- **frontend/** : Application Angular (interface utilisateur responsive)
- **tests/** : Scripts de tests pour les deux parties

## Contribution

Les contributions sont les bienvenues ! Merci de proposer vos suggestions via des issues ou des pull requests.

## Contact

Pour toute question ou suggestion : thibault.cholet [at] icloud.com

---

**Ce projet met la protection de la vie privée au cœur de sa conception.**
