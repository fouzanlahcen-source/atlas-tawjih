import { useState } from 'react'
import { envoyerFeedback } from '../services/sheets'

const TYPES = {
  fr: [
    { id: 'eleve',         label: '🎓 Élève',                     desc: 'Tu viens de passer le test' },
    { id: 'tuteur',        label: '👨‍👩‍👧 Tuteur / Parent',          desc: 'Tu accompagnes un élève' },
    { id: 'centre',        label: '🏫 Centre de Soutien Scolaire', desc: 'Tu représentes un centre' },
    { id: 'etablissement', label: '🏛️ Établissement',              desc: 'Tu représentes un établissement' },
  ],
  en: [
    { id: 'eleve',         label: '🎓 Student',     desc: 'You just took the test' },
    { id: 'tuteur',        label: '👨‍👩‍👧 Tutor',      desc: 'You accompany a student' },
    { id: 'centre',        label: '🏫 Tutoring Center', desc: 'You represent a center' },
    { id: 'etablissement', label: '🏛️ School',       desc: 'You represent a school' },
  ],
}

const ROLES = {
  fr: ['Directeur(trice)', 'Conseiller(ère) en orientation', 'Enseignant(e)'],
  en: ['Director', 'Career counselor', 'Teacher'],
}

const T = {
  fr: {
    titre: 'Ton avis compte !',
    sous: 'Obligatoire avant de télécharger ton PDF — moins d\'une minute',
    qui: 'Tu es :',
    prenom: 'Prénom', prenom_ph: 'Ex : Youssef',
    nom_centre: 'Nom du centre', nom_centre_ph: 'Ex : Centre Réussite',
    nom_etab: "Nom de l'établissement", nom_etab_ph: 'Ex : Lycée Ibn Rochd',
    ville: 'Ville', ville_ph: 'Ex : Marrakech',
    role: 'Ton rôle',
    message: 'Ton message (max 3 lignes · français, anglais ou darija)',
    message_ph: 'Dis-nous ce que tu penses du test...',
    note_label: 'Note le test :',
    btn: '📄 Envoyer et télécharger mon PDF',
    sending: '⏳ Envoi...',
    merci: 'Merci pour ton feedback !',
    merci2: 'Ton PDF va se télécharger dans un instant...',
    e_type: 'Choisis qui tu es', e_note: 'Donne une note',
    e_msg: 'Écris un message (5 caractères min.)',
    e_prenom: 'Ton prénom est requis', e_ville: 'Ta ville est requise',
    e_role: 'Choisis ton rôle', e_nom: 'Ce champ est requis',
  },
  en: {
    titre: 'Your feedback matters!',
    sous: 'Required before downloading your PDF — less than a minute',
    qui: 'You are:',
    prenom: 'First name', prenom_ph: 'Ex: Youssef',
    nom_centre: 'Center name', nom_centre_ph: 'Ex: Success Center',
    nom_etab: 'School name', nom_etab_ph: 'Ex: Ibn Rochd High School',
    ville: 'City', ville_ph: 'Ex: Marrakech',
    role: 'Your role',
    message: 'Your message (max 3 lines)',
    message_ph: 'Tell us what you think about the test...',
    note_label: 'Rate the test:',
    btn: '📄 Send and download my PDF',
    sending: '⏳ Sending...',
    merci: 'Thank you for your feedback!',
    merci2: 'Your PDF will download in a moment...',
    e_type: 'Choose who you are', e_note: 'Please give a rating',
    e_msg: 'Write a message (min. 5 characters)',
    e_prenom: 'First name required', e_ville: 'City required',
    e_role: 'Choose your role', e_nom: 'This field is required',
  },
}

const inputStyle = (err, val) => ({
  width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13,
  border: `1.5px solid ${err ? '#EF4444' : val ? '#7C3AED' : '#E2E8F0'}`,
  background: err ? '#FEF2F2' : '#fff', outline: 'none',
  boxSizing: 'border-box', fontFamily: "'Segoe UI',sans-serif",
})

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
    {children} *
  </label>
)
const ErrMsg = ({ msg }) => msg
  ? <div style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>⚠ {msg}</div>
  : null

