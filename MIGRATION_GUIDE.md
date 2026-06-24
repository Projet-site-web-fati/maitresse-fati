# 🔄 Migration Guide: SQLite → Turso + B2

## 📋 Vue d'ensemble

Ce guide explique comment migrer votre base de données SQLite locale vers **Turso** (LibSQL) et configurer le stockage des fichiers avec **B2** (Backblaze).

### Architecture

```
┌─────────────────────┐
│   Application       │
│  (Next.js 16)       │
└──────────┬──────────┘
           │
      ┌────┴──────┐
      │            │
      ▼            ▼
   Turso      B2 (S3)
   (DB)    (File Storage)
```

---

## 🚀 Étape 1 : Préparation locale

### 1.1 Installer les dépendances

```bash
npm install
```

Les dépendances suivantes ont été ajoutées à `package.json` :
- `@libsql/client` — Connexion à Turso
- `@aws-sdk/client-s3` — Upload de fichiers vers B2
- `@aws-sdk/s3-request-presigner` — Génération d'URLs signées

### 1.2 Configurer les variables d'environnement locales

Créer ou vérifier le fichier `.env.local` :

```bash
# Turso Database Configuration
TURSO_CONNECTION_URL=libsql://fatidb-rachid11.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# B2 Storage Configuration
B2_KEY_ID=003e77acc9058dd0000000001
B2_APPLICATION_KEY=K003MpBzwmv1hi0uejdY43xUk1NJM3A
B2_BUCKET_ID=0ee7d7fadc5cf99095e80d1d
B2_ENDPOINT=s3.eu-central-003.backblazeb2.com

NODE_ENV=development
```

---

## 🔄 Étape 2 : Migrer les données (SQLite → Turso)

### 2.1 Sauvegarder la base locale (optionnel mais recommandé)

```bash
cp data/maitresse-fati.db data/maitresse-fati.db.backup
```

### 2.2 Exécuter la migration

```bash
npm run migrate
```

**Qu'est-ce que ce script fait :**
- ✅ Lit TOUTES les données de `data/maitresse-fati.db` (si elle existe)
- ✅ Crée les tables dans Turso si elles n'existent pas
- ✅ Insère tous les enregistrements (announcements, homework, lessons, etc.)
- ✅ Préserve les IDs originaux pour la continuité
- ❌ **NE supprime PAS** la base locale (safe rollback)

**Résultat attendu :**

```
🚀 Starting migration: SQLite → Turso

📋 Reading data from local SQLite...

  ✅ Announcements: 4
  ✅ Resources: 6
  ✅ Homework: 4
  ✅ Planning: 1
  ✅ Events: 5
  ✅ Corrections: 1
  ✅ Lessons: 2
  ✅ Photos: 3
  ✅ Documents: 6
  ✅ Settings: 1

📊 Migration Summary:
==================================================
  TOTAL: 33 records

✅ Migration completed successfully!

📌 Next steps:
   1. Verify data in Turso console: https://turso.tech
   2. Add environment variables to Vercel
   3. Deploy: git push
```

### 2.3 Vérifier la migration

