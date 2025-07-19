const VisitorService = require('../services/VisitorService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Controller pour la gestion des visiteurs
 */
class VisitorController {
  constructor() {
    this.visitorService = new VisitorService();
  }

  /**
   * Enregistrer l'arrivée d'un visiteur
   * POST /api/visitors/check-in
   */
  checkIn = asyncHandler(async (req, res) => {
    const visitor = await this.visitorService.checkIn(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Visiteur enregistré avec succès',
      data: visitor
    });
  });

  /**
   * Enregistrer le départ d'un visiteur
   * POST /api/visitors/check-out
   */
  checkOut = asyncHandler(async (req, res) => {
    const visitor = await this.visitorService.checkOut(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Départ enregistré avec succès',
      data: visitor
    });
  });

  /**
   * Obtenir tous les visiteurs
   * GET /api/visitors
   */
  getAllVisitors = asyncHandler(async (req, res) => {
    const visitors = await this.visitorService.getAllVisitors();
    
    res.status(200).json({
      success: true,
      data: visitors,
      count: visitors.length
    });
  });

  /**
   * Obtenir les visiteurs actuellement présents
   * GET /api/visitors/current
   */
  getCurrentVisitors = asyncHandler(async (req, res) => {
    const visitors = await this.visitorService.getCurrentVisitors();
    
    res.status(200).json({
      success: true,
      data: visitors,
      count: visitors.length
    });
  });

  /**
   * Obtenir un visiteur par ID
   * GET /api/visitors/:id
   */
  getVisitorById = asyncHandler(async (req, res) => {
    const visitor = await this.visitorService.getVisitorById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  });

  /**
   * Obtenir les statistiques des visiteurs
   * GET /api/visitors/stats
   */
  getStatistics = asyncHandler(async (req, res) => {
    const stats = await this.visitorService.getStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  });

  /**
   * Obtenir les visiteurs par période
   * GET /api/visitors/range?startDate=...&endDate=...
   */
  getVisitorsByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const visitors = await this.visitorService.getVisitorsByDateRange(startDate, endDate);
    
    res.status(200).json({
      success: true,
      data: visitors,
      count: visitors.length,
      period: { startDate, endDate }
    });
  });

  /**
   * Obtenir un rapport de visite détaillé
   * GET /api/visitors/:id/report
   */
  getVisitReport = asyncHandler(async (req, res) => {
    const report = await this.visitorService.getVisitReport(req.params.id);
    
    res.status(200).json({
      success: true,
      data: report
    });
  });

  /**
   * Anonymiser les visiteurs anciens
   * POST /api/visitors/anonymize
   */
  anonymizeOldVisitors = asyncHandler(async (req, res) => {
    const { anonymizationDays } = req.body;
    const result = await this.visitorService.anonymizeOldVisitors(anonymizationDays);
    
    res.status(200).json({
      success: true,
      message: 'Anonymisation terminée',
      data: result
    });
  });

  /**
   * Supprimer tous les visiteurs (fonction de debug)
   * DELETE /api/visitors/clear
   */
  clearAllVisitors = asyncHandler(async (req, res) => {
    const result = await this.visitorService.clearAllVisitors();
    
    res.status(200).json({
      success: true,
      message: 'Liste des visiteurs vidée avec succès',
      data: result
    });
  });

  /**
   * Générer des visiteurs de test (debug uniquement)
   * POST /api/visitors/generate-test
   */
  generateTestVisitors = asyncHandler(async (req, res) => {
    const { count = 10, daysBack = 90 } = req.body;
    const result = await this.visitorService.generateTestVisitors(count, daysBack);
    
    res.status(200).json({
      success: true,
      message: `${result.generated} visiteurs de test générés`,
      data: result
    });
  });
}

module.exports = VisitorController;