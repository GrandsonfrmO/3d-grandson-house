# Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet ! Ce guide vous aidera à démarrer.

## 🚀 Avant de commencer

1. Fork le repository
2. Cloner votre fork : `git clone https://github.com/your-username/react-email-shop.git`
3. Ajouter le remote upstream : `git remote add upstream https://github.com/original-owner/react-email-shop.git`
4. Créer une branche : `git checkout -b feature/your-feature-name`

## 📋 Processus de contribution

### 1. Développement

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Démarrer le développement
npm run dev
npm run server  # Dans un autre terminal
```

### 2. Code Style

- Utiliser TypeScript pour tout le code
- Suivre les conventions ESLint
- Formater avec Prettier
- Ajouter des commentaires pour le code complexe

### 3. Tests

```bash
# Exécuter les tests
npm run test

# Tests en mode watch
npm run test:watch

# Vérifier les types
npm run lint
```

### 4. Commits

Utiliser des messages de commit clairs et descriptifs :

```
feat: Add new feature
fix: Fix bug in component
docs: Update README
style: Format code
refactor: Refactor module
test: Add tests
chore: Update dependencies
```

### 5. Pull Request

1. Mettre à jour votre branche avec main : `git pull upstream main`
2. Pousser vos changements : `git push origin feature/your-feature-name`
3. Ouvrir une PR sur GitHub
4. Remplir le template de PR
5. Attendre la review

## 📝 Template de Pull Request

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de breaking changes
- [ ] Code formaté
- [ ] Linting OK

## Screenshots (si applicable)
Ajouter des screenshots pour les changements UI
```

## 🐛 Signaler un bug

1. Vérifier que le bug n'existe pas déjà
2. Ouvrir une issue avec le template bug
3. Inclure :
   - Description claire du bug
   - Étapes pour reproduire
   - Comportement attendu
   - Comportement actuel
   - Environnement (OS, Node version, etc.)

## 💡 Proposer une fonctionnalité

1. Ouvrir une issue avec le template feature
2. Décrire la fonctionnalité
3. Expliquer le cas d'usage
4. Attendre le feedback avant de commencer

## 📚 Structure du code

```
src/
├── api/              # Endpoints API
├── components/       # Composants React
├── hooks/            # Hooks personnalisés
├── i18n/             # Traductions
├── services/         # Services
├── monitoring/       # Monitoring
└── store.ts          # État global
```

## 🔍 Checklist avant de soumettre

- [ ] Code testé localement
- [ ] Tests passent : `npm run test`
- [ ] Linting OK : `npm run lint`
- [ ] Build OK : `npm run build`
- [ ] Pas de console.log en production
- [ ] Pas de secrets dans le code
- [ ] Documentation mise à jour
- [ ] Commit messages clairs

## 📞 Questions ?

- Ouvrir une discussion sur GitHub
- Contacter les mainteneurs
- Consulter la documentation

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

Merci de votre contribution ! 🎉
