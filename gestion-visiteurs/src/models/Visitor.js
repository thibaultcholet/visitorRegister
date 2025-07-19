const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

/**
 * Modèle Visitor avec validation
 */
class Visitor {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.societe = data.societe || null;
    this.email = data.email;
    this.telephone = data.telephone || null;
    this.personneVisitee = data.personneVisitee;
    this.heureArrivee = data.heureArrivee || new Date().toISOString();
    this.heureSortie = data.heureSortie || null;
    this.statut = data.heureSortie ? 'parti' : 'present';
  }

  /**
   * Schema de validation pour l'enregistrement d'arrivée
   */
  static get checkInSchema() {
    return Joi.object({
      nom: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
        .required()
        .messages({
          'string.pattern.base': 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes',
          'string.min': 'Le nom doit contenir au moins 2 caractères',
          'string.max': 'Le nom ne peut pas dépasser 50 caractères'
        }),
      
      prenom: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
        .required()
        .messages({
          'string.pattern.base': 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes',
          'string.min': 'Le prénom doit contenir au moins 2 caractères',
          'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
        }),
      
      societe: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .allow(null, '')
        .messages({
          'string.min': 'La société doit contenir au moins 2 caractères',
          'string.max': 'La société ne peut pas dépasser 100 caractères'
        }),
      
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'L\'adresse email n\'est pas valide'
        }),
      
      telephone: Joi.string()
        .pattern(config.VALIDATION.PHONE_PATTERN)
        .allow(null, '')
        .messages({
          'string.pattern.base': 'Le numéro de téléphone n\'est pas valide'
        }),
      
      personneVisitee: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.min': 'La personne visitée doit contenir au moins 2 caractères',
          'string.max': 'La personne visitée ne peut pas dépasser 50 caractères'
        })
    });
  }

  /**
   * Schema de validation pour l'enregistrement de sortie
   */
  static get checkOutSchema() {
    return Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'L\'adresse email n\'est pas valide'
        })
    });
  }

  /**
   * Valider les données d'enregistrement d'arrivée
   */
  static validateCheckIn(data) {
    return this.checkInSchema.validate(data, { abortEarly: false });
  }

  /**
   * Valider les données d'enregistrement de sortie
   */
  static validateCheckOut(data) {
    return this.checkOutSchema.validate(data, { abortEarly: false });
  }

  /**
   * Anonymiser les données d'un visiteur
   */
  anonymize() {
    this.nom = '[ANONYMIZED]';
    this.prenom = '[ANONYMIZED]';
    this.societe = '[ANONYMIZED]';
    this.email = '[ANONYMIZED]';
    this.telephone = '[ANONYMIZED]';
    this.personneVisitee = '[ANONYMIZED]';
    return this;
  }

  /**
   * Vérifier si le visiteur doit être anonymisé
   */
  shouldBeAnonymized(anonymizationDays = 30) {
    if (!this.heureSortie) return false;
    
    const sortieDate = new Date(this.heureSortie);
    const anonymizationDate = new Date();
    anonymizationDate.setDate(anonymizationDate.getDate() - anonymizationDays);
    
    return sortieDate < anonymizationDate && this.nom !== '[ANONYMIZED]';
  }

  /**
   * Marquer le visiteur comme parti
   */
  checkOut() {
    this.heureSortie = new Date().toISOString();
    this.statut = 'parti';
    return this;
  }

  /**
   * Convertir en objet JSON
   */
  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      societe: this.societe,
      email: this.email,
      telephone: this.telephone,
      personneVisitee: this.personneVisitee,
      heureArrivee: this.heureArrivee,
      heureSortie: this.heureSortie,
      statut: this.statut
    };
  }
}

module.exports = Visitor;