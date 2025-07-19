const Visitor = require('../src/models/Visitor');

describe('🏢 Tests - Champ Société Optionnel', () => {
  describe('Validation du schéma avec société optionnelle', () => {
    test('Accepte une validation avec société remplie', () => {
      const validData = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const { error } = Visitor.validateCheckIn(validData);
      expect(error).toBeUndefined();
    });

    test('Accepte une validation avec société vide', () => {
      const validDataWithoutCompany = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: '',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const { error } = Visitor.validateCheckIn(validDataWithoutCompany);
      expect(error).toBeUndefined();
    });

    test('Accepte une validation sans champ société', () => {
      const validDataWithoutCompanyField = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const { error } = Visitor.validateCheckIn(validDataWithoutCompanyField);
      expect(error).toBeUndefined();
    });

    test('Rejette une société trop courte', () => {
      const invalidData = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'A',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const { error } = Visitor.validateCheckIn(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('La société doit contenir au moins 2 caractères');
    });

    test('Rejette une société trop longue', () => {
      const invalidData = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'A'.repeat(101),
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const { error } = Visitor.validateCheckIn(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('La société ne peut pas dépasser 100 caractères');
    });
  });

  describe('Construction de l\'objet Visitor', () => {
    test('Crée un visiteur avec société', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      expect(visitor.societe).toBe('Tech Solutions SARL');
    });

    test('Crée un visiteur avec société vide', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: '',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      expect(visitor.societe).toBeNull();
    });

    test('Crée un visiteur sans champ société', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      expect(visitor.societe).toBeNull();
    });

    test('Crée un visiteur avec société null', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: null,
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      expect(visitor.societe).toBeNull();
    });
  });

  describe('Serialization JSON', () => {
    test('toJSON inclut société null', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      const json = visitor.toJSON();
      
      expect(json).toHaveProperty('societe');
      expect(json.societe).toBeNull();
    });

    test('toJSON inclut société définie', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      const json = visitor.toJSON();
      
      expect(json).toHaveProperty('societe');
      expect(json.societe).toBe('Tech Solutions SARL');
    });
  });

  describe('Anonymisation', () => {
    test('Anonymise la société même si elle est null', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      visitor.anonymize();
      
      expect(visitor.societe).toBe('[ANONYMIZED]');
    });

    test('Anonymise la société définie', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      const visitor = new Visitor(data);
      visitor.anonymize();
      
      expect(visitor.societe).toBe('[ANONYMIZED]');
    });
  });

  describe('Tests d\'intégration - Cas d\'usage réels', () => {
    test('Workflow complet avec société', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      // Validation
      const { error, value } = Visitor.validateCheckIn(data);
      expect(error).toBeUndefined();

      // Création
      const visitor = new Visitor(value);
      expect(visitor.societe).toBe('Tech Solutions SARL');

      // Checkout
      visitor.checkOut();
      expect(visitor.statut).toBe('parti');
      expect(visitor.heureSortie).toBeTruthy();

      // Sérialisation
      const json = visitor.toJSON();
      expect(json.societe).toBe('Tech Solutions SARL');
    });

    test('Workflow complet sans société', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      // Validation
      const { error, value } = Visitor.validateCheckIn(data);
      expect(error).toBeUndefined();

      // Création
      const visitor = new Visitor(value);
      expect(visitor.societe).toBeNull();

      // Checkout
      visitor.checkOut();
      expect(visitor.statut).toBe('parti');
      expect(visitor.heureSortie).toBeTruthy();

      // Sérialisation
      const json = visitor.toJSON();
      expect(json.societe).toBeNull();
    });

    test('Workflow complet avec société vide', () => {
      const data = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: '',
        email: 'jean.martin@test.com',
        personneVisitee: 'Marie Dubois'
      };

      // Validation
      const { error, value } = Visitor.validateCheckIn(data);
      expect(error).toBeUndefined();

      // Création
      const visitor = new Visitor(value);
      expect(visitor.societe).toBeNull();

      // Checkout
      visitor.checkOut();
      expect(visitor.statut).toBe('parti');

      // Sérialisation
      const json = visitor.toJSON();
      expect(json.societe).toBeNull();
    });
  });
});