const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');
const ConfigRepository = require('../src/repositories/ConfigRepository');

describe('🖼️ Tests - Upload Logo', () => {
  let configRepo;
  const testImagePath = path.join(__dirname, 'test-logo.png');
  
  beforeAll(() => {
    // Créer un fichier image de test simple (1x1 pixel PNG)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testImagePath, pngData);
  });

  beforeEach(async () => {
    configRepo = new ConfigRepository();
  });

  afterAll(() => {
    // Nettoyer le fichier de test
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('Fonctionnalité principale', () => {
    test('Upload d\'un logo PNG valide', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logo mis à jour avec succès');
      expect(response.body.data).toHaveProperty('logoPath');
      expect(response.body.data.logoPath).toMatch(/^\/images\/logo-\d+-\d+\.png$/);
    });

    test('Upload sans fichier', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Le chemin du logo est requis');
    });

    test('Content-Type multipart/form-data accepté', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Intégration avec ConfigRepository', () => {
    test('Le logo est persisté dans la configuration', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      const logoPath = response.body.data.logoPath;
      
      // Vérifier que le logo est dans la configuration
      const config = await configRepo.getConfig();
      expect(config.logoPath).toBe(logoPath);
    });

    test('Le logo est accessible via la configuration publique', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      const logoPath = response.body.data.logoPath;
      
      // Vérifier que le logo est dans la configuration publique
      const publicConfig = await configRepo.getPublicConfig();
      expect(publicConfig.logoPath).toBe(logoPath);
    });

    test('Le logo remplace l\'ancien logo', async () => {
      // Premier upload
      const response1 = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      const firstLogoPath = response1.body.data.logoPath;

      // Attendre un peu pour avoir un nom de fichier différent
      await new Promise(resolve => setTimeout(resolve, 100));

      // Deuxième upload
      const response2 = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      const secondLogoPath = response2.body.data.logoPath;

      // Vérifier que les chemins sont différents
      expect(firstLogoPath).not.toBe(secondLogoPath);
      
      // Vérifier que seul le nouveau logo est dans la configuration
      const config = await configRepo.getConfig();
      expect(config.logoPath).toBe(secondLogoPath);
    });
  });

  describe('Sécurité', () => {
    test('Noms de fichiers sécurisés', async () => {
      const response = await request(app)
        .put('/api/admin/logo')
        .attach('logo', testImagePath)
        .expect(200);

      const logoPath = response.body.data.logoPath;
      
      // Vérifier que le nom de fichier contient un timestamp et un nombre aléatoire
      expect(logoPath).toMatch(/^\/images\/logo-\d+-\d+\.png$/);
      
      // Vérifier qu'il n'y a pas de caractères dangereux (sauf / et . qui sont normaux)
      expect(logoPath).not.toMatch(/[<>:"\\|?*]/);
    });
  });
});