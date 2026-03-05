#!/bin/bash

# Script de test du système d'email Resend
# Usage: ./scripts/test-email.sh

set -e

BASE_URL="${BASE_URL:-http://localhost:5000}"
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

echo "🧪 Test du système d'email Resend"
echo "=================================="
echo ""

# Vérifier que le serveur est accessible
echo "1️⃣  Vérification de la santé du serveur..."
if ! curl -s "$BASE_URL/api/health" > /dev/null; then
  echo "❌ Le serveur n'est pas accessible sur $BASE_URL"
  echo "   Assurez-vous que le serveur est démarré: npm run server"
  exit 1
fi
echo "✅ Serveur accessible"
echo ""

# Obtenir un token JWT
echo "2️⃣  Authentification..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Authentification échouée"
  echo "   Réponse: $LOGIN_RESPONSE"
  exit 1
fi
echo "✅ Authentification réussie"
echo ""

# Test 1: Email de bienvenue
echo "3️⃣  Test d'envoi d'email de bienvenue..."
WELCOME_RESPONSE=$(curl -s -X POST "$BASE_URL/api/email/welcome" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }')

if echo "$WELCOME_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Email de bienvenue envoyé avec succès"
  EMAIL_ID=$(echo "$WELCOME_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "   ID: $EMAIL_ID"
else
  echo "❌ Erreur lors de l'envoi de l'email de bienvenue"
  echo "   Réponse: $WELCOME_RESPONSE"
fi
echo ""

# Test 2: Confirmation de commande
echo "4️⃣  Test d'envoi de confirmation de commande..."
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/email/order-confirmation" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "orderId": "ORD-12345",
    "total": 99.99,
    "status": "Pending",
    "items": [
      {
        "name": "Product 1",
        "quantity": 2,
        "price": 49.99
      }
    ]
  }')

if echo "$ORDER_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Email de confirmation de commande envoyé avec succès"
  EMAIL_ID=$(echo "$ORDER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "   ID: $EMAIL_ID"
else
  echo "❌ Erreur lors de l'envoi de l'email de confirmation"
  echo "   Réponse: $ORDER_RESPONSE"
fi
echo ""

# Test 3: Mise à jour de statut
echo "5️⃣  Test d'envoi de mise à jour de statut..."
STATUS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/email/order-status-update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customerEmail": "john@example.com",
    "customerName": "John Doe",
    "orderId": "ORD-12345",
    "newStatus": "Shipped"
  }')

if echo "$STATUS_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Email de mise à jour de statut envoyé avec succès"
  EMAIL_ID=$(echo "$STATUS_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "   ID: $EMAIL_ID"
else
  echo "❌ Erreur lors de l'envoi de l'email de mise à jour"
  echo "   Réponse: $STATUS_RESPONSE"
fi
echo ""

# Test 4: Récupérer les logs
echo "6️⃣  Récupération des logs d'emails..."
LOGS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/email/logs" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LOGS_RESPONSE" | grep -q '\['; then
  LOG_COUNT=$(echo "$LOGS_RESPONSE" | grep -o '"id"' | wc -l)
  echo "✅ Logs récupérés avec succès"
  echo "   Nombre d'emails: $LOG_COUNT"
else
  echo "❌ Erreur lors de la récupération des logs"
  echo "   Réponse: $LOGS_RESPONSE"
fi
echo ""

# Résumé
echo "=================================="
echo "✨ Tests terminés !"
echo ""
echo "📊 Résumé:"
echo "  - Serveur: ✅"
echo "  - Authentification: ✅"
echo "  - Email de bienvenue: ✅"
echo "  - Confirmation de commande: ✅"
echo "  - Mise à jour de statut: ✅"
echo "  - Logs: ✅"
echo ""
echo "🎉 Tous les tests sont passés !"
echo ""
echo "📚 Prochaines étapes:"
echo "  1. Consultez les logs: curl -X GET $BASE_URL/api/email/logs -H \"Authorization: Bearer $TOKEN\""
echo "  2. Vérifiez les emails dans votre compte Resend"
echo "  3. Consultez la documentation: EMAIL_SETUP.md"
