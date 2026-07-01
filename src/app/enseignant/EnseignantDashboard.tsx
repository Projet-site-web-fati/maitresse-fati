"use client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getMediaUrl } from "@/lib/media";

interface Correction { id: number; title: string; dictee_text: string; correction: string; bareme: string; notes: string; level: string; week_number: number; created_at: string; file_url?: string | null; color?: string | null; }
interface Planning   { id: number; title: string; content: string; period: string; subject: string; level: string; created_at: string; file_url?: string | null; color?: string | null; }
interface Resource   { id: number; title: string; description: string; level: string; subject: string; type: string; is_private: number; file_url: string | null; color?: string | null; }
interface Announcement { id: number; title: string; content: string; category: string; audience: string; created_at: string; file_url?: string | null; color?: string | null; }
interface Homework   { id: number; title: string; description: string; subject: string; level: string; due_date: string; file_url?: string | null; color?: string | null; }
interface Photo      { id: number; title: string; description: string; album: string; image_url: string; }
interface Lesson     { id: number; title: string; content: string; subject: string; level: string; chapter: string; file_url: string | null; created_at: string; color?: string | null; }
interface CalEvent   { id: number; title: string; event_date: string; event_type: string; file_url?: string | null; }
interface Document   { id: number; title: string; file_url: string | null; icon: string; }
interface Contact    { id: number; name: string; email: string; subject: string; message: string; is_read: number; created_at: string; }

const SUBJECTS = ["Français", "Mathématiques", "Sciences", "Histoire-Géo", "Arts", "EMC", "Tous"];
const LEVELS   = ["CE1", "CE2", "CM1", "CM2"];
const EVENT_TYPES = ["info", "devoir", "sortie", "eval", "reunion", "fete"];
const EV_COLORS: Record<string, string> = { info:"#3B82F6", devoir:"#F97316", sortie:"#22C55E", eval:"#EF4444", reunion:"#A855F7", fete:"#EC4899" };

const MAIN_TABS = [
  { id:"eleves",     label:"Élèves",     icon:"🎒", color:"#3B82F6" },
  { id:"parents",    label:"Parents",    icon:"👨‍👩‍👧", color:"#2563EB" },
  { id:"enseignant", label:"Enseignant", icon:"👩‍🏫", color:"#7C3AED" },
  { id:"photos",     label:"Photos",     icon:"📸", color:"#EC4899" },
  { id:"messages",   label:"Messages",   icon:"📬", color:"#F97316" },
  { id:"parametres", label:"Paramètres", icon:"⚙️", color:"#64748B" },
];

const SIDEBAR: Record<string, { id:string; label:string; icon:string; color:string }[]> = {
  eleves:     [{ id:"devoirs",        label:"Devoirs",            icon:"📝", color:"#DC2626" }, { id:"lecons",    label:"Leçons",       icon:"📖", color:"#3B82F6" }, { id:"ressources", label:"Ressources & Dictées", icon:"📄", color:"#7C3AED" }],
  parents:    [{ id:"annonces",       label:"Annonces",           icon:"📢", color:"#0891B2" }, { id:"agenda",    label:"Agenda",       icon:"📅", color:"#22C55E" }, { id:"documents",  label:"Documents",           icon:"📋", color:"#7C3AED" }],
  enseignant: [{ id:"planifications", label:"Planifications",     icon:"📅", color:"#16A34A" }, { id:"corrections",label:"Corrections", icon:"✅", color:"#F97316" }],
};
const DEFAULT_SECTION: Record<string, string> = { eleves:"devoirs", parents:"annonces", enseignant:"planifications" };

