import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const PASTEL_COLORS = ['#ffb899', '#c4b5fd', '#86efac', '#fde68a', '#fda4af', '#93c5fd']

export function fireConfetti(type = 'default') {
  const configs = {
    default: {
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: PASTEL_COLORS,
      scalar: 1.1,
    },
    session: {
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: PASTEL_COLORS,
      scalar: 1.3,
      shapes: ['circle', 'square'],
    },
    milestone: {
      particleCount: 150,
      spread: 120,
      origin: { y: 0.4 },
      colors: PASTEL_COLORS,
      scalar: 1.2,
      gravity: 0.8,
    },
    firstDeck: {
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffb899', '#fde68a', '#86efac'],
      scalar: 1.2,
      shapes: ['star'],
    },
    cardMilestone: {
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#c4b5fd', '#fda4af', '#93c5fd'],
      scalar: 1.0,
    },
  }

  const config = configs[type] || configs.default
  confetti({ ...config, disableForReducedMotion: true })
}

export default function ConfettiTrigger({ trigger, type = 'default' }) {
  useEffect(() => {
    if (trigger) fireConfetti(type)
  }, [trigger, type])
  return null
}
