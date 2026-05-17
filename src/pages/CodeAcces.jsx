import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Codes importés depuis src/config/codes.js ─────────────
// Pour modifier les codes : ouvre src/config/codes.js
import { CODES_VALIDES, CODES_ADMIN } from '../config/codes'

const getCodesUtilises = () => {
  try {
    return JSON.parse(localStorage.getItem('codes_utilises') || '[]')
  } catch { return [] }
}

const marquerCodeUtilise = (code) => {
  if (CODES_ADMIN.includes(code)) return // jamais bloquer les codes admin
  const utilises = getCodesUtilises()
  if (!utilises.includes(code)) {
    utilises.push(code)
    localStorage.setItem('codes_utilises', JSON.stringify(utilises))
  }
}

const isCodeDejaUtilise = (code) => {
  if (CODES_ADMIN.includes(code)) return false // admin toujours dispo
  return getCodesUtilises().includes(code)
}

const TEXTS = {
  fr: {
    titre:       "Code d'accès",
    sous_titre:  'Saisir ton code pour commencer le test',
    desc:        "Ce code t'a été fourni par ton établissement ou l'équipe Atlas Tawjih.",
    placeholder: 'Ex : ATLAS-2025',
    btn:         'Valider le code →',
    valid:       'Code valide — accès autorisé !',
    invalid:     'Code invalide. Vérifie et réessaie.',
    no_code:     "Tu n'as pas de code ? Contacte l'équipe Atlas Tawjih :",
    etape:       'Étape 1 sur 4',
  },
  en: {
    titre:       'Access Code',
    sous_titre:  'Enter your code to start the test',
    desc:        'This code was provided by your institution or the Atlas Tawjih team.',
    placeholder: 'Ex: ATLAS-2025',
    btn:         'Validate code →',
    valid:       'Valid code — access granted!',
    invalid:     'Invalid code. Please check and try again.',
    no_code:     "Don't have a code? Contact the Atlas Tawjih team:",
    etape:       'Step 1 of 4',
  },
}

