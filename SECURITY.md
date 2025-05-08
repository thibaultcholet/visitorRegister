# SECURITY.md – Sécurité et gestion des vulnérabilités

## Signalement d’une faille de sécurité
Si vous découvrez une faille de sécurité, merci de la signaler immédiatement à l’administrateur du projet (voir contact dans le README). Ne la divulguez pas publiquement.

## Principes de sécurité appliqués
- Utilisation du HTTPS obligatoire
- Chiffrement des données sensibles (mot de passe, tokens, etc.)
- Limitation des accès par rôle (admin/visiteur)
- Journalisation des actions sensibles (export, suppression)
- Protection contre les attaques courantes (CSRF, XSS, injections SQL)
- Mises à jour régulières des dépendances

## RGPD et sécurité
- Données minimisées et anonymisées autant que possible
- Suppression/anonymisation automatique après la période légale
- Accès restreint aux données personnelles

## Bonnes pratiques pour les contributeurs
- Ne jamais commit de secrets, mots de passe ou données réelles
- Utiliser les variables d’environnement pour toute information sensible
- Vérifier les permissions avant toute modification de données

---

Complétez ce fichier à chaque évolution majeure de la sécurité ou en cas de découverte de vulnérabilité.
