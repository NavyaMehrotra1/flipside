import { Link } from 'react-router-dom'
import { BookOpen, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

export default function DeckGrid({ decks, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {decks.map((deck, i) => (
        <DeckCard key={deck.id} deck={deck} index={i} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}

function DeckCard({ deck, onDelete, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="card-base card-hover pop-in group relative"
      style={{ background: deck.color || '#ffe8dc' }}
    >
      <Link to={`/deck/${deck.id}`} className="block p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{deck.emoji || '📚'}</span>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-black/10"
            onClick={e => { e.preventDefault(); setMenuOpen(o => !o) }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
        <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: 'var(--color-text)' }}>
          {deck.name}
        </h3>
        {deck.description && (
          <p className="text-sm opacity-70 line-clamp-2 mb-3">{deck.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-xs opacity-60 font-semibold">
          <BookOpen size={12} />
          <span>Study now</span>
        </div>
      </Link>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-12 right-3 z-20 card-base p-1.5 min-w-[140px]" style={{ background: 'var(--color-surface)' }}>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-black/5 text-left"
              onClick={() => { onEdit?.(deck); setMenuOpen(false) }}
            >
              <Edit2 size={13} /> Edit deck
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-500 text-left"
              onClick={() => { onDelete?.(deck); setMenuOpen(false) }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
