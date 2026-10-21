import { supabase } from './supabase'
import { isOffline, listOutbox, loadLibrary, markUnreachable } from './offlineStore'

export function isNetworkFailure(error) {
  if (isOffline()) return true
  const msg = `${error?.name || ''} ${error?.message || ''} ${error?.details || ''}`
  return /failed to fetch|network|load failed|offline|abort|timeout/i.test(msg)
}

function withAbort(query, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return query.abortSignal(controller.signal).then(
    (result) => {
      clearTimeout(timer)
      return result
    },
    (error) => {
      clearTimeout(timer)
      throw error
    },
  )
}

export async function readReview(userId, cardId) {
  const pending = await listOutbox(userId)
  const queued = [...pending].reverse().find((item) => item.kind === 'review' && item.row?.card_id === cardId)
  if (queued) return queued.row

  if (!isOffline()) {
    try {
      const query = supabase
        .from('reviews')
        .select('*')
        .eq('card_id', cardId)
        .eq('user_id', userId)
      const { data, error } = await withAbort(query.maybeSingle(), 2500)
      if (!error && data) return data
      if (error && isNetworkFailure(error)) markUnreachable()
    } catch {
      markUnreachable()
    }
  }

  const lib = await loadLibrary(userId)
  return lib?.reviews?.find((review) => review.card_id === cardId) || null
}

export async function saveReview(row, { timeoutMs = 2500 } = {}) {
  const attempt = (payload) =>
    withAbort(
      supabase.from('reviews').upsert(payload, { onConflict: 'card_id,user_id' }),
      timeoutMs,
    )

  try {
    const first = await attempt(row)
    if (first.error && /last_grade|schema cache|column/i.test(first.error.message || '')) {
      const rest = { ...row }
      delete rest.last_grade
      return attempt(rest)
    }
    return first
  } catch (error) {
    return { error }
  }
}
