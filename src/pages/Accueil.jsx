import { useNavigate } from 'react-router-dom'
import { lireCompteur, lireFeedbacks } from '../services/sheets'
import { useEffect, useState } from 'react'

const LANGS = {
  fr: {
    nav_commencer: 'Commencer',
    hero_badge: 'Test officiel RIASEC · Adapté au contexte marocain',
    hero_title1: 'Découvre ta voie,',
    hero_title2: 'construis ton avenir',
    hero_desc: "72 questions pour identifier ton profil de personnalité et t\u2019orienter vers les filières et métiers qui te correspondent vraiment.",
    hero_btn: 'Commencer mon test gratuit →',
    hero_sub: '15 à 20 min · Résultat immédiat · Rapport PDF gratuit',
    stats: ['Questions', 'Dimensions RIASEC', 'Métiers proposés', 'Gratuit'],
    dims_title: 'Les 6 dimensions RIASEC',
    dims_sub: 'Chaque personne est une combinaison unique de ces 6 profils',
    how_title: 'Comment ça marche ?',
    how_sub: "5 étapes simples, de ton code d\u2019accès à ton rapport PDF",
    cta_title: 'Prêt à découvrir ton profil ?',
    cta_desc: 'Rejoins des milliers de bacheliers marocains qui ont déjà découvert leur voie grâce à Atlas Tawjih.',
    cta_btn: 'Commencer maintenant →',
    footer_rights: 'Tous droits réservés',
    compteur_label: 'BACHELIERS ONT DÉJÀ PASSÉ LE TEST',
    compteur_sub: 'et découvert leur profil RIASEC',
    feedback_title: 'Ce qu\u2019ils disent',
    feedback_sub: 'Avis vérifiés par l\u2019équipe Atlas Tawjih',
    dims: [
      { lettre: 'R', nom: 'Réaliste',      desc: 'Travail manuel, outils, nature, technique' },
      { lettre: 'I', nom: 'Investigateur', desc: 'Sciences, analyse, recherche, curiosité' },
      { lettre: 'A', nom: 'Artistique',    desc: 'Créativité, arts, expression, imagination' },
      { lettre: 'S', nom: 'Social',        desc: 'Aide, enseignement, écoute, coopération' },
      { lettre: 'E', nom: 'Entreprenant',  desc: 'Leadership, commerce, action, initiative' },
      { lettre: 'C', nom: 'Conventionnel', desc: 'Organisation, ordre, méthode, précision' },
    ],
    etapes: [
      { icon: '🔑', label: "Code d\u2019accès",  desc: 'Saisir ton code unique' },
      { icon: '📋', label: 'Ton profil',          desc: 'Quelques infos rapides' },
      { icon: '✏️', label: '72 questions',         desc: '15 à 20 minutes guidées' },
      { icon: '📊', label: 'Tes résultats',        desc: 'Profil + métiers + domaines' },
      { icon: '📄', label: 'Rapport PDF',          desc: 'Téléchargeable gratuitement' },
    ],
    fb_types: { eleve: 'Élève', tuteur: 'Parent / Tuteur', centre: 'Centre Scolaire', etablissement: 'Établissement' },
  },
  en: {
    nav_commencer: 'Get Started',
    hero_badge: 'Official RIASEC Test · Adapted for Moroccan students',
    hero_title1: 'Discover your path,',
    hero_title2: 'build your future',
    hero_desc: '72 questions to identify your personality profile and guide you toward the fields and careers that truly match who you are.',
    hero_btn: 'Start my free test →',
    hero_sub: '15 to 20 min · Instant results · Free PDF report',
    stats: ['Questions', 'RIASEC Dimensions', 'Careers suggested', 'Free'],
    dims_title: 'The 6 RIASEC Dimensions',
    dims_sub: 'Every person is a unique combination of these 6 profiles',
    how_title: 'How does it work?',
    how_sub: '5 simple steps, from your access code to your PDF report',
    cta_title: 'Ready to discover your profile?',
    cta_desc: 'Join thousands of Moroccan students who already found their path with Atlas Tawjih.',
    cta_btn: 'Start now →',
    footer_rights: 'All rights reserved',
    compteur_label: 'STUDENTS HAVE ALREADY TAKEN THE TEST',
    compteur_sub: 'and discovered their RIASEC profile',
    feedback_title: 'What they say',
    feedback_sub: 'Reviews verified by the Atlas Tawjih team',
    dims: [
      { lettre: 'R', nom: 'Realistic',      desc: 'Manual work, tools, nature, technical' },
      { lettre: 'I', nom: 'Investigative',  desc: 'Science, analysis, research, curiosity' },
      { lettre: 'A', nom: 'Artistic',       desc: 'Creativity, arts, expression, imagination' },
      { lettre: 'S', nom: 'Social',         desc: 'Helping, teaching, listening, cooperating' },
      { lettre: 'E', nom: 'Enterprising',   desc: 'Leadership, business, action, initiative' },
      { lettre: 'C', nom: 'Conventional',   desc: 'Organization, order, method, precision' },
    ],
    etapes: [
      { icon: '🔑', label: 'Access code',   desc: 'Enter your unique code' },
      { icon: '📋', label: 'Your profile',  desc: 'A few quick details' },
      { icon: '✏️', label: '72 questions',  desc: '15 to 20 guided minutes' },
      { icon: '📊', label: 'Your results',  desc: 'Profile + careers + fields' },
      { icon: '📄', label: 'PDF Report',    desc: 'Download for free' },
    ],
    fb_types: { eleve: 'Student', tuteur: 'Parent / Tutor', centre: 'Tutoring Center', etablissement: 'School' },
  },
}

