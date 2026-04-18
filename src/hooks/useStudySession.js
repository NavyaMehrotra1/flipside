import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { sm2 } from '../lib/sm2'
import { updateStreak } from '../lib/streaks'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sessionKey(deckId, mode) {
  return `flipside-session-${deckId}-${mode}`
}

export function useStudySession(cards, deckId, mode = 'sequential') {
  const { user } = useAuth()

  const [sessionCards] = useState(() =>
    mode === 'random' ? shuffle(cards) : [...cards]
  )

  // Restore position from sessionStorage so tab switches don't reset progress
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = sessionStorage.getItem(sessionKey(deckId, mode))
      if (saved !== null) {
        const idx = parseInt(saved, 10)
        if (!isNaN(idx) && idx < cards.length) return idx
      }
    } catch {}
    return 0
  })

  const [flipped, setFlipped]   = useState(false)
  const [grades, setGrades]     = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [startTime]             = useState(Date.now())
  const [ended, setEnded]       = useState(false)
  const [lastGrade, setLastGrade] = useState(null)

  // Persist index whenever it changes
  useEffect(() => {
    try { sessionStorage.setItem(sessionKey(deckId, mode), String(currentIndex)) } catch {}
  }, [currentIndex, deckId, mode])

  const currentCard = sessionCards[currentIndex]
  const totalCards  = sessionCards.length
  const progress    = totalCards > 0 ? currentIndex / totalCards : 0

  const startSession = useCallback(async () => {
    const { data } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, deck_id: deckId, mode, started_at: new Date().toISOString() })
      .select().single()
    if (data) setSessionId(data.id)
  }, [user, deckId, mode])

  const flip = () => setFlipped(f => !f)

  const grade = async (gradeValue) => {
    if (!currentCard) return
    setLastGrade(gradeValue)
    setGrades(prev => ({ ...prev, [currentCard.id]: gradeValue }))

    const { data: review } = await supabase
      .from('reviews').select('*')
      .eq('card_id', currentCard.id).eq('user_id', user.id).single()

    const sm2Result = sm2(review || {}, gradeValue)
    await supabase.from('reviews').upsert(
      { user_id: user.id, card_id: currentCard.id, ...sm2Result },
      { onConflict: 'card_id,user_id' }
    )

    setTimeout(() => {
      setFlipped(false)
      setLastGrade(null)
      if (currentIndex + 1 >= totalCards) {
        endSession(gradeValue)
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 600)
  }

  const endSession = async (finalGrade) => {
    const allGrades = { ...grades }
    if (currentCard) allGrades[currentCard.id] = finalGrade

    const correct  = Object.values(allGrades).filter(g => g >= 2).length
    const total    = Object.values(allGrades).length
    const accuracy = total > 0 ? correct / total : 0

    if (sessionId) {
      await supabase.from('sessions').update({
        ended_at: new Date().toISOString(),
        cards_reviewed: total,
        accuracy,
      }).eq('id', sessionId)
    }

    // Clear saved position when session finishes
    try { sessionStorage.removeItem(sessionKey(deckId, mode)) } catch {}
    await updateStreak(user.id)
    setEnded(true)
  }

  const prev = () => {
    if (currentIndex > 0) { setFlipped(false); setCurrentIndex(i => i - 1) }
  }

  const next = () => {
    if (currentIndex < totalCards - 1) { setFlipped(false); setCurrentIndex(i => i + 1) }
  }

  const accuracy = (() => {
    const vals = Object.values(grades)
    if (!vals.length) return null
    return Math.round((vals.filter(g => g >= 2).length / vals.length) * 100)
  })()

  return {
    currentCard, currentIndex, totalCards,
    flipped, grades, ended, lastGrade, progress, accuracy,
    timeTaken: Math.round((Date.now() - startTime) / 1000),
    flip, grade, prev, next, startSession,
  }
}
