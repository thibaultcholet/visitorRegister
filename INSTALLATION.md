# 📦 Guide d'installation - Système de Gestion des Visiteurs

Ce guide vous accompagne pas à pas pour installer et configurer le système de gestion des visiteurs.

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Consultez le [README.md](README.md) pour une vue d'ensemble.

## 🔧 Prérequis techniques

### Environnement requis

- **Node.js** : Version 18.0 ou supérieure
- **npm** : Version 8.0 ou supérieure (inclus avec Node.js)
- **Navigateur web moderne** : Chrome, Firefox, Safari, Edge
- **Système d'exploitation** : Windows, macOS, Linux

### Vérification des prérequis

```bash
# Vérifier Node.js
node --version
# Doit afficher v18.x.x ou supérieur

# Vérifier npm
npm --version
# Doit afficher 8.x.x ou supérieur
```

## 🚀 Installation étape par étape

### 1. Récupération du projet

```bash
# Cloner le repository complet
git clone https://github.com/thibaultcholet/Context-Engineering-Intro.git
cd Context-Engineering-Intro/projets/gestion-visiteurs

# Ou télécharger directement le projet depuis GitHub
# https://github.com/thibaultcholet/Context-Engineering-Intro/tree/main/projets/gestion-visiteurs
```

### 2. Installation des dépendances

```bash
# Installation des packages Node.js
npm install

# Vérification de l'installation
npm list --depth=0
```

**Dépendances installées :**
- `express` : Serveur web
- `cors` : Gestion CORS
- `helmet` : Sécurité headers
- `express-rate-limit` : Rate limiting
- `winston` : Logging
- `joi` : Validation des données
- `multer` : Upload de fichiers
- `uuid` : Génération d'identifiants

### 3. Configuration initiale

#### Structure des dossiers

Le système créera automatiquement :

```
gestion-visiteurs/
├── server.js             # Serveur principal
├── src/                  # Code source organisé (MVC)
│   ├── controllers/      # Contrôleurs métier
│   ├── services/         # Services applicatifs
│   ├── repositories/     # Accès aux données
│   ├── models/           # Modèles de données
│   ├── middleware/       # Middleware sécurité
│   ├── routes/           # Définition des routes
│   └── utils/            # Utilitaires (logger)
├── data/
│   ├── config.json       # Configuration système
│   └── visitors.json     # Base de données visiteurs  
├── public/               # Assets web
├── logs/                 # Logs d'application
├── tests/                # Tests unitaires
└── node_modules/         # Dépendances
```

#### Fichiers de données

Les fichiers JSON seront créés automatiquement au premier démarrage avec les valeurs par défaut.

### 4. Premier démarrage

```bash
# Démarrage du serveur
npm start

# Ou avec Node.js directement
node server.js
```

**Sortie attendue :**
```
[INFO] Server started on port 3001
[INFO] Security middleware configured
[INFO] Configuration file created with default values
[INFO] Visitors file created
[INFO] Application ready to receive requests
```

### 5. Vérification de l'installation

1. **Ouvrir le navigateur** : http://localhost:3001
2. **Vérifier la page d'accueil** : L'horloge doit s'afficher
3. **Tester l'administration** : http://localhost:3001/admin.html
4. **Se connecter** avec le PIN par défaut : `123456`
5. **Vérifier les logs** : Les fichiers dans le dossier `logs/`

## ⚙️ Configuration post-installation

### 1. Modification du code PIN

**Via l'interface admin :**
1. Aller sur http://localhost:3001/admin.html
2. Se connecter avec `123456`
3. Aller dans **Paramètres** → **Sécurité**
4. Changer le code PIN (4-6 chiffres)

**Manuellement (avancé) :**
```bash
# Générer un hash SHA-256 pour le PIN "1234"
echo -n "1234" | sha256sum
# Résultat : 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4

# Modifier data/config.json avec ce hash
```

### 2. Personnalisation de l'interface

**Message d'accueil :**
- Aller dans **Paramètres** → **Configuration**
- Modifier le message d'accueil
- Cliquer sur "Enregistrer la configuration"

**Logo d'entreprise :**
- Aller dans **Paramètres** → **Logo de l'entreprise**
- Upload d'un fichier PNG, JPG ou SVG
- Le logo apparaîtra sur toutes les pages

