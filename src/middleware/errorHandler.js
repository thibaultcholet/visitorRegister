const logger = require('../utils/logger');

/**
 * Classe pour les erreurs métier
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  logger.logApiError(err, req, res);

  // Erreur de validation Joi
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = new AppError(message, 400);
  }

  // Erreur de JSON malformé
  if (err.type === 'entity.parse.failed') {
    error = new AppError('Données JSON invalides', 400);
  }

  // Erreur de fichier non trouvé
  if (err.code === 'ENOENT') {
    error = new AppError('Fichier non trouvé', 404);
  }

  // Erreur de permission
  if (err.code === 'EACCES') {
    error = new AppError('Permissions insuffisantes', 403);
  }

  // Erreur de multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('Fichier trop volumineux', 400);
  }

  // Erreur d'authentification
  if (err.name === 'UnauthorizedError') {
    error = new AppError('Non autorisé', 401);
  }

  // Erreur par défaut
  if (!error.statusCode) {
    error = new AppError('Erreur interne du serveur', 500);
  }

  // Réponse d'erreur
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Erreur interne du serveur',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Middleware pour les routes non trouvées
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route non trouvée: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Wrapper pour les fonctions async
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};