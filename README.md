# React Email & Shop Application

Une application full-stack moderne construite avec React, Express, PostgreSQL et Gemini AI. Inclut un système d'administration, un shop, des mini-jeux et un système d'email.

## 🚀 Fonctionnalités

- **Admin Dashboard** - Gestion des produits, commandes et paramètres
- **Shop** - Système de boutique avec panier et checkout
- **Mini-Games** - Jeux interactifs intégrés
- **Email Service** - Système d'email avec Resend
- **Gemini AI** - Intégration avec l'API Gemini
- **Authentification JWT** - Sécurité des endpoints admin
- **Multilingue** - Support du français et autres langues
- **3D Graphics** - Utilisation de Three.js et React Three Fiber

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn
- Clés API (Gemini, Resend)

## 🔧 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/yourusername/react-email-shop.git
cd react-email-shop
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-key"
RESEND_API_KEY="your-resend-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
```

### 4. Initialiser la base de données
```bash
npm run setup-db
npm run seed
```

## 🏃 Démarrage

### Mode développement
```bash
# Terminal 1 - Frontend (Vite)
npm run dev

# Terminal 2 - Backend (Express)
npm run server
```

L'application sera disponible sur `http://localhost:3000`

### Mode production
```bash
npm run build
npm start
```

## 📦 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer le serveur Vite (frontend) |
| `npm run server` | Démarrer le serveur Express (backend) |
| `npm run build` | Construire pour la production |
| `npm run preview` | Prévisualiser la build production |
| `npm run setup-db` | Initialiser la base de données |
| `npm run seed` | Remplir la base de données avec des données de test |
| `npm run lint` | Vérifier les types TypeScript |
| `npm run test` | Exécuter les tests |
| `npm run test:watch` | Exécuter les tests en mode watch |

## 📚 Structure du projet

```
├── src/
│   ├── api/              # Endpoints API
│   ├── components/       # Composants React
│   ├── hooks/            # Hooks personnalisés
│   ├── i18n/             # Traductions et localisation
│   ├── services/         # Services (email, etc.)
│   ├── monitoring/       # Monitoring et logs
│   ├── App.tsx           # Composant principal
│   └── store.ts          # État global (Zustand)
├── scripts/              # Scripts d'initialisation
├── tests/                # Tests unitaires
├── server.ts             # Serveur Express
└── vite.config.ts        # Configuration Vite
```

## 🔐 Sécurité

- Les variables sensibles sont dans `.env` (non versionné)
- JWT pour l'authentification admin
- CORS configuré pour les domaines autorisés
- Validation des entrées sur le backend

## 🚀 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur :
- Vercel
- Heroku
- Railway
- AWS
- DigitalOcean

## 📝 Variables d'environnement

### Développement
Copier `.env.example` vers `.env` et configurer les valeurs locales.

### Production
Voir `.env.production.example` pour les variables requises en production.

## 🧪 Tests

```bash
# Exécuter tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test -- --coverage
```

## 📧 Configuration Email

L'application utilise [Resend](https://resend.com) pour l'email.

1. Créer un compte sur Resend
2. Obtenir votre clé API
3. Configurer `RESEND_API_KEY` et `RESEND_FROM_EMAIL` dans `.env`

## 🤖 Gemini AI

L'application intègre l'API Gemini pour les fonctionnalités IA.

1. Créer un projet sur [Google AI Studio](https://aistudio.google.com)
2. Obtenir votre clé API
3. Configurer `GEMINI_API_KEY` dans `.env`

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 📞 Support

Pour les questions ou problèmes, veuillez ouvrir une [issue](https://github.com/yourusername/react-email-shop/issues).

## 🙏 Remerciements

- [React](https://react.dev)
- [Express](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Three.js](https://threejs.org)
