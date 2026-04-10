# 🃏 Flipside

> **Every card has two sides.**

A modern, polished flashcard app — a better Anki. Built with React + Vite and Supabase.

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd flip_side
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**, paste the contents of [`docs/schema.sql`](docs/schema.sql), and click **Run**
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public** key

Full step-by-step guide: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

### 3. Add your environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the app

```bash
npm run dev
```

Visit **http://localhost:5173** and sign up.

---

## Features

### Cards
- **Rich text editor** — bold, italic, inline code, code blocks, bullet lists
- **Images** — drag & drop, paste (`Cmd+V`), or click the 🖼️ button. Works directly from your screenshot clipboard, no setup needed
- **Tags** — coloured pill tags with filter support
- **Bookmarks** — flag cards with 🔖
- **CSV import** — bulk add cards from a spreadsheet (`front`, `back`, `tags` columns)
- **Notion export** — downloads a `.md` file with toggle syntax Notion can import

### Study modes
- **Sequential** — cards in order
- **Shuffle** — randomised
- **Spaced repetition** — SM-2 algorithm, shows only cards due today

### Quick Add
Fast card entry panel — optimised for speed typing:
- `Tab` — jumps between Question and Answer fields
- `Enter` — saves the card and snaps focus back to Question instantly
- `Shift+Enter` — newline (doesn't save)
- `Cmd+Enter` — save from anywhere
- Tags are **sticky** — set once, apply to the whole batch
- Paste or drag-drop images into either field

### Streaks & gamification
- Daily study streak tracked with 🔥 in the navbar
- Milestone messages at 3, 7, 14, 30, 60, 100 days
- Confetti on session complete, streak milestones, first deck, and card count milestones (50, 100)
- Floating emoji reactions on each grade (😅 🤏 👍 🌟)

### Keyboard shortcuts (press `?` while studying)

| Key | Action |
|-----|--------|
| `Space` | Flip card |
| `← →` | Previous / Next |
| `1` `2` `3` `4` | Nope / Almost / Got it / Easy |
| `N` | New card |
| `E` | Edit card |
| `B` | Bookmark toggle |
| `?` | Show shortcuts |

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Backend / Auth / DB | Supabase |
| Rich text | TipTap |
| Routing | React Router v6 |
| Icons | Lucide React |
| Confetti | canvas-confetti |
| Toasts | react-hot-toast |

---

## Project structure

```
src/
├── components/
│   ├── CardFlip.jsx          # 3D spring-eased flip card
│   ├── DeckGrid.jsx          # Pastel deck cards with emoji
│   ├── Navbar.jsx            # Streak flame + dark mode toggle
│   ├── QuickAddPanel.jsx     # Speed card entry panel
│   ├── TipTapEditor.jsx      # Rich text + image editor
│   ├── FloatingEmoji.jsx     # Grade reaction animation
│   ├── ConfettiTrigger.jsx   # canvas-confetti wrapper
│   ├── EmojiPicker.jsx       # Emoji grid for deck icons
│   ├── Modal.jsx
│   ├── SkeletonLoader.jsx
│   └── KeyboardShortcutsModal.jsx
├── pages/
│   ├── Login.jsx / Signup.jsx
│   ├── Dashboard.jsx         # Decks grid + streak banner
│   ├── DeckView.jsx          # Card browser, search, filters
│   ├── StudySession.jsx      # Flip + grade + end screen
│   ├── NewDeck.jsx           # Emoji + color picker
│   └── Settings.jsx
├── hooks/
│   ├── useDecks.js
│   ├── useCards.js
│   ├── useStudySession.js    # SM-2 grading state
│   └── useStreak.js
├── lib/
│   ├── supabase.js
│   ├── sm2.js                # SM-2 spaced repetition algorithm
│   ├── exportNotion.js       # Markdown export
│   ├── csvImport.js          # CSV parser
│   ├── streaks.js            # Streak logic + milestones
│   └── uploadImage.js        # Image → WebP base64 converter
├── context/
│   └── AuthContext.jsx       # Supabase auth (email + OAuth)
└── styles/
    └── globals.css           # CSS variables, animations
docs/
├── schema.sql                # Paste this into Supabase SQL Editor
└── SUPABASE_SETUP.md         # Full setup guide
```

---

## Available scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```
