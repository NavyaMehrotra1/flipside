let deferred = null
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => fn())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferred = event
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    notify()
  })
}

export function onInstallable(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function canInstall() {
  return !!deferred
}

export async function promptInstall() {
  if (!deferred) return false
  deferred.prompt()
  const choice = await deferred.userChoice
  deferred = null
  notify()
  return choice?.outcome === 'accepted'
}

export function isStandalone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export function deviceKind() {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent || ''
  if (/iPhone|iPod/.test(ua)) return 'iphone'
  if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ipad'
  return 'other'
}
