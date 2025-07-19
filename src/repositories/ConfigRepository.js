const FileRepository = require('./FileRepository');
const Config = require('../models/Config');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Repository pour la gestion de la configuration
 */
class ConfigRepository extends FileRepository {
  constructor() {
    super(config.CONFIG_FILE, {
      pinCodeHash: config.DEFAULT_PIN_HASH,
      requirePinChange: true,
      welcomeMessage: 'Bienvenue dans notre entreprise',
      logoPath: '/images/logo.png',
      anonymizationDays: config.ANONYMIZATION_DAYS,
      maxFileSize: config.MAX_FILE_SIZE
    });
  }

  /**
   * Obtenir la configuration actuelle
   */
  async getConfig() {
    try {
      const data = await this.read();
      return new Config(data);
    } catch (error) {
      logger.error('Erreur lors de la récupération de la configuration', { error: error.message });
      throw error;
    }
  }

  /**
   * Mettre à jour la configuration
   */
  async updateConfig(updates) {
    try {
      const currentConfig = await this.getConfig();
      const updatedConfig = currentConfig.updateConfig(updates);
      
      await this.write(updatedConfig.toJSON());
      
      logger.logUserAction('config_updated', {
        updates,
        timestamp: new Date().toISOString()
      });
      
      return updatedConfig;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la configuration', { 
        error: error.message, 
        updates 
      });
      throw error;
    }
  }

  /**
   * Changer le code PIN
   */
  async changePin(newPin, currentPin = null) {
    try {
      const currentConfig = await this.getConfig();
      
      // Vérifier le PIN actuel si requis
      if (currentPin && !currentConfig.verifyPin(currentPin)) {
        throw new Error('Code PIN actuel incorrect');
      }
      
      // La validation du PIN est maintenant gérée dans le service ConfigService
      
      const updatedConfig = currentConfig.changePin(newPin);
      await this.write(updatedConfig.toJSON());
      
      logger.logAdminAccess('pin_changed', true, {
        timestamp: new Date().toISOString()
      });
      
      return updatedConfig;
    } catch (error) {
      logger.logAdminAccess('pin_change_failed', false, {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      logger.error('Erreur lors du changement de PIN', { error: error.message });
      throw error;
    }
  }

  /**
   * Vérifier le code PIN
   */
  async verifyPin(pin) {
    try {
      const currentConfig = await this.getConfig();
      const isValid = currentConfig.verifyPin(pin);
      
      logger.logAdminAccess('pin_verification', isValid, {
        timestamp: new Date().toISOString()
      });
      
      return isValid;
    } catch (error) {
      logger.error('Erreur lors de la vérification du PIN', { error: error.message });
      throw error;
    }
  }

  /**
   * Obtenir la configuration publique (sans données sensibles)
   */
  async getPublicConfig() {
    try {
      const currentConfig = await this.getConfig();
      return currentConfig.getPublicConfig();
    } catch (error) {
      logger.error('Erreur lors de la récupération de la configuration publique', { 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Mettre à jour le chemin du logo
   */
  async updateLogoPath(logoPath) {
    try {
      const currentConfig = await this.getConfig();
      currentConfig.logoPath = logoPath;
      
      await this.write(currentConfig.toJSON());
      
      logger.logUserAction('logo_updated', {
        logoPath,
        timestamp: new Date().toISOString()
      });
      
      return currentConfig;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du logo', { 
        error: error.message, 
        logoPath 
      });
      throw error;
    }
  }

  /**
   * Réinitialiser la configuration aux valeurs par défaut
   */
  async resetToDefaults() {
    try {
      const defaultConfig = new Config();
      await this.write(defaultConfig.toJSON());
      
      logger.logAdminAccess('config_reset', true, {
        timestamp: new Date().toISOString()
      });
      
      return defaultConfig;
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation de la configuration', { 
        error: error.message 
      });
      throw error;
    }
  }
}

module.exports = ConfigRepository;