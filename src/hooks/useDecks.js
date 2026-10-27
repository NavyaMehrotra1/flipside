import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { isOffline, loadLibrary, rememberDecks } from '../lib/offlineStore'
import { ensureMicroDeck } from '../lib/seedMicroDeck'

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

  const mirrorDecks = (next) => {
    if (user) rememberDecks(user.id, next).catch(() => {})
  }

  const fetchDecks = useCallback(async () => {
    if (!user) return
    const lib = await loadLibrary(user.id)
    if (lib) {
      setDecks(lib.decks || [])
      setError(null)
      setLoading(false)
    } else {
      setLoading(true)
    }

    if (isOffline()) {
      if (!lib) {
        setDecks([])
        setError('offline')
      }
      setLoading(false)
      return
    }

    try {
      await ensureMicroDeck(user.id)
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      const next = data || []
      setDecks(next)
      setError(null)
      rememberDecks(user.id, next).catch(() => {})
    } catch {
      if (!lib) {
        setDecks([])
        setError(isOffline() ? 'offline' : 'Could not load your decks.')
      }
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchDecks()
  }, [fetchDecks])

  useEffect(() => {
    const onOnline = () => fetchDecks()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
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
      const next = [data, ...decks]
      setDecks(next)
      mirrorDecks(next)
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
      const next = decks.map(d => d.id === id ? data : d)
      setDecks(next)
      mirrorDecks(next)
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
      const next = decks.filter(d => d.id !== id)
      setDecks(next)
      mirrorDecks(next)
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
    let cancelled = false

    async function load() {
      const cached = async () => {
        const lib = await loadLibrary(user.id)
        return lib?.decks?.find((deck) => deck.id === deckId) || null
      }

      const saved = await cached()
      if (saved && !cancelled) {
        setDeck(saved)
        setLoading(false)
      }

      if (isOffline()) {
        if (!cancelled) {
          if (!saved) setDeck(null)
          setLoading(false)
        }
        return
      }

      try {
        const { data, error } = await supabase
          .from('decks')
          .select('*')
          .eq('id', deckId)
          .eq('user_id', user.id)
          .single()

        if (cancelled) return
        if (!error && data) setDeck(data)
        else if (!saved) setDeck(null)
      } catch {
        if (!cancelled && !saved) setDeck(null)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user, deckId])

  return { deck, loading }
}
