import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function readStoredSession() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith('sb-') || !key.endsWith('-auth-token')) continue
      const parsed = JSON.parse(localStorage.getItem(key) || 'null')
      if (parsed?.user) return parsed
      if (parsed?.currentSession?.user) return parsed.currentSession
    }
  } catch { /* stay signed out until a stored session exists */ }
  return null
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredSession()?.user ?? null)
  const [session, setSession] = useState(() => {
    const stored = readStoredSession()
    return stored?.user ? stored : null
  })
  const [loading, setLoading] = useState(() => !readStoredSession()?.user)

  useEffect(() => {
    let active = true
    const slow = setTimeout(() => {
      if (active) setLoading(false)
    }, 3000)

    supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (!active) return
      clearTimeout(slow)
      if (!next && readStoredSession()?.user) {
        setLoading(false)
        return
      }
      setSession(next)
      setUser(next?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT' && readStoredSession()?.user) return
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      clearTimeout(slow)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, display_name: name },
      },
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })
    if (!error) setUser(data.user)
    return { data, error }
  }

  const displayName = user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] || 'Friend'

  const firstName = displayName.split(' ')[0]

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signUp, signIn, signOut, updateProfile,
      displayName, firstName,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
