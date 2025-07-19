const FileRepository = require('./FileRepository');
const Visitor = require('../models/Visitor');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Repository pour la gestion des visiteurs
 */
class VisitorRepository extends FileRepository {
  constructor() {
    super(config.VISITORS_FILE, []);
  }

  /**
   * Obtenir tous les visiteurs
   */
  async findAll() {
    try {
      const data = await this.read();
      return data.map(visitor => new Visitor(visitor));
    } catch (error) {
      logger.error('Erreur lors de la récupération des visiteurs', { error: error.message });
      throw error;
    }
  }

  /**
   * Trouver un visiteur par ID
   */
  async findById(id) {
    try {
      const visitors = await this.findAll();
      return visitors.find(visitor => visitor.id === id) || null;
    } catch (error) {
      logger.error('Erreur lors de la recherche du visiteur par ID', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Trouver un visiteur par email (présent uniquement)
   */
  async findByEmailPresent(email) {
    try {
      const visitors = await this.findAll();
      return visitors.find(visitor => visitor.email === email && !visitor.heureSortie) || null;
    } catch (error) {
      logger.error('Erreur lors de la recherche du visiteur par email', { error: error.message, email });
      throw error;
    }
  }

  /**
   * Obtenir les visiteurs actuellement présents
   */
  async findCurrentVisitors() {
    try {
      const visitors = await this.findAll();
      return visitors.filter(visitor => !visitor.heureSortie);
    } catch (error) {
      logger.error('Erreur lors de la récupération des visiteurs actuels', { error: error.message });
      throw error;
    }
  }

  /**
   * Obtenir les visiteurs par période
   */
  async findByDateRange(startDate, endDate = new Date()) {
    try {
      const visitors = await this.findAll();
      return visitors.filter(visitor => {
        const arrivalDate = new Date(visitor.heureArrivee);
        return arrivalDate >= startDate && arrivalDate <= endDate;
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des visiteurs par période', { 
        error: error.message, 
        startDate, 
        endDate 
      });
      throw error;
    }
  }

  /**
   * Ajouter un nouveau visiteur
   */
  async create(visitorData) {
    try {
      const visitors = await this.findAll();
      const newVisitor = new Visitor(visitorData);
      
      visitors.push(newVisitor);
      await this.write(visitors.map(v => v.toJSON()));
      
      logger.logUserAction('visitor_checkin', {
        visitorId: newVisitor.id,
        email: newVisitor.email,
        societe: newVisitor.societe
      });
      
      return newVisitor;
    } catch (error) {
      logger.error('Erreur lors de la création du visiteur', { error: error.message, visitorData });
      throw error;
    }
  }

  /**
   * Mettre à jour un visiteur
   */
  async update(id, updates) {
    try {
      const visitors = await this.findAll();
      const visitorIndex = visitors.findIndex(v => v.id === id);
      
      if (visitorIndex === -1) {
        throw new Error('Visiteur non trouvé');
      }
      
      Object.assign(visitors[visitorIndex], updates);
      await this.write(visitors.map(v => v.toJSON()));
      
      logger.logUserAction('visitor_update', {
        visitorId: id,
        updates
      });
      
      return visitors[visitorIndex];
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du visiteur', { error: error.message, id, updates });
      throw error;
    }
  }

  /**
   * Marquer un visiteur comme parti
   */
  async checkOut(email) {
    try {
      const visitors = await this.findAll();
      const visitorIndex = visitors.findIndex(v => v.email === email && !v.heureSortie);
      
      if (visitorIndex === -1) {
        throw new Error('Aucune arrivée en cours trouvée pour cet email');
      }
      
      visitors[visitorIndex].checkOut();
      await this.write(visitors.map(v => v.toJSON()));
      
      logger.logUserAction('visitor_checkout', {
        visitorId: visitors[visitorIndex].id,
        email: email
      });
      
      return visitors[visitorIndex];
    } catch (error) {
      logger.error('Erreur lors du checkout du visiteur', { error: error.message, email });
      throw error;
    }
  }

  /**
   * Supprimer tous les visiteurs (fonction de debug)
   */
  async deleteAll() {
    try {
      await this.write([]);
      logger.logUserAction('visitors_clear_all', {});
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression des visiteurs', { error: error.message });
      throw error;
    }
  }

  /**
   * Anonymiser les visiteurs anciens
   */
  async anonymizeOldVisitors(anonymizationDays = config.ANONYMIZATION_DAYS) {
    try {
      const visitors = await this.findAll();
      let anonymizedCount = 0;
      
      visitors.forEach(visitor => {
        if (visitor.shouldBeAnonymized(anonymizationDays)) {
          visitor.anonymize();
          anonymizedCount++;
        }
      });
      
      if (anonymizedCount > 0) {
        await this.write(visitors.map(v => v.toJSON()));
        logger.logUserAction('visitors_anonymized', {
          anonymizedCount,
          anonymizationDays
        });
      }
      
      return anonymizedCount;
    } catch (error) {
      logger.error('Erreur lors de l\'anonymisation des visiteurs', { error: error.message });
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des visiteurs
   */
  async getStatistics() {
    try {
      const visitors = await this.findAll();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Filtrer les visiteurs non anonymisés pour les statistiques
      const nonAnonymizedVisitors = visitors.filter(v => v.nom !== '[ANONYMIZED]');
      
      // Visiteurs actuellement présents
      const currentVisitors = nonAnonymizedVisitors.filter(v => !v.heureSortie);
      
      // Visiteurs arrivés dans les différentes périodes
      const todayArrivals = nonAnonymizedVisitors.filter(v => new Date(v.heureArrivee) >= today);
      const last7daysArrivals = nonAnonymizedVisitors.filter(v => new Date(v.heureArrivee) >= sevenDaysAgo);
      const last30daysArrivals = nonAnonymizedVisitors.filter(v => new Date(v.heureArrivee) >= thirtyDaysAgo);
      
      // Pour éviter l'incohérence, s'assurer que les périodes incluent au minimum
      // le nombre de visiteurs actuellement présents
      const todayCount = Math.max(currentVisitors.length, todayArrivals.length);
      const last7daysCount = Math.max(currentVisitors.length, last7daysArrivals.length);
      const last30daysCount = Math.max(currentVisitors.length, last30daysArrivals.length);

      return {
        current: currentVisitors.length,
        today: todayCount,
        last7days: last7daysCount,
        last30days: last30daysCount,
        total: nonAnonymizedVisitors.length
      };
    } catch (error) {
      logger.error('Erreur lors du calcul des statistiques', { error: error.message });
      throw error;
    }
  }
}

module.exports = VisitorRepository;