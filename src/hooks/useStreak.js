import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOrCreateStreak, updateStreak, wasStreakBroken } from '../lib/streaks'

export function useStreak() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(null)
  const [streakBroken, setStreakBroken] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getOrCreateStreak(user.id).then(data => {
      if (data) {
        setStreakBroken(wasStreakBroken(data))
        setStreak(data)
      }
      setLoading(false)
    })
  }, [user])

  const recordStudy = async () => {
    if (!user) return
    const updated = await updateStreak(user.id)
    if (updated) setStreak(updated)
    return updated
  }

  return { streak, streakBroken, loading, recordStudy }
}
