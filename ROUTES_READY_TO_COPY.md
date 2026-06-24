# 📋 ROUTES À ADAPTER - Code prêt à copier-coller

Chaque groupe ci-dessous est prêt à être copié dans son fichier correspondant. Les imports et patterns sont corrects.

---

## 1️⃣ /api/homework/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
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
    const { title, description, subject, due_date, file_url = "", classroom = "", color = "" } = body;
    
    if (!title || !subject || !due_date)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createHomework({
      title,
      description,
      subject,
      due_date,
      file_url,
      classroom,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 2️⃣ /api/homework/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteHomework } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE homework 
            SET title=?, description=?, subject=?, due_date=?, file_url=?, classroom=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.description,
        body.subject,
        body.due_date,
        body.file_url || "",
        body.classroom || "",
        body.color || "",
        parseInt(id),
      ],
    });
    
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

## 3️⃣ /api/resources/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getResources, createResource } from "@/lib/queries";

export async function GET() {
  try {
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, file_url, type = "", audience = "", color = "" } = body;
    
    if (!title || !file_url)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createResource({
      title,
      description,
      file_url,
      type,
      audience,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 4️⃣ /api/resources/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteResource } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE resources 
            SET title=?, description=?, file_url=?, type=?, audience=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.description,
        body.file_url,
        body.type || "",
        body.audience || "",
        body.color || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteResource(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 5️⃣ /api/lessons/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getLessons, createLesson } from "@/lib/queries";

export async function GET() {
  try {
    const lessons = await getLessons();
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, subject, level = "", file_url = "", color = "" } = body;
    
    if (!title || !content || !subject)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createLesson({
      title,
      content,
      subject,
      level,
      file_url,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 6️⃣ /api/lessons/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteLesson } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE lessons 
            SET title=?, content=?, subject=?, level=?, file_url=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.content,
        body.subject,
        body.level || "",
        body.file_url || "",
        body.color || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteLesson(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 7️⃣ /api/planning/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getPlanning, createPlanning } from "@/lib/queries";

export async function GET() {
  try {
    const planning = await getPlanning();
    return NextResponse.json(planning);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, start_date, end_date, type = "", color = "" } = body;
    
    if (!title || !start_date)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createPlanning({
      title,
      description,
      start_date,
      end_date,
      type,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 8️⃣ /api/planning/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deletePlanning } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE planning 
            SET title=?, description=?, start_date=?, end_date=?, type=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.description,
        body.start_date,
        body.end_date || null,
        body.type || "",
        body.color || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePlanning(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 9️⃣ /api/events/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/queries";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, event_date, type = "", location = "", color = "" } = body;
    
    if (!title || !event_date)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createEvent({
      title,
      description,
      event_date,
      type,
      location,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 🔟 /api/events/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteEvent } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE events 
            SET title=?, description=?, event_date=?, type=?, location=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.description,
        body.event_date,
        body.type || "",
        body.location || "",
        body.color || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteEvent(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 1️⃣1️⃣ /api/photos/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getPhotos, createPhoto } from "@/lib/queries";

export async function GET() {
  try {
    const photos = await getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, image_url, album = "", description = "" } = body;
    
    if (!title || !image_url)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createPhoto({
      title,
      image_url,
      album,
      description,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 1️⃣2️⃣ /api/photos/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deletePhoto } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE photos 
            SET title=?, image_url=?, album=?, description=? 
            WHERE id=?`,
      args: [
        body.title,
        body.image_url,
        body.album || "",
        body.description || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePhoto(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 1️⃣3️⃣ /api/documents/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument } from "@/lib/queries";

export async function GET() {
  try {
    const documents = await getDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, file_url, type = "", audience = "" } = body;
    
    if (!title || !file_url)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createDocument({
      title,
      file_url,
      type,
      audience,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 1️⃣4️⃣ /api/documents/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteDocument } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE documents 
            SET title=?, file_url=?, type=?, audience=? 
            WHERE id=?`,
      args: [
        body.title,
        body.file_url,
        body.type || "",
        body.audience || "",
        parseInt(id),
      ],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteDocument(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 1️⃣5️⃣ /api/upload/route.ts (B2 Integration)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadToB2, deleteFromB2 } from "@/lib/b2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "documents";

    if (!file)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const fileName = `${category}/${Date.now()}-${file.name}`;
    const url = await uploadToB2(Buffer.from(buffer), fileName, file.type);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName } = body;

    if (!fileName)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    await deleteFromB2(fileName);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
```

---

## ✨ Instructions finales

1. **Copie chaque route** dans son fichier correspondant
2. **Après chaque groupe** : `npm run build`
3. **Quand tout compile** : `npm run dev` + test des endpoints
4. **Migration** : `npm run migrate`
5. **Déploiement** : `git push` vers Vercel

**Temps total** : ~30 minutes pour tout adapter

