# 🔄 Routes API Migration Pattern

## Vue d'ensemble

Suite à la migration vers Turso (LibSQL), toutes les routes API doivent être adaptées. Le pattern est simple et consiste à :

1. **Remplacer** `db.prepare()` par des fonctions de `queries.ts`
2. **Ajouter** `await` (les opérations Turso sont asynchrones)
3. **Ajouter** la gestion d'erreurs

---

## Pattern Before/After

### AVANT (SQLite)
```typescript
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM announcements").all();
  return NextResponse.json(rows);
}
```

### APRÈS (Turso)
```typescript
import { getAnnouncements } from "@/lib/queries";

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## Fonctions disponibles dans `queries.ts`

### Announcements
- `getAnnouncements()` → Liste toutes les annonces
- `createAnnouncement(data)` → Créer une annonce
- `getAnnouncementById(id)` → Récupérer une annonce
- `updateAnnouncement(id, data)` → Modifier une annonce
- `deleteAnnouncement(id)` → Supprimer une annonce

### Homework
- `getHomework()` → Liste tous les devoirs
- `createHomework(data)` → Créer un devoir
- `getHomeworkById(id)` → Récupérer un devoir
- `updateHomework(id, data)` → Modifier un devoir
- `deleteHomework(id)` → Supprimer un devoir

### Resources
- `getResources()` → Liste toutes les ressources
- `createResource(data)` → Créer une ressource
- `deleteResource(id)` → Supprimer une ressource

### Lessons
- `getLessons()` → Liste toutes les leçons
- `createLesson(data)` → Créer une leçon
- `deleteLesson(id)` → Supprimer une leçon

### Corrections
- `getCorrections()` → Liste toutes les corrections
- `createCorrection(data)` → Créer une correction
- `deleteCorrection(id)` → Supprimer une correction

### Planning
- `getPlanning()` → Liste tous les plannings
- `createPlanning(data)` → Créer un planning
- `deletePlanning(id)` → Supprimer un planning

### Events
- `getEvents()` → Liste tous les événements
- `createEvent(data)` → Créer un événement
- `deleteEvent(id)` → Supprimer un événement

### Photos
- `getPhotos()` → Liste toutes les photos
- `createPhoto(data)` → Créer une photo
- `deletePhoto(id)` → Supprimer une photo

### Contacts
- `getContacts()` → Liste tous les contacts
- `createContact(data)` → Créer un contact
- `markContactAsRead(id)` → Marquer comme lu
- `deleteContact(id)` → Supprimer un contact

### Documents
- `getDocuments()` → Liste tous les documents
- `createDocument(data)` → Créer un document
- `deleteDocument(id)` → Supprimer un document

---

## Routes déjà migrées ✅

- ✅ `/api/announcements/route.ts`
- ✅ `/api/announcements/[id]/route.ts`

---

## Routes à migrer (Template à utiliser)

### 1. `/api/homework/route.ts`
```typescript
import { getHomework, createHomework } from "@/lib/queries";

export async function GET() {
  try {
    const homework = await getHomework();
    return NextResponse.json(homework);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createHomework(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

### 2. `/api/homework/[id]/route.ts`
```typescript
import { updateHomework, deleteHomework } from "@/lib/queries";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateHomework(parseInt(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteHomework(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## Checklist des routes

- [ ] `/api/homework/route.ts`
- [ ] `/api/homework/[id]/route.ts`
- [ ] `/api/resources/route.ts`
- [ ] `/api/resources/[id]/route.ts`
- [ ] `/api/lessons/route.ts`
- [ ] `/api/lessons/[id]/route.ts`
- [ ] `/api/corrections/route.ts`
- [ ] `/api/corrections/[id]/route.ts`
- [ ] `/api/planning/route.ts`
- [ ] `/api/planning/[id]/route.ts`
- [ ] `/api/events/route.ts`
- [ ] `/api/events/[id]/route.ts`
- [ ] `/api/photos/route.ts`
- [ ] `/api/photos/[id]/route.ts`
- [ ] `/api/documents/route.ts`
- [ ] `/api/documents/[id]/route.ts`
- [ ] `/api/contact/route.ts`
- [ ] `/api/contact/[id]/route.ts`
- [ ] `/api/auth/route.ts`
- [ ] `/api/upload/route.ts`

---

## Remarques importantes

### async/await
Turso utilise uniquement les opérations asynchrones. **Toujours utiliser** `await` avec les queries.

### Gestion d'erreurs
Ajouter un try/catch autour de chaque requête pour éviter que l'app crash.

### Import statements
```typescript
// ❌ ANCIEN
import { getDb } from "@/lib/db";

// ✅ NOUVEAU
import { getAnnouncements, createAnnouncement, ... } from "@/lib/queries";
```

### Conversion des IDs
Turso retourne les IDs comme chaînes. **Toujours convertir** :
```typescript
parseInt(id)  // avant de passer à une fonction
```

---

## Test local

```bash
# 1. Arrêter l'app si elle tourne
npm run dev

# 2. Faire les modifications
# 3. L'app devrait hot-reload automatiquement
# 4. Tester les endpoints :

curl http://localhost:3000/api/announcements
curl http://localhost:3000/api/homework
# etc.
```

---

## Support

Pour toute question sur une route spécifique, consultez :
- `src/lib/queries.ts` — toutes les fonctions disponibles
- `src/app/api/announcements/` — exemple complet (déjà migré)
