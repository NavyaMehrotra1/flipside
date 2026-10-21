import { supabase } from './supabase'
import { isOffline, loadLibrary } from './offlineStore'

function storageKey(userId) {
  return `flipside-grades:${userId}`
}

function readLocal(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function rememberGrade(userId, cardId, grade) {
  if (!userId || !cardId) return
  const all = readLocal(userId)
  all[cardId] = { grade, at: new Date().toISOString() }
  try { localStorage.setItem(storageKey(userId), JSON.stringify(all)) } catch { /* private mode can block storage */ }
}

function applyGrade(map, cardId, grade, at) {
  if (typeof grade !== 'number') return
  const when = at ? new Date(at).getTime() : 0
  if (Number.isNaN(when)) return
  const prev = map[cardId]
  if (!prev || when >= prev.at) map[cardId] = { grade, at: when }
}

export async function gradeMapForCards(userId, cardIds) {
  const map = {}
  const wanted = new Set(cardIds)

  const local = readLocal(userId)
  for (const [cardId, entry] of Object.entries(local)) {
    if (!wanted.has(cardId)) continue
    applyGrade(map, cardId, entry?.grade, entry?.at)
  }

  let reviews = []
  if (!isOffline()) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 2500)
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('card_id, last_grade, last_reviewed')
          .eq('user_id', userId)
          .abortSignal(controller.signal)
        if (!error && data) reviews = data
      } finally {
        clearTimeout(timer)
      }
    } catch { /* fall back to the on-device copy */ }
  }
  if (!reviews.length) {
    const lib = await loadLibrary(userId)
    reviews = lib?.reviews || []
  }

  for (const review of reviews) {
    if (!wanted.has(review.card_id)) continue
    applyGrade(map, review.card_id, review.last_grade, review.last_reviewed)
  }

  return map
}
