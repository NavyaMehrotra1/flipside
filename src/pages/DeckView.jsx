import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Plus, Play, Download, Upload, Search, Bookmark, Grid3X3, List, ArrowLeft, X, Tag, Zap } from 'lucide-react'
import { useDeck } from '../hooks/useDecks'
import { useCards } from '../hooks/useCards'
import Modal from '../components/Modal'
import TipTapEditor from '../components/TipTapEditor'
import QuickAddPanel from '../components/QuickAddPanel'
import { SkeletonGrid } from '../components/SkeletonLoader'
import { exportToNotion, downloadMarkdown } from '../lib/exportNotion'
import { parseCSV, generateCSVTemplate } from '../lib/csvImport'
import toast from 'react-hot-toast'
import { fireConfetti } from '../components/ConfettiTrigger'
import { Bookmark as BookmarkFill } from 'lucide-react'

export default function DeckView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deck, loading: deckLoading } = useDeck(id)
  const { cards, loading: cardsLoading, createCard, updateCard, deleteCard, toggleBookmark, bulkImport } = useCards(id)

  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [showStudyModal, setShowStudyModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  const fileRef = useRef()

  const allTags = [...new Set(cards.flatMap(c => c.tags || []))]

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
    const matchTag = !tagFilter || (c.tags || []).includes(tagFilter)
    return matchSearch && matchTag
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await createCard({
      front,
      back,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    setSaving(false)
    if (error) {
      toast.error('Hmm, something went wrong.')
    } else {
      const total = cards.length + 1
      if (total === 50 || total === 100) {
        fireConfetti('cardMilestone')
        toast.success(`${total} cards! Look at you go! 🎉`, { duration: 4000 })
      } else {
        toast.success('Card added! ✨')
      }
      setFront(''); setBack(''); setTags('')
      setShowAddModal(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const { error } = await updateCard(showEditModal.id, { front, back, tags: tagArr })
    setSaving(false)
    if (error) {
      toast.error('Hmm, something went wrong.')
    } else {
      toast.success('Card updated!')
      setShowEditModal(null)
    }
  }

  const handleExport = () => {
    if (!deck || !cards.length) {
      toast.error('No cards to export.')
      return
    }
    const content = exportToNotion(deck, cards)
    downloadMarkdown(content, deck.name)
    toast.success('Exported! Open in Notion. 📄')
  }

  const handleImportFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = parseCSV(text)
      const { data, error } = await bulkImport(parsed)
      if (error) throw new Error(error.message)
      toast.success(`Imported ${parsed.length} cards! 🎉`)
      setShowImportModal(false)
    } catch (err) {
      toast.error(err.message || 'Could not parse CSV. Check the format.')
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([generateCSVTemplate()], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'flipside-template.csv'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (deckLoading) return <div className="max-w-6xl mx-auto px-4 py-8"><SkeletonGrid /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm opacity-50 hover:opacity-100 mb-2 transition-opacity">
            <ArrowLeft size={13} /> Decks
          </button>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <span>{deck?.emoji}</span>
            {deck?.name}
          </h1>
          {deck?.description && <p className="opacity-60 text-sm mt-1">{deck.description}</p>}
          <p className="text-xs opacity-40 mt-1 font-semibold">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowImportModal(true)} className="btn-secondary text-sm py-2 px-4">
            <Upload size={14} /> Import CSV
          </button>
          <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4">
            <Download size={14} /> Export
          </button>
          <Link to={`/deck/${id}/study`} className="btn-secondary text-sm py-2 px-4">
            <Play size={14} /> Study
          </Link>
          <button
            onClick={() => setQuickAddOpen(o => !o)}
            className="btn-secondary text-sm py-2 px-4"
            style={quickAddOpen ? { borderColor: '#ff9f7a', color: '#ff9f7a' } : {}}
          >
            <Zap size={14} /> Quick Add
          </button>
          <button onClick={() => { setFront(''); setBack(''); setTags(''); setShowAddModal(true) }} className="btn-primary text-sm py-2 px-4">
            <Plus size={14} /> Add card
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 py-2 text-sm"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                className={`tag-pill cursor-pointer transition-opacity ${tagFilter === tag ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                {tag}
                {tagFilter === tag && <X size={10} className="ml-1" />}
              </button>
            ))}
          </div>
        )}

        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 transition-colors ${view === 'grid' ? 'bg-peach text-white' : 'hover:bg-black/5'}`}
            style={view === 'grid' ? { background: '#ffb899' } : {}}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 transition-colors ${view === 'list' ? 'bg-peach text-white' : 'hover:bg-black/5'}`}
            style={view === 'list' ? { background: '#ffb899' } : {}}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Quick Add Panel */}
      {quickAddOpen && (
        <QuickAddPanel
          onSave={async ({ front, back, tags }) => {
            const { error } = await createCard({ front, back, tags })
            if (error) {
              toast.error('Hmm, something went wrong.')
            } else {
              const total = cards.length + 1
              if (total === 50 || total === 100) {
                fireConfetti('cardMilestone')
                toast.success(`${total} cards! Look at you go! 🎉`, { duration: 3000 })
              }
            }
          }}
          onClose={() => setQuickAddOpen(false)}
        />
      )}

      {/* Cards */}
      {cardsLoading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <div className="card-base py-16 text-center" style={{ background: 'var(--color-surface)' }}>
          <div className="text-4xl mb-3">{cards.length === 0 ? '✨' : '🔍'}</div>
          <h3 className="font-bold mb-2">
            {cards.length === 0 ? 'No cards yet — let\'s fix that! ✨' : 'No cards match your search'}
          </h3>
          {cards.length === 0 && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary mt-2 text-sm">
              <Plus size={14} /> Add your first card
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card, i) => (
            <CardItem key={card.id} card={card} index={i} deckId={id}
              onEdit={() => { setShowEditModal(card); setFront(card.front); setBack(card.back); setTags((card.tags || []).join(', ')) }}
              onDelete={() => { if (confirm('Delete this card?')) deleteCard(card.id).then(() => toast.success('Card deleted.')) }}
              onBookmark={() => toggleBookmark(card.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((card, i) => (
            <CardListItem key={card.id} card={card} deckId={id}
              onEdit={() => { setShowEditModal(card); setFront(card.front); setBack(card.back); setTags((card.tags || []).join(', ')) }}
              onDelete={() => { if (confirm('Delete this card?')) deleteCard(card.id).then(() => toast.success('Card deleted.')) }}
              onBookmark={() => toggleBookmark(card.id)}
            />
          ))}
        </div>
      )}

      {/* Add card modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add a new card ✨" size="lg">
        <form onSubmit={handleAdd} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Front (Question)</label>
            <TipTapEditor content={front} onChange={setFront} placeholder="What's the question?" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Back (Answer)</label>
            <TipTapEditor content={back} onChange={setBack} placeholder="What's the answer?" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              <Tag size={13} className="inline mr-1" />
              Tags <span className="opacity-40 font-normal">(comma separated)</span>
            </label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="biology, chapter1" className="input-base text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving...' : 'Add card'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit card modal */}
      <Modal open={!!showEditModal} onClose={() => setShowEditModal(null)} title="Edit card" size="lg">
        <form onSubmit={handleEdit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Front</label>
            <TipTapEditor content={front} onChange={setFront} placeholder="Question..." />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Back</label>
            <TipTapEditor content={back} onChange={setBack} placeholder="Answer..." />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Tags</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2" className="input-base text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowEditModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import CSV modal */}
      <Modal open={showImportModal} onClose={() => setShowImportModal(false)} title="Import CSV" size="md">
        <div className="p-5 space-y-4">
          <p className="text-sm opacity-70">
            Upload a CSV file with <strong>front</strong>, <strong>back</strong>, and optional <strong>tags</strong> columns.
            Multiple tags separated by semicolons.
          </p>
          <button onClick={downloadTemplate} className="btn-secondary text-sm w-full justify-center">
            <Download size={14} /> Download template
          </button>
          <div
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-black/3 transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">Click to upload CSV</p>
            <p className="text-xs opacity-50 mt-1">or drag and drop</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
        </div>
      </Modal>
    </div>
  )
}

