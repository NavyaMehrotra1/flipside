import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStreak } from '../hooks/useStreak'
import { Moon, Sun, Settings, LogOut, BookOpen } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, firstName, signOut } = useAuth()
  const { streak } = useStreak()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(253,248,243,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl no-underline" style={{ color: 'var(--color-text)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}
          >
            🃏
          </div>
          <span>Flipside</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          {streak && (
            <Link
              to="/"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold no-underline"
              style={{ background: 'rgba(255,184,153,0.15)', color: '#ea580c' }}
              title={`${streak.current_streak} day streak`}
            >
              🔥 {streak.current_streak}
            </Link>
          )}

          {/* Dark mode */}
          <button
            onClick={() => setDark(d => !d)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}
              >
                {firstName?.[0]?.toUpperCase() || 'U'}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-10 z-20 card-base p-2 min-w-[180px]"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    <div className="px-3 py-1.5 text-xs opacity-50 font-semibold">{firstName}</div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 no-underline"
                      style={{ color: 'var(--color-text)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings size={14} /> Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-500 text-left"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
