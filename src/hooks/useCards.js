import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { isOffline, loadLibrary, rememberDeckCards } from '../lib/offlineStore'

export function useCards(deckId) {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const mirrorCards = (next) => {
    if (user && deckId) rememberDeckCards(user.id, deckId, next).catch(() => {})
  }

  const fetchCards = useCallback(async () => {
    if (!user || !deckId) return
    const lib = await loadLibrary(user.id)
    const cached = (lib?.cards || []).filter((card) => card.deck_id === deckId)
    if (lib) {
      setCards(cached)
      setError(null)
      setLoading(false)
    } else {
      setLoading(true)
    }

    if (isOffline()) {
      if (!lib) {
        setCards([])
        setError('offline')
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .eq('user_id', user.id)
        .order('position', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      const next = data || []
      setCards(next)
      setError(null)
      rememberDeckCards(user.id, deckId, next).catch(() => {})
    } catch {
      if (!lib) {
        setCards([])
        setError(isOffline() ? 'offline' : 'Could not load cards.')
      }
    }
    setLoading(false)
  }, [user, deckId])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  useEffect(() => {
    const onOnline = () => fetchCards()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [fetchCards])

  const createCard = async ({ front, back, tags = [], bookmarked = false }) => {
    const position = cards.length
    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        deck_id: deckId,
        front,
        back,
        tags,
        bookmarked,
        position,
      })
      .select()
      .single()

    if (!error && data) {
      const next = [...cards, data]
      setCards(next)
      mirrorCards(next)
    }
    return { data, error }
  }

  const updateCard = async (id, updates) => {
    const { data, error } = await supabase
      .from('cards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error && data) {
      const next = cards.map(c => c.id === id ? data : c)
      setCards(next)
      mirrorCards(next)
    }
    return { data, error }
  }

  const deleteCard = async (id) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      const next = cards.filter(c => c.id !== id)
      setCards(next)
      mirrorCards(next)
    }
    return { error }
  }

  const toggleBookmark = async (id) => {
    const card = cards.find(c => c.id === id)
    if (!card) return
    return updateCard(id, { bookmarked: !card.bookmarked })
  }

  const bulkImport = async (newCards) => {
    const position = cards.length
    const rows = newCards.map((c, i) => ({
      user_id: user.id,
      deck_id: deckId,
      front: c.front,
      back: c.back,
      tags: c.tags || [],
      bookmarked: false,
      position: position + i,
    }))

    const { data, error } = await supabase
      .from('cards')
      .insert(rows)
      .select()

    if (!error && data) {
      const next = [...cards, ...data]
      setCards(next)
      mirrorCards(next)
    }
    return { data, error }
  }

  return { cards, loading, error, fetchCards, createCard, updateCard, deleteCard, toggleBookmark, bulkImport }
}
