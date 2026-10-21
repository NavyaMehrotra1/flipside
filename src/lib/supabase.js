import { createClient } from '@supabase/supabase-js'
import { dualStorage } from './storage'
import { markReachable, markUnreachable } from './offlineStore'

function flightFetch(input, init = {}) {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 12000)
  if (init.signal) {
    if (init.signal.aborted) controller.abort()
    else init.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }
  return fetch(input, { ...init, signal: controller.signal })
    .then((response) => {
      markReachable()
      return response
    })
    .catch((error) => {
      if (timedOut || (typeof navigator !== 'undefined' && navigator.onLine === false)) markUnreachable()
      throw error
    })
    .finally(() => clearTimeout(timer))
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: dualStorage,
    },
    global: { fetch: flightFetch },
  }
)
