# 🔄 Procédure de Redémarrage du Serveur

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Consultez le [README.md](README.md) pour une vue d'ensemble.

## 📋 Procédure Standard de Redémarrage

### 1. Arrêt Propre du Serveur

```bash
# Arrêter le processus Node.js proprement
pkill -f "node server.js"

# Attendre 2 secondes pour l'arrêt complet
sleep 2

# Vérifier que le processus est arrêté
ps aux | grep "node server.js" | grep -v grep
```

### 2. Libération du Port (si nécessaire)

```bash
# Forcer la libération du port 3001 si nécessaire
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
```

### 3. Redémarrage en Arrière-Plan

```bash
# Démarrer le serveur en arrière-plan avec logs
nohup npm start > server.log 2>&1 &
```

### 4. Vérification du Démarrage

```bash
# Attendre que le serveur démarre
sleep 3

# Vérifier que le serveur répond
curl -s http://localhost:3001/health
```

## 🚨 Problèmes Courants et Solutions

### Port déjà utilisé
```bash
# Trouver et tuer le processus qui utilise le port
lsof -ti:3001 | xargs kill -9

# Puis redémarrer normalement
nohup npm start > server.log 2>&1 &
```

### Processus zombie
```bash
# Tuer tous les processus Node.js liés au projet
pkill -f "node server.js"
pkill -f "npm start"

# Nettoyer les ports
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Redémarrer
nohup npm start > server.log 2>&1 &
```

### Logs non visibles
```bash
# Voir les logs en temps réel
tail -f server.log

# Voir les dernières lignes
tail -20 server.log
```

## ⚡ Script de Redémarrage Automatisé

Créer un script `restart.sh` :

```bash
#!/bin/bash
# restart.sh - Script de redémarrage automatisé

echo "🔄 Arrêt du serveur..."
pkill -f "node server.js"
sleep 2

echo "🧹 Nettoyage du port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "🚀 Démarrage du serveur..."
nohup npm start > server.log 2>&1 &

echo "⏳ Attente du démarrage..."
sleep 3

echo "✅ Vérification de l'état..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Serveur démarré avec succès sur http://localhost:3001"
else
    echo "❌ Erreur lors du démarrage"
    echo "Logs:"
    tail -10 server.log
fi
```

Rendre le script exécutable :
```bash
chmod +x restart.sh
```

Utilisation :
```bash
./restart.sh
```

## 🔍 Vérifications Post-Redémarrage

### 1. Health Check
```bash
curl -s http://localhost:3001/health | jq .
```

### 2. Test des Statistiques
```bash
curl -s http://localhost:3001/api/admin/stats | jq .
```

### 3. Vérification des Logs
```bash
tail -20 server.log
```

## 📝 Bonnes Pratiques

1. **Toujours** attendre 2-3 secondes entre l'arrêt et le redémarrage
2. **Vérifier** que le port est libéré avant de redémarrer
3. **Utiliser** `nohup` pour éviter que le processus s'arrête à la fermeture du terminal
4. **Rediriger** les logs vers un fichier pour le debugging
5. **Tester** la réponse du serveur après redémarrage

## 🚫 À Éviter

- ❌ Ne jamais utiliser `npm start &` sans `nohup`
- ❌ Ne pas redémarrer immédiatement après l'arrêt
- ❌ Ne pas vérifier l'état du serveur après redémarrage
- ❌ Ne pas nettoyer les processus zombie

## 🔧 Variables d'Environnement

Le serveur utilise le fichier `.env` :
```bash
PORT=3001
NODE_ENV=development
```

Après modification du `.env`, **toujours** redémarrer le serveur pour prendre en compte les changements.

---

**Dernière mise à jour** : 2025-07-17