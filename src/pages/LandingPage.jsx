import { useRef } from 'react'
import { Link } from 'react-router-dom'

function ForgettingCurve() {
  const reviewX = [80, 200, 355, 555]
  const fallY =   [78,  65,  60,  55]

  const srSegments = []
  let prev = { x: 0, y: 10 }
  reviewX.forEach((rx, i) => {
    srSegments.push(`M ${prev.x},${prev.y} C ${prev.x + 30},${prev.y} ${rx - 30},${fallY[i]} ${rx},${fallY[i]}`)
    srSegments.push(`M ${rx},${fallY[i]} L ${rx},12`)
    prev = { x: rx, y: 12 }
  })
  srSegments.push(`M ${prev.x},${prev.y} C ${prev.x + 20},${prev.y} 630,30 640,32`)

  return (
    <div className="relative w-full rounded-3xl p-6 pt-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <svg viewBox="0 0 680 215" className="w-full" style={{ maxHeight: 260, overflow: 'visible' }}>
        {/* Horizontal grid */}
        {[10, 110, 195].map(y => (
          <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
        ))}
        <line x1="0" y1="200" x2="640" y2="200" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />

        {/* Y labels */}
        <text x="647" y="14"  fontSize="9.5" fill="currentColor" fillOpacity="0.4">100%</text>
        <text x="647" y="114" fontSize="9.5" fill="currentColor" fillOpacity="0.4">50%</text>
        <text x="647" y="199" fontSize="9.5" fill="currentColor" fillOpacity="0.4">0%</text>

        {/* X labels */}
        {[{ x: 100, l: 'Day 1' }, { x: 280, l: 'Day 7' }, { x: 420, l: 'Day 14' }, { x: 590, l: 'Day 30' }].map(({ x, l }) => (
          <text key={l} x={x} y="213" fontSize="9.5" fill="currentColor" fillOpacity="0.4" textAnchor="middle">{l}</text>
        ))}

        {/* No-review curve (red dashed) */}
        <path
          d="M 0,10 C 25,10 50,38 85,78 C 145,125 260,167 640,183"
          fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeDasharray="7,4"
        />

        {/* Spaced repetition (green saw-tooth) */}
        {srSegments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinejoin="round" />
        ))}

        {/* Review dots */}
        {reviewX.map((rx, i) => (
          <circle key={rx} cx={rx} cy={fallY[i]} r="5" fill="#4ade80" />
        ))}

        {/* "Review!" label on first dot */}
        <text x={reviewX[0] + 8} y={fallY[0] - 8} fontSize="9" fill="#4ade80" fontWeight="700">Review</text>

        {/* Legend */}
        <g transform="translate(8,162)">
          <line x1="0" y1="7" x2="18" y2="7" stroke="#fca5a5" strokeWidth="2.5" strokeDasharray="5,3" />
          <text x="24" y="11" fontSize="10" fill="currentColor" fillOpacity="0.55">Without review</text>
        </g>
        <g transform="translate(8,178)">
          <line x1="0" y1="7" x2="18" y2="7" stroke="#86efac" strokeWidth="2.5" />
          <circle cx="26" cy="7" r="3.5" fill="#4ade80" />
          <text x="33" y="11" fontSize="10" fill="currentColor" fillOpacity="0.55">With Flipside (each dot = review)</text>
        </g>
      </svg>
    </div>
  )
}

const COMPARISON = [
  ['SM-2 spaced repetition algorithm',  true,  true],
  ['Works in any browser, no install',   false, true],
  ['Modern, beautiful UI',               false, true],
  ['Study groups & leaderboards',        false, true],
  ['AI card generation from notes',      false, true],
  ['Free on all devices',                false, true],
  ['Daily streaks + milestone rewards',  false, true],
  ['Time to first card',                 '~30 min setup', '30 seconds'],
]

const STATS = [
  {
    num: '50%',
    claim: 'of new information is forgotten within 1 hour without review',
    cite: 'Ebbinghaus, 1885',
  },
  {
    num: '2×',
    claim: 'better recall with active testing vs. re-reading the same material',
    cite: 'Roediger & Karpicke, 2006',
  },
  {
    num: '200%',
    claim: 'improvement in long-term retention with spaced practice over massed study',
    cite: 'Cepeda et al., 2006',
  },
]

