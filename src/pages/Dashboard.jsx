import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Flame, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDecks } from '../hooks/useDecks'
import { useStreak } from '../hooks/useStreak'
import DeckGrid from '../components/DeckGrid'
import { SkeletonGrid } from '../components/SkeletonLoader'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'
import ConfettiTrigger, { fireConfetti } from '../components/ConfettiTrigger'
import { getMilestoneMessage, isMilestone } from '../lib/streaks'

const HEADERS = [
  "What are we learning today?",
  "Ready to flip some cards? 🃏",
  "Knowledge is loading... ☕",
  "Your brain is ready. Let's go! 🚀",
  "Small steps, big gains. ✨",
  "The best time to study is now! 📚",
]

export default function Dashboard() {
  const { firstName } = useAuth()
  const { decks, loading, createDeck, deleteDeck, updateDeck } = useDecks()
  const { streak, streakBroken } = useStreak()
  const [header] = useState(() => HEADERS[Math.floor(Math.random() * HEADERS.length)])
  const [deleteModal, setDeleteModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Check streak milestones
  useEffect(() => {
    if (streak?.current_streak && isMilestone(streak.current_streak)) {
      fireConfetti('milestone')
    }
  }, [streak?.current_streak])

  const handleDelete = async () => {
    if (!deleteModal) return
    const { error } = await deleteDeck(deleteModal.id)
    if (error) {
      toast.error('Hmm, something went wrong. Let\'s try that again.')
    } else {
      toast.success('Deck deleted.')
    }
    setDeleteModal(null)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!editModal) return
    const { error } = await updateDeck(editModal.id, { name: editName, description: editDesc })
    if (error) {
      toast.error('Hmm, something went wrong.')
    } else {
      toast.success('Deck updated! 🎉')
    }
    setEditModal(null)
  }

  const milestoneMsg = streak ? getMilestoneMessage(streak.current_streak) : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold opacity-50 mb-1">{header}</p>
            <h1 className="text-3xl font-extrabold">
              Welcome back, {firstName}! 👋
            </h1>
          </div>

          <Link to="/new-deck" className="btn-primary">
            <Plus size={16} />
            New Deck
          </Link>
        </div>

        {/* Streak banner */}
        {streak && (
          <div className="mt-4 flex flex-wrap gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-2xl"
              style={{ background: 'rgba(255,184,153,0.15)', border: '1px solid rgba(255,184,153,0.3)' }}
            >
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-extrabold text-orange-500 leading-none text-lg">
                  {streak.current_streak} day{streak.current_streak !== 1 ? 's' : ''}
                </div>
                <div className="text-xs opacity-60 font-semibold">
                  {streakBroken
                    ? "Streak reset — but you're back! That's what matters. 💪"
                    : streak.current_streak === 0
                    ? "Study today to start your streak!"
                    : milestoneMsg || `Longest: ${streak.longest_streak} days`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decks section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <BookOpen size={18} /> Your Decks
          <span className="text-sm font-normal opacity-40 ml-1">({decks.length})</span>
        </h2>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : decks.length === 0 ? (
        <div
          className="card-base flex flex-col items-center justify-center py-16 text-center"
          style={{ background: 'var(--color-surface)' }}
        >
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-xl mb-2">No cards yet — let's fix that! ✨</h3>
          <p className="opacity-60 mb-6 text-sm">Create your first deck and start learning something new today.</p>
          <Link to="/new-deck" className="btn-primary">
            <Plus size={16} />
            Create your first deck
          </Link>
        </div>
      ) : (
        <DeckGrid
          decks={decks}
          onDelete={setDeleteModal}
          onEdit={(deck) => {
            setEditModal(deck)
            setEditName(deck.name)
            setEditDesc(deck.description || '')
          }}
        />
      )}

      {/* Delete modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete deck?" size="sm">
        <div className="p-5">
          <p className="opacity-70 text-sm mb-4">
            This will permanently delete <strong>"{deleteModal?.name}"</strong> and all its cards.
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-full font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit deck" size="sm">
        <form onSubmit={handleEdit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Deck name</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <input
              type="text"
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="What's this deck about?"
              className="input-base"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
