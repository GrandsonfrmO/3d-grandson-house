#!/bin/bash

# Script de configuration de la base de données PostgreSQL

echo "🚀 Configuration de la base de données PostgreSQL..."
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé"
    echo "Veuillez installer PostgreSQL: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL trouvé"
echo ""

# Créer la base de données
echo "📦 Création de la base de données 'grandson_db'..."
psql -U postgres -c "CREATE DATABASE grandson_db;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Base de données créée avec succès"
else
    echo "⚠️  La base de données existe peut-être déjà"
fi

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Vérifier que le .env contient:"
echo "   DATABASE_URL=postgresql://postgres:password@localhost:5432/grandson_db"
echo "2. Démarrer le serveur: npm run dev"
echo ""
