import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FILIERES = {
  fr: [
    'Sciences Mathématiques A (SMA)',
    'Sciences Mathématiques B (SMB)',
    'Sciences Physiques et Chimiques (PC)',
    'Sciences de la Vie et de la Terre (SVT)',
    'Sciences Économiques (ECO)',
    'Sciences de Gestion Comptable (SGC)',
    'Sciences et Technologies Électriques (STE)',
    'Sciences et Technologies Mécaniques (STM)',
    'Arts Appliqués',
    'Sciences Humaines',
    'Lettres et Sciences Humaines',
    'Autre',
  ],
  en: [
    'Mathematical Sciences A (SMA)',
    'Mathematical Sciences B (SMB)',
    'Physical and Chemical Sciences (PC)',
    'Life and Earth Sciences (SVT)',
    'Economic Sciences (ECO)',
    'Accounting Management Sciences (SGC)',
    'Electrical Technologies (STE)',
    'Mechanical Technologies (STM)',
    'Applied Arts',
    'Human Sciences',
    'Letters and Human Sciences',
    'Other',
  ],
}

const TEXTS = {
  fr: {
    etape: 'Étape 2 sur 4',
    titre: 'Tes informations personnelles',
    desc: 'Ces informations seront intégrées dans ton rapport PDF final.',
    prenom: 'Prénom',
    prenom_ph: 'Ex : Youssef',
    nom: 'Nom',
    nom_ph: 'Ex : El Amrani',
    filiere: 'Filière du Baccalauréat',
    filiere_ph: '-- Sélectionne ta filière --',
    ville: 'Ville',
    ville_ph: 'Ex : Marrakech',
    mobilite: "Est-ce que tu acceptes d'étudier dans une ville différente de la tienne ?",
    mobilite_hint: "Si une école qui te correspond est dans une autre ville, serais-tu prêt(e) à y aller ?",
    mob_non: 'Non, je reste dans ma ville',
    mob_oui: 'Oui, peu importe la ville',
    mob_partiel: 'Oui, mais dans certaines villes seulement',
    prive: 'Es-tu intéressé(e) par les écoles privées ?',
    prive_oui: 'Oui',
    prive_non: 'Non',
    btn: 'Commencer le test →',
    retour: '← Retour',
    erreur_prenom: 'Le prénom est obligatoire (min. 2 caractères)',
    erreur_nom: 'Le nom est obligatoire (min. 2 caractères)',
    erreur_filiere: 'Sélectionne ta filière',
    erreur_ville: 'La ville est obligatoire',
    erreur_mobilite: 'Choisis une option',
    erreur_prive: 'Choisis une option',
  },
  en: {
    etape: 'Step 2 of 4',
    titre: 'Your personal information',
    desc: 'This information will be included in your final PDF report.',
    prenom: 'First name',
    prenom_ph: 'Ex: Youssef',
    nom: 'Last name',
    nom_ph: 'Ex: El Amrani',
    filiere: 'Baccalaureate field',
    filiere_ph: '-- Select your field --',
    ville: 'City',
    ville_ph: 'Ex: Marrakech',
    mobilite: 'Are you willing to study in a different city?',
    mobilite_hint: 'If a matching school is in another city, would you be willing to go there?',
    mob_non: 'No, I stay in my city',
    mob_oui: 'Yes, any city works',
    mob_partiel: 'Yes, but only certain cities',
    prive: 'Are you interested in private schools?',
    prive_oui: 'Yes',
    prive_non: 'No',
    btn: 'Start the test →',
    retour: '← Back',
    erreur_prenom: 'First name is required (min. 2 characters)',
    erreur_nom: 'Last name is required (min. 2 characters)',
    erreur_filiere: 'Please select your field',
    erreur_ville: 'City is required',
    erreur_mobilite: 'Please choose an option',
    erreur_prive: 'Please choose an option',
    completude_label: 'Form completion',
  },
}

