const request = require('supertest');
const path = require('path');

// Configuration des variables d'environnement pour les tests AVANT l'import du serveur
process.env.NODE_ENV = 'test';
const testDataDir = path.join(__dirname, 'test-data-departure');
process.env.DATA_DIR = testDataDir;
process.env.VISITORS_FILE = path.join(testDataDir, 'visitors.json');
process.env.CONFIG_FILE = path.join(testDataDir, 'config.json');

const app = require('../server');
const VisitorRepository = require('../src/repositories/VisitorRepository');
const fs = require('fs').promises;

describe('🚪 Tests - Bouton Départ Admin', () => {
  let visitorRepo;
  let testVisitorId;

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
    // Nettoyer les visiteurs de test
    await visitorRepo.deleteAll();

    // Créer un visiteur test
    const testVisitor = await visitorRepo.create({
      nom: 'TestUser',
      prenom: 'Jean',
      societe: 'Test Company',
      email: 'test@example.com',
      personneVisitee: 'Marie Dubois'
    });
    testVisitorId = testVisitor.id;
  });

  afterEach(async () => {
    // Nettoyer après chaque test
    await visitorRepo.deleteAll();
  });

  describe('API endpoint /api/admin/visitors/current', () => {
    test('Retourne la liste des visiteurs actuels avec ID', async () => {
      const response = await request(app)
        .get('/api/admin/visitors/current')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0].id).toBe(testVisitorId);
      expect(response.body.data[0].email).toBe('test@example.com');
    });

    test('Retourne visiteur avec société null gérée', async () => {
      // Créer un visiteur sans société
      await visitorRepo.create({
        nom: 'TestUser2',
        prenom: 'Pierre',
        email: 'test2@example.com',
        personneVisitee: 'Julie Bernard'
      });

      const response = await request(app)
        .get('/api/admin/visitors/current')
        .expect(200);

      expect(response.body.data.length).toBe(2);
      const visitorWithoutCompany = response.body.data.find(v => v.email === 'test2@example.com');
      expect(visitorWithoutCompany.societe).toBeNull();
    });
  });

  describe('API endpoint /api/check-out', () => {
    test('Départ d\'un visiteur fonctionne correctement', async () => {
      const response = await request(app)
        .post('/api/check-out')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('heureSortie');
      expect(response.body.data.statut).toBe('parti');
    });

    test('Erreur si email non trouvé', async () => {
      const response = await request(app)
        .post('/api/check-out')
        .send({ email: 'inexistant@example.com' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Aucune arrivée en cours trouvée');
    });

    test('Erreur si email manquant', async () => {
      const response = await request(app)
        .post('/api/check-out')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Workflow complet du bouton Départ', () => {
    test('Simulation complète du flux admin', async () => {
      // 1. Récupérer la liste des visiteurs actuels
      const visitorsResponse = await request(app)
        .get('/api/admin/visitors/current')
        .expect(200);

      expect(visitorsResponse.body.data.length).toBe(1);
      const visitor = visitorsResponse.body.data[0];
      expect(visitor.id).toBe(testVisitorId);
      expect(visitor.email).toBe('test@example.com');

      // 2. Enregistrer le départ du visiteur
      const checkoutResponse = await request(app)
        .post('/api/check-out')
        .send({ email: visitor.email })
        .expect(200);

      expect(checkoutResponse.body.success).toBe(true);
      expect(checkoutResponse.body.data.heureSortie).toBeTruthy();

      // 3. Vérifier qu'il n'est plus dans la liste des visiteurs actuels
      const updatedVisitorsResponse = await request(app)
        .get('/api/admin/visitors/current')
        .expect(200);

      expect(updatedVisitorsResponse.body.data.length).toBe(0);

      // 4. Vérifier qu'il apparaît dans l'historique
      const historyResponse = await request(app)
        .get('/api/admin/visitors/history')
        .expect(200);

      expect(historyResponse.body.data.length).toBe(1);
      const historicalVisitor = historyResponse.body.data[0];
      expect(historicalVisitor.id).toBe(testVisitorId);
      expect(historicalVisitor.heureSortie).toBeTruthy();
      expect(historicalVisitor.statut).toBe('parti');
    });

    test('Gestion des visiteurs avec société null', async () => {
      // Créer un visiteur sans société
      const visitorWithoutCompany = await visitorRepo.create({
        nom: 'Sans',
        prenom: 'Société',
        email: 'sansociete@example.com',
        personneVisitee: 'Test Manager'
      });

      // 1. Récupérer les visiteurs actuels
      const visitorsResponse = await request(app)
        .get('/api/admin/visitors/current')
        .expect(200);

      expect(visitorsResponse.body.data.length).toBe(2);
      const targetVisitor = visitorsResponse.body.data.find(v => v.email === 'sansociete@example.com');
      expect(targetVisitor.societe).toBeNull();

      // 2. Enregistrer le départ
      const checkoutResponse = await request(app)
        .post('/api/check-out')
        .send({ email: targetVisitor.email })
        .expect(200);

      expect(checkoutResponse.body.success).toBe(true);

      // 3. Vérifier l'historique avec société null
      const historyResponse = await request(app)
        .get('/api/admin/visitors/history')
        .expect(200);

      const historicalVisitor = historyResponse.body.data.find(v => v.email === 'sansociete@example.com');
      expect(historicalVisitor).toBeTruthy();
      expect(historicalVisitor.societe).toBeNull();
      expect(historicalVisitor.heureSortie).toBeTruthy();
    });
  });

  describe('Tests d\'erreur et cas limites', () => {
    test('Double départ du même visiteur', async () => {
      // Premier départ
      await request(app)
        .post('/api/check-out')
        .send({ email: 'test@example.com' })
        .expect(200);

      // Tentative de second départ
      const response = await request(app)
        .post('/api/check-out')
        .send({ email: 'test@example.com' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Aucune arrivée en cours trouvée');
    });

    test('Départ avec email invalide', async () => {
      const response = await request(app)
        .post('/api/check-out')
        .send({ email: 'email-invalide' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('Départ avec données manquantes', async () => {
      const response = await request(app)
        .post('/api/check-out')
        .send({ email: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Intégration avec les statistiques', () => {
    test('Les statistiques se mettent à jour après un départ', async () => {
      // Statistiques avant départ
      const statsBefore = await request(app)
        .get('/api/admin/stats')
        .expect(200);

      expect(statsBefore.body.data.current).toBe(1);

      // Enregistrer le départ
      await request(app)
        .post('/api/check-out')
        .send({ email: 'test@example.com' })
        .expect(200);

      // Statistiques après départ
      const statsAfter = await request(app)
        .get('/api/admin/stats')
        .expect(200);

      expect(statsAfter.body.data.current).toBe(0);
      expect(statsAfter.body.data.today).toBeGreaterThanOrEqual(1);
    });
  });
});