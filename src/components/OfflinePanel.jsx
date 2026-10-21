import { useEffect, useState } from 'react'
import { Download, Smartphone, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { downloadLibrary } from '../lib/offlineSync'
import { clearLibrary, isOffline, loadLibrary, offlineEnabled, onConnectivity, setOfflineEnabled } from '../lib/offlineStore'
import { canInstall, deviceKind, isStandalone, onInstallable, promptInstall } from '../lib/installPrompt'

export default function OfflinePanel() {
  const { user } = useAuth()
  const [savedAt, setSavedAt] = useState(null)
  const [enabled, setEnabled] = useState(offlineEnabled)
  const [saving, setSaving] = useState(false)
  const [installable, setInstallable] = useState(canInstall)
  const [online, setOnline] = useState(() => !isOffline())
  const standalone = isStandalone()
  const device = deviceKind()

  useEffect(() => {
    if (!user) return
    loadLibrary(user.id).then((lib) => setSavedAt(lib?.savedAt || null))
  }, [user])

  useEffect(() => onInstallable(() => setInstallable(canInstall())), [])

  useEffect(() => onConnectivity((offline) => setOnline(!offline)), [])

  const handleSave = async () => {
    if (isOffline() || !navigator.onLine) {
      toast.error('Connect once on wifi so your decks can download before the flight.')
      return
    }
    setSaving(true)
    try {
      const lib = await downloadLibrary(user.id)
      setOfflineEnabled(true)
      setEnabled(true)
      setSavedAt(lib.savedAt)
      toast.success('Saved for your flight. This device can study with no connection.')
    } catch (err) {
      toast.error(err.message || 'Could not save for offline.')
    }
    setSaving(false)
  }

  const handleClear = async () => {
    await clearLibrary(user.id)
    setOfflineEnabled(false)
    setEnabled(false)
    setSavedAt(null)
    toast.success('Offline copy removed from this device.')
  }

  const handleInstall = async () => {
    const accepted = await promptInstall()
    if (accepted) toast.success('Flipside is on your Home Screen.')
  }

  const savedLabel = savedAt
    ? new Date(savedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : null

  return (
    <section id="offline" className="card-base p-6 mb-4" style={{ background: 'var(--color-surface)' }}>
      <h2 className="font-bold text-lg mb-2">Offline mode</h2>
      <p className="text-sm opacity-70 mb-4">
        This is the copy you study on a flight. Open Flipside once on wifi before you leave and your decks stay on this device. Airplane mode and plane wifi that never really connects both use that copy. Ratings sync after you land.
      </p>

      {!online && (
        <p className="text-sm font-semibold mb-3" style={{ color: '#ea580c' }}>
          No working connection{enabled ? '. Studying uses the copy saved on this device.' : '. Open the app once on wifi before a flight so your decks are already here.'}
        </p>
      )}

      {enabled && savedLabel && (
        <p className="text-sm font-semibold mb-3">Saved on this device · {savedLabel}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleSave} disabled={saving || !online} className="btn-primary text-sm disabled:opacity-40">
          <Download size={14} />
          {saving ? 'Saving...' : enabled ? 'Update offline copy' : 'Save for offline'}
        </button>
        {enabled && (
          <button type="button" onClick={handleClear} className="btn-secondary text-sm">
            <Trash2 size={14} /> Remove copy
          </button>
        )}
      </div>

      <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Smartphone size={16} /> On your phone and iPad
        </h3>
        {standalone ? (
          <p className="text-sm opacity-70">
            Flipside is installed on this device. Save for offline above, then open it from your Home Screen with no connection.
          </p>
        ) : (
          <>
            <p className="text-sm opacity-70 mb-3">
              Add Flipside to your Home Screen so it opens like an app. Do that on each device, then tap Save for offline while you still have a connection.
            </p>
            {installable && (
              <button type="button" onClick={handleInstall} className="btn-secondary text-sm mb-3">
                Install app
              </button>
            )}
            <ol className="text-sm space-y-2 list-decimal pl-5 opacity-80">
              <li><strong>iPhone:</strong> open this site in Safari, tap Share, then Add to Home Screen.</li>
              <li><strong>iPad:</strong> open this site in Safari, tap Share in the toolbar, then Add to Home Screen.</li>
              {device === 'other' && !installable && (
                <li><strong>Android:</strong> open the browser menu and choose Install app or Add to Home Screen.</li>
              )}
            </ol>
          </>
        )}
      </div>
    </section>
  )
}
