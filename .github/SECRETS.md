# Configuration des Secrets GitHub

Ce fichier documente les secrets à configurer dans GitHub pour le déploiement automatique.

## 📋 Secrets requis

### Pour Vercel
- `VERCEL_TOKEN` - Token d'authentification Vercel
- `VERCEL_ORG_ID` - ID de l'organisation Vercel
- `VERCEL_PROJECT_ID` - ID du projet Vercel

### Pour Railway
- `RAILWAY_TOKEN` - Token d'authentification Railway (optionnel, Railway se connecte via GitHub)

### Pour Heroku
- `HEROKU_API_KEY` - Clé API Heroku
- `HEROKU_APP_NAME` - Nom de l'application Heroku

### Pour AWS
- `AWS_ACCESS_KEY_ID` - Clé d'accès AWS
- `AWS_SECRET_ACCESS_KEY` - Clé secrète AWS
- `AWS_REGION` - Région AWS (ex: us-east-1)

### Variables d'environnement de production
- `DATABASE_URL` - URL de connexion PostgreSQL
- `JWT_SECRET` - Clé secrète JWT
- `GEMINI_API_KEY` - Clé API Gemini
- `RESEND_API_KEY` - Clé API Resend
- `ADMIN_USERNAME` - Nom d'utilisateur admin
- `ADMIN_PASSWORD` - Mot de passe admin

## 🔐 Comment ajouter les secrets

1. Aller sur GitHub → Settings → Secrets and variables → Actions
2. Cliquer "New repository secret"
3. Ajouter le nom et la valeur
4. Cliquer "Add secret"

## ⚠️ Sécurité

- Ne jamais commiter les secrets
- Utiliser des valeurs différentes pour chaque environnement
- Rotationner régulièrement les clés
- Utiliser des tokens avec permissions minimales
- Auditer l'accès aux secrets

## 🔄 Rotation des secrets

Recommandé tous les 90 jours :

1. Générer une nouvelle clé
2. Ajouter le nouveau secret dans GitHub
3. Mettre à jour la plateforme de déploiement
4. Supprimer l'ancien secret

## 📝 Exemple de configuration

```yaml
# .github/workflows/deploy.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
```

## 🆘 Troubleshooting

### Secret non trouvé
- Vérifier le nom exact du secret
- Vérifier que le secret est dans le bon repository
- Vérifier les permissions du workflow

### Déploiement échoue
- Vérifier que tous les secrets requis sont configurés
- Vérifier les logs du workflow
- Vérifier que les valeurs sont correctes

## 📞 Support

Pour les problèmes de secrets, consulter la documentation GitHub :
https://docs.github.com/en/actions/security-guides/encrypted-secrets
