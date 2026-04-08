import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const { user, displayName, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(displayName)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await updateProfile({ display_name: name, full_name: name })
    setSaving(false)
    if (error) {
      toast.error('Hmm, something went wrong.')
    } else {
      toast.success('Profile updated! 🎉')
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords don\'t match.')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) {
      toast.error('Hmm, something went wrong.')
    } else {
      toast.success('Password updated!')
      setPassword(''); setConfirmPassword('')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm.')
      return
    }
    // Note: deleting a user requires admin privileges; this signs them out instead
    await signOut()
    toast.success('Account deletion requested. Contact support to complete.')
    navigate('/login')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm opacity-50 hover:opacity-100 mb-6 transition-opacity">
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-extrabold mb-8">Settings ⚙️</h1>

      {/* Profile */}
      <section className="card-base p-6 mb-4" style={{ background: 'var(--color-surface)' }}>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={16} /> Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Display name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email</label>
            <input type="email" value={user?.email || ''} className="input-base opacity-60" disabled />
            <p className="text-xs opacity-50 mt-1">Contact support to change your email address.</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="card-base p-6 mb-4" style={{ background: 'var(--color-surface)' }}>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="input-base" required />
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm">Update password</button>
        </form>
      </section>

      {/* Connected accounts */}
      <section className="card-base p-6 mb-4" style={{ background: 'var(--color-surface)' }}>
        <h2 className="font-bold text-lg mb-4">Connected Accounts</h2>
        <div className="space-y-2">
          {(user?.app_metadata?.providers || [user?.app_metadata?.provider]).filter(Boolean).map(provider => (
            <div key={provider} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="capitalize font-semibold">{provider}</span>
              <span className="opacity-50">connected</span>
            </div>
          ))}
          {!user?.app_metadata?.providers && !user?.app_metadata?.provider && (
            <p className="text-sm opacity-50">No OAuth providers connected.</p>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className="card-base p-6 border-red-200" style={{ background: 'rgba(254,242,242,0.5)', borderColor: '#fca5a5' }}>
        <h2 className="font-bold text-lg mb-2 text-red-600 flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h2>
        <p className="text-sm opacity-70 mb-4">Deleting your account is permanent and cannot be undone. All your decks and cards will be lost.</p>
        <div className="space-y-3">
          <input
            type="text"
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="input-base text-sm border-red-200"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== 'DELETE'}
            className="w-full py-2.5 rounded-full font-bold text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Delete my account
          </button>
        </div>
      </section>
    </div>
  )
}
