# Guide de Déploiement

Ce guide couvre le déploiement de l'application sur différentes plateformes.

## 📋 Prérequis généraux

- Code pushé sur GitHub
- Variables d'environnement configurées
- Base de données en production
- Clés API (Gemini, Resend)

## 🚀 Déploiement sur Vercel

### Frontend uniquement (recommandé pour Vercel)

1. **Connecter le repository**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "New Project"
   - Importer votre repository GitHub

2. **Configurer les variables d'environnement**
   - Aller dans Settings → Environment Variables
   - Ajouter :
     ```
     VITE_LANGUAGE=fr
     VITE_CURRENCY=GNF
     VITE_API_URL=https://your-backend.com
     ```

3. **Configurer la build**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Déployer**
   - Vercel déploiera automatiquement à chaque push sur main

### Backend sur Vercel (avec serverless functions)

Pour le backend, utiliser une autre plateforme (voir ci-dessous).

---

## 🚀 Déploiement sur Heroku

### 1. Préparer l'application

```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer une app
heroku create your-app-name
```

### 2. Configurer les variables d'environnement

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set GEMINI_API_KEY="your-key"
heroku config:set RESEND_API_KEY="your-key"
heroku config:set ADMIN_USERNAME="admin"
heroku config:set ADMIN_PASSWORD="your-password"
```

### 3. Configurer la base de données

```bash
# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Initialiser la base de données
heroku run npm run setup-db
heroku run npm run seed
```

### 4. Déployer

```bash
git push heroku main
```

### 5. Vérifier les logs

```bash
heroku logs --tail
```

---

## 🚀 Déploiement sur Railway

### 1. Connecter le repository

- Aller sur [railway.app](https://railway.app)
- Cliquer "New Project"
- Sélectionner "Deploy from GitHub repo"
- Autoriser et sélectionner votre repository

### 2. Ajouter PostgreSQL

- Cliquer "Add Service"
- Sélectionner "PostgreSQL"
- Railway créera automatiquement `DATABASE_URL`

### 3. Configurer les variables d'environnement

Dans le dashboard Railway :
- Aller dans Variables
- Ajouter toutes les variables de `.env.production.example`

### 4. Configurer la build

- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 5. Déployer

Railway déploiera automatiquement à chaque push.

---

## 🚀 Déploiement sur AWS

### Option 1: Elastic Beanstalk

```bash
# Installer EB CLI
pip install awsebcli

# Initialiser
eb init -p node.js-18 your-app-name

# Créer l'environnement
eb create production

# Configurer les variables
eb setenv NODE_ENV=production JWT_SECRET="..." DATABASE_URL="..."

# Déployer
eb deploy
```

### Option 2: EC2 + RDS

1. **Créer une instance EC2**
   - AMI: Ubuntu 22.04
   - Type: t3.micro (free tier)

2. **Installer les dépendances**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql-client
   ```

3. **Cloner et configurer**
   ```bash
   git clone your-repo
   cd your-repo
   npm install
   cp .env.production.example .env
   # Éditer .env avec les valeurs
   ```

4. **Créer une base de données RDS**
   - Engine: PostgreSQL
   - Configurer `DATABASE_URL` dans `.env`

5. **Démarrer l'application**
   ```bash
   npm run build
   npm start
   ```

---

## 🚀 Déploiement sur DigitalOcean

### 1. Créer un Droplet

- Aller sur [digitalocean.com](https://www.digitalocean.com)
- Créer un Droplet (Ubuntu 22.04, $5/mois)

### 2. Se connecter et installer

```bash
ssh root@your-droplet-ip

# Mettre à jour
apt update && apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Installer PostgreSQL
apt install -y postgresql postgresql-contrib

# Installer Nginx (reverse proxy)
apt install -y nginx
```

### 3. Configurer PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE your_app;
CREATE USER your_user WITH PASSWORD 'your_password';
ALTER ROLE your_user SET client_encoding TO 'utf8';
ALTER ROLE your_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE your_user SET default_transaction_deferrable TO on;
ALTER ROLE your_user SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE your_app TO your_user;
\q
```

### 4. Cloner et configurer l'application

```bash
cd /var/www
git clone your-repo
cd your-repo
npm install
cp .env.production.example .env
# Éditer .env
npm run build
```

### 5. Configurer Nginx

Créer `/etc/nginx/sites-available/your-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. Configurer PM2 (process manager)

```bash
npm install -g pm2
pm2 start npm --name "your-app" -- start
pm2 startup
pm2 save
```

### 7. Configurer SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 🐳 Déploiement avec Docker

### 1. Construire l'image

```bash
docker build -t your-app:latest .
```

### 2. Exécuter le conteneur

```bash
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  -e GEMINI_API_KEY="your-key" \
  -e RESEND_API_KEY="your-key" \
  --name your-app \
  your-app:latest
```

### 3. Avec Docker Compose

```bash
docker-compose up -d
```

---

## 📊 Monitoring et Logs

### Heroku
```bash
heroku logs --tail
```

### Railway
Dashboard → Logs

### DigitalOcean
```bash
pm2 logs
```

### Docker
```bash
docker logs -f your-app
```

---

## 🔄 CI/CD avec GitHub Actions

Voir `.github/workflows/deploy.yml` pour l'automatisation du déploiement.

---

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée
- [ ] Build testée localement (`npm run build`)
- [ ] Tests passent (`npm run test`)
- [ ] Linting OK (`npm run lint`)
- [ ] Domaine configuré
- [ ] SSL/HTTPS activé
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Logs configurés

---

## 🆘 Troubleshooting

### Erreur de connexion à la base de données
```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL
```

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=5001
```

### Erreur de build
```bash
# Nettoyer et reconstruire
npm run clean
npm install
npm run build
```

### Problèmes de mémoire
```bash
# Augmenter la limite Node.js
NODE_OPTIONS=--max-old-space-size=2048 npm start
```

---

## 📞 Support

Pour les problèmes de déploiement, consultez la documentation officielle de votre plateforme.
