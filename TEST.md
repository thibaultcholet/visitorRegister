# TEST.md – Stratégie et bonnes pratiques de tests

## Objectifs des tests
Garantir la fiabilité, la sécurité et la conformité RGPD de l’application.

## Types de tests
- **Tests unitaires** : Vérifient le comportement des fonctions/méthodes isolées (PHPUnit pour Symfony, Jasmine/Karma pour Angular).
- **Tests d’intégration** : Vérifient l’interaction entre plusieurs composants (API Platform Test, HTTP Client, etc.).
- **Tests end-to-end (e2e)** : Simulent un parcours utilisateur complet (Cypress, Protractor, etc.).
- **Tests de sécurité** : Vérifient la résistance aux attaques courantes (XSS, CSRF, injections).

## Outils recommandés
- **Backend** : PHPUnit, API Platform Test, Doctrine Fixtures
- **Frontend** : Jasmine, Karma, Angular Testing Library, Cypress

## Bonnes pratiques
- Écrire un test pour chaque fonctionnalité majeure ou bug corrigé.
- Nommer clairement les tests et décrire leur objectif.
- Automatiser les tests dans la CI/CD.
- Prévoir des jeux de données anonymisés pour les tests RGPD.

## Lancer les tests
- Backend :
  ```bash
  cd backend
  php bin/phpunit
  ```
- Frontend :
  ```bash
  cd frontend
  npm run test
  ```

---

## Test Driven Development (TDD)

### Principe
Le TDD consiste à écrire d’abord les tests qui échouent, puis à développer le code pour les faire réussir, et enfin à refactoriser le code. Cycle :
1. **Red** : Écrire un test qui échoue (fonctionnalité non encore implémentée)
2. **Green** : Écrire le minimum de code pour que le test passe
3. **Refactor** : Améliorer le code tout en gardant le test au vert

### Workflow TDD pour ce projet
- Toujours commencer par écrire un test pour chaque nouvelle fonctionnalité ou correction de bug
- Implémenter le code uniquement pour faire passer le test
- Refactoriser une fois le test réussi
- Répéter pour chaque fonctionnalité ou évolution

### Backend Symfony (PHP)
- Outil : PHPUnit
- Dossier des tests : `backend/tests/`
- Exemple :
  ```php
  // backend/tests/Entity/VisitorTest.php
  use PHPUnit\Framework\TestCase;
  use App\Entity\Visitor;

  class VisitorTest extends TestCase
  {
      public function testCreateVisitor()
      {
          $visitor = new Visitor('Jean', 'Dupont', 'ACME');
          $this->assertEquals('Jean', $visitor->getFirstName());
      }
  }
  ```

### Frontend Angular (TypeScript)
- Outils : Jasmine & Karma
- Les fichiers de test sont générés automatiquement avec chaque composant/service (`*.spec.ts`)
- Exemple :
  ```typescript
  // frontend/src/app/visitor-form/visitor-form.component.spec.ts
  it('should create the form', () => {
    expect(component.form).toBeTruthy();
  });
  ```

### Conseils pratiques
- Intégrer les tests dans la CI/CD (GitHub Actions, GitLab CI, etc.)
- Utiliser des mocks et des fixtures pour isoler les tests
- Automatiser l’exécution des tests avant chaque merge ou déploiement

---

Complétez ce fichier au fil de l’avancement du projet et des besoins spécifiques.