### 3. Configuration avancée

**Modifier `data/config.json` :**
```json
{
  "pinCodeHash": "votre-hash-sha256",
  "requirePinChange": false,
  "welcomeMessage": "Bienvenue chez Votre Société",
  "logoPath": "/images/votre-logo.png",
  "anonymizationDays": 90
}
```

## 🔒 Configuration de sécurité

### 1. Code PIN sécurisé

**Recommandations :**
- Utiliser un PIN de 6 chiffres
- Éviter les séquences (123456, 000000)
- Changer régulièrement le PIN

### 2. Anonymisation RGPD

**Configuration par défaut :** 30 jours
**Modification :**
- Via l'admin : **Paramètres** → **Configuration**
- Manuellement : modifier `anonymizationDays` dans config.json

### 3. Sauvegarde des données

```bash
# Sauvegarde manuelle
cp data/visitors.json backup/visitors-$(date +%Y%m%d).json
cp data/config.json backup/config-$(date +%Y%m%d).json

# Script de sauvegarde automatique (cron)
0 2 * * * cp /path/to/data/*.json /path/to/backup/
```

## 🐛 Résolution de problèmes

### Erreurs courantes

#### 1. Port 3000 déjà utilisé

**Erreur :**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions :**
```bash
# Option 1: Trouver et arrêter le processus
lsof -ti:3000 | xargs kill -9

# Option 2: Changer le port
PORT=3001 npm start

# Option 3: Modifier server.js
const PORT = process.env.PORT || 3001;
```

#### 2. Modules non trouvés

**Erreur :**
```
Error: Cannot find module 'express'
```

**Solution :**
```bash
# Supprimer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### 3. Permissions de fichiers

**Erreur :**
```
Error: EACCES: permission denied, open 'data/visitors.json'
```

**Solutions :**
```bash
# Linux/macOS
chmod 755 data/
chmod 644 data/*.json

# Windows : Clic droit → Propriétés → Sécurité
```

### Logs et debugging

**Activation des logs détaillés :**
```bash
# Variable d'environnement
DEBUG=true npm start

# Ou modifier server.js
const DEBUG = true;
```

**Console du navigateur :**
- Ouvrir F12 pour voir les logs JavaScript
- Vérifier les erreurs réseau dans l'onglet Network

## 🚀 Déploiement en production

### 1. Configuration serveur

**Variables d'environnement :**
```bash
export NODE_ENV=production
export PORT=3000
export DEBUG=false
```

### 2. Serveur web (nginx)

**Configuration nginx :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /images/ {
        alias /path/to/gestion-visiteurs/data/images/;
    }
}
```

### 3. Process manager (PM2)

```bash
# Installation PM2
npm install -g pm2

# Démarrage
pm2 start server.js --name "gestion-visiteurs"

# Auto-start au boot
pm2 startup
pm2 save
```

### 4. HTTPS (Let's Encrypt)

```bash
# Installation certbot
sudo apt install certbot python3-certbot-nginx

# Génération certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring

### 1. Logs applicatifs

```bash
# Logs PM2
pm2 logs gestion-visiteurs

# Logs système
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Métriques de performance

```bash
# Monitoring PM2
pm2 monit

# Espace disque (données)
du -sh data/
```

### 3. Sauvegarde automatisée

**Script cron complet :**
```bash
#!/bin/bash
# backup-visiteurs.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/gestion-visiteurs"
DATA_DIR="/path/to/gestion-visiteurs/data"

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR/$DATE

# Sauvegarder les données
cp $DATA_DIR/*.json $BACKUP_DIR/$DATE/
cp -r $DATA_DIR/images $BACKUP_DIR/$DATE/

# Compression
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Nettoyage (garder 30 jours)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

**Crontab :**
```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /path/to/backup-visiteurs.sh
```

## ✅ Checklist de mise en production

- [ ] Code PIN modifié et sécurisé
- [ ] Logo et message personnalisés
- [ ] HTTPS configuré
- [ ] Sauvegarde automatique active
- [ ] Monitoring en place
- [ ] Tests de charge effectués
- [ ] Documentation utilisateur fournie
- [ ] Formation administrateurs effectuée

---

**Support technique :** Consulter la documentation complète dans `README.md`