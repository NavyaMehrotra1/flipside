import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGroups } from '../hooks/useGroups'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Copy, LogOut, Plus, Hash } from 'lucide-react'

function StudiedBadge({ lastStudyDate }) {
  const today = new Date().toISOString().slice(0, 10)
  const studied = lastStudyDate === today
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={studied
        ? { background: 'rgba(134,239,172,0.2)', color: '#16a34a' }
        : { background: 'rgba(0,0,0,0.06)', color: 'var(--color-text-muted)' }}
    >
      {studied ? '✓ studied today' : 'not yet today'}
    </span>
  )
}

function Leaderboard({ groupId }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { getLeaderboard } = useGroups()

  useEffect(() => {
    setLoading(true)
    getLeaderboard(groupId).then(data => {
      setMembers(data)
      setLoading(false)
    })
  }, [groupId])

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton h-14 rounded-2xl" />
      ))}
    </div>
  )

  if (!members.length) return (
    <p className="text-sm opacity-50 text-center py-6">No members yet — share the invite code!</p>
  )

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="space-y-2">
      {members.map((m, i) => (
        <div key={m.user_id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <span className="text-xl w-7 text-center">{medals[i] ?? `${i + 1}.`}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{m.display_name ?? 'Anonymous'}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold" style={{ color: '#f97316' }}>
                🔥 {m.current_streak ?? 0} day{m.current_streak !== 1 ? 's' : ''}
              </span>
              <StudiedBadge lastStudyDate={m.last_study_date} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function GroupPanel({ group, onLeave }) {
  const copyCode = () => {
    navigator.clipboard.writeText(group.code)
    toast.success(`Code "${group.code}" copied!`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-lg">{group.name}</h3>
          <button onClick={copyCode}
            className="flex items-center gap-1.5 text-xs font-bold opacity-50 hover:opacity-100 transition-opacity mt-0.5">
            <Hash size={11} />
            {group.code}
            <Copy size={10} />
          </button>
        </div>
        <button onClick={onLeave}
          className="flex items-center gap-1 text-xs opacity-40 hover:opacity-80 transition-opacity"
          title="Leave group">
          <LogOut size={12} /> Leave
        </button>
      </div>
      <Leaderboard groupId={group.id} />
    </div>
  )
}

function EmptyState({ onCreate, onJoin }) {
  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [tab, setTab] = useState('create')
  const [busy, setBusy] = useState(false)

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">👥</div>
        <h3 className="font-extrabold text-xl mb-2">Study with your people.</h3>
        <p className="opacity-60 text-sm">Create a group and share the code. Your friends join, and you all hold each other accountable.</p>
      </div>

      <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        {['create', 'join'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize"
            style={tab === t ? { background: 'linear-gradient(135deg, #ff9f7a, #ffb89a)', color: 'white', boxShadow: '0 2px 8px rgba(255,159,122,0.3)' } : { opacity: 0.5 }}>
            {t === 'create' ? '+ Create group' : '↗ Join group'}
          </button>
        ))}
      </div>

      {tab === 'create' ? (
        <div className="space-y-3">
          <input
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            placeholder='e.g. "Bio 201 Study Squad"'
            className="input-base"
            onKeyDown={e => e.key === 'Enter' && onCreate(createName, setBusy)}
          />
          <button
            onClick={() => onCreate(createName, setBusy)}
            disabled={!createName.trim() || busy}
            className="btn-primary w-full justify-center">
            {busy ? 'Creating...' : 'Create group →'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="6-letter code (e.g. XK92AB)"
            className="input-base font-mono tracking-widest"
            maxLength={6}
            onKeyDown={e => e.key === 'Enter' && onJoin(joinCode, setBusy)}
          />
          <button
            onClick={() => onJoin(joinCode, setBusy)}
            disabled={joinCode.length !== 6 || busy}
            className="btn-primary w-full justify-center">
            {busy ? 'Joining...' : 'Join group →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function SocialView() {
  const { user, displayName } = useAuth()
  const { groups, loading, createGroup, joinGroup, leaveGroup } = useGroups(user?.id)
  const [activeGroupId, setActiveGroupId] = useState(null)

  // Sync this user's profile so others can see their streak on the leaderboard
  useEffect(() => {
    if (!user) return
    supabase.from('streaks').select('current_streak, last_study_date').eq('user_id', user.id).single()
      .then(({ data: streak }) => {
        supabase.from('profiles').upsert({
          id: user.id,
          display_name: displayName,
          current_streak: streak?.current_streak ?? 0,
          last_study_date: streak?.last_study_date ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
      })
  }, [user?.id, displayName])

  // Auto-select first group when groups load
  useEffect(() => {
    if (groups.length && !activeGroupId) setActiveGroupId(groups[0].id)
  }, [groups])

  const handleCreate = async (name, setBusy) => {
    if (!name.trim()) return
    setBusy(true)
    const { group, error } = await createGroup(name)
    setBusy(false)
    if (error) { toast.error(error.message); return }
    toast.success(`Group "${group.name}" created! Share code: ${group.code}`)
    setActiveGroupId(group.id)
  }

  const handleJoin = async (code, setBusy) => {
    setBusy(true)
    const { group, error } = await joinGroup(code)
    setBusy(false)
    if (error) { toast.error(error.message); return }
    toast.success(`Joined "${group.name}"! 🎉`)
    setActiveGroupId(group.id)
  }

  const handleLeave = async (groupId) => {
    await leaveGroup(groupId)
    setActiveGroupId(groups.find(g => g.id !== groupId)?.id ?? null)
    toast.success('Left the group.')
  }

  if (loading) return (
    <div className="space-y-3 mt-4">
      {[1, 2].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
    </div>
  )

  const activeGroup = groups.find(g => g.id === activeGroupId)

  return (
    <div className="mt-2">
      {groups.length === 0 ? (
        <EmptyState onCreate={handleCreate} onJoin={handleJoin} />
      ) : (
        <div>
          {/* Group tabs */}
          {groups.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {groups.map(g => (
                <button key={g.id} onClick={() => setActiveGroupId(g.id)}
                  className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
                  style={activeGroupId === g.id
                    ? { background: 'linear-gradient(135deg, #ff9f7a, #ffb89a)', color: 'white' }
                    : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', opacity: 0.6 }}>
                  {g.name}
                </button>
              ))}
              <button onClick={() => setActiveGroupId('__new__')}
                className="px-3 py-1.5 rounded-full text-sm font-bold opacity-40 hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ border: '1.5px dashed var(--color-border)' }}>
                <Plus size={12} /> Add
              </button>
            </div>
          )}

          {activeGroupId === '__new__' || !activeGroup ? (
            <EmptyState onCreate={handleCreate} onJoin={handleJoin} />
          ) : (
            <GroupPanel group={activeGroup} onLeave={() => handleLeave(activeGroup.id)} />
          )}
        </div>
      )}
    </div>
  )
}
