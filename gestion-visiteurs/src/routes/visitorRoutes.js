const express = require('express');
const VisitorController = require('../controllers/VisitorController');
const { strictLimiter } = require('../middleware/security');

const router = express.Router();
const visitorController = new VisitorController();

/**
 * Routes publiques pour les visiteurs
 */

// Enregistrer l'arrivée d'un visiteur
router.post('/check-in', strictLimiter, visitorController.checkIn);

// Enregistrer le départ d'un visiteur
router.post('/check-out', strictLimiter, visitorController.checkOut);

/**
 * Routes pour les statistiques publiques (si nécessaire)
 */

// Obtenir les statistiques des visiteurs
router.get('/stats', visitorController.getStatistics);

/**
 * Routes administratives pour la gestion des visiteurs
 */

// Obtenir tous les visiteurs
router.get('/', visitorController.getAllVisitors);

// Obtenir les visiteurs actuellement présents
router.get('/current', visitorController.getCurrentVisitors);

// Obtenir les visiteurs par période
router.get('/range', visitorController.getVisitorsByDateRange);

// Obtenir un visiteur par ID
router.get('/:id', visitorController.getVisitorById);

// Obtenir un rapport de visite détaillé
router.get('/:id/report', visitorController.getVisitReport);

// Anonymiser les visiteurs anciens
router.post('/anonymize', visitorController.anonymizeOldVisitors);

// Supprimer tous les visiteurs (fonction de debug)
router.delete('/clear', visitorController.clearAllVisitors);

module.exports = router;