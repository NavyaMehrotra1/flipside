import Modal from './Modal'

const shortcuts = [
  { key: 'Space', description: 'Flip card' },
  { key: '← →', description: 'Previous / Next card' },
  { key: '1', description: 'Grade: Nope 😅' },
  { key: '2', description: 'Grade: Almost 🤏' },
  { key: '3', description: 'Grade: Got it 👍' },
  { key: '4', description: 'Grade: Easy 🌟' },
  { key: 'N', description: 'New card' },
  { key: 'E', description: 'Edit card' },
  { key: 'B', description: 'Bookmark toggle' },
  { key: '?', description: 'Show shortcuts' },
]

export default function KeyboardShortcutsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts ⌨️" size="sm">
      <div className="p-5 space-y-2">
        {shortcuts.map(s => (
          <div key={s.key} className="flex items-center justify-between py-1.5">
            <span className="text-sm opacity-70">{s.description}</span>
            <kbd
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
              style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  )
}
