const request = require('supertest');
const app = require('../server');
const ConfigRepository = require('../src/repositories/ConfigRepository');

describe('🎉 Tests - Message d\'accueil', () => {
  let configRepo;

  beforeEach(async () => {
    configRepo = new ConfigRepository();
    // Réinitialiser la configuration à l'état par défaut avant chaque test
    await configRepo.updateConfig({ welcomeMessage: 'Bienvenue' });
  });

  describe('API endpoint /api/welcome-message', () => {
    test('Retourne le message de bienvenue par défaut', async () => {
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(typeof response.body.data.message).toBe('string');
      expect(response.body.data.message.length).toBeGreaterThan(0);
    });

    test('Retourne un message personnalisé si configuré', async () => {
      // Configurer un message personnalisé
      const customMessage = 'Bienvenue dans notre entreprise !';
      await configRepo.updateConfig({ welcomeMessage: customMessage });

      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe(customMessage);
    });

    test('Structure de la réponse est correcte', async () => {
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.success).toBe(true);
    });
  });

  describe('Configuration du message d\'accueil', () => {
    test('Mettre à jour le message d\'accueil via API admin', async () => {
      const newMessage = 'Nouveau message d\'accueil !';
      
      const updateResponse = await request(app)
        .post('/api/admin/config')
        .send({ welcomeMessage: newMessage })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);

      // Vérifier que le message a été mis à jour
      const getResponse = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(getResponse.body.data.message).toBe(newMessage);
    });

    test('Le message d\'accueil persiste après redémarrage', async () => {
      const persistentMessage = 'Message persistant';
      
      // Configurer le message
      await configRepo.updateConfig({ welcomeMessage: persistentMessage });
      
      // Créer une nouvelle instance du repository pour simuler un redémarrage
      const newConfigRepo = new ConfigRepository();
      const config = await newConfigRepo.getPublicConfig();
      
      expect(config.welcomeMessage).toBe(persistentMessage);
    });
  });

  describe('Gestion des erreurs', () => {
    test('API retourne toujours une réponse valide', async () => {
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(typeof response.body.data.message).toBe('string');
    });
  });

  describe('Validation des données', () => {
    test('Accepte les messages avec caractères spéciaux', async () => {
      const specialMessage = 'Bienvenue ! Éléments spéciaux : à, é, ç, ñ, ü - 123 & @';
      
      const updateResponse = await request(app)
        .post('/api/admin/config')
        .send({ welcomeMessage: specialMessage })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);

      const getResponse = await request(app)
        .get('/api/welcome-message')
        .expect(200);

      expect(getResponse.body.data.message).toBe(specialMessage);
    });

    test('Limite la longueur du message', async () => {
      const longMessage = 'A'.repeat(1000);
      
      const updateResponse = await request(app)
        .post('/api/admin/config')
        .send({ welcomeMessage: longMessage })
        .expect(500);

      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.error.message).toBeTruthy();
    });

    test('Gère les messages vides', async () => {
      const emptyMessage = '';
      
      const updateResponse = await request(app)
        .post('/api/admin/config')
        .send({ welcomeMessage: emptyMessage })
        .expect(500);

      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.error.message).toBeTruthy();
    });
  });

  describe('Intégration avec configuration complète', () => {
    test('Message d\'accueil fait partie de la configuration complète', async () => {
      const testMessage = 'Message pour test complet';
      await configRepo.updateConfig({ welcomeMessage: testMessage });

      const response = await request(app)
        .get('/api/admin/config')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.welcomeMessage).toBe(testMessage);
    });
  });
});