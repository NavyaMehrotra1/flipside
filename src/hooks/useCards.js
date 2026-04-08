import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useCards(deckId) {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCards = useCallback(async () => {
    if (!user || !deckId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', user.id)
      .order('position', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setCards(data || [])
    setLoading(false)
  }, [user, deckId])

  useEffect(() => {
    fetchCards()
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
      setCards(prev => [...prev, data])
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
      setCards(prev => prev.map(c => c.id === id ? data : c))
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
      setCards(prev => prev.filter(c => c.id !== id))
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
      setCards(prev => [...prev, ...data])
    }
    return { data, error }
  }

  return { cards, loading, error, fetchCards, createCard, updateCard, deleteCard, toggleBookmark, bulkImport }
}
