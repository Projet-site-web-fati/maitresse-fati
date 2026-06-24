# ⚡ QUICKSTART - Terminez la migration en 30 minutes

## 📋 Statut actuel

✅ **Fait** :
- Dépendances installées
- src/lib/db.ts, b2.ts, queries.ts créés
- Scripts de migration prêts
- 5 groupes de routes adaptés
- Documentation complète

⏳ **À faire** (30 min) :
- Adapter 15 fichiers de routes restants
- Tester `npm run build` 
- Exécuter `npm run migrate`
- Déployer sur Vercel

---

## 🚀 ÉTAPE 1 : Adapter les routes (20 min)

### Ouverture rapide
1. Ouvrir [ROUTES_READY_TO_COPY.md](./ROUTES_READY_TO_COPY.md)
2. Pour chaque section (1️⃣ à 1️⃣5️⃣) :
   - Copier le code complet
   - Ouvrir le fichier correspondant dans VS Code
   - Remplacer entièrement le contenu
   - **Ctrl+S** pour sauvegarder

### Ordre d'adaptation (plus rapide d'abord)
```
1. homework/route.ts              (3 min)
2. homework/[id]/route.ts          (3 min)
3. resources/route.ts              (2 min)
4. resources/[id]/route.ts         (2 min)
5. lessons/route.ts                (2 min)
6. lessons/[id]/route.ts           (2 min)
7. planning/route.ts               (2 min)
8. planning/[id]/route.ts          (2 min)
9. events/route.ts                 (2 min)
10. events/[id]/route.ts           (2 min)
11. photos/route.ts                (2 min)
12. photos/[id]/route.ts           (2 min)
13. documents/route.ts             (2 min)
14. documents/[id]/route.ts        (2 min)
15. upload/route.ts                (3 min - B2 integration)
```

**Raccourci** : Utiliser recherche/remplacer dans VS Code pour accélérer

---

## 🔨 ÉTAPE 2 : Vérifier la compilation (2 min)

```bash
cd c:\Users\armel\Downloads\MaitresseFATI\maitresse-fati

npm run build
```

**Résultat attendu** :
```
✓ Compiled successfully
Running TypeScript ... ✓ Done
```

**Si erreur** : Regarder le nom du fichier qui plante, vérifier les imports

---

## 🔄 ÉTAPE 3 : Exécuter la migration (5 min)

```bash
npm run migrate
```

**Résultat attendu** :
```
✅ Migration completed successfully!
📊 Migration Summary:
  Announcements:     4
  Homework:          5
  Resources:         3
  Lessons:           2
  Corrections:       2
  Planning:          3
  Events:            1
  Photos:           10
  Documents:         2
  Contacts:          1
  Imported events:   1
  TOTAL:            34 records
```

