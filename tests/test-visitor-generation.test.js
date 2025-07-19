const request = require('supertest');
const path = require('path');

// Configuration des variables d'environnement pour les tests AVANT l'import du serveur
process.env.NODE_ENV = 'test';
const testDataDir = path.join(__dirname, 'test-data-generation');
process.env.DATA_DIR = testDataDir;
process.env.VISITORS_FILE = path.join(testDataDir, 'visitors.json');
process.env.CONFIG_FILE = path.join(testDataDir, 'config.json');

const app = require('../server');
const VisitorRepository = require('../src/repositories/VisitorRepository');
const fs = require('fs').promises;

describe('🧪 Tests - Génération Visiteur Test', () => {
  let visitorRepo;

  beforeAll(async () => {
    // Créer le dossier de test
    await fs.mkdir(testDataDir, { recursive: true });
  });

  afterAll(async () => {
    // Nettoyer les fichiers de test
    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch (error) {
      console.log('Nettoyage des fichiers de test échoué:', error);
    }
  });

  beforeEach(async () => {
    visitorRepo = new VisitorRepository();
    // Nettoyer les visiteurs existants
    await visitorRepo.deleteAll();
  });

  afterEach(async () => {
    // Nettoyer après chaque test
    await visitorRepo.deleteAll();
  });

  describe('API endpoint /api/check-in avec données test', () => {
    test('Créer un visiteur avec société', async () => {
      const testVisitor = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: 'jean.martin.test1234@techsolutions.fr',
        telephone: '06 12 34 56 78',
        personneVisitee: 'Marie Dubois'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(testVisitor)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe('Martin');
      expect(response.body.data.societe).toBe('Tech Solutions SARL');
      expect(response.body.data.email).toBe('jean.martin.test1234@techsolutions.fr');
    });

    test('Créer un visiteur sans société', async () => {
      const testVisitorNoCompany = {
        nom: 'Freelance',
        prenom: 'Sophie',
        societe: '',
        email: 'sophie.freelance.test1234@gmail.com',
        telephone: '06 99 88 77 66',
        personneVisitee: 'Marc Directeur'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(testVisitorNoCompany)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe('Freelance');
      expect(response.body.data.societe).toBeNull();
      expect(response.body.data.email).toBe('sophie.freelance.test1234@gmail.com');
    });

    test('Créer un visiteur avec société manquante', async () => {
      const testVisitorMissingCompany = {
        nom: 'Indépendant',
        prenom: 'Paul',
        email: 'paul.independant.test1234@outlook.com',
        telephone: '07 55 44 33 22',
        personneVisitee: 'Julie Manager'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(testVisitorMissingCompany)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe('Indépendant');
      expect(response.body.data.societe).toBeNull();
      expect(response.body.data.email).toBe('paul.independant.test1234@outlook.com');
    });

    test('Rejeter un visiteur avec email invalide', async () => {
      const invalidTestVisitor = {
        nom: 'Test',
        prenom: 'Invalid',
        societe: 'Test Company',
        email: 'email-invalide',
        telephone: '06 12 34 56 78',
        personneVisitee: 'Test Manager'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(invalidTestVisitor)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('adresse email');
    });

    test('Rejeter un visiteur avec nom manquant', async () => {
      const invalidTestVisitor = {
        prenom: 'Test',
        societe: 'Test Company',
        email: 'test@example.com',
        telephone: '06 12 34 56 78',
        personneVisitee: 'Test Manager'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(invalidTestVisitor)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('nom');
    });
  });

  describe('Génération de visiteurs en masse', () => {
    test('Générer des visiteurs de test avec /api/admin/generate-test-visitors', async () => {
      const requestData = {
        count: 3,
        daysBack: 7
      };

      const response = await request(app)
        .post('/api/admin/generate-test-visitors')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.generated).toBeLessThanOrEqual(3);
      expect(response.body.data.requested).toBe(3);
      expect(response.body.data.daysBack).toBe(7);

      // Vérifier que les visiteurs ont été créés
      const visitors = await visitorRepo.findAll();
      expect(visitors.length).toBe(response.body.data.generated);
    });

    test('Générer des visiteurs avec paramètres par défaut', async () => {
      const response = await request(app)
        .post('/api/admin/generate-test-visitors')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.generated).toBeGreaterThan(0);
      expect(response.body.data.requested).toBe(10); // valeur par défaut
      expect(response.body.data.daysBack).toBe(90); // valeur par défaut

      // Vérifier que les visiteurs ont été créés
      const visitors = await visitorRepo.findAll();
      expect(visitors.length).toBe(response.body.data.generated);
    });

    test('Valider les limites de génération', async () => {
      const requestData = {
        count: 1,
        daysBack: 1
      };

      const response = await request(app)
        .post('/api/admin/generate-test-visitors')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.generated).toBe(1);
      expect(response.body.data.daysBack).toBe(1);
    });
  });

  describe('Fonctionnalité de génération unique', () => {
    test('Simulation de génération unique avec email unique', async () => {
      // Simuler la génération d'un visiteur unique comme le fait le bouton frontend
      const baseEmail = 'jean.martin@techsolutions.fr';
      const uniqueEmail = baseEmail.replace('@', `.test${Date.now()}@`);

      const testVisitor = {
        nom: 'Martin',
        prenom: 'Jean',
        societe: 'Tech Solutions SARL',
        email: uniqueEmail,
        telephone: '06 12 34 56 78',
        personneVisitee: 'Marie Dubois'
      };

      const response = await request(app)
        .post('/api/check-in')
        .send(testVisitor)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(uniqueEmail);
      expect(response.body.data.email).toMatch(/\.test\d+@/);
    });

    test('Génération d\'email unique avec timestamp', async () => {
      const baseEmail = 'test@example.com';
      const timestamp1 = Date.now();
      const timestamp2 = Date.now() + 1000;
      
      const email1 = baseEmail.replace('@', `.test${timestamp1}@`);
      const email2 = baseEmail.replace('@', `.test${timestamp2}@`);
      
      // Vérifier que les emails sont différents
      expect(email1).not.toBe(email2);
      expect(email1).toMatch(/\.test\d+@/);
      expect(email2).toMatch(/\.test\d+@/);
      
      // Vérifier le format d'email
      expect(email1).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(email2).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('Validation des données de test', () => {
    test('Données test avec société optionnelle', async () => {
      const testCases = [
        {
          name: 'Avec société',
          data: {
            nom: 'Martin',
            prenom: 'Jean',
            societe: 'Tech Solutions SARL',
            email: 'jean.martin.test@techsolutions.fr',
            telephone: '06 12 34 56 78',
            personneVisitee: 'Marie Dubois'
          },
          expectedSociete: 'Tech Solutions SARL'
        },
        {
          name: 'Sans société (chaîne vide)',
          data: {
            nom: 'Freelance',
            prenom: 'Sophie',
            societe: '',
            email: 'sophie.freelance.test@gmail.com',
            telephone: '06 99 88 77 66',
            personneVisitee: 'Marc Directeur'
          },
          expectedSociete: null
        },
        {
          name: 'Sans société (propriété manquante)',
          data: {
            nom: 'Indépendant',
            prenom: 'Paul',
            email: 'paul.independant.test@outlook.com',
            telephone: '07 55 44 33 22',
            personneVisitee: 'Julie Manager'
          },
          expectedSociete: null
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/check-in')
          .send(testCase.data)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.societe).toBe(testCase.expectedSociete);
      }
    });
  });
});