export default function LandingPage() {
  const scienceRef = useRef(null)
  const loginRef   = useRef(null)

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(253,248,243,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 font-extrabold text-xl">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}>
            🃏
          </div>
          Flipside
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold opacity-60">
          <button onClick={() => scienceRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:opacity-100 transition-opacity">The Science</button>
          <Link to="/signup" className="hover:opacity-100 transition-opacity">vs Anki</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get started →</Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8"
          style={{ background: 'rgba(196,181,253,0.15)', border: '1px solid rgba(196,181,253,0.3)', color: '#7c3aed' }}>
          Backed by 140 years of memory science
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          The science of<br />
          <span style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            not forgetting.
          </span>
        </h1>

        <p className="text-lg md:text-xl opacity-60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Most studying is wasted effort. Flipside uses spaced repetition to schedule every review
          at the exact right moment — so what you learn actually sticks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/signup" className="btn-primary text-base px-8 py-3.5">Start for free →</Link>
          <button
            onClick={() => scienceRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary text-base px-8 py-3.5"
          >
            See the science ↓
          </button>
        </div>

        {/* Hero card demo */}
        <div className="relative max-w-sm mx-auto">
          <div className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #ffb899 0%, #c4b5fd 50%, #86efac 100%)' }} />
          <div className="relative flip-card-container" style={{ height: 180 }}>
            <div className="flip-card-inner w-full h-full" style={{ transform: 'rotateY(0deg)' }}>
              <div className="flip-card-front" style={{
                background: 'linear-gradient(135deg, #fff0e8, #ffe8dc)',
                border: '1px solid rgba(255,184,153,0.3)',
                boxShadow: '0 20px 60px rgba(255,159,122,0.2)',
              }}>
                <div className="text-center w-full px-6">
                  <div className="text-xs font-bold uppercase tracking-widest mb-3 opacity-40">Question</div>
                  <p style={{ fontFamily: 'var(--font-card)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>
                    What is the spacing effect?
                  </p>
                  <div className="mt-4 text-xs opacity-30 font-semibold">click to flip →</div>
                </div>
              </div>
              <div className="flip-card-back" style={{
                background: 'linear-gradient(135deg, #fdf4ff, #ede9fe)',
                border: '1px solid rgba(196,181,253,0.3)',
              }}>
                <div className="text-center w-full px-6">
                  <div className="text-xs font-bold uppercase tracking-widest mb-3 opacity-40">Answer</div>
                  <p style={{ fontFamily: 'var(--font-card)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 }}>
                    Distributing practice over time leads to stronger memory than cramming the same amount in one session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Science / Forgetting Curve ────────────────────── */}
      <section ref={scienceRef} className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">The Ebbinghaus Forgetting Curve</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">You're losing information<br />faster than you think.</h2>
          <p className="opacity-60 max-w-xl mx-auto">
            Hermann Ebbinghaus mapped human forgetting in 1885. Without timed review,
            memory follows a steep exponential decay. Flipside fights it automatically.
          </p>
        </div>

        <ForgettingCurve />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {STATS.map(({ num, claim, cite }) => (
            <div key={num} className="rounded-2xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="text-4xl font-extrabold mb-2"
                style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {num}
              </div>
              <p className="text-sm leading-relaxed opacity-70 mb-3">{claim}</p>
              <div className="text-xs font-semibold opacity-35 font-mono">{cite}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two Modes ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Two modes. One habit.</h2>
          <p className="opacity-60 max-w-xl mx-auto">
            Study alone when you need deep focus. Switch to Social when you need accountability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #fff8f5, #fff0e8)', border: '1px solid rgba(255,184,153,0.2)' }}>
            <div className="text-3xl mb-4">📚</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(255,159,122,0.15)', color: '#ea580c' }}>Focus Mode</div>
            <h3 className="text-xl font-extrabold mb-3">Pure, distraction-free study.</h3>
            <ul className="space-y-2 text-sm opacity-70">
              {['SM-2 spaced repetition on every card', 'Sequential, shuffle, or due-cards-only mode', 'Keyboard-driven — never touch your mouse', 'Streak tracking that rewards consistency'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">✓</span>{f}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid rgba(134,239,172,0.2)' }}>
            <div className="text-3xl mb-4">👥</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(134,239,172,0.2)', color: '#16a34a' }}>Social Mode</div>
            <h3 className="text-xl font-extrabold mb-3">Study with people. Stay accountable.</h3>
            <ul className="space-y-2 text-sm opacity-70">
              {['Create or join a study group in seconds', 'Live leaderboard — streaks and cards today', 'See who\'s studied and who\'s falling behind', 'Group invite codes, no email required'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── vs Anki ───────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Everything Anki gets right.<br />Plus everything it misses.</h2>
          <p className="opacity-60">Anki's algorithm is brilliant. The rest of it is a 2003 desktop app.</p>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <div className="grid grid-cols-3 px-6 py-3 text-xs font-bold uppercase tracking-widest opacity-40"
            style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
            <span>Feature</span>
            <span className="text-center">Anki</span>
            <span className="text-center">Flipside</span>
          </div>
          {COMPARISON.map(([feature, anki, flip], i) => (
            <div key={feature}
              className="grid grid-cols-3 px-6 py-4 text-sm items-center"
              style={{
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-warm)',
                borderBottom: i < COMPARISON.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
              <span className="font-semibold opacity-80">{feature}</span>
              <span className="text-center">
                {typeof anki === 'string' ? <span className="opacity-50 text-xs">{anki}</span>
                  : anki ? <span className="text-green-500 font-bold text-base">✓</span>
                  : <span className="text-red-400 font-bold text-base">✗</span>}
              </span>
              <span className="text-center">
                {typeof flip === 'string' ? <span className="text-green-600 text-xs font-semibold">{flip}</span>
                  : flip ? <span className="text-green-500 font-bold text-base">✓</span>
                  : <span className="text-red-400 font-bold text-base">✗</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="rounded-3xl p-12" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ede9fe 50%, #dcfce7 100%)', border: '1px solid var(--color-border)' }}>
          <div className="text-5xl mb-4">🃏</div>
          <h2 className="text-3xl font-extrabold mb-3">Start studying smarter.</h2>
          <p className="opacity-60 mb-8">Free forever. 30 seconds to your first deck.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5">Create free account →</Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">Sign in</Link>
          </div>
        </div>

        <div className="mt-8 text-xs opacity-30 flex items-center justify-center gap-4">
          <Link to="/privacy" className="hover:opacity-60 transition-opacity">Privacy</Link>
          <Link to="/terms" className="hover:opacity-60 transition-opacity">Terms</Link>
        </div>
      </section>
    </div>
  )
}
