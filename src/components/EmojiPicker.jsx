import { useState } from 'react'

const POPULAR_EMOJIS = [
  '📚','📖','📝','✏️','🎓','🧠','💡','🔬','🔭','🧪','🧬','💻','🖥️','📱',
  '🎯','🏆','⭐','🌟','✨','🔥','💫','🌈','🎨','🎭','🎵','🎸','🎹','🎺',
  '🌍','🌿','🌱','🌸','🌺','🦋','🐬','🦊','🐘','🦁','🐉','🦅','🌊','⚡',
  '📊','📈','💰','🏗️','⚗️','🎲','🃏','🎪','🚀','🛸','🌙','☀️','🌙','❄️',
  '🍎','🍋','🍇','🫐','🌮','🍕','☕','🧃','🎂','🍰','🍩','🍫','🍭','🧁',
  '💪','🧘','🏊','⛹️','🤸','🏋️','🎾','⚽','🏀','🎮','🕹️','🎭','🎬','📸',
]

export default function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search
    ? POPULAR_EMOJIS.filter(e => e.includes(search))
    : POPULAR_EMOJIS

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 text-3xl rounded-2xl border-2 flex items-center justify-center hover:scale-105 transition-transform"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
      >
        {value || '📚'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-16 left-0 z-20 card-base p-3 w-72"
            style={{ background: 'var(--color-surface)' }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base mb-2 text-sm py-1.5"
            />
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {filtered.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => { onChange(emoji); setOpen(false) }}
                  className="w-8 h-8 text-xl rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
