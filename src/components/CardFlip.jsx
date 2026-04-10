import { useState, useEffect } from 'react'

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

  // Expand height if content has an image
  const hasImage = (html) => html?.includes('<img')

  const frontHasImage = hasImage(front)
  const backHasImage = hasImage(back)
  const cardHeight = (frontHasImage || backHasImage) ? '480px' : '360px'

  return (
    <div className="w-full" style={{ height: cardHeight }}>
      <div className="flip-card-container w-full h-full" onClick={handleFlip}>
        <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div
            className="flip-card-front overflow-auto"
            style={{
              background: frontBg || 'var(--color-surface)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--color-border)',
              alignItems: frontHasImage ? 'flex-start' : 'center',
              paddingTop: frontHasImage ? '1.5rem' : '2.5rem',
            }}
          >
            <div className="text-center w-full">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-40">Question</div>
              <div
                className="card-content leading-relaxed"
                style={{
                  fontFamily: 'var(--font-card)',
                  color: 'var(--color-text)',
                  fontSize: frontHasImage ? '1rem' : '1.2rem',
                  fontWeight: 600,
                }}
                dangerouslySetInnerHTML={{ __html: front }}
              />
              {!frontHasImage && (
                <div className="mt-6 text-xs opacity-30 flex items-center justify-center gap-1">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-xs">Space</kbd>
                  <span>to flip</span>
                </div>
              )}
            </div>
          </div>

          {/* Back */}
          <div
            className="flip-card-back overflow-auto"
            style={{
              background: backBg || 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(196,181,253,0.3)',
              alignItems: backHasImage ? 'flex-start' : 'center',
              paddingTop: backHasImage ? '1.5rem' : '2.5rem',
            }}
          >
            <div className="text-center w-full">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-40">Answer</div>
              <div
                className="card-content leading-relaxed"
                style={{
                  fontFamily: 'var(--font-card)',
                  color: 'var(--color-text)',
                  fontSize: backHasImage ? '1rem' : '1.2rem',
                  fontWeight: 600,
                }}
                dangerouslySetInnerHTML={{ __html: back }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