**Important** :
- Données migrées vers Turso
- SQLite local inchangé (possible rollback)
- Vérifier sur [Turso Dashboard](https://platform.turso.tech) si besoin

---

## 🌐 ÉTAPE 4 : Déployer sur Vercel (3 min)

### 4a. Configurer variables d'environnement

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner ton projet
3. **Settings** → **Environment Variables**
4. Ajouter ces 6 variables :

```
Name: TURSO_CONNECTION_URL
Value: libsql://fatidb-rachid11.aws-eu-west-1.turso.io
Environment: ✓ Production

Name: TURSO_AUTH_TOKEN
Value: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJncm91cF91dWlkIjoiMWI3ZjUzYjctYjQzMC00MGFkLWFhNzMtMzlmOTVhMmExYTg1IiwianRpIjoiVksxdkcyX1BFZkR0TXc2anBzVm9ldyIsIm9yZ19pZCI6MTAwMDE4Nzc5OSwic2NvcGVzIjp7InNjb3BlcyI6WyJkYjpjb25maWd1cmUiLCJkYjpjcmVhdGUiLCJkYjpkZWxldGUiLCJkYjptaW50LXRva2VuIiwiZGI6cm90YXRlLWNyZWRzIiwiZ3JvdXA6Y29uZmlndXJlIiwiZ3JvdXA6bWludC10b2tlbiIsImdyb3VwOnJvdGF0ZS1jcmVkcyIsInJlYWQiXX19.XfRYd8NScGTiRjq2qd7Qve8ccs3Rqx4ltOMDfclSuedOIclH9ttL7WuCba7duLHeVM7OlGZsHiq7XRuMK4MEAg
Environment: ✓ Production

Name: B2_KEY_ID
Value: 003e77acc9058dd0000000001
Environment: ✓ Production

Name: B2_APPLICATION_KEY
Value: K003MpBzwmv1hi0uejdY43xUk1NJM3A
Environment: ✓ Production

Name: B2_BUCKET_ID
Value: 0ee7d7fadc5cf99095e80d1d
Environment: ✓ Production

Name: B2_ENDPOINT
Value: s3.eu-central-003.backblazeb2.com
Environment: ✓ Production
```

### 4b. Déployer

```bash
git add .
git commit -m "feat: complete Turso + B2 migration - all routes adapted"
git push
```

**Vercel va** :
1. Détecter le push
2. Lancer le build automatiquement
3. Déployer quand build réussit
4. T'afficher l'URL sur le dashboard

---

## ✅ CHECKLIST FINALE

- [ ] Toutes les 15 routes copiées/adaptées
- [ ] `npm run build` réussit (0 erreurs TypeScript)
- [ ] `npm run dev` démarre sans erreur
- [ ] `npm run migrate` complété avec succès
- [ ] 6 variables ajoutées à Vercel
- [ ] `git push` effectué
- [ ] Vercel build réussit
- [ ] Tester https://votre-app.vercel.app/api/announcements
- [ ] Vérifier quelques pages (élèves, enseignant, etc.)
- [ ] Tester upload de fichier (devrait aller vers B2)

---

## 🆘 Troubleshooting rapide

### Erreur `Property 'prepare' does not exist`
→ Route non adaptée, vérifier les imports. Utiliser fichier ROUTES_READY_TO_COPY.md

### `npm run build` échoue sur une route
→ Lire le message d'erreur exact, trouver la route, copier le code correspondant

### `npm run migrate` échoue
→ Vérifier que .env.local existe et a les bonnes valeurs
→ Vérifier la connexion internet vers Turso
→ Consulter MIGRATION_GUIDE.md

### App fonctionne localement mais pas sur Vercel
→ Vérifier que les 6 variables env sont bien sur Vercel (Settings → Environment Variables)
→ Vérifier qu'elles sont en scope "Production"
→ Redéployer depuis Vercel dashboard

---

## 📞 Documents de référence

- **ROUTES_READY_TO_COPY.md** - Tous les codes à copier
- **ROUTES_MIGRATION.md** - Patterns détaillés + explications
- **MIGRATION_GUIDE.md** - Migration complète (avec rollback)
- **COMPLETION_STATUS.md** - Statut global du projet

---

## ⏱️ Timeline estimée

| Étape | Temps |
|-------|--------|
| Adapter 15 routes | 20 min |
| Test `npm run build` | 2 min |
| Exécuter `npm run migrate` | 5 min |
| Ajouter variables Vercel | 2 min |
| `git push` + déploiement | 3 min |
| **TOTAL** | **~32 minutes** |

---

## 🎉 Après déploiement

🎯 **Bravo !** Ton app est maintenant :

✨ Utilisant Turso cloud (scalable, disponible globalement)
✨ Uploadant les fichiers vers B2 (économique, rapide)
✨ Déployée sur Vercel (CI/CD automatique, global CDN)
✨ Avec async/await moderne (maintenable, type-safe)
✨ Zero downtime migration (rollback possible si besoin)

---

## 🔐 Notes de sécurité

⚠️ **Variables d'environnement** :
- Ne JAMAIS commiter .env.local dans Git
- Sur Vercel : toujours mettre scope "Production"
- Les tokens sont sensibles, ne pas partager

✅ **Migration de données** :
- SQLite local est préservé (pas supprimé)
- Vous pouvez revenir en arrière si besoin
- Les IDs sont conservés exactement

---

**C'est parti ! 🚀 Bonne chance !**

