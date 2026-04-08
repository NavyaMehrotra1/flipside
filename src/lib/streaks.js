import { supabase } from './supabase'

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]

export function getMilestoneMessage(streak) {
  if (streak >= 100) return "100 days. You are absolutely unstoppable. 🏆"
  if (streak >= 60) return "Two months of dedication. Legendary. ✨"
  if (streak >= 30) return "A whole month. Incredible. 🌟"
  if (streak >= 14) return "Two weeks strong! Your brain is loving this. 🧠"
  if (streak >= 7) return "One week strong! 🎉"
  if (streak >= 3) return "You're building a habit! 🌱"
  return null
}

export function isMilestone(streak) {
  return STREAK_MILESTONES.includes(streak)
}

export async function getOrCreateStreak(userId) {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Not found — create
    const { data: created } = await supabase
      .from('streaks')
      .insert({ user_id: userId, current_streak: 0, longest_streak: 0 })
      .select()
      .single()
    return created
  }

  return data
}

export async function updateStreak(userId) {
  const streak = await getOrCreateStreak(userId)
  if (!streak) return streak

  const today = new Date().toISOString().split('T')[0]
  const lastStudy = streak.last_study_date

  if (lastStudy === today) {
    // Already studied today, no change
    return streak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak
  if (lastStudy === yesterdayStr) {
    // Continuing streak
    newStreak = streak.current_streak + 1
  } else if (!lastStudy) {
    newStreak = 1
  } else {
    // Streak broken
    newStreak = 1
  }

  const longestStreak = Math.max(streak.longest_streak, newStreak)

  const { data } = await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_study_date: today,
    })
    .eq('user_id', userId)
    .select()
    .single()

  return data
}

export function wasStreakBroken(streakData) {
  if (!streakData?.last_study_date) return false
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  return streakData.last_study_date !== today && streakData.last_study_date !== yesterdayStr
}
