import { useState, useEffect } from 'react'

const GRADE_CONFIG = {
  0: { emoji: '😅', color: '#ef4444' },
  1: { emoji: '🤏', color: '#f97316' },
  2: { emoji: '👍', color: '#22c55e' },
  3: { emoji: '🌟', color: '#eab308' },
}

export default function FloatingEmoji({ grade, position }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(t)
  }, [])

  if (!visible || grade === null || grade === undefined) return null

  const config = GRADE_CONFIG[grade]
  if (!config) return null

  return (
    <div
      className="float-emoji"
      style={{
        left: position?.x ? position.x - 20 : '50%',
        top: position?.y ? position.y - 20 : '50%',
        color: config.color,
      }}
    >
      {config.emoji}
    </div>
  )
}
