import { useState, useEffect } from 'react'
import { Space } from 'lucide-react'

export default function CardFlip({ front, back, flipped, onFlip, frontBg, backBg }) {
  const [animating, setAnimating] = useState(false)

  const handleFlip = () => {
    if (animating) return
    setAnimating(true)
    onFlip()
    setTimeout(() => setAnimating(false), 600)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        handleFlip()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [animating])

  return (
    <div className="w-full" style={{ height: '360px' }}>
      <div className="flip-card-container w-full h-full" onClick={handleFlip}>
        <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div
            className="flip-card-front"
            style={{
              background: frontBg || 'var(--color-surface)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-center w-full">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-40">Question</div>
              <div
                className="text-xl font-semibold leading-relaxed"
                style={{ fontFamily: 'var(--font-card)', color: 'var(--color-text)' }}
                dangerouslySetInnerHTML={{ __html: front }}
              />
              <div className="mt-6 text-xs opacity-30 flex items-center justify-center gap-1">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-xs">Space</kbd>
                <span>to flip</span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="flip-card-back"
            style={{
              background: backBg || 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(196,181,253,0.3)',
            }}
          >
            <div className="text-center w-full">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-40">Answer</div>
              <div
                className="text-xl font-semibold leading-relaxed"
                style={{ fontFamily: 'var(--font-card)', color: 'var(--color-text)' }}
                dangerouslySetInnerHTML={{ __html: back }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
