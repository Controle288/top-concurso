const CACHE = 'topconcurso-v4'
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg']
const API_CACHE = 'topconcurso-api-v1'

const BRAZILIAN_HOLIDAYS = [
  '01-01', // Confraternização Universal
  '04-21', // Tiradentes
  '05-01', // Dia do Trabalho
  '09-07', // Independência
  '10-12', // Nossa Senhora Aparecida
  '11-02', // Finados
  '11-15', // Proclamação da República
  '12-25', // Natal
]

function isHoliday(dateStr: string): boolean {
  const mmdd = dateStr.slice(5)
  return BRAZILIAN_HOLIDAYS.includes(mmdd)
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDay() === 0 || d.getDay() === 6
}

function isBusinessDay(dateStr: string): boolean {
  return !isWeekend(dateStr) && !isHoliday(dateStr)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE && k !== API_CACHE).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Cache static assets (build files)
  if (url.origin === location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Cache Supabase API responses (stale-while-revalidate)
  if (url.hostname.includes('supabase')) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request)
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone())
          }
          return response
        }).catch(() => cachedResponse)
        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // Document pages - serve cached index.html when offline
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE).then((cache) => cache.put('/index.html', clone))
          return response
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // Everything else: cache-first for static, network-first for dynamic
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    const title = data.title || 'Top Concurso'
    const options = {
      body: data.body || '',
      icon: data.icon || '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
    }
    event.waitUntil(self.registration.showNotification(title, options))
  } catch {
    const title = 'Top Concurso'
    const options = {
      body: event.data.text(),
      icon: '/icon.svg',
      badge: '/icon.svg',
    }
    event.waitUntil(self.registration.showNotification(title, options))
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(urlToOpen)
    })
  )
})
