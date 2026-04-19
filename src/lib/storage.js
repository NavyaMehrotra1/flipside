/**
 * Dual storage adapter for Supabase auth.
 * Saves session to BOTH localStorage AND a 30-day cookie.
 * If localStorage is cleared, the cookie restores the session automatically.
 * If cookies are cleared, localStorage still has it.
 * Both need to be cleared simultaneously to lose the session.
 */

const COOKIE_DAYS = 30

function setCookie(name, value) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString()
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`
}

function getCookie(name) {
  const match = document.cookie.split('; ').find(r => r.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export const dualStorage = {
  getItem: (key) => {
    // Try localStorage first
    try {
      const ls = localStorage.getItem(key)
      if (ls) return ls
    } catch {}

    // Fall back to cookie and restore localStorage if found
    const cookie = getCookie(`fs_${key}`)
    if (cookie) {
      try { localStorage.setItem(key, cookie) } catch {}
      return cookie
    }
    return null
  },

  setItem: (key, value) => {
    try { localStorage.setItem(key, value) } catch {}
    setCookie(`fs_${key}`, value)
  },

  removeItem: (key) => {
    try { localStorage.removeItem(key) } catch {}
    removeCookie(`fs_${key}`)
  },
}
