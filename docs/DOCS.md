# DOCS.md – Documentation technique

## Table des matières
1. Architecture générale du projet
2. Schéma de la base de données
3. Convention des endpoints API
4. Exemples de requêtes et de réponses
5. Design et accessibilité
6. Extensions et outils recommandés
7. Foire aux questions (FAQ)

---

## 1. Architecture générale
- Frontend Angular (UI, services, composants)
- Backend Symfony (API REST, sécurité, RGPD)
- Base de données PostgreSQL

## 2. Schéma de la base de données
*(À compléter avec un diagramme ou une description détaillée lors de la modélisation)*

## 3. Convention des endpoints API
- `/api/visitors` (GET, POST)
- `/api/visitors/{id}/depart` (PATCH/POST)
- `/api/visitors/{id}` (DELETE, GET)

## 4. Exemples de requêtes
```http
POST /api/visitors
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "company": "ACME",
  "consent": true
}
```

## 5. Design et accessibilité
- Utilisation d’Angular Material pour l’UI
- Respect des contrastes, navigation clavier, textes alternatifs

## 6. Extensions et outils recommandés
- VSCode + Prettier, PHP-CS-Fixer, Angular Language Service
- Postman pour tester l’API

## 7. FAQ
- *(À compléter selon les retours utilisateurs ou contributeurs)*

---

Complétez ce fichier au fil de l’avancement du projet et des besoins techniques.
