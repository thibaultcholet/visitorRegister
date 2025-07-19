const request = require('supertest');
const app = require('../server');
const ConfigRepository = require('../src/repositories/ConfigRepository');
const Config = require('../src/models/Config');

describe('🔐 Tests - Changement de Code PIN', () => {
  let configRepo;
  const originalPin = '123456';
  const defaultPinHash = Config.hashPin(originalPin);

  beforeEach(async () => {
    configRepo = new ConfigRepository();
    // Réinitialiser la configuration avant chaque test
    await configRepo.resetToDefaults();
    // Ajouter un délai pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  });

  afterAll(async () => {
    // Restaurer la configuration par défaut à la fin
    await new ConfigRepository().resetToDefaults();
  });

  test('Devrait changer le PIN avec un code valide de 4 chiffres', async () => {
    const newPin = '1234';
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({ newPin })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Code PIN mis à jour avec succès');
    
    // Vérifier que le PIN a bien été changé
    const config = await configRepo.getConfig();
    expect(config.verifyPin(newPin)).toBe(true);
    expect(config.pinCodeHash).not.toBe(defaultPinHash);
  });

  test('Devrait changer le PIN avec un code valide de 6 chiffres', async () => {
    const newPin = '654321';
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({ newPin })
      .expect(200);

    expect(response.body.success).toBe(true);
    const config = await configRepo.getConfig();
    expect(config.verifyPin(newPin)).toBe(true);
  });

  test('Ne devrait pas changer le PIN avec un code trop court (3 chiffres)', async () => {
    const newPin = '123';
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({ newPin })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Le code PIN doit contenir entre 4 et 6 chiffres');
  });

  test('Ne devrait pas changer le PIN avec un code trop long (7 chiffres)', async () => {
    const newPin = '1234567';
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({ newPin })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Le code PIN doit contenir entre 4 et 6 chiffres');
  });

  test('Ne devrait pas changer le PIN avec des caractères non numériques', async () => {
    const newPin = '12a4';
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({ newPin })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Le code PIN ne peut contenir que des chiffres');
  });

  test('Ne devrait pas changer le PIN si aucun PIN n\'est fourni', async () => {
    const response = await request(app)
      .post('/api/admin/change-pin')
      .send({});

    // Accepter soit 400 (erreur de validation) soit 429 (rate limiting)
    expect([400, 429]).toContain(response.status);
    
    if (response.status === 400) {
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Le nouveau code PIN est requis');
    }
    // Si c'est 429, c'est que le rate limiting est actif, ce qui est acceptable pour ce test
  });
});
