const ConfigService = require('../services/ConfigService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Controller pour la gestion de la configuration
 */
class ConfigController {
  constructor() {
    this.configService = new ConfigService();
  }

  /**
   * Obtenir la configuration publique
   * GET /api/config/public
   */
  getPublicConfig = asyncHandler(async (req, res) => {
    const config = await this.configService.getPublicConfig();
    
    res.status(200).json({
      success: true,
      data: config
    });
  });

  /**
   * Obtenir le message de bienvenue
   * GET /api/config/welcome-message
   */
  getWelcomeMessage = asyncHandler(async (req, res) => {
    const result = await this.configService.getWelcomeMessage();
    
    res.status(200).json({
      success: true,
      data: result
    });
  });

  /**
   * Obtenir la configuration complète (admin uniquement)
   * GET /api/admin/config
   */
  getFullConfig = asyncHandler(async (req, res) => {
    const config = await this.configService.getFullConfig();
    
    res.status(200).json({
      success: true,
      data: config
    });
  });

  /**
   * Mettre à jour la configuration
   * PUT /api/admin/config
   */
  updateConfig = asyncHandler(async (req, res) => {
    const updatedConfig = await this.configService.updateConfig(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Configuration mise à jour avec succès',
      data: updatedConfig
    });
  });

  /**
   * Authentifier avec le code PIN
   * POST /api/admin/login
   */
  login = asyncHandler(async (req, res) => {
    const { pin } = req.body;
    const result = await this.configService.authenticatePin(pin);
    
    res.status(200).json({
      success: true,
      message: 'Authentification réussie',
      data: result
    });
  });

  /**
   * Changer le code PIN
   * PUT /api/admin/change-pin
   */
  changePin = asyncHandler(async (req, res) => {
    const { newPin, currentPin } = req.body;
    const result = await this.configService.changePin(newPin, currentPin);
    
    res.status(200).json({
      success: true,
      message: 'Code PIN mis à jour avec succès',
      data: result
    });
  });

  /**
   * Mettre à jour le logo
   * PUT /api/admin/logo
   */
  updateLogo = asyncHandler(async (req, res) => {
    const logoPath = req.file ? `/images/${req.file.filename}` : req.body.logoPath;
    const updatedConfig = await this.configService.updateLogo(logoPath);
    
    res.status(200).json({
      success: true,
      message: 'Logo mis à jour avec succès',
      data: updatedConfig
    });
  });

  /**
   * Obtenir les paramètres de sécurité
   * GET /api/admin/security
   */
  getSecuritySettings = asyncHandler(async (req, res) => {
    const settings = await this.configService.getSecuritySettings();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  });

  /**
   * Réinitialiser la configuration
   * POST /api/admin/config/reset
   */
  resetConfig = asyncHandler(async (req, res) => {
    const defaultConfig = await this.configService.resetConfig();
    
    res.status(200).json({
      success: true,
      message: 'Configuration réinitialisée aux valeurs par défaut',
      data: defaultConfig
    });
  });
}

module.exports = ConfigController;