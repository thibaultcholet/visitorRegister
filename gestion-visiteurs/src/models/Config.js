const Joi = require('joi');
const crypto = require('crypto');
const config = require('../config/config');

/**
 * Modèle Config avec validation
 */
class Config {
  constructor(data = {}) {
    this.pinCodeHash = data.pinCodeHash || config.DEFAULT_PIN_HASH;
    this.requirePinChange = data.requirePinChange !== undefined ? data.requirePinChange : true;
    this.welcomeMessage = data.welcomeMessage || 'Bienvenue dans notre entreprise';
    this.logoPath = data.logoPath || '/images/logo.png';
    this.anonymizationDays = data.anonymizationDays || config.ANONYMIZATION_DAYS;
    this.maxFileSize = data.maxFileSize || config.MAX_FILE_SIZE;
  }

  /**
   * Schema de validation pour la configuration
   */
  static get configSchema() {
    return Joi.object({
      welcomeMessage: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .messages({
          'string.min': 'Le message de bienvenue doit contenir au moins 3 caractères',
          'string.max': 'Le message de bienvenue ne peut pas dépasser 200 caractères'
        }),
      
      anonymizationDays: Joi.number()
        .integer()
        .min(1)
        .max(365)
        .messages({
          'number.min': 'Le nombre de jours doit être au moins 1',
          'number.max': 'Le nombre de jours ne peut pas dépasser 365'
        }),
      
      logoPath: Joi.string()
        .uri({ relativeOnly: true })
        .messages({
          'string.uri': 'Le chemin du logo n\'est pas valide'
        })
    });
  }

  /**
   * Schema de validation pour le changement de PIN
   */
  // Validation PIN déplacée dans ConfigService pour plus de cohérence

  /**
   * Valider la configuration
   */
  static validateConfig(data) {
    return this.configSchema.validate(data, { abortEarly: false });
  }

  // Validation PIN déplacée dans ConfigService

  /**
   * Hacher un code PIN
   */
  static hashPin(pin) {
    return crypto.createHash('sha256').update(pin.toString()).digest('hex');
  }

  /**
   * Vérifier un code PIN
   */
  verifyPin(pin) {
    const hashedPin = Config.hashPin(pin);
    return hashedPin === this.pinCodeHash;
  }

  /**
   * Changer le code PIN
   */
  changePin(newPin) {
    this.pinCodeHash = Config.hashPin(newPin);
    this.requirePinChange = false;
    return this;
  }

  /**
   * Mettre à jour la configuration
   */
  updateConfig(updates) {
    const { error, value } = Config.validateConfig(updates);
    if (error) {
      throw new Error(`Configuration invalide: ${error.details.map(d => d.message).join(', ')}`);
    }

    Object.assign(this, value);
    return this;
  }

  /**
   * Obtenir les paramètres publics (sans données sensibles)
   */
  getPublicConfig() {
    return {
      welcomeMessage: this.welcomeMessage,
      logoPath: this.logoPath,
      anonymizationDays: this.anonymizationDays,
      requirePinChange: this.requirePinChange
    };
  }

  /**
   * Convertir en objet JSON
   */
  toJSON() {
    return {
      pinCodeHash: this.pinCodeHash,
      requirePinChange: this.requirePinChange,
      welcomeMessage: this.welcomeMessage,
      logoPath: this.logoPath,
      anonymizationDays: this.anonymizationDays,
      maxFileSize: this.maxFileSize
    };
  }
}

module.exports = Config;