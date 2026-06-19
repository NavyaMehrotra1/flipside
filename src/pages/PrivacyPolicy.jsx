import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/signup" className="inline-flex items-center gap-1 text-sm opacity-50 hover:opacity-100 mb-8 transition-opacity">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #ff9f7a, #c4b5fd)' }}>
            🃏
          </div>
          <span className="font-extrabold text-xl">Flipside</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 mt-6">Privacy Policy</h1>
        <p className="opacity-50 text-sm mb-10">Last updated: June 19, 2026</p>

        <div className="space-y-8 text-sm leading-7" style={{ color: 'var(--color-text)' }}>

          <section>
            <h2 className="font-bold text-lg mb-2">1. What we collect</h2>
            <p className="opacity-70">When you create an account we collect your <strong>email address</strong> and any <strong>display name</strong> you provide. When you use Flipside we store the <strong>flashcard decks and cards</strong> you create, your <strong>study session history</strong> (cards reviewed, accuracy, timestamps), and your <strong>streak data</strong> (study dates). If you opt into push notifications we store a <strong>push subscription token</strong> associated with your account.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">2. How we use your data</h2>
            <ul className="opacity-70 space-y-1 list-disc list-inside">
              <li>To provide the Flipside service: show your decks, schedule spaced-repetition reviews, track streaks.</li>
              <li>To send daily study reminder notifications (only if you opt in).</li>
              <li>To generate flashcards via AI (the text you submit is sent to Anthropic's API; see Section 4).</li>
              <li>We do not sell your data, run ads, or share it with third parties for marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">3. Data storage</h2>
            <p className="opacity-70">Your data is stored in <strong>Supabase</strong> (a managed Postgres database hosted on AWS). All data is protected by row-level security — only your account can read or write your data. Connections are encrypted in transit (TLS) and at rest.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">4. AI card generation</h2>
            <p className="opacity-70">When you use the AI card generator, the text you paste is sent to <strong>Anthropic's Claude API</strong> to produce flashcard suggestions. Anthropic processes this text to return a response. We do not store the raw text you paste beyond the duration of the API call. Please review <a href="https://www.anthropic.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Anthropic's Privacy Policy</a> for how they handle API inputs.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">5. Cookies and local storage</h2>
            <p className="opacity-70">Flipside uses <strong>localStorage</strong> and a first-party <strong>cookie</strong> to persist your login session for up to 30 days. No third-party tracking cookies are used.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">6. Your rights</h2>
            <ul className="opacity-70 space-y-1 list-disc list-inside">
              <li><strong>Access:</strong> You can view all your data inside the app at any time.</li>
              <li><strong>Deletion:</strong> You can permanently delete your account and all associated data from Settings → Danger Zone. Deletion is immediate and irreversible.</li>
              <li><strong>Export:</strong> Card export is available via the export button inside each deck.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">7. Children</h2>
            <p className="opacity-70">Flipside is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">8. Changes to this policy</h2>
            <p className="opacity-70">We may update this policy as the service evolves. Material changes will be notified via email. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">9. Contact</h2>
            <p className="opacity-70">Questions? Email us at <a href="mailto:nmehrot2@jh.edu" className="underline">nmehrot2@jh.edu</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-xs opacity-40 flex gap-4" style={{ borderColor: 'var(--color-border)' }}>
          <Link to="/terms" className="hover:opacity-70">Terms of Service</Link>
          <Link to="/privacy" className="hover:opacity-70">Privacy Policy</Link>
          <Link to="/login" className="hover:opacity-70">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
