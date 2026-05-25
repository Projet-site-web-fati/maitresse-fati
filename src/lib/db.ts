import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'maitresse-fati.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
    seedData(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  // Migrate existing tables (silent fail if column already exists)
  try { db.exec("ALTER TABLE lessons ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE homework ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE announcements ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE events ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE planning ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE corrections ADD COLUMN file_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN color TEXT"); } catch {}
  try { db.exec("ALTER TABLE homework ADD COLUMN color TEXT"); } catch {}
  try { db.exec("ALTER TABLE resources ADD COLUMN color TEXT"); } catch {}
  try { db.exec("ALTER TABLE announcements ADD COLUMN color TEXT"); } catch {}
  try { db.exec("ALTER TABLE planning ADD COLUMN color TEXT"); } catch {}
  try { db.exec("ALTER TABLE corrections ADD COLUMN color TEXT"); } catch {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'info',
      audience TEXT NOT NULL DEFAULT 'all',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      level TEXT NOT NULL,
      subject TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'fiche',
      file_url TEXT,
      is_private INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS homework (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      level TEXT NOT NULL,
      due_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      album TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS planning (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      period TEXT NOT NULL,
      subject TEXT NOT NULL,
      level TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS corrections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      dictee_text TEXT NOT NULL,
      correction TEXT NOT NULL,
      bareme TEXT,
      notes TEXT,
      level TEXT NOT NULL,
      week_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      subject TEXT NOT NULL,
      level TEXT NOT NULL,
      chapter TEXT,
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'info',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      file_url TEXT,
      icon TEXT DEFAULT '📄',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedData(db: Database.Database) {
  // Always ensure default password exists
  const pwdExists = db.prepare("SELECT key FROM settings WHERE key = 'teacher_password'").get();
  if (!pwdExists) {
    db.prepare("INSERT INTO settings (key, value) VALUES ('teacher_password', 'fati2025')").run();
  }

  // Seed events if empty
  const eventsCount = db.prepare('SELECT COUNT(*) as c FROM events').get() as { c: number };
  if (eventsCount.c === 0) {
    const insertEvent = db.prepare('INSERT INTO events (title, event_date, event_type) VALUES (?, ?, ?)');
    insertEvent.run('Dictée de vocabulaire – CM1/CM2', '2026-05-28', 'devoir');
    insertEvent.run('Sortie Musée des Sciences – CM2', '2026-06-05', 'sortie');
    insertEvent.run('Évaluation de Mathématiques – CM1', '2026-06-10', 'eval');
    insertEvent.run('Réunion parents-professeurs – 18h', '2026-06-12', 'reunion');
    insertEvent.run('Fête de fin d\'année – 15h', '2026-06-20', 'fete');
  }

  // Seed documents if empty
  const docsCount = db.prepare('SELECT COUNT(*) as c FROM documents').get() as { c: number };
  if (docsCount.c === 0) {
    const insertDoc = db.prepare('INSERT INTO documents (title, file_url, icon) VALUES (?, ?, ?)');
    insertDoc.run('Liste fournitures scolaires 2025-2026', '', '📋');
    insertDoc.run('Programme annuel – CM1', '', '📚');
    insertDoc.run('Programme annuel – CM2', '', '📚');
    insertDoc.run('Règlement intérieur de la classe', '', '📜');
    insertDoc.run('Autorisation sortie musée des Sciences', '', '✍️');
    insertDoc.run('Charte numérique et photos', '', '🔒');
  }

  const count = db.prepare('SELECT COUNT(*) as c FROM announcements').get() as { c: number };
  if (count.c > 0) return;

  const insertAnnouncement = db.prepare(
    'INSERT INTO announcements (title, content, category, audience) VALUES (?, ?, ?, ?)'
  );

  insertAnnouncement.run(
    'Bienvenue sur notre site !',
    'Bonjour à tous les élèves et parents ! Retrouvez ici toutes les ressources pédagogiques, les devoirs, et les informations importantes de la classe.',
    'info',
    'all'
  );
  insertAnnouncement.run(
    'Dictée vendredi 30 mai',
    'N\'oubliez pas de réviser les mots de la liste n°12 pour la dictée de vendredi prochain.',
    'devoir',
    'eleves'
  );
  insertAnnouncement.run(
    'Sortie pédagogique – Musée des Sciences',
    'La sortie au Musée des Sciences aura lieu le 5 juin. Les autorisations sont à rendre avant le 1er juin.',
    'sortie',
    'parents'
  );
  insertAnnouncement.run(
    'Réunion parents-professeurs',
    'Une réunion parents-professeurs est organisée le jeudi 12 juin à 18h. Merci de confirmer votre présence.',
    'reunion',
    'parents'
  );

  const insertHomework = db.prepare(
    'INSERT INTO homework (title, description, subject, level, due_date) VALUES (?, ?, ?, ?, ?)'
  );
  insertHomework.run('Exercices page 45-46', 'Faire les exercices 1, 2 et 3 page 45 et 46 du manuel.', 'Mathématiques', 'CM1', '2026-05-28');
  insertHomework.run('Lecture chapitre 3', 'Lire le chapitre 3 du livre "Le Petit Prince" et répondre aux questions.', 'Français', 'CM2', '2026-05-29');
  insertHomework.run('Leçon sur les volcans', 'Apprendre la leçon sur la formation des volcans.', 'Sciences', 'CM1', '2026-05-30');
  insertHomework.run('Conjugaison : imparfait', 'Conjuguer les verbes de la liste à l\'imparfait.', 'Français', 'CE2', '2026-05-27');

  const insertResource = db.prepare(
    'INSERT INTO resources (title, description, level, subject, type, is_private) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertResource.run('Fiche grammaire – Le groupe nominal', 'Fiche récapitulative sur le groupe nominal et ses expansions.', 'CM1', 'Français', 'fiche', 0);
  insertResource.run('Exercices – Fractions', 'Série d\'exercices sur les fractions simples et comparaison.', 'CM2', 'Mathématiques', 'exercice', 0);
  insertResource.run('Leçon – La photosynthèse', 'Leçon illustrée sur le mécanisme de la photosynthèse chez les plantes.', 'CM2', 'Sciences', 'leçon', 0);
  insertResource.run('Dictée audio – Semaine 5', 'Fichier audio de la dictée préparée de la semaine 5.', 'CE2', 'Français', 'audio', 0);
  insertResource.run('Planification annuelle CM1', 'Planification annuelle complète pour le niveau CM1.', 'CM1', 'Tous', 'planification', 1);
  insertResource.run('Correction évaluation Maths', 'Corrigé complet de l\'évaluation de mathématiques du 15 mai.', 'CM2', 'Mathématiques', 'correction', 1);

  const insertLesson = db.prepare(
    'INSERT INTO lessons (title, content, subject, level, chapter) VALUES (?, ?, ?, ?, ?)'
  );
  insertLesson.run(
    'Les fractions',
    'Une fraction représente une partie d\'un tout. Elle s\'écrit avec un numérateur (en haut) et un dénominateur (en bas). Exemple : 3/4 signifie 3 parties sur 4.',
    'Mathématiques', 'CM1', 'Chapitre 5 – Les nombres rationnels'
  );
  insertLesson.run(
    'L\'accord du participe passé',
    'Le participe passé employé avec "être" s\'accorde en genre et en nombre avec le sujet. Avec "avoir", il s\'accorde avec le COD placé avant.',
    'Français', 'CM2', 'Chapitre 8 – Conjugaison'
  );

  const insertPhoto = db.prepare(
    'INSERT INTO photos (title, description, album, image_url) VALUES (?, ?, ?, ?)'
  );
  insertPhoto.run('Atelier peinture', 'Les élèves ont réalisé de magnifiques peintures lors de l\'atelier arts plastiques.', 'Ateliers créatifs', '/images/placeholder-class.jpg');
  insertPhoto.run('Sortie nature', 'Sortie découverte de la faune locale au parc naturel.', 'Sorties scolaires', '/images/placeholder-class.jpg');
  insertPhoto.run('Fête de fin d\'année', 'Spectacle et remise des livrets lors de la fête de fin d\'année.', 'Événements', '/images/placeholder-class.jpg');

  const insertCorrection = db.prepare(
    'INSERT INTO corrections (title, dictee_text, correction, bareme, notes, level, week_number) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  insertCorrection.run(
    'Dictée Semaine 5 – Les saisons',
    'En automne, les feuilles tombent doucement des arbres. Les enfants jouent dans les parcs colorés.',
    'En automne[accord], les feuilles[féminin pluriel] tombent[accord sujet/verbe] doucement[adverbe] des arbres[masculin pluriel]. Les enfants[masculin pluriel] jouent[accord] dans les parcs[masculin pluriel] colorés[accord adjectif].',
    'Accord sujet/verbe : 3pts | Accords des noms : 3pts | Homophones : 2pts | Orthographe : 2pts',
    'Fautes fréquentes : "automne" sans e final, "feuilles" au singulier.',
    'CE2', 5
  );

  const insertPlanning = db.prepare(
    'INSERT INTO planning (title, content, period, subject, level) VALUES (?, ?, ?, ?, ?)'
  );
  insertPlanning.run(
    'Planification – Français CM1 – Période 4',
    'Semaine 1 : Grammaire – Le groupe verbal\nSemaine 2 : Conjugaison – Le passé composé\nSemaine 3 : Orthographe – Les homophones a/à\nSemaine 4 : Lecture – Compréhension de texte\nSemaine 5 : Évaluation bilan',
    'Période 4', 'Français', 'CM1'
  );
}
