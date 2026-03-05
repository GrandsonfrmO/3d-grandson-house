#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Configuration de la base de données PostgreSQL...\n');

// Vérifier si PostgreSQL est installé
exec('psql --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ PostgreSQL n\'est pas installé');
    console.log('Veuillez installer PostgreSQL: https://www.postgresql.org/download/\n');
    process.exit(1);
  }

  console.log('✅ PostgreSQL trouvé:', stdout.trim());
  console.log('');

  // Créer la base de données
  console.log('📦 Création de la base de données "grandson_db"...');
  
  exec('psql -U postgres -c "CREATE DATABASE grandson_db;"', (error, stdout, stderr) => {
    if (error && !stderr.includes('already exists')) {
      console.log('❌ Erreur lors de la création:', error.message);
      process.exit(1);
    }

    if (stderr.includes('already exists')) {
      console.log('⚠️  La base de données existe déjà');
    } else {
      console.log('✅ Base de données créée avec succès');
    }

    console.log('');
    console.log('✅ Configuration terminée!\n');
    console.log('📝 Prochaines étapes:');
    console.log('1. Vérifier que le .env contient:');
    console.log('   DATABASE_URL=postgresql://postgres:password@localhost:5432/grandson_db');
    console.log('2. Démarrer le serveur: npm run dev\n');
  });
});
