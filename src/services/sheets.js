// ══════════════════════════════════════════════════════════
// SERVICE GOOGLE SHEETS — Atlas Tawjih
// ══════════════════════════════════════════════════════════

const API_URL = 'https://script.google.com/macros/s/AKfycby2vdzMEoARe5c3rk3o-6jnyA_-C5AbxMXvLy7F-4_H8XxCYpkqZrulWX5T5OicATwP/exec'

export async function incrementerCompteur() {
  try {
    await fetch(`${API_URL}?action=increment`, { method: 'GET', mode: 'no-cors' })
  } catch (e) { console.warn('Compteur:', e) }
}

export async function lireCompteur() {
  try {
    const res = await fetch(`${API_URL}?action=getCount`)
    const data = await res.json()
    return data.count || 0
  } catch (e) { return null }
}

export async function envoyerFeedback(feedback) {
  try {
    const params = new URLSearchParams({
      action:  'feedback',
      type:    feedback.type    || '',
      prenom:  feedback.prenom  || '',
      ville:   feedback.ville   || '',
      profil:  feedback.profil  || '',
      note:    String(feedback.note || ''),
      message: feedback.message || '',
    })
    await fetch(`${API_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
    return true
  } catch (e) { return false }
}

export async function lireFeedbacks() {
  try {
    const res = await fetch(`${API_URL}?action=getFeedbacks`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) { return [] }
}
