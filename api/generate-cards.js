import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content } = req.body ?? {}
  if (!content?.trim()) return res.status(400).json({ error: 'No content provided' })
  if (content.length > 50000) return res.status(400).json({ error: 'Content too long (max 50k chars)' })

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are a flashcard generator. Extract the most important concepts from the content below and turn them into clear flashcard pairs.

Rules:
- Front: a specific question or prompt (not too broad)
- Back: a concise, direct answer (1-3 sentences max)
- Tags: 1-3 short topic keywords per card
- Generate 10-25 cards depending on content length
- Skip obvious or trivial facts
- Prefer testable, specific knowledge over vague concepts

Return ONLY a valid JSON array — no markdown, no explanation:
[{"front":"...","back":"...","tags":["..."]}]

Content:
${content}`,
      },
    ],
  })

  const text = msg.content[0].text.trim()
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return res.status(500).json({ error: 'Could not parse cards from AI response' })

  try {
    const cards = JSON.parse(match[0])
    res.json({ cards })
  } catch {
    res.status(500).json({ error: 'Invalid JSON from AI' })
  }
}