// Capitalize : première lettre majuscule, reste minuscule
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Capitalize chaque mot (pour ville : ex "Casablanca", "Marrakech")
const capitalizeWords = (str) => {
  if (!str) return ''
  return str.split(' ').map(w => capitalize(w)).join(' ')
}

export default function Formulaire() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('fr')
  const changeLang = (l) => {
    setLang(l)
    // Reset filière quand on change de langue pour éviter les incohérences
    setForm(f => ({ ...f, filiere: '' }))
  }
  const t = TEXTS[lang]

  const [form, setForm] = useState({
    prenom: '', nom: '', filiere: '',
    ville: '', mobilite: '', prive: '',
  })
  const [erreurs, setErreurs] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Vérifier que l'élève a bien un code valide
  useEffect(() => {
    const code = sessionStorage.getItem('code_acces')
    if (!code) navigate('/code')
  }, [])

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErreurs(e => ({ ...e, [field]: '' }))
  }

  const valider = () => {
    const e = {}
    if (!form.prenom.trim() || form.prenom.trim().length < 2) e.prenom = t.erreur_prenom
    if (!form.nom.trim()    || form.nom.trim().length < 2)    e.nom    = t.erreur_nom
    if (!form.filiere)      e.filiere   = t.erreur_filiere
    if (!form.ville.trim()) e.ville     = t.erreur_ville
    if (!form.mobilite)     e.mobilite  = t.erreur_mobilite
    if (!form.prive)        e.prive     = t.erreur_prive
    setErreurs(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (!valider()) return
    sessionStorage.setItem('eleve', JSON.stringify(form))
    navigate('/test')
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${erreurs[field] ? '#EF4444' : form[field] ? '#7C3AED' : '#E2E8F0'}`,
    borderRadius: 8, fontSize: 13, color: '#1E293B',
    background: erreurs[field] ? '#FEF2F2' : '#fff',
    outline: 'none', transition: 'border 0.2s',
    boxSizing: 'border-box', fontFamily: "'Segoe UI', sans-serif",
  })

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#475569', marginBottom: 5,
  }

  const errStyle = {
    fontSize: 11, color: '#EF4444', marginTop: 4,
    display: 'flex', alignItems: 'center', gap: 4,
  }

  const radioOpt = (field, val, label) => {
    const selected = form[field] === val
    return (
      <div onClick={() => set(field, val)} style={{
        padding: '9px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${selected ? '#7C3AED' : '#E2E8F0'}`,
        background: selected ? '#F5F3FF' : '#fff',
        color: selected ? '#5B21B6' : '#475569',
        fontSize: 12, fontWeight: selected ? 600 : 400,
        transition: 'all 0.15s', userSelect: 'none',
      }}>
        <span style={{ marginRight: 6 }}>{selected ? '●' : '○'}</span>{label}
      </div>
    )
  }

  const completude = () => {
    const champs = Object.values(form)
    return Math.round((champs.filter(v => v.trim()).length / champs.length) * 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 0.5, boxShadow: '0 2px 8px rgba(124,58,237,0.35)', flexShrink: 0 }}>AT</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>Atlas Tawjih</div>
            <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>ORIENTATION</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
          {['fr', 'en'].map(l => (
            <button key={l} onClick={() => changeLang(l)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: lang === l ? '#7C3AED' : 'transparent', color: lang === l ? '#fff' : '#64748B', fontSize: 12, fontWeight: lang === l ? 600 : 400, cursor: 'pointer' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* BARRE DE PROGRESSION */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>{t.etape}</span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>50%</span>
          </div>
          <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #5B21B6)', borderRadius: 3, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {[
              { num: 1, label: lang === 'fr' ? 'Code'      : 'Code',    done: true  },
              { num: 2, label: lang === 'fr' ? 'Profil'    : 'Profile', done: false, active: true },
              { num: 3, label: lang === 'fr' ? 'Test'      : 'Test',    done: false },
              { num: 4, label: lang === 'fr' ? 'Résultats' : 'Results', done: false },
            ].map((e) => (
              <div key={e.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: e.done ? '#10B981' : e.active ? '#7C3AED' : '#E2E8F0',
                  color: e.done || e.active ? '#fff' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  border: e.active ? '2px solid #5B21B6' : e.done ? '2px solid #059669' : '2px solid #E2E8F0',
                }}>{e.done ? '✓' : e.num}</div>
                <span style={{ fontSize: 10, color: e.active ? '#7C3AED' : e.done ? '#059669' : '#94A3B8', fontWeight: e.active || e.done ? 600 : 400 }}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>

          {/* Titre */}
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{t.titre}</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>{t.desc}</p>
          </div>

          {/* Indicateur de complétude */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${completude()}%`, height: '100%', background: completude() === 100 ? '#10B981' : '#7C3AED', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: completude() === 100 ? '#059669' : '#7C3AED', minWidth: 36 }}>{completude()}%</span>
          </div>

          {/* FORMULAIRE */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Prénom + Nom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>{t.prenom} *</label>
                <input value={form.prenom} onChange={e => set('prenom', capitalize(e.target.value))} placeholder={t.prenom_ph} style={inputStyle('prenom')} />
                {erreurs.prenom && <div style={errStyle}>⚠ {erreurs.prenom}</div>}
              </div>
              <div>
                <label style={labelStyle}>{t.nom} *</label>
                <input value={form.nom} onChange={e => set('nom', capitalize(e.target.value))} placeholder={t.nom_ph} style={inputStyle('nom')} />
                {erreurs.nom && <div style={errStyle}>⚠ {erreurs.nom}</div>}
              </div>
            </div>

            {/* Filière */}
            <div>
              <label style={labelStyle}>{t.filiere} *</label>
              <select value={form.filiere} onChange={e => set('filiere', e.target.value)} style={{ ...inputStyle('filiere'), cursor: 'pointer' }}>
                <option value="">{t.filiere_ph}</option>
                {FILIERES[lang].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {erreurs.filiere && <div style={errStyle}>⚠ {erreurs.filiere}</div>}
            </div>

            {/* Ville */}
            <div>
              <label style={labelStyle}>{t.ville} *</label>
              <input value={form.ville} onChange={e => set('ville', capitalizeWords(e.target.value))} placeholder={t.ville_ph} style={inputStyle('ville')} />
              {erreurs.ville && <div style={errStyle}>⚠ {erreurs.ville}</div>}
            </div>

            {/* Mobilité */}
            <div>
              <label style={labelStyle}>{t.mobilite} *</label>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8, fontStyle: 'italic' }}>{t.mobilite_hint}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {radioOpt('mobilite', 'non',     t.mob_non)}
                {radioOpt('mobilite', 'oui',     t.mob_oui)}
                {radioOpt('mobilite', 'partiel', t.mob_partiel)}
              </div>
              {erreurs.mobilite && <div style={{ ...errStyle, marginTop: 6 }}>⚠ {erreurs.mobilite}</div>}
            </div>

            {/* Écoles privées */}
            <div>
              <label style={labelStyle}>{t.prive} *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {radioOpt('prive', 'oui', t.prive_oui)}
                {radioOpt('prive', 'non', t.prive_non)}
              </div>
              {erreurs.prive && <div style={{ ...errStyle, marginTop: 6 }}>⚠ {erreurs.prive}</div>}
            </div>

          </div>

          {/* BOUTONS */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={() => navigate('/code')} style={{ padding: '12px 20px', border: '1.5px solid #E2E8F0', borderRadius: 9, background: '#fff', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              {t.retour}
            </button>
            <button onClick={handleSubmit} style={{
              flex: 1, padding: '13px',
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              color: '#fff', border: 'none', borderRadius: 9,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
            }}>
              {t.btn}
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#1E293B', padding: '16px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>Atlas Tawjih</span>
          <span style={{ color: '#64748B' }}>·</span>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>أطلس توجيه</span>
        </div>
        <div style={{ fontSize: 11, color: '#475569' }}>atlastawjih.maroc@gmail.com</div>
      </footer>

    </div>
  )
}