export default function Feedback({ lang = 'fr', profilRiasec = '', onValide }) {
  const t = T[lang]
  const [type, setType]       = useState('')
  const [prenom, setPrenom]   = useState('')
  const [nomOrg, setNomOrg]   = useState('')
  const [ville, setVille]     = useState('')
  const [role, setRole]       = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote]       = useState(0)
  const [hover, setHover]     = useState(0)
  const [err, setErr]         = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const clrErr = (k) => setErr(e => ({ ...e, [k]: '' }))

  const valider = () => {
    const e = {}
    if (!type)                     e.type    = t.e_type
    if (note === 0)                e.note    = t.e_note
    if (message.trim().length < 5) e.msg     = t.e_msg
    if (type === 'tuteur' && !prenom.trim())              e.prenom = t.e_prenom
    if ((type === 'centre' || type === 'etablissement') && !nomOrg.trim()) e.nom = t.e_nom
    if ((type === 'centre' || type === 'etablissement') && !ville.trim())  e.ville = t.e_ville
    if ((type === 'centre' || type === 'etablissement') && !role)          e.role  = t.e_role
    setErr(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!valider()) return
    setLoading(true)
    // Utilise le vrai prénom pour tous les types
    const nomAffiche =
      type === 'tuteur' ? prenom :
      type === 'eleve'  ? prenom :
      nomOrg

    await envoyerFeedback({
      type, prenom: nomAffiche, ville,
      profil: role || profilRiasec,
      message, note,
    })
    setLoading(false)
    setDone(true)
    if(onValide) onValide()
    setTimeout(() => onValide?.(), 1600)
  }

  if (done) return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#059669', marginBottom: 8 }}>{t.merci}</div>
      <div style={{ fontSize: 13, color: '#64748B' }}>{t.merci2}</div>
    </div>
  )

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>💬</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{t.titre}</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.sous}</div>
      </div>

      {/* QUI ES-TU */}
      <div style={{ marginBottom: 16 }}>
        <Label>{t.qui}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TYPES[lang].map(tp => (
            <div key={tp.id} onClick={() => { setType(tp.id); clrErr('type'); setRole(''); setPrenom(''); setNomOrg(''); setVille('') }}
              style={{ padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${type === tp.id ? '#7C3AED' : '#E2E8F0'}`, background: type === tp.id ? '#F5F3FF' : '#fff', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: type === tp.id ? '#5B21B6' : '#1E293B' }}>{tp.label}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{tp.desc}</div>
            </div>
          ))}
        </div>
        <ErrMsg msg={err.type} />
      </div>

      {/* CHAMPS TUTEUR */}
      {type === 'tuteur' && (
        <div style={{ marginBottom: 12 }}>
          <Label>{t.prenom}</Label>
          <input value={prenom} onChange={e => { setPrenom(e.target.value); clrErr('prenom') }}
            placeholder={t.prenom_ph} style={inputStyle(err.prenom, prenom)} />
          <ErrMsg msg={err.prenom} />
        </div>
      )}

      {/* CHAMPS CENTRE / ETABLISSEMENT */}
      {(type === 'centre' || type === 'etablissement') && (
        <>
          <div style={{ marginBottom: 12 }}>
            <Label>{type === 'centre' ? t.nom_centre : t.nom_etab}</Label>
            <input value={nomOrg} onChange={e => { setNomOrg(e.target.value); clrErr('nom') }}
              placeholder={type === 'centre' ? t.nom_centre_ph : t.nom_etab_ph} style={inputStyle(err.nom, nomOrg)} />
            <ErrMsg msg={err.nom} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>{t.ville}</Label>
            <input value={ville} onChange={e => { setVille(e.target.value); clrErr('ville') }}
              placeholder={t.ville_ph} style={inputStyle(err.ville, ville)} />
            <ErrMsg msg={err.ville} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>{t.role}</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ROLES[lang].map(r => (
                <div key={r} onClick={() => { setRole(r); clrErr('role') }}
                  style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${role === r ? '#7C3AED' : '#E2E8F0'}`, background: role === r ? '#F5F3FF' : '#fff', fontSize: 12, color: role === r ? '#5B21B6' : '#475569', fontWeight: role === r ? 600 : 400 }}>
                  {r}
                </div>
              ))}
            </div>
            <ErrMsg msg={err.role} />
          </div>
        </>
      )}

      {/* MESSAGE + NOTE + BOUTON — visible si type choisi */}
      {type && (
        <>
          {/* MESSAGE */}
          <div style={{ marginBottom: 16 }}>
            <Label>{t.message}</Label>
            <textarea value={message}
              onChange={e => {
                const lines = e.target.value.split('\n')
                if (lines.length <= 3) { setMessage(e.target.value); clrErr('msg') }
              }}
              placeholder={t.message_ph} rows={3}
              style={{ ...inputStyle(err.msg, message), resize: 'none', width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <ErrMsg msg={err.msg} />
              <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 'auto' }}>
                {message.split('\n').length}/3 {lang === 'fr' ? 'lignes' : 'lines'}
              </span>
            </div>
          </div>

          {/* ÉTOILES */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>{t.note_label} *</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[1,2,3,4,5].map(i => (
                <span key={i}
                  onClick={() => { setNote(i); clrErr('note') }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  style={{ fontSize: 34, cursor: 'pointer', transition: 'all 0.15s', transform: (hover||note) >= i ? 'scale(1.2)' : 'scale(1)', color: (hover||note) >= i ? '#F59E0B' : '#E2E8F0', userSelect: 'none' }}>
                  ★
                </span>
              ))}
              {note > 0 && (
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, marginLeft: 8 }}>
                  {note}/5 {['','😕','😐','🙂','😊','🤩'][note]}
                </span>
              )}
            </div>
            <ErrMsg msg={err.note} />
          </div>

          {/* BOUTON */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '13px', border: 'none', borderRadius: 10,
            background: loading ? '#6D28D9' : 'linear-gradient(135deg,#7C3AED,#5B21B6)',
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
          }}>
            {loading ? t.sending : t.btn}
          </button>
        </>
      )}
    </div>
  )
}
