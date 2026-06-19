import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' })

  const token = authHeader.split(' ')[1]

  // Verify the token belongs to a real user
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) return res.status(401).json({ error: 'Invalid token' })

  const { error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) return res.status(500).json({ error: error.message })

  res.json({ ok: true })
}
