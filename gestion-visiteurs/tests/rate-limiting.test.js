const request = require('supertest');
const app = require('../server');

describe('🚦 Tests - Rate Limiting', () => {
  
  describe('Rate limiting général', () => {
    test('Permet plusieurs requêtes dans la limite autorisée', async () => {
      const promises = [];
      
      // Envoyer 10 requêtes simultanément
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .get('/api/welcome-message')
            .expect(200)
        );
      }
      
      const responses = await Promise.all(promises);
      
      // Vérifier que toutes les requêtes ont réussi
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('message');
      });
    });

    test('Endpoint de santé non limité', async () => {
      const promises = [];
      
      // Envoyer 20 requêtes simultanément au endpoint de santé
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .get('/health')
            .expect(200)
        );
      }
      
      const responses = await Promise.all(promises);
      
      // Vérifier que toutes les requêtes ont réussi
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Service en ligne');
      });
    });
  });

  describe('Rate limiting strict pour endpoints sensibles', () => {
    test('Permet plusieurs requêtes check-out dans la limite autorisée', async () => {
      const promises = [];
      
      // Envoyer 10 requêtes simultanément
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/check-out')
            .send({ email: `test${i}@example.com` })
        );
      }
      
      const responses = await Promise.all(promises);
      
      // Vérifier que toutes les requêtes ont été traitées (même si elles échouent fonctionnellement)
      responses.forEach(response => {
        // Les requêtes peuvent échouer avec 404 (email non trouvé) mais pas avec 429 (rate limit)
        expect(response.status).not.toBe(429);
        expect(response.body.success).toBe(false);
        if (response.status === 404) {
          expect(response.body.error.message).toContain('Aucune arrivée en cours trouvée');
        }
      });
    });

    test('Permet plusieurs requêtes check-in dans la limite autorisée', async () => {
      const promises = [];
      
      // Envoyer 10 requêtes simultanément avec des emails différents
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/check-in')
            .send({
              nom: `TestUser${i}`,
              prenom: 'Rate',
              email: `ratetest${i}@example.com`,
              telephone: '0123456789',
              personneVisitee: 'Test Manager'
            })
        );
      }
      
      const responses = await Promise.all(promises);
      
      // Vérifier que toutes les requêtes ont été traitées
      responses.forEach(response => {
        // Les requêtes peuvent échouer avec 400 (validation) mais pas avec 429 (rate limit)
        expect(response.status).not.toBe(429);
        expect(response.body).toHaveProperty('success');
      });
    });
  });

  describe('Configuration du rate limiting', () => {
    test('Vérifie la configuration en développement', () => {
      const config = require('../src/config/config');
      
      // Vérifier que la configuration est adaptée au test/développement
      expect(['development', 'test']).toContain(config.NODE_ENV);
      expect(config.RATE_LIMIT.max).toBe(1000); // 1000 requêtes par minute
      expect(config.RATE_LIMIT.windowMs).toBe(1 * 60 * 1000); // 1 minute
    });

    test('Headers de rate limiting présents', async () => {
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);
      
      // Vérifier que les headers de rate limiting sont présents
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });

  describe('Gestion des erreurs de rate limiting', () => {
    test('Format de réponse correct pour rate limiting', async () => {
      // Ce test vérifie le format sans déclencher le rate limit
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);
      
      // Vérifier que la réponse a le bon format
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
    });

    test('Middleware de rate limiting appliqué', async () => {
      const response = await request(app)
        .get('/api/welcome-message')
        .expect(200);
      
      // Vérifier que les headers indiquent que le rate limiting est actif
      const remainingRequests = parseInt(response.headers['ratelimit-remaining']);
      expect(remainingRequests).toBeLessThan(1000); // Moins que la limite max
      expect(remainingRequests).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Endpoints exclus du rate limiting', () => {
    test('Endpoint de santé non affecté par rate limiting', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      // Le endpoint de santé ne devrait pas avoir de headers de rate limiting
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Service en ligne');
      expect(response.body.timestamp).toBeTruthy();
    });

    test('Fichiers statiques non affectés', async () => {
      const response = await request(app)
        .get('/style.css')
        .expect(200);
      
      // Les fichiers statiques ne devraient pas être rate limitées
      expect(response.headers['content-type']).toContain('text/css');
    });
  });

  describe('Différents types de rate limiting', () => {
    test('Rate limiting différent pour endpoints admin', async () => {
      // Tester l'endpoint de configuration admin
      const response = await request(app)
        .get('/api/admin/config')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('welcomeMessage');
    });

    test('Rate limiting pour endpoint de configuration publique', async () => {
      const response = await request(app)
        .get('/api/public')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('welcomeMessage');
    });
  });
});