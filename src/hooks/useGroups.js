import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function randomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function useGroups(userId) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('group_members')
      .select('group_id, groups(id, name, code, created_by)')
      .eq('user_id', userId)
    setGroups(data?.map(r => r.groups).filter(Boolean) ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const createGroup = async (name) => {
    const code = randomCode()
    const { data: group, error } = await supabase
      .from('groups')
      .insert({ name: name.trim(), code, created_by: userId })
      .select()
      .single()
    if (error || !group) return { error: error ?? new Error('Failed to create group') }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId })
    await load()
    return { group }
  }

  const joinGroup = async (code) => {
    const { data: group } = await supabase
      .from('groups')
      .select()
      .eq('code', code.toUpperCase().trim())
      .single()
    if (!group) return { error: new Error('Group not found — check the code.') }
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId })
    if (error?.code === '23505') return { error: new Error('You\'re already in this group.') }
    if (error) return { error }
    await load()
    return { group }
  }

  const leaveGroup = async (groupId) => {
    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId)
    await load()
  }

  const getLeaderboard = async (groupId) => {
    const { data } = await supabase
      .from('group_members')
      .select('user_id, profiles(display_name, current_streak, last_study_date)')
      .eq('group_id', groupId)
    return (data ?? [])
      .map(r => ({ user_id: r.user_id, ...r.profiles }))
      .sort((a, b) => (b.current_streak ?? 0) - (a.current_streak ?? 0))
  }

  return { groups, loading, createGroup, joinGroup, leaveGroup, getLeaderboard }
}
