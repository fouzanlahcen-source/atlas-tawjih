import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CODES_VALIDES, CODES_ADMIN } from '../config/codes'

export default function CodeAcces() {
  const navigate = useNavigate()
  const [code, setCode]   = useState('')
  const [error, setError] = useState('')

  const verifier = () => {
    const c = code.trim().toUpperCase()
    if (!c) { setError('Merci de saisir un code.'); return }

    if (CODES_ADMIN.includes(c)) {
      navigate('/formulaire')
      return
    }

    // Vérifier usage unique (localStorage)
    const used = JSON.parse(localStorage.getItem('usedCodes') || '[]')

    if (!CODES_VALIDES.includes(c)) {
      setError('Code invalide. Vérifie ton code ou contacte Atlas Tawjih.')
      return
    }

    if (used.includes(c)) {
      setError('Ce code a déjà été utilisé. Contacte Atlas Tawjih : 0703244407')
      return
    }

    // Marquer comme utilisé
    localStorage.setItem('usedCodes', JSON.stringify([...used, c]))
    navigate('/formulaire')
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#F5F3FF,#EDE9FE,#F0F9FF)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif", padding:20 }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'40px 36px', maxWidth:420, width:'100%', boxShadow:'0 20px 60px rgba(124,58,237,0.12)' }}>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#7C3AED,#5B21B6)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:18, margin:'0 auto 12px', boxShadow:'0 8px 20px rgba(124,58,237,0.35)' }}>AT</div>
          <div style={{ fontSize:22, fontWeight:800, color:'#1E293B' }}>Atlas Tawjih</div>
          <div style={{ fontSize:13, color:'#94A3B8', marginTop:4 }}>Plateforme d'orientation RIASEC</div>
        </div>

        <div style={{ fontSize:16, fontWeight:700, color:'#1E293B', marginBottom:6 }}>🔑 Code d'accès</div>
        <div style={{ fontSize:13, color:'#64748B', marginBottom:20, lineHeight:1.6 }}>
          Saisis ton code personnel pour accéder au test. Chaque code est <strong>valable une seule fois</strong>.
        </div>

        <input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
          onKeyDown={e => e.key === 'Enter' && verifier()}
          placeholder="Ex : ATLAS-001"
          style={{ width:'100%', padding:'14px 16px', border:`2px solid ${error?'#EF4444':'#E2E8F0'}`, borderRadius:10, fontSize:15, fontWeight:600, color:'#1E293B', outline:'none', letterSpacing:1, boxSizing:'border-box', textAlign:'center', marginBottom:12 }}
        />

        {error && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#991B1B', marginBottom:12, lineHeight:1.6 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={verifier}
          style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#7C3AED,#5B21B6)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 6px 20px rgba(124,58,237,0.35)' }}>
          Accéder au test →
        </button>

        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'#94A3B8', lineHeight:1.7 }}>
          Pas de code ?<br/>
          <span style={{ color:'#7C3AED', fontWeight:600 }}>📞 0703244407</span>
          <span style={{ margin:'0 6px' }}>·</span>
          <span style={{ color:'#7C3AED', fontWeight:600 }}>atlastawjih.maroc@gmail.com</span>
        </div>
      </div>
    </div>
  )
}
