import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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

        <h1 className="text-3xl font-extrabold mb-2 mt-6">Terms of Service</h1>
        <p className="opacity-50 text-sm mb-10">Last updated: June 19, 2026</p>

        <div className="space-y-8 text-sm leading-7" style={{ color: 'var(--color-text)' }}>

          <section>
            <h2 className="font-bold text-lg mb-2">1. Acceptance</h2>
            <p className="opacity-70">By creating an account or using Flipside you agree to these Terms. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">2. The service</h2>
            <p className="opacity-70">Flipside is a flashcard and spaced-repetition study tool. We provide it free of charge. We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice where possible.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">3. Your account</h2>
            <ul className="opacity-70 space-y-1 list-disc list-inside">
              <li>You must be at least 13 years old to use Flipside.</li>
              <li>You are responsible for keeping your password secure.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>One account per person; do not share accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">4. Your content</h2>
            <p className="opacity-70">You retain ownership of the flashcard content you create. By using Flipside you grant us a limited license to store and process that content solely to provide the service. You are responsible for ensuring you have the right to use any content you paste or upload (e.g., excerpts from textbooks).</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">5. AI-generated cards</h2>
            <p className="opacity-70">The AI card generator uses Anthropic's Claude API to suggest flashcards based on text you provide. AI output may be inaccurate or incomplete — always verify generated cards before studying. We are not liable for errors in AI-generated content.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">6. Acceptable use</h2>
            <p className="opacity-70 mb-2">You agree not to:</p>
            <ul className="opacity-70 space-y-1 list-disc list-inside">
              <li>Use the service for any unlawful purpose.</li>
              <li>Upload content that is abusive, harassing, or infringes third-party rights.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the service or its APIs.</li>
              <li>Use the AI generator to produce harmful, deceptive, or illegal content.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">7. Termination</h2>
            <p className="opacity-70">You may delete your account at any time from Settings. We may suspend or terminate accounts that violate these Terms. Upon termination all your data is permanently deleted.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">8. Disclaimer of warranties</h2>
            <p className="opacity-70">Flipside is provided <strong>"as is"</strong> without warranties of any kind, express or implied. We do not warrant that the service will be error-free, uninterrupted, or that your data will never be lost. Always keep a backup of important study materials.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">9. Limitation of liability</h2>
            <p className="opacity-70">To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of Flipside.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">10. Changes to these terms</h2>
            <p className="opacity-70">We may update these Terms. Continued use of Flipside after changes are posted constitutes acceptance. We will notify you of material changes by email.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">11. Contact</h2>
            <p className="opacity-70">Questions about these Terms? Email <a href="mailto:nmehrot2@jh.edu" className="underline">nmehrot2@jh.edu</a>.</p>
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
