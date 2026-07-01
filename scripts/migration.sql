-- Turso Migration SQL
-- Generated from SQLite local database

-- announcements: 4 records
INSERT OR IGNORE INTO announcements(id,title,content,category,audience,created_at,updated_at,file_url,color) VALUES(1,'Bienvenue sur notre site !','Bonjour à tous les élèves et parents ! Retrouvez ici toutes les ressources pédagogiques, les devoirs, et les informations importantes de la classe.','info','all','2026-05-25 07:21:44','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO announcements(id,title,content,category,audience,created_at,updated_at,file_url,color) VALUES(2,'Dictée vendredi 30 mai','N''oubliez pas de réviser les mots de la liste n°12 pour la dictée de vendredi prochain.','devoir','eleves','2026-05-25 07:21:44','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO announcements(id,title,content,category,audience,created_at,updated_at,file_url,color) VALUES(3,'Sortie pédagogique – Musée des Sciences','La sortie au Musée des Sciences aura lieu le 5 juin. Les autorisations sont à rendre avant le 1er juin.','sortie','parents','2026-05-25 07:21:44','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO announcements(id,title,content,category,audience,created_at,updated_at,file_url,color) VALUES(4,'Réunion parents-professeurs','Une réunion parents-professeurs est organisée le jeudi 12 juin à 18h. Merci de confirmer votre présence.','reunion','parents','2026-05-25 07:21:44','2026-05-25 07:21:44',NULL,NULL);

-- resources: 6 records
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(1,'Fiche grammaire – Le groupe nominal','Fiche récapitulative sur le groupe nominal et ses expansions.','CM1','Français','fiche',NULL,0,'2026-05-25 07:21:44',NULL);
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(2,'Exercices – Fractions','Série d''exercices sur les fractions simples et comparaison.','CM2','Mathématiques','exercice',NULL,0,'2026-05-25 07:21:44',NULL);
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(3,'Leçon – La photosynthèse','Leçon illustrée sur le mécanisme de la photosynthèse chez les plantes.','CM2','Sciences','leçon',NULL,0,'2026-05-25 07:21:44',NULL);
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(4,'Dictée audio – Semaine 5','Fichier audio de la dictée préparée de la semaine 5.','CE2','Français','audio',NULL,0,'2026-05-25 07:21:44',NULL);
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(5,'Planification annuelle CM1','Planification annuelle complète pour le niveau CM1.','CM1','Tous','planification',NULL,1,'2026-05-25 07:21:44',NULL);
INSERT OR IGNORE INTO resources(id,title,description,level,subject,type,file_url,is_private,created_at,color) VALUES(6,'Correction évaluation Maths','Corrigé complet de l''évaluation de mathématiques du 15 mai.','CM2','Mathématiques','correction',NULL,1,'2026-05-25 07:21:44',NULL);

-- homework: 5 records
INSERT OR IGNORE INTO homework(id,title,description,subject,level,due_date,created_at,file_url,color) VALUES(1,'Exercices page 45-46','Faire les exercices 1, 2 et 3 page 45 et 46 du manuel.','Mathématiques','CM1','2026-05-28','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO homework(id,title,description,subject,level,due_date,created_at,file_url,color) VALUES(2,'Lecture chapitre 3','Lire le chapitre 3 du livre "Le Petit Prince" et répondre aux questions.','Français','CM2','2026-05-29','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO homework(id,title,description,subject,level,due_date,created_at,file_url,color) VALUES(3,'Leçon sur les volcans','Apprendre la leçon sur la formation des volcans.','Sciences','CM1','2026-05-30','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO homework(id,title,description,subject,level,due_date,created_at,file_url,color) VALUES(4,'Conjugaison : imparfait Rachid','Conjuguer les verbes de la liste à l''imparfait.','Français','CE2','2026-05-27','2026-05-25 07:21:44','','');
INSERT OR IGNORE INTO homework(id,title,description,subject,level,due_date,created_at,file_url,color) VALUES(5,'Devoir Rachid','LAllalalalalalalal','Sciences','CE2','2026-05-29','2026-05-28 14:57:29','','#22C55E');

-- photos: 3 records
INSERT OR IGNORE INTO photos(id,title,description,album,image_url,created_at) VALUES(1,'Atelier peinture','Les élèves ont réalisé de magnifiques peintures lors de l''atelier arts plastiques.','Ateliers créatifs','/images/placeholder-class.jpg','2026-05-25 07:21:44');
INSERT OR IGNORE INTO photos(id,title,description,album,image_url,created_at) VALUES(2,'Sortie nature','Sortie découverte de la faune locale au parc naturel.','Sorties scolaires','/images/placeholder-class.jpg','2026-05-25 07:21:44');
INSERT OR IGNORE INTO photos(id,title,description,album,image_url,created_at) VALUES(3,'Fête de fin d''année','Spectacle et remise des livrets lors de la fête de fin d''année.','Événements','/images/placeholder-class.jpg','2026-05-25 07:21:44');

-- contacts: 0 records
-- planning: 1 records
INSERT OR IGNORE INTO planning(id,title,content,period,subject,level,created_at,file_url,color) VALUES(1,'Planification – Français CM1 – Période 4','Semaine 1 : Grammaire – Le groupe verbal
Semaine 2 : Conjugaison – Le passé composé
Semaine 3 : Orthographe – Les homophones a/à
Semaine 4 : Lecture – Compréhension de texte
Semaine 5 : Évaluation bilan','Période 4','Français','CM1','2026-05-25 07:21:44',NULL,NULL);

-- corrections: 1 records
INSERT OR IGNORE INTO corrections(id,title,dictee_text,correction,bareme,notes,level,week_number,created_at,file_url,color) VALUES(1,'Dictée Semaine 5 – Les saisons','En automne, les feuilles tombent doucement des arbres. Les enfants jouent dans les parcs colorés.','En automne[accord], les feuilles[féminin pluriel] tombent[accord sujet/verbe] doucement[adverbe] des arbres[masculin pluriel]. Les enfants[masculin pluriel] jouent[accord] dans les parcs[masculin pluriel] colorés[accord adjectif].','Accord sujet/verbe : 3pts | Accords des noms : 3pts | Homophones : 2pts | Orthographe : 2pts','Fautes fréquentes : "automne" sans e final, "feuilles" au singulier.','CE2',5,'2026-05-25 07:21:44',NULL,NULL);

-- lessons: 2 records
INSERT OR IGNORE INTO lessons(id,title,content,subject,level,chapter,created_at,file_url,color) VALUES(1,'Les fractions','Une fraction représente une partie d''un tout. Elle s''écrit avec un numérateur (en haut) et un dénominateur (en bas). Exemple : 3/4 signifie 3 parties sur 4.','Mathématiques','CM1','Chapitre 5 – Les nombres rationnels','2026-05-25 07:21:44',NULL,NULL);
INSERT OR IGNORE INTO lessons(id,title,content,subject,level,chapter,created_at,file_url,color) VALUES(2,'L''accord du participe passé','Le participe passé employé avec "être" s''accorde en genre et en nombre avec le sujet. Avec "avoir", il s''accorde avec le COD placé avant.','Français','CM2','Chapitre 8 – Conjugaison','2026-05-25 07:21:44',NULL,NULL);

-- events: 5 records
INSERT OR IGNORE INTO events(id,title,event_date,event_type,created_at,file_url) VALUES(1,'Dictée de vocabulaire – CM1/CM2','2026-05-28','devoir','2026-05-25 10:46:57',NULL);
INSERT OR IGNORE INTO events(id,title,event_date,event_type,created_at,file_url) VALUES(2,'Sortie Musée des Sciences – CM2','2026-06-05','sortie','2026-05-25 10:46:57',NULL);
INSERT OR IGNORE INTO events(id,title,event_date,event_type,created_at,file_url) VALUES(3,'Évaluation de Mathématiques – CM1','2026-06-10','eval','2026-05-25 10:46:57',NULL);
INSERT OR IGNORE INTO events(id,title,event_date,event_type,created_at,file_url) VALUES(4,'Réunion parents-professeurs – 18h','2026-06-12','reunion','2026-05-25 10:46:57',NULL);
INSERT OR IGNORE INTO events(id,title,event_date,event_type,created_at,file_url) VALUES(5,'Fête de fin d''année – 15h','2026-06-20','fete','2026-05-25 10:46:57',NULL);

-- documents: 6 records
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(1,'Liste fournitures scolaires 2025-2026','','📋','2026-05-25 10:46:57');
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(2,'Programme annuel – CM1','','📚','2026-05-25 10:46:57');
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(3,'Programme annuel – CM2','','📚','2026-05-25 10:46:57');
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(4,'Règlement intérieur de la classe','','📜','2026-05-25 10:46:57');
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(5,'Autorisation sortie musée des Sciences','','✍️','2026-05-25 10:46:57');
INSERT OR IGNORE INTO documents(id,title,file_url,icon,created_at) VALUES(6,'Charte numérique et photos','','🔒','2026-05-25 10:46:57');

-- settings: 1 records
INSERT OR IGNORE INTO settings(key,value,updated_at) VALUES('teacher_password','fati2025','2026-05-25 09:12:46');

-- admin_users: 0 records
