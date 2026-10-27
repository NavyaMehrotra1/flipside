import { supabase } from './supabase'
import { MICRO_CARDS, MICRO_DECK, MICRO_DECK_NAME } from '../data/microExamDeck'

const inflight = new Map()
const ready = new Set()

async function createMicroDeck(userId) {
  const { data: existing, error: findError } = await supabase
    .from('decks')
    .select('id')
    .eq('user_id', userId)
    .eq('name', MICRO_DECK_NAME)
    .maybeSingle()

  if (findError) throw findError

  let deckId = existing?.id
  if (!deckId) {
    const { data: deck, error } = await supabase
      .from('decks')
      .insert({
        user_id: userId,
        name: MICRO_DECK.name,
        description: MICRO_DECK.description,
        emoji: MICRO_DECK.emoji,
        color: MICRO_DECK.color,
      })
      .select('id')
      .single()
    if (error) throw error
    deckId = deck.id
  }

  const { count, error: countError } = await supabase
    .from('cards')
    .select('id', { count: 'exact', head: true })
    .eq('deck_id', deckId)
    .eq('user_id', userId)

  if (countError) throw countError
  if (count > 0) return

  const rows = MICRO_CARDS.map((card, index) => ({
    user_id: userId,
    deck_id: deckId,
    front: card.front,
    back: card.back,
    tags: card.tags,
    bookmarked: false,
    position: index,
  }))

  for (let i = 0; i < rows.length; i += 40) {
    const { error } = await supabase.from('cards').insert(rows.slice(i, i + 40))
    if (error) throw error
  }
}

export function ensureMicroDeck(userId) {
  if (ready.has(userId)) return Promise.resolve()
  if (!inflight.has(userId)) {
    const job = createMicroDeck(userId)
      .then(() => ready.add(userId))
      .finally(() => inflight.delete(userId))
    inflight.set(userId, job)
  }
  return inflight.get(userId)
}
