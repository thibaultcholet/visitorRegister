# IA_INSTRUCTION.md – Instructions pour l’IA et les assistants automatisés

## Objectif
Garantir que toute intervention de l’IA sur ce projet respecte la conformité RGPD, la sécurité, la qualité logicielle et les bonnes pratiques de développement collaboratif.

## Règles à respecter

1. **Respect strict du RGPD**
   - Ne jamais générer, stocker ou traiter de données personnelles réelles en dehors des cas de test anonymisés.
   - Toujours privilégier la minimisation et l’anonymisation des données.
   - Proposer systématiquement la documentation des traitements de données.

2. **Qualité logicielle et TDD**
   - Toujours proposer d’écrire un test avant d’implémenter une nouvelle fonctionnalité (TDD).
   - Générer des exemples de tests pour chaque nouvelle entité, endpoint ou composant.
   - Suggérer des refactorings si le code devient complexe ou redondant.

3. **Documentation et traçabilité**
   - Mettre à jour systématiquement les fichiers de documentation concernés (`README.md`, `TASK.md`, `CHANGELOG.md`, etc.) à chaque modification majeure.
   - Documenter toute décision d’architecture, choix technique ou point RGPD dans `/docs/DOCS.md`.

4. **Sécurité**
   - Ne jamais proposer d’exemple de code contenant des failles connues (injection SQL, XSS, CSRF…).
   - Toujours rappeler l’importance des variables d’environnement pour les secrets et credentials.

5. **Collaboration**
   - Toujours expliquer les choix techniques et proposer des alternatives si pertinent.
   - Encourager la revue de code et la validation croisée des modifications.

---

**Note : Cette instruction doit être respectée par toute IA ou agent assistant intervenant sur ce projet, afin de garantir la conformité, la sécurité et la qualité du développement.**