export default function CodeAcces() {
  const navigate = useNavigate()
  const [lang, setLang]     = useState('fr')
  const [code, setCode]     = useState('')
  const [statut, setStatut] = useState(null) // null | 'valide' | 'invalide'
  const [loading, setLoading] = useState(false)
  const [msgErreur, setMsgErreur] = useState('')
  const t = TEXTS[lang]

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase()
    setCode(val)
    setStatut(null) // reset statut à chaque frappe
    setMsgErreur('')
  }

  const handleValider = () => {
    if (!code.trim()) return
    setLoading(true)
    setTimeout(() => {
      const codeNet = code.trim().toUpperCase()
      if (!CODES_VALIDES.includes(codeNet)) {
        // Code inexistant
        setStatut('invalide')
        setMsgErreur(lang === 'fr'
          ? 'Code invalide. Vérifie et réessaie.'
          : 'Invalid code. Please check and try again.')
      } else if (isCodeDejaUtilise(codeNet)) {
        // Code déjà utilisé
        setStatut('utilise')
        setMsgErreur(lang === 'fr'
          ? 'Ce code a déjà été utilisé. Chaque code est valable une seule fois.'
          : 'This code has already been used. Each code is valid only once.')
      } else {
        // Code valide et disponible
        setStatut('valide')
        marquerCodeUtilise(codeNet)
        sessionStorage.setItem('code_acces', codeNet)
        setTimeout(() => navigate('/formulaire'), 1200)
      }
      setLoading(false)
    }, 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleValider()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 0.5, boxShadow: '0 2px 8px rgba(124,58,237,0.35)', flexShrink: 0 }}>AT</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>Atlas Tawjih</div>
            <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>ORIENTATION</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
          {['fr', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: lang === l ? '#7C3AED' : 'transparent', color: lang === l ? '#fff' : '#64748B', fontSize: 12, fontWeight: lang === l ? 600 : 400, cursor: 'pointer' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BARRE DE PROGRESSION ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>{t.etape}</span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>25%</span>
          </div>
          <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #5B21B6)', borderRadius: 3, transition: 'width 0.4s ease' }} />
          </div>
          {/* Étapes visuelles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {[
              { num: 1, label: lang === 'fr' ? 'Code'       : 'Code' },
              { num: 2, label: lang === 'fr' ? 'Profil'     : 'Profile' },
              { num: 3, label: lang === 'fr' ? 'Test'       : 'Test' },
              { num: 4, label: lang === 'fr' ? 'Résultats'  : 'Results' },
            ].map((e) => (
              <div key={e.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: e.num === 1 ? '#7C3AED' : '#E2E8F0',
                  color: e.num === 1 ? '#fff' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  border: e.num === 1 ? '2px solid #5B21B6' : '2px solid #E2E8F0',
                  transition: 'all 0.3s'
                }}>{e.num}</div>
                <span style={{ fontSize: 10, color: e.num === 1 ? '#7C3AED' : '#94A3B8', fontWeight: e.num === 1 ? 600 : 400 }}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Icône */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: statut === 'valide' ? '#F0FDF4' : '#EDE9FE',
              border: `2px solid ${statut === 'valide' ? '#BBF7D0' : '#DDD6FE'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', fontSize: 28,
              transition: 'all 0.3s'
            }}>
              {statut === 'valide' ? '✅' : '🔑'}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{t.titre}</h1>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{t.desc}</p>
          </div>

          {/* Card principale */}
          <div style={{
            background: '#fff', border: '1px solid #E2E8F0',
            borderRadius: 14, padding: '28px 24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
              {t.sous_titre}
            </label>

            {/* Champ de saisie */}
            <input
              type="text"
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              maxLength={20}
              style={{
                width: '100%', padding: '13px 16px',
                border: `2px solid ${
                  statut === 'valide'   ? '#10B981' :
                  statut === 'invalide' ? '#EF4444' :
                  statut === 'utilise'  ? '#F59E0B' :
                  code.length > 0      ? '#7C3AED' : '#E2E8F0'
                }`,
                borderRadius: 10, fontSize: 16,
                textAlign: 'center', letterSpacing: 3,
                fontWeight: 700, color: '#1E293B',
                background: statut === 'valide' ? '#F0FDF4' : statut === 'invalide' || statut === 'utilise' ? '#FFFBEB' : '#FAFAFA',
                outline: 'none', transition: 'all 0.2s',
                fontFamily: "'Courier New', monospace",
                boxSizing: 'border-box'
              }}
              autoFocus
            />

            {/* Message de statut */}
            {statut === 'valide' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>{t.valid}</span>
              </div>
            )}
            {statut === 'invalide' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
                <span style={{ fontSize: 16 }}>✕</span>
                <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{msgErreur}</span>
              </div>
            )}
            {statut === 'utilise' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 10, padding: '10px 12px', background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>
                  <div style={{ fontSize: 13, color: '#D97706', fontWeight: 600, marginBottom: 3 }}>{msgErreur}</div>
                  <div style={{ fontSize: 11, color: '#92400E' }}>
                    {lang === 'fr'
                      ? "Contacte l'équipe Atlas Tawjih pour obtenir un nouveau code."
                      : 'Contact the Atlas Tawjih team to get a new code.'}
                  </div>
                </div>
              </div>
            )}

            {/* Bouton valider */}
            <button
              onClick={handleValider}
              disabled={!code.trim() || loading || statut === 'valide' || statut === 'utilise'}
              style={{
                width: '100%', marginTop: 16, padding: '13px',
                background: !code.trim() || loading || statut === 'valide' || statut === 'utilise'
                  ? '#E2E8F0'
                  : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                color: !code.trim() || loading || statut === 'valide' || statut === 'utilise' ? '#94A3B8' : '#fff',
                border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: !code.trim() || loading || statut === 'valide' || statut === 'utilise' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: !code.trim() || loading || statut === 'valide' ? 'none' : '0 4px 12px rgba(124,58,237,0.3)'
              }}>
              {loading ? '⏳ Vérification...' : t.btn}
            </button>
          </div>

          {/* Contact si pas de code */}
          <div style={{ marginTop: 20, textAlign: 'center', padding: '16px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FDE68A' }}>
            <p style={{ fontSize: 12, color: '#92400E', marginBottom: 6 }}>{t.no_code}</p>
            <a href="mailto:atlastawjih.maroc@gmail.com" style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>
              📧 atlastawjih.maroc@gmail.com
            </a>
          </div>

        </div>
      </div>

      {/* ── FOOTER SIMPLE ── */}
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
