import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO_CARDS = [
  {
    front: 'What is spaced repetition?',
    back: 'A technique that schedules reviews at increasing intervals — right when you\'re about to forget.',
    color: 'linear-gradient(135deg, #fff0e8 0%, #ffe8dc 100%)',
    backColor: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)',
  },
  {
    front: 'What does the mitochondria do?',
    back: 'Produces ATP — the cell\'s energy currency. The powerhouse of the cell. 🔋',
    color: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
    backColor: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
  },
  {
    front: 'Derivative of x²',
    back: '2x — power rule: bring the exponent down, reduce it by one.',
    color: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
    backColor: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
  },
  {
    front: 'What year did World War II end?',
    back: '1945 — V-E Day (Europe) May 8, V-J Day (Japan) September 2. 🕊️',
    color: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)',
    backColor: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
  },
]

function DemoCard() {
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const flipTimer = setTimeout(() => setFlipped(true), 1600)
    return () => clearTimeout(flipTimer)
  }, [cardIndex])

  useEffect(() => {
    if (!flipped) return
    const nextTimer = setTimeout(() => {
      setAnimating(true)
      setTimeout(() => {
        setCardIndex(i => (i + 1) % DEMO_CARDS.length)
        setFlipped(false)
        setAnimating(false)
      }, 300)
    }, 2000)
    return () => clearTimeout(nextTimer)
  }, [flipped])

  const card = DEMO_CARDS[cardIndex]

  const handleClick = () => {
    if (animating) return
    setFlipped(f => !f)
  }

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      <div
        className="flip-card-container"
        style={{ height: 200 }}
        onClick={handleClick}
      >
        <div className={`flip-card-inner w-full h-full${flipped ? ' flipped' : ''}${animating ? ' opacity-0' : ''}`}
          style={{ transition: animating ? 'opacity 0.3s' : undefined }}>
          <div
            className="flip-card-front"
            style={{ background: card.color, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <div className="text-center w-full px-4">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-40">Question</div>
              <p style={{ fontFamily: 'var(--font-card)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5 }}>
                {card.front}
              </p>
              <div className="mt-4 text-xs opacity-30">tap to flip</div>
            </div>
          </div>
          <div
            className="flip-card-back"
            style={{ background: card.backColor, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <div className="text-center w-full px-4">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-40">Answer</div>
              <p style={{ fontFamily: 'var(--font-card)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5 }}>
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {DEMO_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCardIndex(i); setFlipped(false) }}
            className="rounded-full transition-all"
            style={{
              width: i === cardIndex ? 20 : 6,
              height: 6,
              background: i === cardIndex ? '#ff9f7a' : 'rgba(0,0,0,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Signup() {
  const { signUp } = useAuth()
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
      toast.error(error.message || "Hmm, something went wrong. Let's try that again.")
    } else {
      toast.success('Account created! Check your email to verify. ✨')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — interactive demo */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #fff8f5 0%, #ede9fe 50%, #dcfce7 100%)' }}
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
          <p className="text-3xl font-extrabold leading-tight mb-2" style={{ color: 'var(--color-text)' }}>
            See it in action.
          </p>
          <p className="text-base opacity-50 mb-8">Click any card to flip it. Your decks work just like this.</p>
          <DemoCard />
        </div>

        <div className="space-y-2">
          {[
            ['🧠', 'Spaced repetition built in — cards resurface right when you need them'],
            ['🔥', 'Daily streaks keep you consistent without the guilt'],
            ['✨', 'AI generates cards from any notes, textbook, or paste'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{icon}</span>
              <span className="text-sm font-semibold opacity-70" style={{ color: 'var(--color-text)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — signup form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 lg:hidden"
              style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}>
              🃏
            </div>
            <h1 className="text-2xl font-extrabold mb-1">Create your account 🌱</h1>
            <p className="opacity-60 text-sm">Free forever. No credit card needed.</p>
          </div>

          {/* Mobile demo */}
          <div className="lg:hidden mb-8">
            <DemoCard />
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

          <p className="text-center text-xs mt-4 opacity-40 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="underline hover:opacity-70">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="underline hover:opacity-70">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm mt-5 opacity-60">
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#ff9f7a' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
