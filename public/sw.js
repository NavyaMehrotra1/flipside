const CACHE = 'flipside-shell-v2'
const NETWORK_MS = 2500

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(['/', '/manifest.webmanifest', '/icon.svg']).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(cachedShell(request))
    }
    return
  }
  if (url.pathname.startsWith('/api/')) return
  event.respondWith(cachedShell(request))
})

function fromNetwork(request) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), NETWORK_MS)
  return fetch(request, { signal: controller.signal })
    .then((response) => {
      if (response && response.ok && response.type !== 'opaque') {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
      }
      return response
    })
    .finally(() => clearTimeout(timer))
}

async function cachedShell(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
    || (request.mode === 'navigate' ? ((await cache.match('/')) || (await cache.match('/index.html'))) : null)
  const localDev = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1'

  if (cached && !localDev) {
    fromNetwork(request).catch(() => {})
    return cached
  }

  try {
    return await fromNetwork(request)
  } catch {
    if (cached) return cached
    if (request.mode === 'navigate') {
      return (await cache.match('/')) || (await cache.match('/index.html')) || new Response('Offline', { status: 503 })
    }
    return new Response('', { status: 503 })
  }
}

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'FlipSide', {
      body: data.body ?? 'Time to study!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'flipside-reminder',
      data: { url: data.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin))
      if (existing) return existing.focus()
      return clients.openWindow(event.notification.data?.url ?? '/')
    })
  )
})
