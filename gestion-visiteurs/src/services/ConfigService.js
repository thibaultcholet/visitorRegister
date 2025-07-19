const ConfigRepository = require('../repositories/ConfigRepository');
const Config = require('../models/Config');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Service pour la gestion de la configuration
 */
class ConfigService {
  constructor() {
    this.configRepository = new ConfigRepository();
  }

  /**
   * Obtenir la configuration publique
   */
  async getPublicConfig() {
    try {
      return await this.configRepository.getPublicConfig();
    } catch (error) {
      logger.error('Erreur lors de la récupération de la configuration publique', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Obtenir la configuration complète (admin uniquement)
   */
  async getFullConfig() {
    try {
      return await this.configRepository.getConfig();
    } catch (error) {
      logger.error('Erreur lors de la récupération de la configuration complète', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Mettre à jour la configuration
   */
  async updateConfig(updates) {
    try {
      const updatedConfig = await this.configRepository.updateConfig(updates);
      
      logger.info('Configuration mise à jour avec succès', {
        updates: Object.keys(updates),
        timestamp: new Date().toISOString()
      });

      return updatedConfig.getPublicConfig();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la configuration', {
        error: error.message,
        updates
      });
      throw error;
    }
  }

  /**
   * Authentifier un utilisateur avec le code PIN
   */
  async authenticatePin(pin) {
    try {
      if (!pin) {
        throw new AppError('Le code PIN est requis', 400);
      }

      const isValid = await this.configRepository.verifyPin(pin);
      
      if (!isValid) {
        throw new AppError('Code PIN incorrect', 401);
      }

      logger.info('Authentification PIN réussie', {
        timestamp: new Date().toISOString()
      });

      return { success: true, authenticated: true };
    } catch (error) {
      logger.warn('Échec de l\'authentification PIN', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Changer le code PIN
   */
  async changePin(newPin, currentPin = null) {
    try {
      if (!newPin) {
        throw new AppError('Le nouveau code PIN est requis', 400);
      }

      // Normaliser le PIN: convertir en string et valider
      const normalizedPin = this._normalizePin(newPin);
      
      // Valider le PIN normalisé
      this._validatePin(normalizedPin);

      const updatedConfig = await this.configRepository.changePin(normalizedPin, currentPin);
      
      logger.info('Code PIN changé avec succès', {
        timestamp: new Date().toISOString()
      });

      return { 
        success: true, 
        message: 'Code PIN mis à jour avec succès',
        requirePinChange: updatedConfig.requirePinChange
      };
    } catch (error) {
      logger.error('Erreur lors du changement de PIN', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Normalise un PIN en retirant les espaces et en convertissant en string
   */
  _normalizePin(pin) {
    if (pin === null || pin === undefined) {
      throw new AppError('Le code PIN ne peut pas être vide', 400);
    }
    
    // Convertir en string et nettoyer
    let normalized = String(pin).trim();
    
    // Retirer tous les espaces
    normalized = normalized.replace(/\s/g, '');
    
    return normalized;
  }

  /**
   * Valide un PIN normalisé
   */
  _validatePin(pin) {
    // Vérifier que ce n'est pas vide après normalisation
    if (!pin || pin.length === 0) {
      throw new AppError('Le code PIN ne peut pas être vide', 400);
    }
    
    // Vérifier la longueur (4 à 6 caractères)
    if (pin.length < 4 || pin.length > 6) {
      throw new AppError('Le code PIN doit contenir entre 4 et 6 chiffres', 400);
    }
    
    // Vérifier que ce sont uniquement des chiffres
    if (!/^\d+$/.test(pin)) {
      throw new AppError('Le code PIN ne peut contenir que des chiffres', 400);
    }
    
    return true;
  }

  /**
   * Mettre à jour le logo
   */
  async updateLogo(logoPath) {
    try {
      if (!logoPath) {
        throw new AppError('Le chemin du logo est requis', 400);
      }

      const updatedConfig = await this.configRepository.updateLogoPath(logoPath);
      
      logger.info('Logo mis à jour avec succès', {
        logoPath,
        timestamp: new Date().toISOString()
      });

      return updatedConfig.getPublicConfig();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du logo', {
        error: error.message,
        logoPath
      });
      throw error;
    }
  }

  /**
   * Obtenir le message de bienvenue
   */
  async getWelcomeMessage() {
    try {
      const config = await this.configRepository.getPublicConfig();
      return { message: config.welcomeMessage || 'Bienvenue' };
    } catch (error) {
      logger.error('Erreur lors de la récupération du message de bienvenue', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Réinitialiser la configuration
   */
  async resetConfig() {
    try {
      const defaultConfig = await this.configRepository.resetToDefaults();
      
      logger.warn('Configuration réinitialisée aux valeurs par défaut', {
        timestamp: new Date().toISOString()
      });

      return defaultConfig.getPublicConfig();
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation de la configuration', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Valider les paramètres de configuration
   */
  validateConfigUpdate(updates) {
    const { error, value } = Config.validateConfig(updates);
    if (error) {
      throw new AppError(
        `Configuration invalide: ${error.details.map(d => d.message).join(', ')}`,
        400
      );
    }
    return value;
  }

  /**
   * Obtenir les paramètres de sécurité
   */
  async getSecuritySettings() {
    try {
      const config = await this.configRepository.getConfig();
      
      return {
        requirePinChange: config.requirePinChange,
        anonymizationDays: config.anonymizationDays,
        maxFileSize: config.maxFileSize
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des paramètres de sécurité', {
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = ConfigService;