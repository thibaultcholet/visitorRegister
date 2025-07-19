const VisitorRepository = require('../repositories/VisitorRepository');
const Visitor = require('../models/Visitor');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Service pour la gestion des visiteurs
 */
class VisitorService {
  constructor() {
    this.visitorRepository = new VisitorRepository();
  }

  /**
   * Enregistrer l'arrivée d'un visiteur
   */
  async checkIn(visitorData) {
    try {
      // Validation des données
      const { error, value } = Visitor.validateCheckIn(visitorData);
      if (error) {
        throw new AppError(
          `Données invalides: ${error.details.map(d => d.message).join(', ')}`,
          400
        );
      }

      // Vérifier si un visiteur avec le même email est déjà présent
      const existingVisitor = await this.visitorRepository.findByEmailPresent(value.email);
      if (existingVisitor) {
        throw new AppError(
          'Un visiteur avec cet email est déjà enregistré comme présent',
          409
        );
      }

      // Créer le visiteur
      const visitor = await this.visitorRepository.create(value);
      
      logger.info('Visiteur enregistré avec succès', {
        visitorId: visitor.id,
        email: visitor.email,
        societe: visitor.societe
      });

      return visitor;
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement du visiteur', {
        error: error.message,
        visitorData
      });
      throw error;
    }
  }

  /**
   * Enregistrer le départ d'un visiteur
   */
  async checkOut(checkOutData) {
    try {
      // Validation des données
      const { error, value } = Visitor.validateCheckOut(checkOutData);
      if (error) {
        throw new AppError(
          `Données invalides: ${error.details.map(d => d.message).join(', ')}`,
          400
        );
      }

      // Enregistrer le départ
      const visitor = await this.visitorRepository.checkOut(value.email);
      
      logger.info('Visiteur parti avec succès', {
        visitorId: visitor.id,
        email: visitor.email,
        dureeVisite: this.calculateVisitDuration(visitor.heureArrivee, visitor.heureSortie)
      });

      return visitor;
    } catch (error) {
      // Convertir les erreurs du repository en AppError avec le bon status code
      if (error.message === 'Aucune arrivée en cours trouvée pour cet email') {
        throw new AppError(error.message, 404);
      }
      
      logger.error('Erreur lors de l\'enregistrement du départ', {
        error: error.message,
        checkOutData
      });
      throw error;
    }
  }

  /**
   * Obtenir tous les visiteurs
   */
  async getAllVisitors() {
    try {
      return await this.visitorRepository.findAll();
    } catch (error) {
      logger.error('Erreur lors de la récupération des visiteurs', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Obtenir les visiteurs actuellement présents
   */
  async getCurrentVisitors() {
    try {
      return await this.visitorRepository.findCurrentVisitors();
    } catch (error) {
      logger.error('Erreur lors de la récupération des visiteurs actuels', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Obtenir un visiteur par ID
   */
  async getVisitorById(id) {
    try {
      const visitor = await this.visitorRepository.findById(id);
      if (!visitor) {
        throw new AppError('Visiteur non trouvé', 404);
      }
      return visitor;
    } catch (error) {
      logger.error('Erreur lors de la récupération du visiteur', {
        error: error.message,
        id
      });
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des visiteurs
   */
  async getStatistics() {
    try {
      return await this.visitorRepository.getStatistics();
    } catch (error) {
      logger.error('Erreur lors du calcul des statistiques', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Obtenir les visiteurs par période
   */
  async getVisitorsByDateRange(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new AppError('Les dates de début et fin sont requises', 400);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new AppError('La date de début doit être antérieure à la date de fin', 400);
      }

      return await this.visitorRepository.findByDateRange(start, end);
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
   * Anonymiser les visiteurs anciens
   */
  async anonymizeOldVisitors(anonymizationDays) {
    try {
      const count = await this.visitorRepository.anonymizeOldVisitors(anonymizationDays);
      
      logger.info('Anonymisation des visiteurs terminée', {
        anonymizedCount: count,
        anonymizationDays
      });

      return { anonymizedCount: count };
    } catch (error) {
      logger.error('Erreur lors de l\'anonymisation', {
        error: error.message,
        anonymizationDays
      });
      throw error;
    }
  }

  /**
   * Supprimer tous les visiteurs (fonction de debug)
   */
  async clearAllVisitors() {
    try {
      await this.visitorRepository.deleteAll();
      
      logger.warn('Tous les visiteurs ont été supprimés (fonction de debug)');
      
      return { message: 'Tous les visiteurs ont été supprimés' };
    } catch (error) {
      logger.error('Erreur lors de la suppression des visiteurs', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Générer des visiteurs de test répartis sur plusieurs dates
   */
  async generateTestVisitors(count = 10, daysBack = 90) {
    try {
      const testData = [
        { nom: "Martin", prenom: "Jean", societe: "Tech Solutions SARL", personneVisitee: "Marie Dubois" },
        { nom: "Lefebvre", prenom: "Sophie", societe: "Digital Consulting", personneVisitee: "Pierre Moreau" },
        { nom: "Rousseau", prenom: "Thomas", societe: "Innovation Labs", personneVisitee: "Julie Bernard" },
        { nom: "Garcia", prenom: "Maria", societe: "Global Services Inc", personneVisitee: "François Leroy" },
        { nom: "Durand", prenom: "Alexandre", societe: "StartUp360", personneVisitee: "Amélie Roux" },
        { nom: "Dubois", prenom: "Claire", societe: "Consulting Pro", personneVisitee: "Marc Dupont" },
        { nom: "Moreau", prenom: "Nicolas", societe: "WebAgency Plus", personneVisitee: "Sarah Martin" },
        { nom: "Bernard", prenom: "Lisa", societe: "Design Studio", personneVisitee: "Antoine Rousseau" },
        { nom: "Petit", prenom: "David", societe: "Mobile Apps Co", personneVisitee: "Camille Garcia" },
        { nom: "Roux", prenom: "Emma", societe: "Cloud Systems", personneVisitee: "Lucas Durand" },
        { nom: "Fournier", prenom: "Paul", societe: "AI Research Lab", personneVisitee: "Nadia Moreau" },
        { nom: "Girard", prenom: "Julie", societe: "Data Analytics", personneVisitee: "Olivier Petit" },
        { nom: "Bonnet", prenom: "Marc", societe: "Cyber Security", personneVisitee: "Léa Fournier" },
        { nom: "Dupont", prenom: "Sarah", societe: "E-commerce Hub", personneVisitee: "Maxime Girard" },
        { nom: "Lambert", prenom: "Antoine", societe: "Fintech Solutions", personneVisitee: "Clara Bonnet" }
      ];

      const generated = [];
      const now = new Date();
      
      for (let i = 0; i < count; i++) {
        const template = testData[i % testData.length];
        
        // Date d'arrivée aléatoire dans la plage spécifiée
        const randomDaysBack = Math.floor(Math.random() * daysBack);
        const arrivalDate = new Date(now.getTime() - (randomDaysBack * 24 * 60 * 60 * 1000));
        
        // Durée de visite aléatoire (30 min à 8h)
        const visitDurationMs = (30 + Math.random() * 450) * 60 * 1000; // 30 min à 8h
        const departureDate = new Date(arrivalDate.getTime() + visitDurationMs);
        
        // 80% de chance que le visiteur soit parti (pour tester l'anonymisation)
        const hasLeft = Math.random() < 0.8;
        
        const visitorInput = {
          nom: template.nom,
          prenom: template.prenom,
          societe: template.societe,
          email: `${template.prenom.toLowerCase()}.${template.nom.toLowerCase()}@${template.societe.toLowerCase().replace(/\s+/g, '')}.com`,
          telephone: `0${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 90000000) + 10000000}`,
          personneVisitee: template.personneVisitee
        };

        // Valider les données d'entrée
        const { error } = Visitor.validateCheckIn(visitorInput);
        if (!error) {
          // Créer le visiteur avec toutes les données (y compris les dates)
          const visitorData = {
            ...visitorInput,
            heureArrivee: arrivalDate.toISOString(),
            heureSortie: hasLeft ? departureDate.toISOString() : null,
            statut: hasLeft ? 'parti' : 'present'
          };
          
          const newVisitor = new Visitor(visitorData);
          await this.visitorRepository.create(newVisitor);
          generated.push(visitorData);
        } else {
          // Log l'erreur pour debug
          logger.warn('Erreur de validation pour visiteur de test', {
            visitorInput,
            error: error.details?.map(d => d.message) || error.message
          });
        }
      }

      logger.info('Visiteurs de test générés', {
        generated: generated.length,
        count,
        daysBack
      });

      return {
        generated: generated.length,
        requested: count,
        daysBack,
        preview: generated.slice(0, 3) // Aperçu des 3 premiers
      };
    } catch (error) {
      logger.error('Erreur lors de la génération de visiteurs de test', {
        error: error.message,
        count,
        daysBack
      });
      throw error;
    }
  }

  /**
   * Calculer la durée d'une visite
   */
  calculateVisitDuration(heureArrivee, heureSortie) {
    if (!heureArrivee || !heureSortie) return null;

    const arrival = new Date(heureArrivee);
    const departure = new Date(heureSortie);
    const durationMs = departure - arrival;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  /**
   * Obtenir un rapport de visite détaillé
   */
  async getVisitReport(visitorId) {
    try {
      const visitor = await this.getVisitorById(visitorId);
      
      return {
        ...visitor.toJSON(),
        dureeVisite: this.calculateVisitDuration(visitor.heureArrivee, visitor.heureSortie),
        statut: visitor.heureSortie ? 'Terminée' : 'En cours'
      };
    } catch (error) {
      logger.error('Erreur lors de la génération du rapport de visite', {
        error: error.message,
        visitorId
      });
      throw error;
    }
  }
}

module.exports = VisitorService;