const DIM_STYLES = [
  { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
  { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB' },
  { bg: '#F5F3FF', border: '#DDD6FE', color: '#7C3AED' },
  { bg: '#F0FDF4', border: '#BBF7D0', color: '#059669' },
  { bg: '#FFFBEB', border: '#FDE68A', color: '#D97706' },
  { bg: '#ECFEFF', border: '#A5F3FC', color: '#0891B2' },
]

const STAT_NUMS  = ['72', '6', '10+', '100%']
const STAT_ICONS = [
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
]

const FB_ICONS = { eleve: '🎓', tuteur: '👨‍👩‍👧', centre: '🏫', etablissement: '🏛️' }

// ── Animated counter hook ──────────────────────────────────
function useAnimatedCount(target, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return count
}

export default function Accueil() {
  const navigate = useNavigate()
  const [lang, setLang]         = useState('fr')
  const [visible, setVisible]   = useState(false)
  const [compteur, setCompteur] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [fbIndex, setFbIndex]   = useState(0)
  const t = LANGS[lang]
  const animCount = useAnimatedCount(compteur)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    lireCompteur().then(n => { if (n !== null) setCompteur(n) })
    lireFeedbacks().then(data => setFeedbacks(data))
  }, [])

  // Auto-slide feedbacks
  useEffect(() => {
    if (feedbacks.length <= 1) return
    const t = setInterval(() => setFbIndex(i => (i + 1) % feedbacks.length), 4000)
    return () => clearInterval(t)
  }, [feedbacks])

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── STYLE GLOBAL ANIMATIONS ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes slideIn{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer{ 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .fb-card { animation: fadeUp 0.5s ease both; }
        .dim-card:hover { transform: translateY(-4px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        {/* Logo texte */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 0.5, boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}>AT</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>Atlas Tawjih</div>
            <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>ORIENTATION</div>
          </div>
        </div>
        {/* Lang + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
            {['fr', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 11px', borderRadius: 6, border: 'none', background: lang === l ? '#7C3AED' : 'transparent', color: lang === l ? '#fff' : '#64748B', fontSize: 12, fontWeight: lang === l ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/code')} style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
            {t.nav_commencer}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 50%,#F0F9FF 100%)', padding: '64px 24px 52px', textAlign: 'center', borderBottom: '1px solid #E2E8F0', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EDE9FE', border: '1px solid #C4B5FD', color: '#5B21B6', fontSize: 12, padding: '5px 14px', borderRadius: 20, marginBottom: 18 }}>
          <span>🎯</span> {t.hero_badge}
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#1E293B', lineHeight: 1.2, maxWidth: 580, margin: '0 auto 16px' }}>
          {t.hero_title1}<br />
          <span style={{ color: '#7C3AED' }}>{t.hero_title2}</span>
        </h1>
        <p style={{ fontSize: 15, color: '#64748B', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.75 }}>{t.hero_desc}</p>
        <button onClick={() => navigate('/code')} style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: '#fff', border: 'none', padding: '14px 34px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,58,237,0.4)', animation: 'float 3s ease-in-out infinite' }}>
          {t.hero_btn}
        </button>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>{t.hero_sub}</div>
      </section>

      {/* ── STATS ── */}
      <section style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        {STAT_NUMS.map((num, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '22px 8px', borderRight: i < 3 ? '1px solid #E2E8F0' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 40, height: 40, background: '#F5F3FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{STAT_ICONS[i]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#7C3AED' }}>{num}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.stats[i]}</div>
          </div>
        ))}
      </section>

      {/* ── DIMENSIONS ── */}
      <section style={{ padding: '36px 24px', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6, textAlign: 'center' }}>{t.dims_title}</h2>
        <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 22 }}>{t.dims_sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {t.dims.map((d, i) => (
            <div key={i} className="dim-card" style={{ background: DIM_STYLES[i].bg, border: `1px solid ${DIM_STYLES[i].border}`, borderRadius: 12, padding: '16px', cursor: 'default', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: DIM_STYLES[i].color, marginBottom: 3 }}>{d.lettre}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{d.nom}</div>
              <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT CA MARCHE ── */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '36px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6, textAlign: 'center' }}>{t.how_title}</h2>
        <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 26 }}>{t.how_sub}</p>
        <div style={{ display: 'flex', maxWidth: 720, margin: '0 auto', alignItems: 'flex-start' }}>
          {t.etapes.map((e, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              {i < t.etapes.length - 1 && <div style={{ position: 'absolute', top: 21, right: '-10%', width: '20%', height: 2, background: 'linear-gradient(90deg,#DDD6FE,#E2E8F0)', zIndex: 0 }} />}
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EDE9FE', border: '2px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 20, position: 'relative', zIndex: 1 }}>{e.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', marginBottom: 3 }}>{e.label}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.4 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPTEUR MODERNE ── */}
      {compteur !== null && (
        <section style={{ padding: '0 0', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg,#1E1B4B 0%,#3B0764 50%,#1E1B4B 100%)', padding: '48px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Cercles décoratifs */}
            <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, right: -20, width: 260, height: 260, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '20%', width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', opacity: 0.6, animation: 'pulse 2s infinite' }} />
            <div style={{ position: 'absolute', top: '30%', right: '25%', width: 6, height: 6, borderRadius: '50%', background: '#C4B5FD', opacity: 0.5, animation: 'pulse 2.5s infinite' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
                <span style={{ fontSize: 14 }}>🚀</span>
                <span style={{ fontSize: 11, color: '#C4B5FD', letterSpacing: 1, fontWeight: 600 }}>
                  {lang === 'fr' ? 'EN TEMPS RÉEL' : 'REAL TIME'}
                </span>
              </div>

              {/* Grand chiffre animé */}
              <div style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, background: 'linear-gradient(135deg,#fff,#DDD6FE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -2 }}>
                {animCount.toLocaleString()}
              </div>

              <div style={{ fontSize: 14, fontWeight: 700, color: '#A78BFA', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
                {t.compteur_label}
              </div>
              <div style={{ fontSize: 13, color: '#7C3AED', opacity: 0.7 }}>{t.compteur_sub}</div>

              {/* Barre décorative */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                {['R','I','A','S','E','C'].map((l, i) => (
                  <div key={l} style={{ width: 32, height: 4, borderRadius: 2, background: ['#EF4444','#3B82F6','#8B5CF6','#10B981','#F59E0B','#06B6D4'][i], opacity: 0.8, animation: `pulse ${1.5 + i*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEEDBACKS ── */}
      {feedbacks.length > 0 && (
        <section style={{ padding: '48px 24px', background: 'linear-gradient(180deg,#F8FAFC,#fff)', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EDE9FE', border: '1px solid #DDD6FE', borderRadius: 20, padding: '4px 14px', marginBottom: 12 }}>
              <span>💬</span>
              <span style={{ fontSize: 11, color: '#5B21B6', fontWeight: 600 }}>{lang === 'fr' ? 'TÉMOIGNAGES' : 'TESTIMONIALS'}</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{t.feedback_title}</h2>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>{t.feedback_sub}</p>
          </div>

          {/* Grille ou carousel selon nombre */}
          {feedbacks.length <= 3 ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${feedbacks.length},1fr)`, gap: 16, maxWidth: 860, margin: '0 auto' }}>
              {feedbacks.map((fb, i) => <FeedbackCard key={i} fb={fb} t={t} delay={i * 100} />)}
            </div>
          ) : (
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              {/* Carousel */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
                {[0,1,2].map(offset => {
                  const idx = (fbIndex + offset) % feedbacks.length
                  return <FeedbackCard key={idx} fb={feedbacks[idx]} t={t} delay={offset * 80} />
                })}
              </div>
              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                {feedbacks.map((_, i) => (
                  <div key={i} onClick={() => setFbIndex(i)} style={{ width: i === fbIndex ? 20 : 8, height: 8, borderRadius: 4, background: i === fbIndex ? '#7C3AED' : '#DDD6FE', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius: 20, padding: '36px 28px', maxWidth: 520, margin: '0 auto', boxShadow: '0 12px 40px rgba(124,58,237,0.3)' }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🚀</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{t.cta_title}</h3>
          <p style={{ fontSize: 13, color: '#DDD6FE', marginBottom: 22, lineHeight: 1.7 }}>{t.cta_desc}</p>
          <button onClick={() => navigate('/code')} style={{ background: '#fff', color: '#7C3AED', border: 'none', padding: '13px 30px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>{t.cta_btn}</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1E293B', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, background: '#7C3AED', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11 }}>AT</div>
          <span style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700 }}>Atlas Tawjih</span>
          <span style={{ color: '#475569' }}>·</span>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>أطلس توجيه</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>atlastawjih.maroc@gmail.com</div>
        <div style={{ fontSize: 11, color: '#475569' }}>{t.footer_rights} © {new Date().getFullYear()} · Atlas Tawjih</div>
      </footer>
    </div>
  )
}

// ── Composant carte feedback ───────────────────────────────
function FeedbackCard({ fb, t, delay = 0 }) {
  const stars = Number(fb.note) || 0
  const typeLabel = t.fb_types[fb.type] || fb.type
  const dimColor = { eleve:'#7C3AED', tuteur:'#059669', centre:'#2563EB', etablissement:'#D97706' }[fb.type] || '#7C3AED'

  return (
    <div className="fb-card" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', transition: 'all 0.2s', animationDelay: `${delay}ms`, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${dimColor},${dimColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          {FB_ICONS[fb.type] || '👤'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fb.prenom}</div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
            <span style={{ background: `${dimColor}18`, color: dimColor, padding: '1px 7px', borderRadius: 10, fontWeight: 600, fontSize: 10 }}>{typeLabel}</span>
            {fb.ville && <span style={{ marginLeft: 5 }}>· {fb.ville}</span>}
          </div>
        </div>
      </div>
      {/* Étoiles */}
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 16, color: i <= stars ? '#F59E0B' : '#E2E8F0' }}>★</span>
        ))}
      </div>
      {/* Message */}
      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, fontStyle: 'italic', margin: 0, borderLeft: `3px solid ${dimColor}`, paddingLeft: 10 }}>
        "{fb.message}"
      </p>
    </div>
  )
}
