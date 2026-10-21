const DB_NAME = 'flipside-offline'
const DB_VERSION = 1
const FLAG = 'flipside-offline'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('library')) db.createObjectStore('library')
      if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function requestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function offlineEnabled() {
  try { return localStorage.getItem(FLAG) === '1' } catch { return false }
}

export function setOfflineEnabled(on) {
  try { localStorage.setItem(FLAG, on ? '1' : '0') } catch { /* preference stays in memory for this call only */ }
}

let unreachableUntil = 0
const connectivityListeners = new Set()

function emitConnectivity() {
  const offline = isOffline()
  connectivityListeners.forEach((fn) => fn(offline))
}

export function markUnreachable() {
  const already = Date.now() < unreachableUntil
  unreachableUntil = Date.now() + 60_000
  if (!already) emitConnectivity()
}

export function markReachable() {
  if (unreachableUntil === 0) return
  unreachableUntil = 0
  emitConnectivity()
}

export function isOffline() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true
  return Date.now() < unreachableUntil
}

export function onConnectivity(fn) {
  connectivityListeners.add(fn)
  return () => connectivityListeners.delete(fn)
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    unreachableUntil = 0
    emitConnectivity()
  })
  window.addEventListener('offline', emitConnectivity)
}

export async function loadLibrary(userId) {
  if (!userId) return null
  try {
    const db = await openDb()
    const record = await requestToPromise(db.transaction('library', 'readonly').objectStore('library').get(userId))
    return record || null
  } catch {
    return null
  }
}

export async function saveLibrary(userId, library) {
  const db = await openDb()
  const tx = db.transaction('library', 'readwrite')
  tx.objectStore('library').put(library, userId)
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function clearLibrary(userId) {
  try {
    const db = await openDb()
    const tx = db.transaction('library', 'readwrite')
    tx.objectStore('library').delete(userId)
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch { /* a missing copy just means offline study is not ready */ }
}

async function patchLibrary(userId, recipe) {
  const current = await loadLibrary(userId)
  if (!current) return null
  const next = recipe(current)
  next.savedAt = new Date().toISOString()
  await saveLibrary(userId, next)
  return next
}

export async function rememberDecks(userId, decks) {
  const current = (await loadLibrary(userId)) || { cards: [], reviews: [], streak: null }
  await saveLibrary(userId, { ...current, decks, savedAt: new Date().toISOString() })
  setOfflineEnabled(true)
}

export function replaceDecks(userId, decks) {
  return rememberDecks(userId, decks)
}

export async function rememberDeckCards(userId, deckId, cards) {
  const current = (await loadLibrary(userId)) || { decks: [], reviews: [], streak: null }
  const others = (current.cards || []).filter((card) => card.deck_id !== deckId)
  await saveLibrary(userId, {
    ...current,
    cards: [...others, ...cards],
    savedAt: new Date().toISOString(),
  })
  setOfflineEnabled(true)
}

export function replaceDeckCards(userId, deckId, cards) {
  return rememberDeckCards(userId, deckId, cards)
}

export function upsertCachedReview(userId, row) {
  return patchLibrary(userId, (current) => {
    const reviews = [...(current.reviews || [])]
    const index = reviews.findIndex((review) => review.card_id === row.card_id)
    if (index >= 0) reviews[index] = { ...reviews[index], ...row }
    else reviews.push(row)
    return { ...current, reviews }
  })
}

export function patchStreak(userId, streak) {
  return patchLibrary(userId, (current) => ({ ...current, streak }))
}

export async function enqueue(item) {
  const db = await openDb()
  const tx = db.transaction('outbox', 'readwrite')
  tx.objectStore('outbox').put({
    id: item.id || crypto.randomUUID(),
    userId: item.userId,
    kind: item.kind,
    row: item.row || null,
    createdAt: new Date().toISOString(),
  })
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function listOutbox(userId) {
  try {
    const db = await openDb()
    const all = await requestToPromise(db.transaction('outbox', 'readonly').objectStore('outbox').getAll())
    return (all || [])
      .filter((item) => item.userId === userId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  } catch {
    return []
  }
}

export async function removeOutboxItem(id) {
  const db = await openDb()
  const tx = db.transaction('outbox', 'readwrite')
  tx.objectStore('outbox').delete(id)
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
