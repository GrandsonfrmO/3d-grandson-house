# Script de configuration de la base de données PostgreSQL pour Windows

Write-Host "🚀 Configuration de la base de données PostgreSQL..." -ForegroundColor Green
Write-Host ""

# Vérifier si PostgreSQL est installé
try {
    $psqlVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL trouvé: $psqlVersion" -ForegroundColor Green
    } else {
        throw "PostgreSQL non trouvé"
    }
} catch {
    Write-Host "❌ PostgreSQL n'est pas installé" -ForegroundColor Red
    Write-Host "Veuillez installer PostgreSQL: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Créer la base de données
Write-Host "📦 Création de la base de données 'grandson_db'..." -ForegroundColor Cyan

# Essayer de créer la base de données
$output = psql -U postgres -c "CREATE DATABASE grandson_db;" 2>&1

if ($LASTEXITCODE -eq 0 -or $output -like "*already exists*") {
    Write-Host "✅ Base de données créée avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors de la création: $output" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Vérifier que le .env contient:" -ForegroundColor White
Write-Host "   DATABASE_URL=postgresql://postgres:password@localhost:5432/grandson_db" -ForegroundColor Yellow
Write-Host "2. Démarrer le serveur: npm run dev" -ForegroundColor White
Write-Host ""
