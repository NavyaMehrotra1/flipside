import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '../hooks/useDecks'
import EmojiPicker from '../components/EmojiPicker'
import toast from 'react-hot-toast'
import { fireConfetti } from '../components/ConfettiTrigger'
import { ArrowLeft } from 'lucide-react'

const PASTEL_OPTIONS = [
  { color: '#FFE8DC', label: 'Peach' },
  { color: '#EDE9FE', label: 'Lavender' },
  { color: '#DCFCE7', label: 'Mint' },
  { color: '#FEFCE8', label: 'Butter' },
  { color: '#FFE4E6', label: 'Rose' },
  { color: '#DBEAFE', label: 'Sky' },
  { color: '#FEF3C7', label: 'Amber' },
  { color: '#F0FDF4', label: 'Sage' },
]

export default function NewDeck() {
  const navigate = useNavigate()
  const { createDeck, decks } = useDecks()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('📚')
  const [color, setColor] = useState(PASTEL_OPTIONS[0].color)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await createDeck({ name, description, emoji, color })
    setLoading(false)
    if (error) {
      toast.error('Hmm, something went wrong. Let\'s try that again.')
    } else {
      if (decks.length === 0) {
        fireConfetti('firstDeck')
        toast.success('First deck created! You\'re on fire! 🔥', { duration: 4000 })
      } else {
        toast.success('Deck created! Let\'s add some cards. ✨')
      }
      navigate(`/deck/${data.id}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 mb-6 transition-opacity"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-extrabold mb-2">Create a new deck 📚</h1>
      <p className="opacity-60 text-sm mb-8">Give it a name and personality.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Emoji + Name */}
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold mb-2">Icon</label>
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1.5">Deck name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Biology 101"
              className="input-base"
              maxLength={60}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Description <span className="opacity-40 font-normal">(optional)</span></label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What's this deck about?"
            className="input-base"
            maxLength={200}
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold mb-3">Card color</label>
          <div className="flex flex-wrap gap-2">
            {PASTEL_OPTIONS.map(opt => (
              <button
                key={opt.color}
                type="button"
                onClick={() => setColor(opt.color)}
                title={opt.label}
                className="w-10 h-10 rounded-xl transition-transform hover:scale-105"
                style={{
                  background: opt.color,
                  border: color === opt.color ? '2.5px solid #ff9f7a' : '2px solid transparent',
                  boxShadow: color === opt.color ? '0 0 0 2px rgba(255,159,122,0.3)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="card-base p-5"
          style={{ background: color }}
        >
          <div className="text-3xl mb-2">{emoji}</div>
          <div className="font-bold text-lg">{name || 'Deck name'}</div>
          {description && <div className="text-sm opacity-60 mt-1">{description}</div>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Creating...' : 'Create deck ✨'}
        </button>
      </form>
    </div>
  )
}
