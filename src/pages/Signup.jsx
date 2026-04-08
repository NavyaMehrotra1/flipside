import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User } from 'lucide-react'

function GitHubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
import toast from 'react-hot-toast'

export default function Signup() {
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      toast.error(error.message || 'Hmm, something went wrong. Let\'s try that again.')
    } else {
      toast.success('Account created! Check your email to verify. ✨')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #dbeafe 50%, #ede9fe 100%)' }}
      >
        <div className="flex items-center gap-2 font-extrabold text-2xl" style={{ color: 'var(--color-text)' }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}
          >
            🃏
          </div>
          Flipside
        </div>

        <div>
          <p className="text-4xl font-extrabold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
            Start your<br />learning journey.
          </p>
          <p className="text-base opacity-60 mb-6">Join thousands of learners who study smarter every day.</p>
          <div className="space-y-3">
            {[
              ['🚀', 'Spaced repetition that actually works'],
              ['🎯', 'Track your progress with daily streaks'],
              ['✨', 'Beautiful cards that make studying enjoyable'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm opacity-40">
          Already a member?{' '}
          <Link to="/login" className="font-bold underline" style={{ color: 'var(--color-text)' }}>Sign in</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold mb-1">Create your account 🌱</h1>
            <p className="opacity-60 text-sm">It's free. No credit card needed.</p>
          </div>

          <div className="space-y-3 mb-6">
            <button onClick={signInWithGoogle} className="btn-secondary w-full justify-center">
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Sign up with Google
            </button>
            <button onClick={signInWithGitHub} className="btn-secondary w-full justify-center">
              <GitHubIcon size={16} />
              Sign up with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs opacity-40 font-semibold">or email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Your name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Alex" className="input-base pl-9" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="input-base pl-9" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" className="input-base pl-9" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating account...' : 'Create account ✨'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 opacity-60">
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#ff9f7a' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
