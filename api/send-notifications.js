import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // Vercel injects CRON_SECRET automatically for cron jobs
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end()
  }

  const { data: subs } = await supabase.from('push_subscriptions').select('*')
  if (!subs?.length) return res.json({ sent: 0 })

  const now = new Date().toISOString()

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      // Count due cards for this user
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', sub.user_id)
        .lte('due_date', now)

      if (!count || count === 0) return

      const payload = JSON.stringify({
        title: 'FlipSide',
        body: `You have ${count} card${count === 1 ? '' : 's'} due for review 🧠`,
        url: '/',
      })

      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    })
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  res.json({ sent })
}
