# Configuration GitHub

Ce dossier contient la configuration GitHub pour le projet, incluant les workflows CI/CD, les templates et les configurations.

## 📁 Structure

```
.github/
├── workflows/           # Workflows GitHub Actions
│   ├── ci.yml          # Pipeline CI/CD principal
│   ├── test.yml        # Tests automatisés
│   ├── lint.yml        # Linting et formatage
│   ├── security.yml    # Vérifications de sécurité
│   ├── deploy.yml      # Déploiement
│   ├── release.yml     # Gestion des releases
│   ├── docs.yml        # Documentation
│   ├── performance.yml # Analyse de performance
│   └── ...
├── ISSUE_TEMPLATE/     # Templates pour les issues
│   ├── bug_report.md
│   └── feature_request.md
├── pull_request_template.md  # Template pour les PRs
├── CODEOWNERS          # Propriétaires du code
├── dependabot.yml      # Configuration Dependabot
├── labels.yml          # Labels pour les issues
└── SECRETS.md          # Documentation des secrets
```

## 🔄 Workflows

### CI/CD Principal (`ci.yml`)
- Tests unitaires
- Linting
- Build
- Vérifications de sécurité
- Déploiement automatique

### Tests (`test.yml`)
- Tests unitaires
- Tests d'intégration
- Tests E2E
- Vérification des types
- Couverture de code

### Linting (`lint.yml`)
- Vérification TypeScript
- Formatage du code
- Détection de console.log
- Détection de secrets

### Sécurité (`security.yml`)
- Audit npm
- Scan de secrets
- CodeQL
- Vérification des licences
- Scan des conteneurs Docker

### Déploiement (`deploy.yml`)
- Déploiement sur Vercel
- Déploiement sur Railway
- Vérifications de santé

### Release (`release.yml`)
- Création de releases
- Publication sur npm
- Déploiement en production

## 🔐 Secrets requis

Voir [SECRETS.md](./SECRETS.md) pour la liste complète des secrets à configurer.

## 📝 Templates

### Issues
- Bug Report: `.github/ISSUE_TEMPLATE/bug_report.md`
- Feature Request: `.github/ISSUE_TEMPLATE/feature_request.md`

### Pull Requests
- Template: `.github/pull_request_template.md`

## 🏷️ Labels

Les labels sont définis dans `labels.yml` et incluent :
- `bug` - Bugs
- `enhancement` - Nouvelles fonctionnalités
- `documentation` - Documentation
- `priority-high/medium/low` - Priorité
- `type-frontend/backend/database/devops` - Type
- `status-in-progress/review/blocked` - Statut

## 👥 Code Owners

Le fichier `CODEOWNERS` définit les propriétaires du code pour chaque partie du projet. Les PRs demandent automatiquement une review des propriétaires.

## 🤖 Dependabot

`dependabot.yml` configure les mises à jour automatiques des dépendances :
- npm
- GitHub Actions
- Docker

## 🚀 Utilisation

### Déclencher un workflow manuellement

1. Aller sur GitHub → Actions
2. Sélectionner le workflow
3. Cliquer "Run workflow"

### Voir les logs

1. Aller sur GitHub → Actions
2. Cliquer sur le workflow
3. Cliquer sur le job pour voir les logs

### Configurer les secrets

1. Aller sur GitHub → Settings → Secrets and variables → Actions
2. Cliquer "New repository secret"
3. Ajouter le nom et la valeur

## 📚 Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🆘 Troubleshooting

### Workflow ne s'exécute pas
- Vérifier que le workflow est activé
- Vérifier les conditions `on:`
- Vérifier les logs

### Secrets non trouvés
- Vérifier le nom exact du secret
- Vérifier que le secret est dans le bon repository
- Vérifier les permissions

### Déploiement échoue
- Vérifier les logs du workflow
- Vérifier que tous les secrets sont configurés
- Vérifier que la build réussit localement

## 📞 Support

Pour les problèmes avec GitHub Actions, consulter la documentation officielle :
https://docs.github.com/en/actions
