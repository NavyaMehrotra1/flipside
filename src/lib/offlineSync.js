import { supabase } from './supabase'
import { updateStreak } from './streaks'
import { saveReview, isNetworkFailure } from './reviews'
import {
  isOffline,
  saveLibrary,
  listOutbox,
  removeOutboxItem,
  upsertCachedReview,
  patchStreak,
  setOfflineEnabled,
} from './offlineStore'

export async function downloadLibrary(userId) {
  const [decks, cards, reviews, streak] = await Promise.all([
    supabase.from('decks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('cards').select('*').eq('user_id', userId).order('position', { ascending: true }),
    supabase.from('reviews').select('*').eq('user_id', userId),
    supabase.from('streaks').select('*').eq('user_id', userId).maybeSingle(),
  ])

  const failed = [decks.error, cards.error, reviews.error, streak.error].find(Boolean)
  if (failed) throw new Error(failed.message || 'Could not save your decks.')

  const library = {
    decks: decks.data || [],
    cards: cards.data || [],
    reviews: reviews.data || [],
    streak: streak.data || null,
    savedAt: new Date().toISOString(),
  }
  await saveLibrary(userId, library)
  setOfflineEnabled(true)
  return library
}

export async function flushOutbox(userId) {
  if (!userId || isOffline()) return
  const items = await listOutbox(userId)
  for (const item of items) {
    if (isOffline()) return
    try {
      if (item.kind === 'review') {
        const { error } = await saveReview(item.row)
        if (error) {
          if (isNetworkFailure(error)) return
          return
        }
        await upsertCachedReview(userId, item.row)
      } else if (item.kind === 'streak') {
        const updated = await updateStreak(userId)
        if (!updated) return
        await patchStreak(userId, updated)
      } else {
        await removeOutboxItem(item.id)
        continue
      }
      await removeOutboxItem(item.id)
    } catch {
      return
    }
  }
}
