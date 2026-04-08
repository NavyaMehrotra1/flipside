import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock } from 'lucide-react'

function GitHubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
import toast from 'react-hot-toast'

export default function Login() {
  const { signIn, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast.error("Hmm, those credentials don't match. Let's try that again.")
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ede9fe 50%, #dcfce7 100%)' }}
      >
        <div className="flex items-center gap-2 font-extrabold text-2xl" style={{ color: 'var(--color-text)' }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}
          >
            🃏
          </div>
          Flipside
        </div>

        <div>
          <p className="text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
            Every card<br />has two sides.
          </p>
          <p className="text-lg opacity-60" style={{ color: 'var(--color-text)' }}>
            Learn smarter, not harder. Spaced repetition meets genuine delight.
          </p>
        </div>

        <div className="flex gap-4">
          {['🧠 Spaced repetition', '🔥 Daily streaks', '✨ Feels good to use'].map(t => (
            <div key={t} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white/60">
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 lg:hidden"
              style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}
            >
              🃏
            </div>
            <h1 className="text-2xl font-extrabold mb-1">Welcome back! 👋</h1>
            <p className="opacity-60 text-sm">Ready to flip some cards?</p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={signInWithGoogle}
              className="btn-secondary w-full justify-center"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Continue with Google
            </button>
            <button
              onClick={signInWithGitHub}
              className="btn-secondary w-full justify-center"
            >
              <GitHubIcon size={16} />
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs opacity-40 font-semibold">or email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-base pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-base pl-9"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 opacity-60">
            New here?{' '}
            <Link to="/signup" className="font-bold" style={{ color: '#ff9f7a' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
