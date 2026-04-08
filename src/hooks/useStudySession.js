import { useState, useCallback } from 'react'
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

export function useStudySession(cards, deckId, mode = 'sequential') {
  const { user } = useAuth()
  const [sessionCards, setSessionCards] = useState(() => {
    if (mode === 'random') return shuffle(cards)
    return [...cards]
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [grades, setGrades] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [startTime] = useState(Date.now())
  const [ended, setEnded] = useState(false)
  const [lastGrade, setLastGrade] = useState(null)

  const currentCard = sessionCards[currentIndex]
  const totalCards = sessionCards.length
  const progress = totalCards > 0 ? currentIndex / totalCards : 0

  const startSession = useCallback(async () => {
    const { data } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        deck_id: deckId,
        mode,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (data) setSessionId(data.id)
  }, [user, deckId, mode])

  const flip = () => setFlipped(f => !f)

  const grade = async (gradeValue) => {
    if (!currentCard) return
    setLastGrade(gradeValue)
    setGrades(prev => ({ ...prev, [currentCard.id]: gradeValue }))

    // Update SM-2
    const { data: review } = await supabase
      .from('reviews')
      .select('*')
      .eq('card_id', currentCard.id)
      .eq('user_id', user.id)
      .single()

    const sm2Result = sm2(review || {}, gradeValue)
    await supabase
      .from('reviews')
      .upsert({
        user_id: user.id,
        card_id: currentCard.id,
        ...sm2Result,
      }, { onConflict: 'card_id,user_id' })

    // Move to next after a short delay (for animation)
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

    const correct = Object.values(allGrades).filter(g => g >= 2).length
    const total = Object.values(allGrades).length
    const accuracy = total > 0 ? correct / total : 0

    if (sessionId) {
      await supabase
        .from('sessions')
        .update({
          ended_at: new Date().toISOString(),
          cards_reviewed: total,
          accuracy,
        })
        .eq('id', sessionId)
    }

    await updateStreak(user.id)
    setEnded(true)
  }

  const prev = () => {
    if (currentIndex > 0) {
      setFlipped(false)
      setCurrentIndex(i => i - 1)
    }
  }

  const next = () => {
    if (currentIndex < totalCards - 1) {
      setFlipped(false)
      setCurrentIndex(i => i + 1)
    }
  }

  const accuracy = (() => {
    const vals = Object.values(grades)
    if (!vals.length) return null
    const correct = vals.filter(g => g >= 2).length
    return Math.round((correct / vals.length) * 100)
  })()

  const timeTaken = Math.round((Date.now() - startTime) / 1000)

  return {
    currentCard,
    currentIndex,
    totalCards,
    flipped,
    grades,
    ended,
    lastGrade,
    progress,
    accuracy,
    timeTaken,
    flip,
    grade,
    prev,
    next,
    startSession,
  }
}
