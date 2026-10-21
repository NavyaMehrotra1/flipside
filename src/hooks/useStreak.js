import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOrCreateStreak, updateStreak, wasStreakBroken } from '../lib/streaks'
import { enqueue, isOffline, loadLibrary, patchStreak } from '../lib/offlineStore'

export function useStreak() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(null)
  const [streakBroken, setStreakBroken] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const lib = await loadLibrary(user.id)
      if (!cancelled && lib?.streak) {
        setStreakBroken(wasStreakBroken(lib.streak))
        setStreak(lib.streak)
        setLoading(false)
      }

      if (isOffline()) {
        if (!cancelled) setLoading(false)
        return
      }

      try {
        const data = await getOrCreateStreak(user.id)
        if (cancelled) return
        if (data) {
          setStreakBroken(wasStreakBroken(data))
          setStreak(data)
          patchStreak(user.id, data).catch(() => {})
        }
      } catch { /* keep the streak saved on this device */ }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user])

  const recordStudy = async () => {
    if (!user) return
    if (isOffline()) {
      try { await enqueue({ userId: user.id, kind: 'streak' }) } catch { /* streak will sync next time online */ }
      return null
    }
    try {
      const updated = await updateStreak(user.id)
      if (updated) {
        setStreak(updated)
        patchStreak(user.id, updated).catch(() => {})
      }
      return updated
    } catch {
      try { await enqueue({ userId: user.id, kind: 'streak' }) } catch { /* streak will sync next time online */ }
      return null
    }
  }

  return { streak, streakBroken, loading, recordStudy }
}
