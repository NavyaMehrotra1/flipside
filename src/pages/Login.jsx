import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [forgotMode, setForgotMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

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

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setResetLoading(false)
    if (error) {
      toast.error('Hmm, something went wrong. Check the email address.')
    } else {
      setResetSent(true)
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}>
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
            <div key={t} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white/60">{t}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {forgotMode ? (
            <>
              <div className="mb-8 text-center">
                <div className="text-4xl mb-3">🔑</div>
                <h1 className="text-2xl font-extrabold mb-1">Reset your password</h1>
                <p className="opacity-60 text-sm">
                  {resetSent
                    ? "Check your inbox for the reset link."
                    : "Enter your email and we'll send you a reset link."}
                </p>
              </div>

              {resetSent ? (
                <div className="space-y-4">
                  <div
                    className="rounded-2xl p-4 text-sm text-center font-semibold"
                    style={{ background: 'rgba(134,239,172,0.15)', color: '#16a34a', border: '1px solid rgba(134,239,172,0.4)' }}
                  >
                    ✅ Reset link sent to <strong>{resetEmail}</strong>
                    <div className="font-normal opacity-70 mt-1">Click the link in the email to set a new password.</div>
                  </div>
                  <button onClick={() => { setForgotMode(false); setResetSent(false) }} className="btn-secondary w-full justify-center">
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="input-base pl-9"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={resetLoading} className="btn-primary w-full justify-center">
                    {resetLoading ? 'Sending...' : 'Send reset link'}
                  </button>
                  <button type="button" onClick={() => setForgotMode(false)} className="btn-secondary w-full justify-center">
                    Back to sign in
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 lg:hidden"
                  style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}>
                  🃏
                </div>
                <h1 className="text-2xl font-extrabold mb-1">Welcome back! 👋</h1>
                <p className="opacity-60 text-sm">Ready to flip some cards?</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      required placeholder="you@example.com" className="input-base pl-9" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setResetEmail(email) }}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: '#ff9f7a' }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      required placeholder="••••••••" className="input-base pl-9" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <p className="text-center text-sm mt-6 opacity-60">
                New here?{' '}
                <Link to="/signup" className="font-bold" style={{ color: '#ff9f7a' }}>Create an account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
