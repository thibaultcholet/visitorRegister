const express = require('express');
const multer = require('multer');
const path = require('path');
const ConfigController = require('../controllers/ConfigController');
const { strictLimiter } = require('../middleware/security');
const config = require('../config/config');

const router = express.Router();
const configController = new ConfigController();

/**
 * Configuration de multer pour l'upload de logo
 */
const storage = multer.diskStorage({
  destination: config.UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Seuls les fichiers image (jpeg, jpg, png, gif, svg) sont autorisés'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: config.MAX_FILE_SIZE },
  fileFilter: fileFilter
});

/**
 * Routes publiques pour la configuration
 */

// Obtenir la configuration publique
router.get('/public', configController.getPublicConfig);

// Obtenir le message de bienvenue
router.get('/welcome-message', configController.getWelcomeMessage);

/**
 * Routes d'administration
 */

// Authentification admin
router.post('/admin/login', strictLimiter, configController.login);

// Obtenir la configuration complète (admin)
router.get('/admin/config', configController.getFullConfig);

// Mettre à jour la configuration
router.put('/admin/config', configController.updateConfig);

// Changer le code PIN
router.post('/admin/change-pin', strictLimiter, configController.changePin);

// Mettre à jour le logo
router.put('/admin/logo', 
  upload.single('logo'), 
  configController.updateLogo
);

// Obtenir les paramètres de sécurité
router.get('/admin/security', configController.getSecuritySettings);

// Réinitialiser la configuration
router.post('/admin/config/reset', configController.resetConfig);

module.exports = router;