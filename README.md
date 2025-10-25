# 🎯 Antidote Dashboard

> **Plateforme de gestion RH et recrutement nouvelle génération**

Une solution complète et moderne pour optimiser vos processus de recrutement, gérer votre vivier de talents et automatiser vos tâches RH grâce à l'intelligence artificielle.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.75.1-green?style=flat-square&logo=supabase)

## ✨ Fonctionnalités principales

### 🏢 **Gestion d'entreprise**

- **Mandats de recrutement** : Création, suivi et gestion complète des postes à pourvoir
- **Base clients** : Gestion centralisée des entreprises clientes et prospects
- **Suivi des candidatures** : Pipeline de recrutement avec étapes personnalisables

### 👥 **Vivier de talents**

- **Base de données candidats** : Profils détaillés avec CV, expériences et formations
- **Analyse IA** : Scoring automatique et recommandations intelligentes
- **Gestion des compétences** : Mapping des compétences techniques et linguistiques
- **Reconnaissance de diplômes** : Suivi des autorisations et certifications

### 🔍 **Sourcing avancé**

- **Chasse de têtes** : Outils de prospection active _(en développement)_
- **Candidatures WordPress** : Intégration avec votre site web
- **Multi-canaux** : Centralisation des candidatures de toutes sources

### 📢 **Gestion des annonces**

- **Publication WordPress** : Diffusion automatisée sur votre site
- **LinkedIn Jobs** : Intégration LinkedIn _(en développement)_
- **Multi-plateformes** : Gestion centralisée de vos annonces

### 🔍 **Veille stratégique**

- **Veille candidats** : Monitoring des profils et prospects _(en développement)_
- **Veille talents** : Analyse du marché des compétences _(en développement)_
- **Veille concurrentielle** : Surveillance de la concurrence _(en développement)_

### 🤖 **Intelligence artificielle**

- **Assistant RH** : Chatbot intelligent pour automatiser les tâches _(en développement)_
- **Analyse de CV** : Extraction automatique des informations
- **Matching intelligent** : Correspondance candidat-poste optimisée
- **Recommandations** : Suggestions personnalisées basées sur l'IA

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm, yarn, pnpm ou bun
- Compte Supabase configuré

### Installation

1. **Cloner le projet**

```bash
git clone https://github.com/votre-username/dashboard-antidote.git
cd dashboard-antidote
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuration de l'environnement**

```bash
cp .env.example .env.local
```

Configurez vos variables d'environnement :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique_supabase
```

4. **Lancer le serveur de développement**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Accéder à l'application**
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Architecture technique

### Stack technologique

- **Frontend** : Next.js 15 avec App Router
- **UI/UX** : Tailwind CSS + Radix UI + Lucide Icons
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Formulaires** : React Hook Form + Zod
- **État** : Hooks React personnalisés
- **TypeScript** : Typage strict pour une meilleure maintenabilité

### Structure du projet

```
dashboard-antidote/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Interface principale
│   ├── login/            # Authentification
│   └── layout.tsx        # Layout global
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base
│   ├── candidat/        # Gestion des candidats
│   ├── client/          # Gestion des clients
│   ├── mandat/          # Gestion des mandats
│   └── shared/          # Composants partagés
├── hooks/               # Hooks React personnalisés
├── lib/                 # Utilitaires et configuration
├── services/            # Services API
├── types/               # Définitions TypeScript
└── docs/                # Documentation
```

## 📊 Modèle de données

### Entités principales

**Candidat**

- Informations personnelles et contact
- CV et documents associés
- Expériences professionnelles et formations
- Compétences techniques et linguistiques
- Analyse IA avec scoring et recommandations
- Reconnaissance de diplômes et autorisations

**Client**

- Informations entreprise
- Secteur d'activité et localisation
- Contacts et statut (actif/prospect/inactif)

**Mandat**

- Détails du poste à pourvoir
- Critères de sélection et compétences requises
- Statut et priorité
- Fourchette salariale et localisation

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec Turbopack

# Production
npm run build        # Build de production
npm run start        # Serveur de production

# Qualité de code
npm run lint         # Vérification ESLint
```

## 🎨 Interface utilisateur

- **Design moderne** : Interface épurée et intuitive
- **Responsive** : Optimisé pour desktop, tablette et mobile
- **Accessibilité** : Composants conformes aux standards WCAG
- **Thème sombre/clair** : Support des préférences utilisateur
- **Navigation contextuelle** : Breadcrumbs et navigation intelligente

## 🔐 Sécurité et authentification

- **Authentification Supabase** : Gestion sécurisée des utilisateurs
- **Autorisations granulaires** : Contrôle d'accès par rôle
- **Protection des données** : Chiffrement et conformité RGPD
- **Sessions sécurisées** : Gestion automatique des tokens

## 🚀 Roadmap

### Phase 1 - ✅ Complétée

- [x] Interface de base et navigation
- [x] Gestion des candidats et clients
- [x] Système de mandats
- [x] Intégration Supabase

### Phase 2 - 🚧 En cours

- [ ] Assistant IA conversationnel
- [ ] Analyse avancée des CV
- [ ] Intégration LinkedIn
- [ ] Système de notifications

### Phase 3 - 📋 Planifiée

- [ ] Module de veille stratégique
- [ ] API publique
- [ ] Application mobile
- [ ] Intégrations tierces (ATS, SIRH)

---

<div align="center">
  <strong>Développé avec ❤️ par l'équipe Antidote</strong>
</div>