export default function EnseignantDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab,     setTab]     = useState("eleves");
  const [section, setSection] = useState("devoirs");
  const [openForm, setOpenForm] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  // Data
  const [homeworks, setHomeworks]         = useState<Homework[]>([]);
  const [lessons,   setLessons]           = useState<Lesson[]>([]);
  const [resources, setResources]         = useState<Resource[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calEvents, setCalEvents]         = useState<CalEvent[]>([]);
  const [parentDocs,setParentDocs]        = useState<Document[]>([]);
  const [plannings, setPlannings]         = useState<Planning[]>([]);
  const [corrections,setCorrections]      = useState<Correction[]>([]);
  const [photos,    setPhotos]            = useState<Photo[]>([]);
  const [contacts,  setContacts]          = useState<Contact[]>([]);

  // Edit states
  const [editingHw,   setEditingHw]   = useState<Homework   | null>(null);
  const [editingLesson,setEditingLesson]=useState<Lesson    | null>(null);
  const [editingRes,  setEditingRes]  = useState<Resource   | null>(null);
  const [editingAnn,  setEditingAnn]  = useState<Announcement|null>(null);
  const [editingEvent,setEditingEvent]= useState<CalEvent   | null>(null);
  const [editingDoc,  setEditingDoc]  = useState<Document   | null>(null);
  const [editingPlan, setEditingPlan] = useState<Planning   | null>(null);
  const [editingCorr, setEditingCorr] = useState<Correction | null>(null);
  const [editingPhoto,setEditingPhoto]= useState<Photo      | null>(null);
  const [editPhotoImages, setEditPhotoImages] = useState<string[]>([]);

  // Forms
  const [hwForm,    setHwForm]    = useState({ title:"", description:"", subject:"Français", level:"CM1", due_date:"", file_url:"", color:"" });
  const [lessonForm,setLessonForm]= useState({ title:"", content:"", subject:"Français", level:"CM1", chapter:"", file_url:"", color:"" });
  const [resForm,   setResForm]   = useState({ title:"", description:"", level:"CM1", subject:"Français", type:"fiche", is_private:false, file_url:"", color:"" });
  const [annForm,   setAnnForm]   = useState({ title:"", content:"", category:"info", audience:"all", file_url:"", color:"" });
  const [eventForm, setEventForm] = useState({ title:"", event_date:"", event_type:"info", file_url:"" });
  const [docForm,   setDocForm]   = useState({ title:"", file_url:"", icon:"📄" });
  const [planForm,  setPlanForm]  = useState({ title:"", content:"", period:"Période 1", subject:"Français", level:"CM1", file_url:"", color:"" });
  const [corrForm,  setCorrForm]  = useState({ title:"", dictee_text:"", correction:"", bareme:"", notes:"", level:"CM1", week_number:1, file_url:"", color:"" });
  const [photoForm, setPhotoForm] = useState({ description:"", album:"", newAlbum:"" });
  const [photoImages, setPhotoImages] = useState<string[]>([""]);
  const [pwdForm,   setPwdForm]   = useState({ current:"", next:"", confirm:"" });
  const [pwdMsg,    setPwdMsg]    = useState<{type:"ok"|"err"; text:string}|null>(null);
  const [pwdLoading,setPwdLoading]= useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const rs = await Promise.all([
      fetch("/api/homework"), fetch("/api/lessons"), fetch("/api/resources"),
      fetch("/api/announcements"), fetch("/api/events"), fetch("/api/documents"),
      fetch("/api/planning"), fetch("/api/corrections"), fetch("/api/photos"), fetch("/api/contact"),
    ]);
    const [hw,les,res,ann,ev,doc,plan,corr,ph,ct] = await Promise.all(rs.map(r => r.json()));
    setHomeworks(hw); setLessons(les); setResources(res); setAnnouncements(ann);
    setCalEvents(ev); setParentDocs(doc); setPlannings(plan); setCorrections(corr);
    setPhotos(ph); setContacts(ct);
  }

  const api = {
    post: (url: string, body: object) => fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }),
    put:  (url: string, body: object) => fetch(url, { method:"PUT",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }),
  };

  async function del(endpoint: string, id: number) {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`/api/${endpoint}/${id}`, { method:"DELETE" });
    fetchAll();
  }

  function resetForm() { setOpenForm(false); setFormResetKey(k => k+1); }

  // Submits
  async function submitHw(e: React.FormEvent)    { e.preventDefault(); await api.post("/api/homework", hwForm);    setHwForm({title:"",description:"",subject:"Français",level:"CM1",due_date:"",file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitLesson(e: React.FormEvent){ e.preventDefault(); await api.post("/api/lessons", lessonForm); setLessonForm({title:"",content:"",subject:"Français",level:"CM1",chapter:"",file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitRes(e: React.FormEvent)   { e.preventDefault(); await api.post("/api/resources", {...resForm, is_private: resForm.is_private?1:0}); setResForm({title:"",description:"",level:"CM1",subject:"Français",type:"fiche",is_private:false,file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitAnn(e: React.FormEvent)   { e.preventDefault(); await api.post("/api/announcements", annForm); setAnnForm({title:"",content:"",category:"info",audience:"all",file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitEvent(e: React.FormEvent) { e.preventDefault(); await api.post("/api/events", eventForm);    setEventForm({title:"",event_date:"",event_type:"info",file_url:""}); resetForm(); fetchAll(); }
  async function submitDoc(e: React.FormEvent)   { e.preventDefault(); await api.post("/api/documents", docForm);   setDocForm({title:"",file_url:"",icon:"📄"}); resetForm(); fetchAll(); }
  async function submitPlan(e: React.FormEvent)  { e.preventDefault(); await api.post("/api/planning", planForm);   setPlanForm({title:"",content:"",period:"Période 1",subject:"Français",level:"CM1",file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitCorr(e: React.FormEvent)  { e.preventDefault(); await api.post("/api/corrections", corrForm); setCorrForm({title:"",dictee_text:"",correction:"",bareme:"",notes:"",level:"CM1",week_number:1,file_url:"",color:""}); resetForm(); fetchAll(); }
  async function submitPhoto(e: React.FormEvent) {
    e.preventDefault();
    const album = photoForm.album === "__new__" ? photoForm.newAlbum.trim() : photoForm.album;
    if (!album) return;
    const validImages = photoImages.filter(Boolean);
    if (!validImages.length) return;
    for (const imageUrl of validImages) {
      await api.post("/api/photos", { title: album, description: photoForm.description, album, image_url: imageUrl });
    }
    setPhotoForm({ description:"", album:"", newAlbum:"" });
    setPhotoImages([""]);
    resetForm(); fetchAll();
  }

  async function submitEditHw(e: React.FormEvent)    { e.preventDefault(); if(!editingHw)    return; await api.put(`/api/homework/${editingHw.id}`,       editingHw);    setEditingHw(null);    fetchAll(); }
  async function submitEditLesson(e: React.FormEvent){ e.preventDefault(); if(!editingLesson)return; await api.put(`/api/lessons/${editingLesson.id}`,     editingLesson);setEditingLesson(null);fetchAll(); }
  async function submitEditRes(e: React.FormEvent)   { e.preventDefault(); if(!editingRes)   return; await api.put(`/api/resources/${editingRes.id}`,      editingRes);   setEditingRes(null);   fetchAll(); }
  async function submitEditAnn(e: React.FormEvent)   { e.preventDefault(); if(!editingAnn)   return; await api.put(`/api/announcements/${editingAnn.id}`,  editingAnn);   setEditingAnn(null);   fetchAll(); }
  async function submitEditEvent(e: React.FormEvent) { e.preventDefault(); if(!editingEvent) return; await api.put(`/api/events/${editingEvent.id}`,       editingEvent); setEditingEvent(null); fetchAll(); }
  async function submitEditDoc(e: React.FormEvent)   { e.preventDefault(); if(!editingDoc)   return; await api.put(`/api/documents/${editingDoc.id}`,      editingDoc);   setEditingDoc(null);   fetchAll(); }
  async function submitEditPlan(e: React.FormEvent)  { e.preventDefault(); if(!editingPlan)  return; await api.put(`/api/planning/${editingPlan.id}`,      editingPlan);  setEditingPlan(null);  fetchAll(); }
  async function submitEditCorr(e: React.FormEvent)  { e.preventDefault(); if(!editingCorr)  return; await api.put(`/api/corrections/${editingCorr.id}`,   editingCorr);  setEditingCorr(null);  fetchAll(); }
  async function submitEditPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPhoto) return;
    // Première image = remplace la photo existante
    const [firstUrl, ...extraUrls] = editPhotoImages.filter(Boolean);
    const updatedPhoto = firstUrl ? { ...editingPhoto, image_url: firstUrl } : editingPhoto;
    await api.put(`/api/photos/${editingPhoto.id}`, updatedPhoto);
    // Images supplémentaires = nouvelles photos dans le même album
    for (const url of extraUrls) {
      await api.post("/api/photos", { title: editingPhoto.album, description: editingPhoto.description, album: editingPhoto.album, image_url: url });
    }
    setEditingPhoto(null);
    setEditPhotoImages([]);
    fetchAll();
  }

  async function markRead(id: number) { await fetch(`/api/contact/${id}`, { method:"PATCH" }); fetchAll(); }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwdMsg(null);
    if (pwdForm.next !== pwdForm.confirm) { setPwdMsg({type:"err", text:"Les mots de passe ne correspondent pas."}); return; }
    if (pwdForm.next.length < 4) { setPwdMsg({type:"err", text:"Minimum 4 caractères."}); return; }
    setPwdLoading(true);
    const res = await fetch("/api/auth", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({current_password:pwdForm.current, new_password:pwdForm.next}) });
    const data = await res.json(); setPwdLoading(false);
    if (res.ok) { setPwdMsg({type:"ok", text:"Mot de passe modifié !"}); setPwdForm({current:"",next:"",confirm:""}); }
    else { setPwdMsg({type:"err", text:data.error||"Erreur."}); }
  }

  function switchTab(t: string) { setTab(t); setSection(DEFAULT_SECTION[t] ?? t); setOpenForm(false); setEditingHw(null); setEditingLesson(null); setEditingRes(null); setEditingAnn(null); setEditingEvent(null); setEditingDoc(null); setEditingPlan(null); setEditingCorr(null); setEditingPhoto(null); setEditPhotoImages([]); }
  function switchSection(s: string) { setSection(s); setOpenForm(false); setEditingHw(null); setEditingLesson(null); setEditingRes(null); setEditingAnn(null); setEditingEvent(null); setEditingDoc(null); setEditingPlan(null); setEditingCorr(null); setEditingPhoto(null); setEditPhotoImages([]); }

  const unreadCount = contacts.filter(c => !c.is_read).length;
  const sidebarItems = SIDEBAR[tab];
  const sidebarColor = sidebarItems?.find(s => s.id === section)?.color ?? "#2563EB";

  return (
    <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"1.5rem 1rem" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #F97316 0%, #EA580C 100%)", borderRadius:"1.5rem", padding:"2rem", marginBottom:"2rem", color:"white", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1.5rem", flexWrap:"wrap", boxShadow:"0 8px 32px rgba(249,115,22,0.25)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <span style={{ fontSize:"4rem" }}>👩‍🏫</span>
          <div>
            <h1 style={{ fontWeight:900, fontSize:"clamp(1.5rem,3vw,2rem)", color:"#FEF08A", margin:0 }}>⭐ Espace Enseignant Privé ⭐</h1>
            <p style={{ color:"#FEF3C7", fontSize:"0.95rem", margin:"0.25rem 0 0" }}>Tableau de bord — Maitresse FATI</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.18)", color:"white", border:"2px solid rgba(255,255,255,0.4)", borderRadius:"2rem", padding:"0.5rem 1.25rem", fontWeight:700, fontSize:"0.88rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* Main tabs */}
      <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"1.5rem", paddingLeft: sidebarItems ? "calc(160px + 1.25rem)" : "0" }}>
        {MAIN_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => switchTab(t.id)} style={{ display:"flex", alignItems:"center", gap:"0.35rem", padding:"0.28rem 0.9rem", borderRadius:"0.55rem", border:"2px solid", borderColor:active?t.color:"#E2E8F0", background:active?t.color:"white", color:active?"white":"#64748B", fontWeight:800, fontSize:"0.83rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.15s", boxShadow:active?`0 3px 10px ${t.color}44`:"none" }}>
              <span style={{ fontSize:"0.95rem" }}>{t.icon}</span>
              {t.label}
              {t.id === "messages" && unreadCount > 0 && (
                <span style={{ background:active?"rgba(255,255,255,0.35)":"#FEF2F2", color:active?"white":"#DC2626", borderRadius:"1rem", padding:"0 0.4rem", fontSize:"0.7rem", fontWeight:800 }}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ display:"flex", gap:"1.25rem", alignItems:"flex-start" }}>

        {/* Sidebar */}
        {sidebarItems && (
          <div style={{ width:"160px", flexShrink:0, display:"flex", flexDirection:"column", gap:"0.3rem", paddingTop:"3.9rem", alignSelf:"flex-start" }}>
            {sidebarItems.map(item => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => switchSection(item.id)} style={{
                  display:"flex", alignItems:"center", gap:"0.5rem",
                  width:"100%", padding:"0.45rem 0.65rem",
                  border:"none", borderRadius:"0.7rem",
                  background: active ? item.color : "white",
                  color: active ? "white" : "#374151",
                  fontWeight: 800, fontSize:"0.82rem",
                  cursor:"pointer", fontFamily:"'Nunito',sans-serif",
                  textAlign:"left", transition:"all 0.18s",
                  boxShadow: active ? `0 3px 12px ${item.color}44` : "0 1px 4px rgba(0,0,0,0.07)",
                  outline: active ? "none" : "2px solid #E2E8F0",
                  outlineOffset: "-2px",
                }}>
                  <span style={{
                    display:"flex", alignItems:"center", justifyContent:"center",
                    width:"1.55rem", height:"1.55rem", borderRadius:"0.45rem", flexShrink:0,
                    background: active ? "rgba(255,255,255,0.25)" : `${item.color}18`,
                    fontSize:"0.85rem",
                  }}>{item.icon}</span>
                  <span style={{ lineHeight:1.2 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Section content */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* ── DEVOIRS ── */}
          {section === "devoirs" && (
            <SectionWrap title="Devoirs" color="#DC2626" onAdd={() => { setOpenForm(o => !o); setEditingHw(null); }}>
              {openForm && !editingHw && (
                <form onSubmit={submitHw} style={fmS("#FEF2F2","#FECACA")}>
                  <G2><FF label="Titre du devoir" value={hwForm.title} onChange={v=>setHwForm({...hwForm,title:v})} required />
                    <FF label="Date limite" type="date" value={hwForm.due_date} onChange={v=>setHwForm({...hwForm,due_date:v})} required /></G2>
                  <G2><FS label="Matière" value={hwForm.subject} onChange={v=>setHwForm({...hwForm,subject:v})} opts={["Français","Mathématiques","Sciences","Histoire-Géo","Arts","EMC"]} />
                    <FS label="Niveau" value={hwForm.level} onChange={v=>setHwForm({...hwForm,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`hw-${formResetKey}`} label="Description / consignes" initialValue={hwForm.description} onChange={v=>setHwForm({...hwForm,description:v})} minHeight="120px" />
                  <FUF label="📎 Joindre un fichier (PDF, image…)" value={hwForm.file_url} onChange={v=>setHwForm({...hwForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={hwForm.color} onChange={v=>setHwForm({...hwForm,color:v})} />
                  <FA onCancel={resetForm} color="#DC2626" />
                </form>
              )}
              {editingHw && (
                <form onSubmit={submitEditHw} style={fmS("#FEF2F2","#FECACA")}>
                  <p style={eL}>✏️ Modifier le devoir</p>
                  <G2><FF label="Titre" value={editingHw.title} onChange={v=>setEditingHw({...editingHw,title:v})} required />
                    <FF label="Date limite" type="date" value={editingHw.due_date} onChange={v=>setEditingHw({...editingHw,due_date:v})} required /></G2>
                  <G2><FS label="Matière" value={editingHw.subject} onChange={v=>setEditingHw({...editingHw,subject:v})} opts={["Français","Mathématiques","Sciences","Histoire-Géo","Arts","EMC"]} />
                    <FS label="Niveau" value={editingHw.level} onChange={v=>setEditingHw({...editingHw,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`hwe-${editingHw.id}`} label="Description" initialValue={editingHw.description??""} onChange={v=>setEditingHw({...editingHw,description:v})} minHeight="120px" />
                  <FUF label="📎 Fichier joint" value={editingHw.file_url??""} onChange={v=>setEditingHw({...editingHw,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={editingHw.color??""} onChange={v=>setEditingHw({...editingHw,color:v})} />
                  <FA onCancel={()=>setEditingHw(null)} color="#DC2626" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {homeworks.length === 0 && !openForm && <Emp icon="📝" text="Aucun devoir." />}
              <div style={g2}>
                {homeworks.map(hw => (
                  <Card key={hw.id} borderColor="#FECACA">
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div>
                        <p style={cT}>{hw.title}</p>
                        {hw.description && <div style={{ fontSize:"0.8rem", color:"#64748B", marginTop:"0.25rem" }} dangerouslySetInnerHTML={{ __html: hw.description }} />}
                        <div style={{ display:"flex", gap:"0.35rem", flexWrap:"wrap", marginTop:"0.4rem" }}>
                          <Bdg color="#DC2626">{hw.subject}</Bdg><Bdg color="#2563EB">{hw.level}</Bdg>
                          <Bdg color="#64748B">📅 {new Date(hw.due_date+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</Bdg>
                        </div>
                        {hw.file_url && <a href={hw.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.78rem",color:"#DC2626",fontWeight:700,display:"inline-block",marginTop:"0.35rem" }}>📎 Fichier joint</a>}
                      </div>
                      <Btns onEdit={()=>{setEditingHw(hw);setOpenForm(false);}} onDelete={()=>del("homework",hw.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── LEÇONS ── */}
          {section === "lecons" && (
            <SectionWrap title="Leçons" color="#3B82F6" onAdd={() => { setOpenForm(o => !o); setEditingLesson(null); }}>
              {openForm && !editingLesson && (
                <form onSubmit={submitLesson} style={fmS("#EFF6FF","#BFDBFE")}>
                  <G2><FF label="Titre de la leçon" value={lessonForm.title} onChange={v=>setLessonForm({...lessonForm,title:v})} required />
                    <FF label="Chapitre (optionnel)" value={lessonForm.chapter} onChange={v=>setLessonForm({...lessonForm,chapter:v})} /></G2>
                  <G2><FS label="Matière" value={lessonForm.subject} onChange={v=>setLessonForm({...lessonForm,subject:v})} opts={SUBJECTS} />
                    <FS label="Niveau" value={lessonForm.level} onChange={v=>setLessonForm({...lessonForm,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`les-${formResetKey}`} label="Contenu de la leçon" initialValue={lessonForm.content} onChange={v=>setLessonForm({...lessonForm,content:v})} minHeight="220px" required />
                  <FUF label="📎 Joindre une fiche (PDF, image…)" value={lessonForm.file_url} onChange={v=>setLessonForm({...lessonForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={lessonForm.color} onChange={v=>setLessonForm({...lessonForm,color:v})} />
                  <FA onCancel={resetForm} color="#3B82F6" />
                </form>
              )}
              {editingLesson && (
                <form onSubmit={submitEditLesson} style={fmS("#EFF6FF","#BFDBFE")}>
                  <p style={eL}>✏️ Modifier la leçon</p>
                  <G2><FF label="Titre" value={editingLesson.title} onChange={v=>setEditingLesson({...editingLesson,title:v})} required />
                    <FF label="Chapitre" value={editingLesson.chapter??""} onChange={v=>setEditingLesson({...editingLesson,chapter:v})} /></G2>
                  <G2><FS label="Matière" value={editingLesson.subject} onChange={v=>setEditingLesson({...editingLesson,subject:v})} opts={SUBJECTS} />
                    <FS label="Niveau" value={editingLesson.level} onChange={v=>setEditingLesson({...editingLesson,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`lese-${editingLesson.id}`} label="Contenu" initialValue={editingLesson.content} onChange={v=>setEditingLesson({...editingLesson,content:v})} minHeight="220px" />
                  <FUF label="📎 Fiche jointe" value={editingLesson.file_url??""} onChange={v=>setEditingLesson({...editingLesson,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={editingLesson.color??""} onChange={v=>setEditingLesson({...editingLesson,color:v})} />
                  <FA onCancel={()=>setEditingLesson(null)} color="#3B82F6" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {lessons.length === 0 && !openForm && <Emp icon="📖" text="Aucune leçon." />}
              <div style={g2}>
                {lessons.map(l => (
                  <Card key={l.id} borderColor="#BFDBFE">
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ flex:1 }}>
                        {l.chapter && <p style={{ fontSize:"0.72rem",color:"#94A3B8",fontWeight:600,margin:"0 0 0.2rem" }}>{l.chapter}</p>}
                        <p style={cT}>{l.title}</p>
                        <div style={{ display:"flex", gap:"0.35rem", flexWrap:"wrap", margin:"0.3rem 0 0.5rem" }}><Bdg color="#3B82F6">{l.subject}</Bdg><Bdg color="#F97316">{l.level}</Bdg></div>
                        <div style={{ fontSize:"0.82rem", color:"#64748B", lineHeight:1.5 }} dangerouslySetInnerHTML={{ __html: l.content.length>200 ? l.content.slice(0,200)+"…" : l.content }} />
                        {l.file_url && <a href={l.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.78rem",color:"#3B82F6",fontWeight:700,display:"block",marginTop:"0.4rem" }}>📎 Fiche jointe</a>}
                      </div>
                      <Btns onEdit={()=>{setEditingLesson(l);setOpenForm(false);}} onDelete={()=>del("lessons",l.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── RESSOURCES ── */}
          {section === "ressources" && (
            <SectionWrap title="Ressources & Dictées Audio" color="#7C3AED" onAdd={() => { setOpenForm(o => !o); setEditingRes(null); }}>
              {openForm && !editingRes && (
                <form onSubmit={submitRes} style={fmS("#F5F3FF","#E9D5FF")}>
                  <G3><FF label="Titre" value={resForm.title} onChange={v=>setResForm({...resForm,title:v})} required />
                    <FS label="Niveau" value={resForm.level} onChange={v=>setResForm({...resForm,level:v})} opts={[...LEVELS,"Tous"]} />
                    <FS label="Matière" value={resForm.subject} onChange={v=>setResForm({...resForm,subject:v})} opts={SUBJECTS} /></G3>
                  <G2><FS label="Type" value={resForm.type} onChange={v=>setResForm({...resForm,type:v})} opts={["fiche","exercice","leçon","audio","planification","correction","autre"]} />
                    <div style={{ paddingTop:"1.5rem" }}><label style={{ display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",color:"#374151" }}>
                      <input type="checkbox" checked={resForm.is_private} onChange={e=>setResForm({...resForm,is_private:e.target.checked})} /> 🔒 Ressource privée
                    </label></div></G2>
                  <RTE key={`res-${formResetKey}`} label="Description" initialValue={resForm.description} onChange={v=>setResForm({...resForm,description:v})} minHeight="100px" />
                  <FUF label="📎 Fichier / audio (ou URL)" value={resForm.file_url} onChange={v=>setResForm({...resForm,file_url:v})} accept=".pdf,.mp3,.mp4,.ogg,.wav,.doc,.docx,.png,.jpg" />
                  <ColorPicker value={resForm.color} onChange={v=>setResForm({...resForm,color:v})} />
                  <FA onCancel={resetForm} color="#7C3AED" />
                </form>
              )}
              {editingRes && (
                <form onSubmit={submitEditRes} style={fmS("#F5F3FF","#E9D5FF")}>
                  <p style={eL}>✏️ Modifier la ressource</p>
                  <G3><FF label="Titre" value={editingRes.title} onChange={v=>setEditingRes({...editingRes,title:v})} required />
                    <FS label="Niveau" value={editingRes.level} onChange={v=>setEditingRes({...editingRes,level:v})} opts={[...LEVELS,"Tous"]} />
                    <FS label="Matière" value={editingRes.subject} onChange={v=>setEditingRes({...editingRes,subject:v})} opts={SUBJECTS} /></G3>
                  <G2><FS label="Type" value={editingRes.type} onChange={v=>setEditingRes({...editingRes,type:v})} opts={["fiche","exercice","leçon","audio","planification","correction","autre"]} />
                    <div style={{ paddingTop:"1.5rem" }}><label style={{ display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:700,fontSize:"0.82rem",cursor:"pointer" }}>
                      <input type="checkbox" checked={!!editingRes.is_private} onChange={e=>setEditingRes({...editingRes,is_private:e.target.checked?1:0})} /> 🔒 Privée
                    </label></div></G2>
                  <RTE key={`rese-${editingRes.id}`} label="Description" initialValue={editingRes.description??""} onChange={v=>setEditingRes({...editingRes,description:v})} minHeight="100px" />
                  <FUF label="📎 Fichier / URL" value={editingRes.file_url??""} onChange={v=>setEditingRes({...editingRes,file_url:v})} accept=".pdf,.mp3,.mp4,.ogg,.wav,.doc,.docx,.png,.jpg" />
                  <ColorPicker value={editingRes.color??""} onChange={v=>setEditingRes({...editingRes,color:v})} />
                  <FA onCancel={()=>setEditingRes(null)} color="#7C3AED" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {resources.length === 0 && !openForm && <Emp icon="📄" text="Aucune ressource." />}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0.75rem" }}>
                {resources.map(r => (
                  <Card key={r.id} borderColor={r.is_private?"#E9D5FF":"#E2E8F0"}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <Bdg color={r.is_private?"#7C3AED":"#16A34A"}>{r.is_private?"🔒 Privé":"🌐 Public"}</Bdg>
                      <Btns onEdit={()=>{setEditingRes(r);setOpenForm(false);}} onDelete={()=>del("resources",r.id)} />
                    </div>
                    <p style={{ ...cT, marginTop:"0.4rem" }}>{r.title}</p>
                    {r.description && <div style={{ fontSize:"0.78rem",color:"#64748B",marginTop:"0.2rem" }} dangerouslySetInnerHTML={{ __html: r.description }} />}
                    <div style={{ display:"flex",gap:"0.3rem",flexWrap:"wrap",marginTop:"0.4rem" }}><Bdg color="#3B82F6">{r.level}</Bdg><Bdg color="#F97316">{r.subject}</Bdg><Bdg color="#64748B">{r.type}</Bdg></div>
                    {r.file_url && <a href={r.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.75rem",color:"#7C3AED",fontWeight:700,display:"block",marginTop:"0.4rem" }}>📎 Voir le fichier</a>}
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── ANNONCES ── */}
          {section === "annonces" && (
            <SectionWrap title="Annonces" color="#0891B2" onAdd={() => { setOpenForm(o => !o); setEditingAnn(null); }}>
              {openForm && !editingAnn && (
                <form onSubmit={submitAnn} style={fmS("#ECFEFF","#A5F3FC")}>
                  <FF label="Titre de l'annonce" value={annForm.title} onChange={v=>setAnnForm({...annForm,title:v})} required />
                  <RTE key={`ann-${formResetKey}`} label="Contenu" initialValue={annForm.content} onChange={v=>setAnnForm({...annForm,content:v})} minHeight="160px" required />
                  <G2><FS label="Catégorie" value={annForm.category} onChange={v=>setAnnForm({...annForm,category:v})} opts={["info","devoir","sortie","reunion"]} />
                    <FS label="Visible pour" value={annForm.audience} onChange={v=>setAnnForm({...annForm,audience:v})} opts={["all","eleves","parents"]} /></G2>
                  <FUF label="📎 Joindre un fichier (PDF, image…)" value={annForm.file_url} onChange={v=>setAnnForm({...annForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={annForm.color} onChange={v=>setAnnForm({...annForm,color:v})} />
                  <FA onCancel={resetForm} color="#0891B2" saveLabel="📢 Publier" />
                </form>
              )}
              {editingAnn && (
                <form onSubmit={submitEditAnn} style={fmS("#ECFEFF","#A5F3FC")}>
                  <p style={eL}>✏️ Modifier l&apos;annonce</p>
                  <FF label="Titre" value={editingAnn.title} onChange={v=>setEditingAnn({...editingAnn,title:v})} required />
                  <RTE key={`anne-${editingAnn.id}`} label="Contenu" initialValue={editingAnn.content} onChange={v=>setEditingAnn({...editingAnn,content:v})} minHeight="160px" />
                  <G2><FS label="Catégorie" value={editingAnn.category} onChange={v=>setEditingAnn({...editingAnn,category:v})} opts={["info","devoir","sortie","reunion"]} />
                    <FS label="Audience" value={editingAnn.audience} onChange={v=>setEditingAnn({...editingAnn,audience:v})} opts={["all","eleves","parents"]} /></G2>
                  <FUF label="📎 Fichier joint" value={editingAnn.file_url??""} onChange={v=>setEditingAnn({...editingAnn,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={editingAnn.color??""} onChange={v=>setEditingAnn({...editingAnn,color:v})} />
                  <FA onCancel={()=>setEditingAnn(null)} color="#0891B2" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {announcements.length === 0 && !openForm && <Emp icon="📢" text="Aucune annonce." />}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                {announcements.map(ann => (
                  <Card key={ann.id} borderColor="#A5F3FC">
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ flex:1 }}>
                        <p style={cT}>{ann.title}</p>
                        <div style={{ fontSize:"0.85rem",color:"#64748B",marginTop:"0.3rem",lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: ann.content }} />
                        <div style={{ display:"flex",gap:"0.4rem",marginTop:"0.4rem" }}><Bdg color="#0891B2">{ann.category}</Bdg><Bdg color="#64748B">{ann.audience==="all"?"Tous":ann.audience}</Bdg></div>
                        {ann.file_url && <a href={ann.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.78rem",color:"#0891B2",fontWeight:700,display:"inline-block",marginTop:"0.35rem" }}>📎 Fichier joint</a>}
                      </div>
                      <Btns onEdit={()=>{setEditingAnn(ann);setOpenForm(false);}} onDelete={()=>del("announcements",ann.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── AGENDA ── */}
          {section === "agenda" && (
            <SectionWrap title="Agenda / Calendrier" color="#22C55E" onAdd={() => { setOpenForm(o => !o); setEditingEvent(null); }}>
              {openForm && !editingEvent && (
                <form onSubmit={submitEvent} style={fmS("#F0FDF4","#BBF7D0")}>
                  <G3><FF label="Titre de l'événement" value={eventForm.title} onChange={v=>setEventForm({...eventForm,title:v})} required />
                    <FF label="Date" type="date" value={eventForm.event_date} onChange={v=>setEventForm({...eventForm,event_date:v})} required />
                    <FS label="Type" value={eventForm.event_type} onChange={v=>setEventForm({...eventForm,event_type:v})} opts={EVENT_TYPES} /></G3>
                  <FUF label="📎 Joindre un document (PDF, image…)" value={eventForm.file_url} onChange={v=>setEventForm({...eventForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <FA onCancel={resetForm} color="#22C55E" saveLabel="📅 Ajouter" />
                </form>
              )}
              {editingEvent && (
                <form onSubmit={submitEditEvent} style={fmS("#F0FDF4","#BBF7D0")}>
                  <p style={eL}>✏️ Modifier l&apos;événement</p>
                  <G3><FF label="Titre" value={editingEvent.title} onChange={v=>setEditingEvent({...editingEvent,title:v})} required />
                    <FF label="Date" type="date" value={editingEvent.event_date} onChange={v=>setEditingEvent({...editingEvent,event_date:v})} required />
                    <FS label="Type" value={editingEvent.event_type} onChange={v=>setEditingEvent({...editingEvent,event_type:v})} opts={EVENT_TYPES} /></G3>
                  <FUF label="📎 Fichier joint" value={editingEvent.file_url??""} onChange={v=>setEditingEvent({...editingEvent,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <FA onCancel={()=>setEditingEvent(null)} color="#22C55E" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {calEvents.length === 0 && !openForm && <Emp icon="📅" text="Aucun événement." />}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {calEvents.map(ev => (
                  <Card key={ev.id} borderColor={EV_COLORS[ev.event_type]+"44"}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <div style={{ background:EV_COLORS[ev.event_type]||"#6B7280",color:"white",borderRadius:"0.5rem",padding:"0.3rem 0.65rem",fontWeight:800,fontSize:"0.82rem",whiteSpace:"nowrap",flexShrink:0 }}>
                        {new Date(ev.event_date+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:700, fontSize:"0.9rem", color:"#1E293B", margin:0 }}>{ev.title}</p>
                        {ev.file_url && <a href={ev.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.75rem",color:"#22C55E",fontWeight:700 }}>📎 Document joint</a>}
                      </div>
                      <Bdg color={EV_COLORS[ev.event_type]||"#6B7280"}>{ev.event_type}</Bdg>
                      <Btns onEdit={()=>{setEditingEvent(ev);setOpenForm(false);}} onDelete={()=>del("events",ev.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── DOCUMENTS ── */}
          {section === "documents" && (
            <SectionWrap title="Documents à télécharger" color="#7C3AED" onAdd={() => { setOpenForm(o => !o); setEditingDoc(null); }}>
              {openForm && !editingDoc && (
                <form onSubmit={submitDoc} style={fmS("#F5F3FF","#E9D5FF")}>
                  <G2><FF label="Icône (emoji)" value={docForm.icon} onChange={v=>setDocForm({...docForm,icon:v})} />
                    <FF label="Nom du document" value={docForm.title} onChange={v=>setDocForm({...docForm,title:v})} required /></G2>
                  <FUF label="📎 Fichier (PDF, image…)" value={docForm.file_url} onChange={v=>setDocForm({...docForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <FA onCancel={resetForm} color="#7C3AED" />
                </form>
              )}
              {editingDoc && (
                <form onSubmit={submitEditDoc} style={fmS("#F5F3FF","#E9D5FF")}>
                  <p style={eL}>✏️ Modifier le document</p>
                  <G2><FF label="Icône" value={editingDoc.icon} onChange={v=>setEditingDoc({...editingDoc,icon:v})} />
                    <FF label="Titre" value={editingDoc.title} onChange={v=>setEditingDoc({...editingDoc,title:v})} required /></G2>
                  <FUF label="📎 Fichier / URL" value={editingDoc.file_url??""} onChange={v=>setEditingDoc({...editingDoc,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <FA onCancel={()=>setEditingDoc(null)} color="#7C3AED" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {parentDocs.length === 0 && !openForm && <Emp icon="📋" text="Aucun document." />}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"0.75rem" }}>
                {parentDocs.map(doc => (
                  <Card key={doc.id} borderColor="#E9D5FF">
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <span style={{ fontSize:"1.75rem" }}>{doc.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ ...cT, overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{doc.title}</p>
                        {doc.file_url ? <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.75rem",color:"#7C3AED",fontWeight:700 }}>📎 Voir</a>
                          : <span style={{ fontSize:"0.75rem",color:"#94A3B8",fontWeight:600 }}>Pas de fichier</span>}
                      </div>
                      <Btns onEdit={()=>{setEditingDoc(doc);setOpenForm(false);}} onDelete={()=>del("documents",doc.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── PLANIFICATIONS ── */}
          {section === "planifications" && (
            <SectionWrap title="Planifications pédagogiques" color="#16A34A" onAdd={() => { setOpenForm(o => !o); setEditingPlan(null); }}>
              {openForm && !editingPlan && (
                <form onSubmit={submitPlan} style={fmS("#F0FDF4","#BBF7D0")}>
                  <G3><FF label="Titre" value={planForm.title} onChange={v=>setPlanForm({...planForm,title:v})} required />
                    <FS label="Période" value={planForm.period} onChange={v=>setPlanForm({...planForm,period:v})} opts={["Période 1","Période 2","Période 3","Période 4","Période 5"]} />
                    <FS label="Matière" value={planForm.subject} onChange={v=>setPlanForm({...planForm,subject:v})} opts={SUBJECTS} /></G3>
                  <FS label="Niveau" value={planForm.level} onChange={v=>setPlanForm({...planForm,level:v})} opts={LEVELS} />
                  <RTE key={`plan-${formResetKey}`} label="Contenu de la planification" initialValue={planForm.content} onChange={v=>setPlanForm({...planForm,content:v})} minHeight="240px" required />
                  <FUF label="📎 Joindre un fichier (PDF, image…)" value={planForm.file_url} onChange={v=>setPlanForm({...planForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={planForm.color} onChange={v=>setPlanForm({...planForm,color:v})} />
                  <FA onCancel={resetForm} color="#16A34A" />
                </form>
              )}
              {editingPlan && (
                <form onSubmit={submitEditPlan} style={fmS("#F0FDF4","#BBF7D0")}>
                  <p style={eL}>✏️ Modifier la planification</p>
                  <G3><FF label="Titre" value={editingPlan.title} onChange={v=>setEditingPlan({...editingPlan,title:v})} required />
                    <FS label="Période" value={editingPlan.period} onChange={v=>setEditingPlan({...editingPlan,period:v})} opts={["Période 1","Période 2","Période 3","Période 4","Période 5"]} />
                    <FS label="Matière" value={editingPlan.subject} onChange={v=>setEditingPlan({...editingPlan,subject:v})} opts={SUBJECTS} /></G3>
                  <FS label="Niveau" value={editingPlan.level} onChange={v=>setEditingPlan({...editingPlan,level:v})} opts={LEVELS} />
                  <RTE key={`plane-${editingPlan.id}`} label="Contenu" initialValue={editingPlan.content} onChange={v=>setEditingPlan({...editingPlan,content:v})} minHeight="240px" />
                  <FUF label="📎 Fichier joint" value={editingPlan.file_url??""} onChange={v=>setEditingPlan({...editingPlan,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={editingPlan.color??""} onChange={v=>setEditingPlan({...editingPlan,color:v})} />
                  <FA onCancel={()=>setEditingPlan(null)} color="#16A34A" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {plannings.length === 0 && !openForm && <Emp icon="📅" text="Aucune planification." />}
              <div style={g2}>
                {plannings.map(p => (
                  <Card key={p.id} borderColor="#BBF7D0">
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ flex:1 }}>
                        <p style={cT}>{p.title}</p>
                        <div style={{ display:"flex",gap:"0.35rem",flexWrap:"wrap",margin:"0.3rem 0 0.5rem" }}><Bdg color="#16A34A">{p.period}</Bdg><Bdg color="#2563EB">{p.subject}</Bdg><Bdg color="#F97316">{p.level}</Bdg></div>
                        <div style={{ fontSize:"0.8rem",color:"#374151",lineHeight:1.5,maxHeight:"80px",overflow:"hidden" }} dangerouslySetInnerHTML={{ __html: p.content }} />
                        {p.file_url && <a href={p.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.78rem",color:"#16A34A",fontWeight:700,display:"inline-block",marginTop:"0.35rem" }}>📎 Fichier joint</a>}
                      </div>
                      <Btns onEdit={()=>{setEditingPlan(p);setOpenForm(false);}} onDelete={()=>del("planning",p.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── CORRECTIONS ── */}
          {section === "corrections" && (
            <SectionWrap title="Corrections de Dictées" color="#F97316" onAdd={() => { setOpenForm(o => !o); setEditingCorr(null); }}>
              {openForm && !editingCorr && (
                <form onSubmit={submitCorr} style={fmS("#FFF7ED","#FED7AA")}>
                  <G2><FF label="Titre de la dictée" value={corrForm.title} onChange={v=>setCorrForm({...corrForm,title:v})} required />
                    <FS label="Niveau" value={corrForm.level} onChange={v=>setCorrForm({...corrForm,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`dt-${formResetKey}`} label="Texte de la dictée" initialValue={corrForm.dictee_text} onChange={v=>setCorrForm({...corrForm,dictee_text:v})} minHeight="140px" required />
                  <RTE key={`dc-${formResetKey}`} label="Correction attendue" initialValue={corrForm.correction} onChange={v=>setCorrForm({...corrForm,correction:v})} minHeight="140px" required />
                  <G2>
                    <RTE key={`db-${formResetKey}`} label="Barème (optionnel)" initialValue={corrForm.bareme} onChange={v=>setCorrForm({...corrForm,bareme:v})} minHeight="80px" />
                    <RTE key={`dn-${formResetKey}`} label="Notes / Remarques" initialValue={corrForm.notes} onChange={v=>setCorrForm({...corrForm,notes:v})} minHeight="80px" />
                  </G2>
                  <FUF label="📎 Joindre un fichier (PDF, image…)" value={corrForm.file_url} onChange={v=>setCorrForm({...corrForm,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={corrForm.color} onChange={v=>setCorrForm({...corrForm,color:v})} />
                  <FA onCancel={resetForm} color="#F97316" />
                </form>
              )}
              {editingCorr && (
                <form onSubmit={submitEditCorr} style={fmS("#FFF7ED","#FED7AA")}>
                  <p style={eL}>✏️ Modifier la correction</p>
                  <G2><FF label="Titre" value={editingCorr.title} onChange={v=>setEditingCorr({...editingCorr,title:v})} required />
                    <FS label="Niveau" value={editingCorr.level} onChange={v=>setEditingCorr({...editingCorr,level:v})} opts={LEVELS} /></G2>
                  <RTE key={`dte-${editingCorr.id}`} label="Texte" initialValue={editingCorr.dictee_text} onChange={v=>setEditingCorr({...editingCorr,dictee_text:v})} minHeight="140px" />
                  <RTE key={`dce-${editingCorr.id}`} label="Correction" initialValue={editingCorr.correction} onChange={v=>setEditingCorr({...editingCorr,correction:v})} minHeight="140px" />
                  <G2>
                    <RTE key={`dbe-${editingCorr.id}`} label="Barème" initialValue={editingCorr.bareme??""} onChange={v=>setEditingCorr({...editingCorr,bareme:v})} minHeight="80px" />
                    <RTE key={`dne-${editingCorr.id}`} label="Notes" initialValue={editingCorr.notes??""} onChange={v=>setEditingCorr({...editingCorr,notes:v})} minHeight="80px" />
                  </G2>
                  <FUF label="📎 Fichier joint" value={editingCorr.file_url??""} onChange={v=>setEditingCorr({...editingCorr,file_url:v})} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <ColorPicker value={editingCorr.color??""} onChange={v=>setEditingCorr({...editingCorr,color:v})} />
                  <FA onCancel={()=>setEditingCorr(null)} color="#F97316" saveLabel="💾 Sauvegarder" />
                </form>
              )}
              {corrections.length === 0 && !openForm && <Emp icon="✅" text="Aucune correction." />}
              <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
                {corrections.map(c => (
                  <Card key={c.id} borderColor="#FED7AA">
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div>
                        <p style={cT}>{c.title}</p>
                        <div style={{ display:"flex",gap:"0.4rem",marginTop:"0.3rem" }}><Bdg color="#F97316">{c.level}</Bdg>{c.week_number?<Bdg color="#64748B">Semaine {c.week_number}</Bdg>:null}</div>
                      </div>
                      <Btns onEdit={()=>{setEditingCorr(c);setOpenForm(false);}} onDelete={()=>del("corrections",c.id)} />
                    </div>
                    <details style={{ marginTop:"0.75rem" }}>
                      <summary style={{ cursor:"pointer",fontWeight:700,color:"#F97316",fontSize:"0.85rem" }}>Voir le détail ▾</summary>
                      <div style={{ marginTop:"0.6rem",display:"flex",flexDirection:"column",gap:"0.5rem",paddingTop:"0.5rem",borderTop:"1px solid #FED7AA" }}>
                        <p style={dL}>📝 Texte dictée</p><div style={dT} dangerouslySetInnerHTML={{ __html:c.dictee_text }} />
                        <p style={dL}>✅ Correction</p><div style={dT} dangerouslySetInnerHTML={{ __html:c.correction }} />
                        {c.bareme&&<><p style={dL}>📊 Barème</p><div style={dT} dangerouslySetInnerHTML={{ __html:c.bareme }} /></>}
                        {c.notes &&<><p style={dL}>💬 Notes</p><div style={dT} dangerouslySetInnerHTML={{ __html:c.notes }} /></>}
                        {c.file_url && <a href={c.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.8rem",color:"#F97316",fontWeight:700 }}>📎 Fichier joint</a>}
                      </div>
                    </details>
                  </Card>
                ))}
              </div>
            </SectionWrap>
          )}

          {/* ── PHOTOS ── */}
          {tab === "photos" && (
            <SectionWrap title="Galerie Photos" color="#EC4899" onAdd={() => { setOpenForm(o => !o); setEditingPhoto(null); setEditPhotoImages([]); }}>
              {openForm && !editingPhoto && (() => {
                const existingAlbums = [...new Set(photos.map(p => p.album))].filter(Boolean);
                return (
                  <form onSubmit={submitPhoto} style={fmS("#FDF2F8","#FBCFE8")}>
                    {/* Album selector */}
                    <div>
                      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.3rem" }}>Album</label>
                      <select value={photoForm.album} onChange={e=>setPhotoForm({...photoForm,album:e.target.value})} required style={{ width:"100%", padding:"0.55rem 0.7rem", borderRadius:"0.5rem", border:"2px solid #E2E8F0", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif" }}>
                        <option value="">-- Choisir un album --</option>
                        {existingAlbums.map(a => <option key={a} value={a}>📂 {a}</option>)}
                        <option value="__new__">✨ Créer un nouvel album…</option>
                      </select>
                      {photoForm.album === "__new__" && (
                        <input type="text" placeholder="Nom du nouvel album" value={photoForm.newAlbum} onChange={e=>setPhotoForm({...photoForm,newAlbum:e.target.value})} required
                          style={{ marginTop:"0.5rem", width:"100%", padding:"0.55rem 0.7rem", borderRadius:"0.5rem", border:"2px solid #FBCFE8", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif", boxSizing:"border-box" }} />
                      )}
                    </div>
                    {/* Multi-image upload */}
                    <div>
                      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.5rem" }}>
                        📷 Images {photoImages.filter(Boolean).length > 0 ? `(${photoImages.filter(Boolean).length} sélectionnée${photoImages.filter(Boolean).length > 1 ? "s" : ""})` : ""}
                      </label>
                      <MultiUpload images={photoImages} onChange={setPhotoImages} />
                    </div>
                    <RTE key={`ph-${formResetKey}`} label="Description commune (optionnel)" initialValue={photoForm.description} onChange={v=>setPhotoForm({...photoForm,description:v})} minHeight="80px" />
                    <FA onCancel={()=>{ setPhotoImages([""]); resetForm(); }} color="#EC4899" saveLabel="💾 Ajouter les photos" />
                  </form>
                );
              })()}
              {editingPhoto && (() => {
                const existingAlbums = [...new Set(photos.map(p => p.album))].filter(Boolean);
                // Initialiser les images si pas encore fait
                if (editPhotoImages.length === 0 && editingPhoto.image_url) {
                  setEditPhotoImages([editingPhoto.image_url]);
                }
                return (
                  <form onSubmit={submitEditPhoto} style={fmS("#FDF2F8","#FBCFE8")}>
                    <p style={eL}>✏️ Modifier / compléter l'album</p>
                    <div>
                      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.3rem" }}>Album</label>
                      <select value={editingPhoto.album} onChange={e=>setEditingPhoto({...editingPhoto,album:e.target.value})} style={{ width:"100%", padding:"0.55rem 0.7rem", borderRadius:"0.5rem", border:"2px solid #E2E8F0", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif" }}>
                        {existingAlbums.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.4rem" }}>
                        📷 Photos {editPhotoImages.filter(Boolean).length > 0 ? `(${editPhotoImages.filter(Boolean).length} sélectionnée${editPhotoImages.filter(Boolean).length > 1 ? "s" : ""})` : ""}
                      </label>
                      <p style={{ margin:"0 0 0.5rem", fontSize:"0.73rem", color:"#94A3B8" }}>La 1ère photo remplace l'image actuelle — les suivantes sont ajoutées à l'album.</p>
                      <MultiUpload images={editPhotoImages} onChange={setEditPhotoImages} />
                    </div>
                    <FA onCancel={()=>{ setEditingPhoto(null); setEditPhotoImages([]); }} color="#EC4899" saveLabel="💾 Sauvegarder" />
                  </form>
                );
              })()}
              {photos.length === 0 && !openForm && <Emp icon="📷" text="Aucune photo. Cliquez sur + Ajouter." />}
              {/* Albums groupés */}
              {[...new Set(photos.map(p => p.album))].map(album => (
                <div key={album} style={{ marginBottom:"1.5rem" }}>
                  <p style={{ fontWeight:800, fontSize:"0.9rem", color:"#EC4899", marginBottom:"0.6rem" }}>📂 {album} ({photos.filter(p=>p.album===album).length} photo{photos.filter(p=>p.album===album).length>1?"s":""})</p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.75rem" }}>
                    {photos.filter(p => p.album === album).map(p => (
                      <div key={p.id} style={{ borderRadius:"0.75rem", overflow:"hidden", border:"2px solid #FBCFE8", background:"white", boxShadow:"0 2px 8px rgba(236,72,153,0.08)" }}>
                        <div style={{ height:"100px", overflow:"hidden", background:"#FCE7F3", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {p.image_url && p.image_url !== "/images/placeholder-class.jpg"
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={getMediaUrl(p.image_url)} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                            : <span style={{ fontSize:"2rem", opacity:0.4 }}>📸</span>}
                        </div>
                        <div style={{ padding:"0.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{p.title}</span>
                          <Btns onEdit={()=>{ setEditingPhoto(p); setEditPhotoImages(p.image_url ? [p.image_url] : []); setOpenForm(false); }} onDelete={()=>del("photos",p.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </SectionWrap>
          )}

          {/* ── MESSAGES ── */}
          {tab === "messages" && (
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem" }}>
                <h2 style={{ fontWeight:900,fontSize:"1.1rem",color:"#1E293B",margin:0 }}>📬 Messages reçus ({contacts.length})</h2>
                {unreadCount>0 && <Bdg color="#DC2626">🔴 {unreadCount} non lu{unreadCount>1?"s":""}</Bdg>}
              </div>
              {contacts.length === 0 ? <Emp icon="📭" text="Aucun message reçu." /> : (
                <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
                  {contacts.map(c => (
                    <div key={c.id} style={{ background:"white",borderRadius:"1rem",border:`2px solid ${c.is_read?"#E2E8F0":"#FED7AA"}`,padding:"1rem 1.25rem",boxShadow:c.is_read?"none":"0 4px 16px rgba(249,115,22,0.1)" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",flexWrap:"wrap" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.4rem" }}>
                            {!c.is_read && <Bdg color="#DC2626">● Nouveau</Bdg>}
                            <p style={{ fontWeight:800,fontSize:"0.95rem",color:"#1E293B",margin:0 }}>{c.name}</p>
                            <a href={`mailto:${c.email}`} style={{ fontSize:"0.8rem",color:"#0891B2",fontWeight:600 }}>{c.email}</a>
                            <span style={{ fontSize:"0.75rem",color:"#94A3B8",fontWeight:600 }}>{new Date(c.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}</span>
                          </div>
                          <p style={{ fontWeight:700,fontSize:"0.88rem",color:"#374151",margin:"0 0 0.35rem" }}>Sujet : {c.subject}</p>
                          <p style={{ fontSize:"0.85rem",color:"#64748B",lineHeight:1.6,margin:0 }}>{c.message}</p>
                        </div>
                        <div style={{ display:"flex",gap:"0.4rem",flexShrink:0 }}>
                          {!c.is_read && <button onClick={()=>markRead(c.id)} style={{ background:"#22C55E",color:"white",border:"none",borderRadius:"0.5rem",padding:"0.4rem 0.75rem",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",fontFamily:"'Nunito',sans-serif" }}>✅ Lu</button>}
                          <button onClick={()=>del("contact",c.id)} style={{ background:"#EF4444",color:"white",border:"none",borderRadius:"0.5rem",padding:"0.4rem 0.65rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",fontFamily:"'Nunito',sans-serif" }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PARAMÈTRES ── */}
          {tab === "parametres" && (
            <div style={{ maxWidth:"500px" }}>
              <h2 style={{ fontWeight:900,fontSize:"1.1rem",color:"#1E293B",marginBottom:"1.5rem" }}>⚙️ Paramètres du compte</h2>
              <div style={{ background:"white",borderRadius:"1rem",border:"2px solid #E2E8F0",padding:"1.5rem",boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontWeight:800,color:"#374151",margin:"0 0 1.25rem",fontSize:"1rem" }}>🔑 Changer le mot de passe</h3>
                <form onSubmit={changePassword} style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
                  <FF label="Mot de passe actuel" type="password" value={pwdForm.current} onChange={v=>setPwdForm({...pwdForm,current:v})} required />
                  <FF label="Nouveau mot de passe" type="password" value={pwdForm.next} onChange={v=>setPwdForm({...pwdForm,next:v})} required />
                  <FF label="Confirmer" type="password" value={pwdForm.confirm} onChange={v=>setPwdForm({...pwdForm,confirm:v})} required />
                  {pwdMsg && <div style={{ padding:"0.65rem 1rem",borderRadius:"0.5rem",background:pwdMsg.type==="ok"?"#F0FDF4":"#FEF2F2",color:pwdMsg.type==="ok"?"#16A34A":"#DC2626",fontWeight:700,fontSize:"0.88rem",border:`1px solid ${pwdMsg.type==="ok"?"#BBF7D0":"#FECACA"}` }}>{pwdMsg.text}</div>}
                  <button type="submit" disabled={pwdLoading} style={{ background:"#374151",color:"white",border:"none",borderRadius:"0.75rem",padding:"0.65rem 1.25rem",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",fontFamily:"'Nunito',sans-serif" }}>
                    {pwdLoading?"Enregistrement...":"🔐 Modifier le mot de passe"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ═══════ Sub-components ═══════

function SectionWrap({ title, color, onAdd, children }: { title:string; color:string; onAdd:()=>void; children?:React.ReactNode }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", paddingBottom:"0.75rem", marginBottom:"1.25rem", borderBottom:`3px solid ${color}25` }}>
        <h2 style={{ fontWeight:900, fontSize:"1.05rem", color:"#1E293B", margin:0 }}>{title}</h2>
        <div style={{ flex:1 }} />
        <button onClick={onAdd} style={{ background:color, color:"white", border:"none", borderRadius:"0.6rem", padding:"0.45rem 1rem", fontWeight:800, fontSize:"0.83rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif", display:"flex", alignItems:"center", gap:"0.3rem" }}>＋ Ajouter</button>
      </div>
      {children}
    </div>
  );
}

function Card({ children, borderColor }: { children:React.ReactNode; borderColor:string }) {
  return <div style={{ background:"white", borderRadius:"0.875rem", border:`2px solid ${borderColor}`, padding:"1rem 1.1rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:"0" }}>{children}</div>;
}

function Btns({ onEdit, onDelete }: { onEdit:()=>void; onDelete:()=>void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem", flexShrink:0, marginLeft:"0.5rem" }}>
      <button onClick={onEdit} title="Modifier" style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        width:"2rem", height:"2rem", borderRadius:"0.5rem",
        background:"#FFF7ED", border:"1.5px solid #FED7AA",
        cursor:"pointer", fontSize:"0.85rem", transition:"all 0.15s",
        boxShadow:"0 1px 3px rgba(249,115,22,0.15)"
      }}>✏️</button>
      <button onClick={onDelete} title="Supprimer" style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        width:"2rem", height:"2rem", borderRadius:"0.5rem",
        background:"#FFF1F2", border:"1.5px solid #FECDD3",
        cursor:"pointer", fontSize:"0.85rem", transition:"all 0.15s",
        boxShadow:"0 1px 3px rgba(239,68,68,0.15)"
      }}>🗑️</button>
    </div>
  );
}

function FA({ onCancel, color, saveLabel="💾 Enregistrer" }: { onCancel:()=>void; color:string; saveLabel?:string }) {
  return (
    <div style={{ display:"flex", gap:"0.6rem", paddingTop:"0.25rem" }}>
      <button type="submit" style={{ background:color, color:"white", border:"none", borderRadius:"0.6rem", padding:"0.55rem 1.2rem", fontWeight:800, fontSize:"0.88rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>{saveLabel}</button>
      <button type="button" onClick={onCancel} style={{ background:"#F1F5F9", color:"#64748B", border:"none", borderRadius:"0.6rem", padding:"0.55rem 1.2rem", fontWeight:700, fontSize:"0.88rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>Annuler</button>
    </div>
  );
}

function FF({ label, value, onChange, required, type="text" }: { label:string; value:string; onChange:(v:string)=>void; required?:boolean; type?:string }) {
  return (
    <div>
      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.3rem" }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} required={required}
        style={{ width:"100%", padding:"0.55rem 0.7rem", borderRadius:"0.5rem", border:"2px solid #E2E8F0", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif", outline:"none", boxSizing:"border-box" }} />
    </div>
  );
}

function FS({ label, value, onChange, opts }: { label:string; value:string; onChange:(v:string)=>void; opts:string[] }) {
  return (
    <div>
      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.3rem" }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:"0.55rem 0.7rem", borderRadius:"0.5rem", border:"2px solid #E2E8F0", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif", outline:"none", background:"white", boxSizing:"border-box" }}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Rich Text Editor ──
function RTE({ label, initialValue="", onChange, minHeight="160px", required }: { label?:string; initialValue?:string; onChange:(html:string)=>void; minHeight?:string; required?:boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (ref.current) ref.current.innerHTML = initialValue; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exec = (cmd: string, val?: string) => { ref.current?.focus(); document.execCommand(cmd, false, val); sync(); };
  const sync = () => { if (ref.current) onChange(ref.current.innerHTML); };

  const BTNS = [
    { cmd:"bold",               label:"G",    style:{ fontWeight:"bold" as const } },
    { cmd:"italic",             label:"I",    style:{ fontStyle:"italic" as const } },
    { cmd:"underline",          label:"S",    style:{ textDecoration:"underline" as const } },
    { cmd:"insertUnorderedList",label:"• Liste", style:{} },
    { cmd:"insertOrderedList",  label:"1. Liste",style:{} },
    { cmd:"removeFormat",       label:"✕ Effacer",style:{} },
  ];

  return (
    <div>
      {label && <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.3rem" }}>{label}{required&&<span style={{ color:"#EF4444" }}> *</span>}</label>}
      <div style={{ border:"2px solid #E2E8F0", borderRadius:"0.6rem", overflow:"hidden", background:"white" }}>
        <div style={{ display:"flex", gap:"0.25rem", padding:"0.35rem 0.5rem", background:"#F8FAFC", borderBottom:"1px solid #E2E8F0", flexWrap:"wrap" }}>
          {BTNS.map(btn => (
            <button key={btn.cmd} type="button" onMouseDown={e=>{ e.preventDefault(); exec(btn.cmd); }}
              style={{ ...btn.style, padding:"0.18rem 0.55rem", borderRadius:"0.3rem", border:"1px solid #E2E8F0", background:"white", cursor:"pointer", fontSize:"0.78rem", fontFamily:"'Nunito',sans-serif" }}>
              {btn.label}
            </button>
          ))}
        </div>
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={sync}
          style={{ minHeight, padding:"0.75rem", outline:"none", fontSize:"0.88rem", fontFamily:"'Nunito',sans-serif", lineHeight:1.7, color:"#1E293B" }} />
      </div>
    </div>
  );
}

// ── Multi-image upload (max 5 slots) ──
function MultiUpload({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const list = Array.from(files);
    if (!list.length) return;
    setProgress({ done: 0, total: list.length });
    const results: string[] = [];
    for (const file of list) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.url) results.push(d.url);
      } catch { /* skip */ }
      setProgress(p => p ? { ...p, done: p.done + 1 } : null);
    }
    onChange([...images.filter(Boolean), ...results]);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    onChange(next.length ? next : []);
  }

  const uploaded = images.filter(Boolean);

  return (
    <div>
      {/* Drop zone / select button */}
      <div
        onClick={() => inputRef.current?.click()}
        style={{ border: "2px dashed #FBCFE8", borderRadius: "0.75rem", padding: "1.25rem", background: "#FDF2F8", cursor: "pointer", textAlign: "center", marginBottom: "0.75rem", transition: "background 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#FCE7F3")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FDF2F8")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.webp"
          multiple
          style={{ display: "none" }}
          onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); }}
        />
        <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>📷</div>
        {progress
          ? <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#EC4899" }}>⏳ Envoi {progress.done}/{progress.total}…</p>
          : <>
              <p style={{ margin: 0, fontWeight: 800, fontSize: "0.88rem", color: "#EC4899" }}>Cliquer pour sélectionner des photos</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>Sélection multiple possible (PNG, JPG, GIF, WebP)</p>
            </>
        }
      </div>
      {/* Thumbnails */}
      {uploaded.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: "0.5rem" }}>
          {uploaded.map((url, idx) => (
            <div key={idx} style={{ position: "relative", borderRadius: "0.55rem", overflow: "hidden", border: "2px solid #FBCFE8", height: "90px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getMediaUrl(url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => remove(idx)}
                style={{ position: "absolute", top: "3px", right: "3px", background: "rgba(220,38,38,0.85)", border: "none", borderRadius: "50%", width: "20px", height: "20px", color: "white", cursor: "pointer", fontWeight: 800, fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {uploaded.length > 0 && (
        <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "#94A3B8", textAlign: "right" }}>
          {uploaded.length} photo{uploaded.length > 1 ? "s" : ""} sélectionnée{uploaded.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

// ── File upload field ──
function FUF({ label, value, onChange, accept }: { label?:string; value:string; onChange:(url:string)=>void; accept?:string }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method:"POST", body:fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) onChange(data.url);
    else setErr(data.error || "Erreur upload");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.4rem" }}>{label}</label>}
      <div style={{ border:"2px solid #E2E8F0", borderRadius:"0.6rem", padding:"0.75rem", background:"#FAFAFA", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        <div style={{ display:"flex", gap:"0.6rem", alignItems:"center", flexWrap:"wrap" }}>
          <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display:"none" }} />
          <button type="button" onClick={()=>inputRef.current?.click()} disabled={uploading}
            style={{ background:"white", color:"#475569", border:"2px solid #E2E8F0", borderRadius:"0.5rem", padding:"0.4rem 0.85rem", fontWeight:700, fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif", display:"flex", alignItems:"center", gap:"0.4rem" }}>
            {uploading ? "⏳ Envoi en cours…" : "📎 Joindre un fichier"}
          </button>
          {value && <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize:"0.8rem",color:"#7C3AED",fontWeight:700,display:"flex",alignItems:"center",gap:"0.3rem" }}>✅ Fichier joint</a>}
          {err && <span style={{ fontSize:"0.78rem",color:"#EF4444",fontWeight:600 }}>{err}</span>}
        </div>
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="ou collez directement une URL (https://…)"
          style={{ width:"100%", padding:"0.4rem 0.65rem", borderRadius:"0.45rem", border:"1px solid #E2E8F0", fontSize:"0.8rem", fontFamily:"'Nunito',sans-serif", outline:"none", background:"white", boxSizing:"border-box" }} />
      </div>
    </div>
  );
}

// ── Color picker ──
const COLOR_SWATCHES = ["#3B82F6","#F97316","#22C55E","#EF4444","#A855F7","#EC4899","#0891B2","#FBBF24","#16A34A","#7C3AED","#DC2626","#64748B"];

function ColorPicker({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div>
      <label style={{ display:"block", fontWeight:700, fontSize:"0.8rem", color:"#374151", marginBottom:"0.35rem" }}>🎨 Couleur de la carte</label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.35rem", alignItems:"center" }}>
        <button type="button" onClick={()=>onChange("")} style={{ padding:"0.22rem 0.65rem", borderRadius:"1rem", border:`2px solid ${!value?"#374151":"#E2E8F0"}`, background:!value?"#F1F5F9":"white", fontWeight:700, fontSize:"0.75rem", cursor:"pointer", color:!value?"#374151":"#94A3B8", fontFamily:"'Nunito',sans-serif" }}>
          Auto
        </button>
        {COLOR_SWATCHES.map(c => (
          <button key={c} type="button" onClick={()=>onChange(c)} title={c} style={{
            width:"1.55rem", height:"1.55rem", borderRadius:"50%", background:c, border:`3px solid ${value===c?"#1E293B":"transparent"}`,
            cursor:"pointer", boxShadow:value===c?"0 0 0 2px white, 0 0 0 4px "+c:"none", outline:"none", transition:"all 0.12s",
          }} />
        ))}
      </div>
    </div>
  );
}

function Bdg({ children, color }: { children:React.ReactNode; color:string }) {
  return <span style={{ background:`${color}20`, color, padding:"0.15rem 0.5rem", borderRadius:"1rem", fontSize:"0.73rem", fontWeight:700 }}>{children}</span>;
}
function Emp({ icon, text }: { icon:string; text:string }) {
  return <div style={{ background:"white",borderRadius:"0.875rem",padding:"2.5rem",textAlign:"center",border:"2px dashed #E2E8F0",marginBottom:"1rem" }}><span style={{ fontSize:"2.5rem",display:"block",marginBottom:"0.5rem" }}>{icon}</span><p style={{ color:"#94A3B8",fontWeight:600,fontSize:"0.9rem" }}>{text}</p></div>;
}

// ── Layout helpers ──
function G2({ children }:{ children:React.ReactNode }) { return <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>{children}</div>; }
function G3({ children }:{ children:React.ReactNode }) { return <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem" }}>{children}</div>; }

// ── Style constants ──
const cT: React.CSSProperties = { fontWeight:800, fontSize:"0.92rem", color:"#1E293B", margin:0 };
const eL: React.CSSProperties = { fontWeight:800, color:"#374151", margin:"0 0 0.5rem", fontSize:"0.9rem" };
const dL: React.CSSProperties = { fontWeight:700, fontSize:"0.78rem", color:"#374151", margin:"0.25rem 0 0.1rem" };
const dT: React.CSSProperties = { fontSize:"0.85rem", color:"#475569", lineHeight:1.6 };
const g2: React.CSSProperties = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"0.75rem" };
function fmS(bg:string, border:string): React.CSSProperties {
  return { background:bg, border:`2px solid ${border}`, borderRadius:"0.875rem", padding:"1.25rem", marginBottom:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" };
}
