import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const PASTEL_COLORS = [
  '#FFE8DC', '#EDE9FE', '#DCFCE7', '#FEFCE8',
  '#FFE4E6', '#DBEAFE', '#FEF3C7', '#F0FDF4',
]

export function useDeckColor(index) {
  return PASTEL_COLORS[index % PASTEL_COLORS.length]
}

export function useDecks() {
  const { user } = useAuth()
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDecks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setDecks(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchDecks()
  }, [fetchDecks])

  const createDeck = async ({ name, description, emoji, color }) => {
    const assignedColor = color || PASTEL_COLORS[decks.length % PASTEL_COLORS.length]
    const { data, error } = await supabase
      .from('decks')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        emoji: emoji || '📚',
        color: assignedColor,
      })
      .select()
      .single()

    if (!error && data) {
      setDecks(prev => [data, ...prev])
    }
    return { data, error }
  }

  const updateDeck = async (id, updates) => {
    const { data, error } = await supabase
      .from('decks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error && data) {
      setDecks(prev => prev.map(d => d.id === id ? data : d))
    }
    return { data, error }
  }

  const deleteDeck = async (id) => {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      setDecks(prev => prev.filter(d => d.id !== id))
    }
    return { error }
  }

  return { decks, loading, error, fetchDecks, createDeck, updateDeck, deleteDeck }
}

export function useDeck(deckId) {
  const { user } = useAuth()
  const [deck, setDeck] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !deckId) return
    supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setDeck(data)
        setLoading(false)
      })
  }, [user, deckId])

  return { deck, loading }
}