function CardItem({ card, index, deckId, onEdit, onDelete, onBookmark }) {
  return (
    <div className="card-base card-hover p-4 pop-in group relative" style={{ background: 'var(--color-surface)' }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs opacity-30 font-bold">#{index + 1}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onBookmark}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${card.bookmarked ? 'text-amber-500' : 'hover:bg-black/5 opacity-40'}`}
          >
            {card.bookmarked ? '🔖' : <Bookmark size={12} />}
          </button>
          <button onClick={onEdit} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 opacity-40 text-xs">✏️</button>
          <button onClick={onDelete} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 text-red-400 opacity-40 text-xs">🗑️</button>
        </div>
      </div>
      <div className="text-sm font-semibold mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: card.front }} />
      <div className="text-xs opacity-50 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: card.back }} />
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map(t => <span key={t} className="tag-pill text-xs">{t}</span>)}
        </div>
      )}
    </div>
  )
}

function CardListItem({ card, deckId, onEdit, onDelete, onBookmark }) {
  return (
    <div
      className="card-base flex items-center gap-4 px-4 py-3 group"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" dangerouslySetInnerHTML={{ __html: card.front }} />
        <div className="text-xs opacity-50 truncate" dangerouslySetInnerHTML={{ __html: card.back }} />
      </div>
      {card.tags?.length > 0 && (
        <div className="hidden sm:flex gap-1">
          {card.tags.slice(0, 2).map(t => <span key={t} className="tag-pill text-xs">{t}</span>)}
        </div>
      )}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onBookmark} className={`w-6 h-6 rounded-full flex items-center justify-center ${card.bookmarked ? 'text-amber-500' : 'hover:bg-black/5 opacity-40'}`}>
          {card.bookmarked ? '🔖' : <Bookmark size={12} />}
        </button>
        <button onClick={onEdit} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 opacity-40 text-xs">✏️</button>
        <button onClick={onDelete} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 text-red-400 opacity-40 text-xs">🗑️</button>
      </div>
    </div>
  )
}
