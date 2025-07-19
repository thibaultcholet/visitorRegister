#!/usr/bin/env node

/**
 * Script d'initialisation pour le Système de Gestion des Visiteurs
 * Ce script configure l'application pour son premier démarrage
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Initialisation du Système de Gestion des Visiteurs...\n');

// Définir les chemins
const dataDir = path.join(__dirname, '..', 'data');
const logsDir = path.join(__dirname, '..', 'logs');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Fichiers à créer
const configFile = path.join(dataDir, 'config.json');
const visitorsFile = path.join(dataDir, 'visitors.json');
const configExample = path.join(dataDir, 'config.example.json');
const visitorsExample = path.join(dataDir, 'visitors.example.json');

/**
 * Crée un dossier s'il n'existe pas
 */
function ensureDirectoryExists(dirPath, description) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Dossier créé: ${description} (${dirPath})`);
    } else {
        console.log(`✅ Dossier existant: ${description} (${dirPath})`);
    }
}

/**
 * Copie un fichier d'exemple s'il n'existe pas
 */
function copyExampleFile(examplePath, targetPath, description) {
    if (!fs.existsSync(targetPath)) {
        if (fs.existsSync(examplePath)) {
            fs.copyFileSync(examplePath, targetPath);
            console.log(`✅ Fichier créé: ${description} (${path.basename(targetPath)})`);
        } else {
            console.log(`⚠️  Fichier d'exemple manquant: ${examplePath}`);
        }
    } else {
        console.log(`✅ Fichier existant: ${description} (${path.basename(targetPath)})`);
    }
}

/**
 * Crée le fichier de logo par défaut
 */
function createDefaultLogo() {
    const logoPath = path.join(imagesDir, 'logo.png');
    if (!fs.existsSync(logoPath)) {
        // Créer un fichier placeholder pour le logo
        const placeholderPath = path.join(imagesDir, '.gitkeep');
        fs.writeFileSync(placeholderPath, '# Ce dossier contient les images uploadées par les utilisateurs\n');
        console.log('✅ Placeholder créé pour le dossier images');
        console.log('ℹ️  Ajoutez votre logo d\'entreprise dans public/images/logo.png');
    } else {
        console.log('✅ Logo existant trouvé');
    }
}

try {
    // Créer les dossiers nécessaires
    console.log('📁 Création des dossiers...');
    ensureDirectoryExists(dataDir, 'Dossier de données');
    ensureDirectoryExists(logsDir, 'Dossier de logs');
    ensureDirectoryExists(imagesDir, 'Dossier d\'images');

    console.log('\n📄 Copie des fichiers de configuration...');
    // Copier les fichiers d'exemple
    copyExampleFile(configExample, configFile, 'Configuration principale');
    copyExampleFile(visitorsExample, visitorsFile, 'Base de données des visiteurs');

    console.log('\n🖼️  Configuration du logo...');
    createDefaultLogo();

    console.log('\n✅ Initialisation terminée avec succès !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Personnalisez votre configuration dans data/config.json');
    console.log('2. Ajoutez votre logo dans public/images/logo.png');
    console.log('3. Démarrez l\'application avec: npm start');
    console.log('4. Connectez-vous à l\'admin avec le code PIN: 123456');
    console.log('5. Changez le code PIN par défaut depuis l\'interface admin');
    
    console.log('\n🔐 Sécurité:');
    console.log('- Le code PIN par défaut est 123456 (CHANGEZ-LE!)');
    console.log('- Les données sensibles sont exclues du versioning Git');
    console.log('- Consultez le README.md pour plus d\'informations');

} catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
}