Allez sur [turso.tech](https://turso.tech) et vérifiez que toutes les données sont présentes.

---

## ⚙️ Étape 3 : Tester localement

### 3.1 Démarrer le serveur de développement

```bash
npm run dev
```

L'application devrait maintenant :
- ✅ Se connecter à Turso au lieu de SQLite
- ✅ Lire toutes les données migrées
- ✅ Accepter les uploads vers B2

### 3.2 Tester les uploads de fichiers

Via le dashboard enseignant (`/enseignant`) :
1. Mot de passe : `fati2025`
2. Upload un fichier (PDF, image, etc.)
3. Vérifiez que le fichier est accessible via le lien stocké dans Turso

---

## 🌐 Étape 4 : Configurer Vercel

### 4.1 Ajouter les variables d'environnement

Allez sur **Vercel Dashboard** → **Settings** → **Environment Variables** et ajoutez :

| Variable | Valeur |
|----------|--------|
| `TURSO_CONNECTION_URL` | `libsql://fatidb-rachid11.aws-eu-west-1.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` (JWT token complet) |
| `B2_KEY_ID` | `003e77acc9058dd0000000001` |
| `B2_APPLICATION_KEY` | `K003MpBzwmv1hi0uejdY43xUk1NJM3A` |
| `B2_BUCKET_ID` | `0ee7d7fadc5cf99095e80d1d` |
| `B2_ENDPOINT` | `s3.eu-central-003.backblazeb2.com` |

**Important :** Sélectionnez l'onglet `Production` pour que ces variables soient disponibles en live.

### 4.2 Redéployer

```bash
git add .
git commit -m "feat: migrate to Turso + B2"
git push
```

Vercel redéclenchera le build. Attendez que le déploiement se termine (environ 2-3 minutes).

---

## ✅ Vérification en production

### 5.1 Vérifier que l'app fonctionne

```
https://votre-app.vercel.app
```

- ✅ Page d'accueil charge les annonces depuis Turso
- ✅ Espace élèves affiche les devoirs
- ✅ Dashboard enseignant accessible avec `fati2025`

### 5.2 Tester les uploads

Via `/enseignant/dashboard` :
1. Upload un fichier
2. Vérifiez qu'il est accessible via le lien B2
3. Vérifiez que le lien est sauvegardé dans Turso

### 5.3 Consulter les logs

```bash
# Depuis Vercel Dashboard
Settings → Functions → Logs
```

---

## 🔐 Sécurité

### Credentials stockées

- ✅ **Turso** : JWT token limité aux opérations DB
- ✅ **B2** : Application key spécifique pour le bucket `fatibucket`
- ⚠️  **Ne jamais** commiter `.env.local` (déjà dans `.gitignore`)

### Permissions

- **Turso** : Toutes les permissions DB (`read`, `create`, `configure`, etc.)
- **B2** : Accès public en lecture (URLs signées pour accès temporaire)

---

## 🔄 Rollback (si problème)

### Revenir à SQLite

1. Récupérer `src/lib/db.ts.old`
2. `mv src/lib/db.ts src/lib/db-turso.ts && mv src/lib/db.ts.old src/lib/db.ts`
3. `npm run build`
4. `git push`

### Données

- La base SQLite locale est toujours présente
- Aucune donnée n'a été supprimée
- Tous les enregistrements migr és sont conservés dans Turso

---

## 📚 Ressources

- **Turso Docs** : https://docs.turso.tech
- **Backblaze B2** : https://www.backblaze.com/b2/docs/
- **LibSQL Client** : https://github.com/libsql/client-ts
- **AWS SDK S3** : https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/

---

## ❓ Troubleshooting

### Erreur : "Missing TURSO_CONNECTION_URL"

**Cause** : Variables d'environnement non définies

**Solution** :
```bash
# Vérifier .env.local
echo $TURSO_CONNECTION_URL

# Si vide, copier depuis le fichier d'infos
```

### Erreur : "B2 upload failed"

**Cause** : Credentials B2 incorretes

**Solution** :
1. Vérifier le bucket ID
2. Vérifier la clé application
3. Vérifier que le bucket n'est pas archivé

### Migration très lente

**Cause** : Réseau ou base locale corrompue

**Solution** :
```bash
# Vérifier l'intégrité de la base locale
sqlite3 data/maitresse-fati.db "PRAGMA integrity_check;"

# Relancer la migration
npm run migrate
```

---

## 🎉 Félicitations !

Votre application est maintenant :
- ✅ Déployée sur **Vercel**
- ✅ Utilisant **Turso** pour la base de données
- ✅ Utilisant **B2** pour le stockage de fichiers
- ✅ Entièrement **scalable** et **production-ready**

Pour toute question : consultez les docs officielles ou le guide technique.
