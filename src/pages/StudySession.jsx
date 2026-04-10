import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react'
import { useDeck } from '../hooks/useDecks'
import { useCards } from '../hooks/useCards'
import { useStudySession } from '../hooks/useStudySession'
import CardFlip from '../components/CardFlip'
import FloatingEmoji from '../components/FloatingEmoji'
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal'
import { fireConfetti } from '../components/ConfettiTrigger'
import { useStreak } from '../hooks/useStreak'
import { isMilestone, getMilestoneMessage } from '../lib/streaks'
import toast from 'react-hot-toast'

const GRADE_BUTTONS = [
  { value: 0, label: 'Nope',   emoji: '😅', color: '#fca5a5', bg: 'rgba(252,165,165,0.15)', key: '1' },
  { value: 1, label: 'Almost', emoji: '🤏', color: '#fdba74', bg: 'rgba(253,186,116,0.15)', key: '2' },
  { value: 2, label: 'Got it', emoji: '👍', color: '#86efac', bg: 'rgba(134,239,172,0.15)', key: '3' },
  { value: 3, label: 'Easy',   emoji: '🌟', color: '#fde68a', bg: 'rgba(253,230,138,0.15)', key: '4' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Mode selector ────────────────────────────────────────────────────────────
function ModeSelector({ onSelect, cardCount }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-2xl font-extrabold mb-1">Choose study mode</h2>
      <p className="opacity-60 mb-6 text-sm">{cardCount} card{cardCount !== 1 ? 's' : ''} ready</p>
      <div className="space-y-3">
        {[
          { mode: 'sequential', emoji: '📋', label: 'Sequential', desc: 'Go through cards in order' },
          { mode: 'random',     emoji: '🎲', label: 'Shuffle',    desc: 'Mix it up for better retention' },
          { mode: 'spaced',     emoji: '🧠', label: 'Spaced Repetition', desc: 'SM-2: only cards due today' },
        ].map(m => (
          <button
            key={m.mode}
            onClick={() => onSelect(m.mode)}
            className="card-base card-hover w-full flex items-center gap-4 p-4 text-left"
            style={{ background: 'var(--color-surface)' }}
          >
            <span className="text-3xl">{m.emoji}</span>
            <div>
              <div className="font-bold">{m.label}</div>
              <div className="text-sm opacity-60">{m.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── End of session screen ────────────────────────────────────────────────────
function SessionEnd({ accuracy, cardsReviewed, timeTaken, deckId, onStudyAgain }) {
  const pct = accuracy ?? 0
  const emoji   = pct >= 90 ? '🏆' : pct >= 70 ? '🌟' : pct >= 50 ? '👍' : '💪'
  const message = pct >= 90 ? "You're absolutely crushing it!"
    : pct >= 70 ? "Really solid session! Keep it up!"
    : pct >= 50 ? "Good effort — you're improving!"
    : "Every attempt makes you stronger. 💪"

  const mins = Math.floor(timeTaken / 60)
  const secs = timeTaken % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="text-7xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-extrabold mb-2">Session complete!</h2>
      <p className="opacity-70 mb-8">{message}</p>
      <div className="card-base p-6 mb-6" style={{ background: 'var(--color-surface)' }}>
        <div className="flex justify-around">
          <Stat value={`${pct}%`}  label="Accuracy"  color="#ff9f7a" />
          <Stat value={cardsReviewed} label="Cards"  color="#c4b5fd" />
          <Stat value={timeStr}    label="Time"       color="#86efac" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onStudyAgain} className="btn-primary flex-1 justify-center">Study Again 🔁</button>
        <Link to={`/deck/${deckId}`} className="btn-secondary flex-1 justify-center text-center">Back to Deck</Link>
      </div>
    </div>
  )
}

function Stat({ value, label, color }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs opacity-60 font-semibold mt-1">{label}</div>
    </div>
  )
}

// ─── Active study session (mounts only after cards + mode are ready) ──────────
function ActiveSession({ cards, mode, deckId, deck, onStudyAgain }) {
  const { recordStudy } = useStreak()
  const session = useStudySession(cards, deckId, mode)

  const [emojiPos, setEmojiPos]     = useState(null)
  const [lastGradeEmoji, setLastGradeEmoji] = useState(null)
  const [emojiKey, setEmojiKey]     = useState(0)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [sessionDone, setSessionDone]     = useState(false)
  const [sessionStats, setSessionStats]   = useState(null)

  useEffect(() => {
    if (session.ended && !sessionDone) {
      setSessionDone(true)
      setSessionStats({ accuracy: session.accuracy, cards: session.totalCards, time: session.timeTaken })
      fireConfetti('session')
      recordStudy().then(updated => {
        if (updated && isMilestone(updated.current_streak)) {
          setTimeout(() => {
            fireConfetti('milestone')
            toast.success(getMilestoneMessage(updated.current_streak), { duration: 5000 })
          }, 1500)
        }
      })
    }
  }, [session.ended])

  const handleGrade = useCallback((gradeValue, e) => {
    if (!session.flipped) return
    setEmojiPos(e ? { x: e.clientX, y: e.clientY } : { x: window.innerWidth / 2, y: window.innerHeight / 2 })
    setLastGradeEmoji(gradeValue)
    setEmojiKey(k => k + 1)
    session.grade(gradeValue)
  }, [session])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space') { e.preventDefault(); session.flip(); return }
      if (e.key === 'ArrowLeft')  { session.prev(); return }
      if (e.key === 'ArrowRight') { session.next(); return }
      if (e.key === '1') handleGrade(0)
      if (e.key === '2') handleGrade(1)
      if (e.key === '3') handleGrade(2)
      if (e.key === '4') handleGrade(3)
      if (e.key === '?') setShortcutsOpen(true)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [session, handleGrade])

  if (sessionDone && sessionStats) {
    return (
      <SessionEnd
        accuracy={sessionStats.accuracy}
        cardsReviewed={sessionStats.cards}
        timeTaken={sessionStats.time}
        deckId={deckId}
        onStudyAgain={onStudyAgain}
      />
    )
  }

  if (!session.currentCard) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="text-xl font-bold mb-2">No cards to study!</h2>
        <p className="opacity-60 text-sm mb-6">Add some cards to this deck first.</p>
        <Link to={`/deck/${deckId}`} className="btn-primary">Go to deck</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link to={`/deck/${deckId}`} className="flex items-center gap-1 text-sm opacity-50 hover:opacity-100 transition-opacity">
          <ArrowLeft size={14} /> {deck?.emoji} {deck?.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold opacity-40">
            Card {session.currentIndex + 1} of {session.totalCards} ✨
          </span>
          <button
            onClick={() => setShortcutsOpen(true)}
            className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center opacity-40 hover:opacity-70"
          >
            <HelpCircle size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-8">
        <div className="progress-fill" style={{ width: `${session.progress * 100}%` }} />
      </div>

      {/* Card */}
      <CardFlip
        front={session.currentCard.front}
        back={session.currentCard.back}
        flipped={session.flipped}
        onFlip={session.flip}
        frontBg="var(--color-surface)"
        backBg="linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)"
      />

      {/* Grade buttons */}
      {session.flipped && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {GRADE_BUTTONS.map(btn => (
            <button
              key={btn.value}
              onClick={(e) => handleGrade(btn.value, e)}
              className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: btn.bg, border: `1.5px solid ${btn.color}40`, color: 'var(--color-text)' }}
            >
              <span className="text-xl">{btn.emoji}</span>
              <span className="text-xs">{btn.label}</span>
              <kbd className="text-xs opacity-40 font-mono">{btn.key}</kbd>
            </button>
          ))}
        </div>
      )}

      {/* Nav buttons */}
      {!session.flipped && (
        <div className="flex justify-between mt-6">
          <button onClick={session.prev} disabled={session.currentIndex === 0} className="btn-secondary text-sm disabled:opacity-30">
            <ArrowLeft size={14} /> Prev
          </button>
          <button onClick={session.flip} className="btn-primary">Flip card ↩</button>
          <button onClick={session.next} disabled={session.currentIndex >= session.totalCards - 1} className="btn-secondary text-sm disabled:opacity-30">
            Next <ArrowRight size={14} />
          </button>
        </div>
      )}

      {lastGradeEmoji !== null && (
        <FloatingEmoji key={emojiKey} grade={lastGradeEmoji} position={emojiPos} />
      )}
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}

// ─── Outer shell ──────────────────────────────────────────────────────────────
export default function StudySession() {
  const { id } = useParams()
  const { deck } = useDeck(id)
  const { cards, loading } = useCards(id)

  const [mode, setMode] = useState(null)
  const [orderedCards, setOrderedCards] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)

  const handleModeSelect = (selectedMode) => {
    const arranged = selectedMode === 'random' ? shuffle(cards) : [...cards]
    setOrderedCards(arranged)
    setMode(selectedMode)
  }

  const handleStudyAgain = () => {
    setMode(null)
    setOrderedCards(null)
    setSessionKey(k => k + 1)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4 opacity-40">🃏</div>
        <p className="opacity-50 text-sm">Loading cards...</p>
      </div>
    )
  }

  if (!mode || !orderedCards) {
    return <ModeSelector onSelect={handleModeSelect} cardCount={cards.length} />
  }

  // Key forces a full remount of ActiveSession (and useStudySession) each time
  return (
    <ActiveSession
      key={sessionKey}
      cards={orderedCards}
      mode={mode}
      deckId={id}
      deck={deck}
      onStudyAgain={handleStudyAgain}
    />
  )
}
