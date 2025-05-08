# TASK.md – Cahier des charges détaillé et suivi

## Objectif
Créer une application web RGPD pour l’enregistrement et la gestion des visiteurs sur tablette, avec Symfony (backend/API) et Angular (frontend).

---

## 1. Initialisation du projet et de l’environnement
- [ ] Cloner le dépôt git et installer les prérequis (PHP, Composer, Node.js, npm, PostgreSQL, Angular CLI)
- [ ] Vérifier la structure des dossiers (`backend/`, `frontend/`, `tests/`)
- [ ] Configurer les fichiers `.env` (backend) et `environment.ts` (frontend)
- [ ] Initialiser le versionnement git et vérifier `.gitignore`

---

## 2. Mise en place du backend Symfony
- [ ] Initialiser un projet Symfony dans `backend/`
- [ ] Installer les dépendances nécessaires (Doctrine, migrations, sécurité, API Platform)
- [ ] Configurer la connexion PostgreSQL dans `.env`
- [ ] Générer les clés d’application (APP_SECRET)
- [ ] Préparer la structure des dossiers (`src/Controller`, `src/Entity`, `src/Repository`, etc.)

---

## 3. Mise en place du frontend Angular
- [ ] Initialiser un projet Angular dans `frontend/`
- [ ] Configurer le proxy pour l’API backend (si besoin)
- [ ] Préparer la structure des dossiers (`src/app/components`, `src/app/services`, `src/app/pages`)
- [ ] Mettre en place le design responsive (Angular Material ou Bootstrap)
- [ ] Créer les premiers composants (formulaire visiteur, page d’accueil, etc.)

---

## 4. Modélisation de la base de données visiteurs
- [ ] Définir le schéma de la table `Visitor` (nom, prénom, société, date/heure d’arrivée, date/heure de départ, consentement, etc.)
- [ ] Générer l’entité Doctrine correspondante
- [ ] Créer et exécuter la migration
- [ ] Prévoir les index nécessaires (recherche, tri)

---

## 5. Création des endpoints API
- [ ] Créer les routes pour :
    - [ ] Enregistrement d’un visiteur (POST /api/visitors)
    - [ ] Déclaration du départ (PATCH ou POST /api/visitors/{id}/depart)
    - [ ] Consultation des visiteurs (GET /api/visitors)
- [ ] Valider et sécuriser les données reçues
- [ ] Retourner des réponses claires (statut, messages d’erreur)

---

## 6. Gestion du consentement RGPD et affichage des droits
- [ ] Ajouter une case à cocher pour le consentement sur le formulaire
- [ ] Afficher une notice d’information RGPD claire (finalité, durée, droits)
- [ ] Stocker la preuve du consentement
- [ ] Prévoir un endpoint pour demander la suppression des données (droit à l’oubli)

---

## 7. Interface administrateur
- [ ] Créer l’authentification administrateur (backend + frontend)
- [ ] Créer une page de consultation des visiteurs (filtrage, tri)
- [ ] Ajouter l’export (CSV, Excel)
- [ ] Ajouter la suppression manuelle d’un enregistrement
- [ ] Journaliser les actions sensibles (export, suppression)

---

## 8. Sécurisation et gestion des rôles
- [ ] Mettre en place l’authentification (JWT ou session)
- [ ] Restreindre l’accès aux endpoints sensibles (admin)
- [ ] Protéger l’API contre les attaques courantes (CSRF, XSS, injections)
- [ ] Gérer les permissions côté frontend et backend

---

## 9. Mise en place des tests
- [ ] Écrire des tests unitaires backend (PHPUnit)
- [ ] Écrire des tests d’intégration backend (API Platform/Test)
- [ ] Écrire des tests frontend (Jasmine/Karma, e2e)
- [ ] Tester les cas d’erreur et de sécurité

---

## 10. Documentation technique et utilisateur
- [ ] Documenter l’API (OpenAPI/Swagger, Postman)
- [ ] Documenter l’installation et la configuration du projet
- [ ] Rédiger un guide utilisateur pour l’interface tablette et l’admin

---

## 11. Préparation à la CI/CD et au déploiement
- [ ] Préparer des scripts de build et de migration
- [ ] Ajouter des hooks git (lint, tests)
- [ ] Configurer un pipeline CI/CD (GitHub Actions, GitLab CI, etc.)
- [ ] Préparer la configuration pour un hébergement sécurisé (HTTPS, backups)

---

## 12. Audit RGPD et vérifications finales
- [ ] Vérifier la minimisation des données collectées
- [ ] Vérifier la durée de conservation et les procédures d’anonymisation/suppression
- [ ] Tester le droit d’accès, de rectification, d’opposition et d’oubli
- [ ] Réaliser un audit de sécurité
- [ ] Mettre à jour la documentation RGPD si besoin

---

**Ce fichier doit être mis à jour au fil de l’avancement du projet.**
