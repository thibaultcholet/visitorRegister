# 👥 Guide Utilisateur - Système de Gestion des Visiteurs

Ce guide explique comment utiliser le système de gestion des visiteurs, tant pour les visiteurs que pour les administrateurs.

> **📚 Documentation :** Ce fichier fait partie de la [documentation complète du projet](README.md#-documentation-complète). Pour l'installation, consultez [INSTALLATION.md](INSTALLATION.md).

## 🚪 Pour les Visiteurs

### Page d'accueil

Lorsque vous accédez au système, vous voyez :

**🕐 Horloge en temps réel**
- Affichage de l'heure et de la date actuelles
- Mise à jour automatique chaque seconde

**🏢 Message de bienvenue**
- Message personnalisé de l'entreprise
- Logo de l'entreprise (si configuré)

**⚡ Deux boutons principaux**
- **"Enregistrer mon arrivée"** : Pour signaler votre arrivée
- **"Signaler mon départ"** : Pour signaler votre départ

### ✅ Enregistrement d'arrivée

#### 1. Clic sur "Enregistrer mon arrivée"

Un formulaire s'affiche avec les champs suivants :

**📝 Informations obligatoires :**
- **Nom** : Votre nom de famille
- **Prénom** : Votre prénom
- **Société** : Nom de votre entreprise
- **Adresse e-mail** : Votre email professionnel
- **Personne visitée** : Nom de votre contact dans l'entreprise

**📞 Information optionnelle :**
- **Téléphone** : Votre numéro de téléphone

#### 2. Remplissage du formulaire

**✨ Fonctionnalités avancées :**
- **Validation en temps réel** : Les champs changent de couleur lors de la saisie
- **Icônes explicites** : Chaque champ a une icône pour clarifier son usage
- **Messages d'erreur** : Affichage immédiat si une donnée est incorrecte

**📋 Règles de validation :**
- Tous les champs obligatoires doivent être remplis
- L'email doit avoir un format valide (exemple@domaine.com)
- Le téléphone est optionnel mais doit être au bon format si renseigné

#### 3. Validation

**Clic sur "Valider" :**
- Vérification automatique des données
- Si erreur : message d'alerte et champs à corriger surlignés
- Si succès : popup de confirmation avec confettis ! 🎉

#### 4. Confirmation de succès

**🎊 Popup de célébration :**
- Message de remerciement personnalisé
- Animation de confettis colorés en arrière-plan
- Icône de validation verte
- Bouton "Parfait !" avec compte à rebours

**⏱️ Fermeture automatique :**
- Compteur de 5 secondes affiché sur le bouton
- Format : "Parfait ! (5)" → "Parfait ! (4)" → etc.
- Fermeture automatique à 0 ou clic manuel possible
- Retour automatique à la page d'accueil

### 🚶 Signalement de départ

#### 1. Clic sur "Signaler mon départ"

Formulaire simplifié avec un seul champ :

**📧 Adresse e-mail :**
- Saisissez l'email utilisé lors de l'arrivée
- Le système trouve automatiquement votre visite
- Validation du format email

#### 2. Validation

**Clic sur "Valider" :**
- Recherche automatique dans la base de données
- Vérification que vous êtes bien enregistré comme présent
- Enregistrement de l'heure de départ

#### 3. Confirmation

**Message de confirmation :**
- "Votre départ a été enregistré avec succès"
- Retour automatique à l'accueil après 3 secondes

### 🔙 Navigation

**Bouton "Retour" :**
- Présent sur tous les formulaires
- Retour immédiat à la page d'accueil
- **Sécurité** : Les données saisies sont automatiquement effacées

---

## 👨‍💼 Pour les Administrateurs

### 🔐 Connexion administrative

#### Accès à l'administration

**URL :** http://votre-domaine.com/admin.html
**Lien direct :** Clic sur "Administration" en bas de la page d'accueil

#### Authentification

**🔢 Code PIN :**
- Saisie d'un code PIN de 4 à 6 chiffres
- Code par défaut : `123456` (à changer immédiatement)
- 3 tentatives avant blocage temporaire

**✅ Connexion réussie :**
- Accès au tableau de bord administrateur
- Interface organisée en onglets

### 📊 Dashboard Principal

L'interface administrative est organisée en deux sections principales :

#### 📈 Section "Dashboard"

**Statistiques en temps réel :**
- **Visiteurs sur site** : Nombre actuel de personnes présentes
- **Visites aujourd'hui** : Total des arrivées du jour
- **Visites (7 jours)** : Total de la semaine écoulée
- **Visites (30 jours)** : Total du mois écoulé

**👥 Visiteurs actuellement sur site :**
- Liste en temps réel des personnes présentes
- Informations : Nom, Société, Heure d'arrivée
- **Bouton "Départ"** : Enregistrement manuel d'un départ

**📋 Historique des visites :**
- Tableau complet de toutes les visites
- Colonnes : Nom, Société, Personne visitée, Arrivée, Départ, Durée
- Données automatiquement anonymisées après 30 jours

#### ⚙️ Section "Paramètres"

**🔧 Configuration :**
- **Message d'accueil** : Texte affiché sur la page d'accueil
- **Anonymisation** : Délai avant anonymisation des données (jours)
- Bouton "Lancer l'anonymisation" pour forcer le processus

**🔒 Sécurité :**
- **Changement de code PIN** : Nouveau PIN de 4-6 chiffres
- Confirmation obligatoire du nouveau PIN
- Validation en temps réel

**🖼️ Logo de l'entreprise :**
- Upload de fichier (PNG, JPG, SVG, GIF)
- Affichage automatique sur toutes les pages
- Redimensionnement automatique

**🧪 Debug & Tests :**
- **Afficher/Masquer bouton de test** : Contrôle du bouton de pré-remplissage
- **Vider la liste des visiteurs** : Nettoyage complet (avec confirmation)
- **Générer un visiteur test** : Création automatique de données fictives
- Indicateur de statut en temps réel

### 🛠️ Fonctionnalités avancées

#### 🔄 Gestion des visiteurs

**Enregistrement manuel d'un départ :**
1. Dans "Dashboard" → "Visiteurs actuellement sur site"
2. Clic sur "Départ" à côté du visiteur
3. Confirmation automatique et mise à jour des statistiques

**Forcer l'anonymisation :**
1. Dans "Paramètres" → "Configuration"
2. Clic sur "Lancer l'anonymisation"
3. Toutes les données anciennes sont anonymisées immédiatement

#### 🧪 Outils de développement

**Activation du mode test :**
1. Dans "Paramètres" → "Debug & Tests"
2. Clic sur "Afficher bouton de test"
3. Un bouton de pré-remplissage apparaît sur le formulaire d'arrivée

**Génération de données test :**
1. Clic sur "Générer un visiteur test"
2. Un visiteur fictif est créé automatiquement
3. Mise à jour immédiate du dashboard

**Nettoyage de la base :**
1. Clic sur "Vider la liste des visiteurs"
2. Confirmation de sécurité
3. Suppression de tous les visiteurs (irréversible)

### 📱 Interface responsive

**Adaptation automatique :**
- **Desktop** : Interface complète avec tous les éléments
- **Tablette** : Adaptation des colonnes et boutons
- **Mobile** : Interface simplifiée et optimisée

### 🔒 Sécurité et confidentialité

#### Protection des données

**Anonymisation automatique :**
- Délai configurable (30 jours par défaut)
- Remplacement par "[ANONYMIZED]" des champs sensibles
- Conservation des statistiques anonymes

**Réinitialisation des formulaires :**
- Nettoyage automatique lors du retour à l'accueil
- Aucune donnée personnelle conservée en local
- Conformité RGPD

#### Bonnes pratiques

**Code PIN :**
- Changer le code par défaut immédiatement
- Utiliser 6 chiffres pour plus de sécurité
- Éviter les séquences évidentes (123456, 000000)
- Changer régulièrement le code

**Gestion des accès :**
- Fermer la session admin après utilisation
- Ne pas partager le code PIN
- Vérifier régulièrement les logs d'accès

## 🆘 Résolution de problèmes

### Problèmes courants visiteurs

**Le formulaire ne se valide pas :**
- Vérifier que tous les champs obligatoires sont remplis
- Vérifier le format de l'email (doit contenir @ et un domaine)
- Vérifier que le formulaire n'affiche pas de messages d'erreur

**La popup de confirmation ne s'affiche pas :**
- Vérifier que JavaScript est activé dans le navigateur
- Actualiser la page (F5) et réessayer
- Vérifier la console du navigateur (F12) pour les erreurs

**Le départ ne s'enregistre pas :**
- Vérifier que l'email saisi correspond exactement à celui de l'arrivée
- S'assurer d'être bien enregistré comme présent
- Contacter l'administrateur si le problème persiste

### Problèmes courants administrateurs

**Impossible de se connecter :**
- Vérifier le code PIN (4-6 chiffres uniquement)
- Attendre 5 minutes en cas de blocage temporaire
- Contacter le support technique si nécessaire

**Les statistiques ne se mettent pas à jour :**
- Actualiser la page (F5)
- Vérifier la connexion Internet
- Redémarrer le serveur si nécessaire

**Le logo ne s'affiche pas :**
- Vérifier le format du fichier (PNG, JPG, SVG, GIF)
- Vérifier la taille du fichier (max 5 MB)
- Actualiser la page après upload

## 📞 Support

**En cas de problème technique :**
1. Vérifier ce guide utilisateur
2. Consulter la documentation technique (README.md)
3. Vérifier les logs système
4. Contacter l'administrateur système

**Formation supplémentaire :**
- Formation administrateur disponible sur demande
- Guide d'installation pour l'équipe technique
- Documentation développeur pour les personnalisations

---

**Version du guide :** 1.0 | **Dernière mise à jour :** Date actuelle