/* 台州全科通 Service Worker：离线可查，不缓存任何患者数据。 */
const CACHE_VERSION = 'tkt-v3'
const CORE_CACHE = `${CACHE_VERSION}-core`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const BASE = new URL('./', self.registration.scope).href
const INDEX_URL = new URL('index.html', BASE).href
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(precacheCore().then(() => self.skipWaiting()))
})

async function precacheCore() {
  const cache = await caches.open(CORE_CACHE)
  await Promise.allSettled(
    CORE_ASSETS.map((path) => cache.add(new Request(new URL(path, BASE), { cache: 'reload' }))),
  )

  // 构建后的 JS/CSS 带哈希，安装时从 index.html 自动发现并预缓存，
  // 保证首次联网打开后即使没有再次刷新，也能离线启动应用壳。
  try {
    const indexResponse = await fetch(INDEX_URL, { cache: 'reload' })
    if (!indexResponse.ok) {
      console.warn('[tkt] Failed to fetch index.html for precache:', indexResponse.status)
      return
    }
    const html = await indexResponse.clone().text()
    await cache.put(INDEX_URL, indexResponse)

    const assetUrls = [...html.matchAll(/(?:src|href)="([^"]+?\.(?:js|css)(?:\?[^"]*)?)"/g)]
      .map((match) => new URL(match[1], INDEX_URL))
      .filter((url) => url.origin === self.location.origin)
      .map((url) => url.href)

    const results = await Promise.allSettled(
      assetUrls.map((url) => cache.add(new Request(url, { cache: 'reload' }))),
    )
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn('[tkt] Failed to precache asset:', assetUrls[index], result.reason)
      }
    })
  } catch (error) {
    console.warn('[tkt] Build asset discovery failed:', error)
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('tkt-') && key !== CORE_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request))
    return
  }

  event.respondWith(staleWhileRevalidate(request))
})

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cachedPage = await caches.match(request)
    return cachedPage || (await caches.match(INDEX_URL)) || (await caches.match(BASE)) || Response.error()
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(RUNTIME_CACHE)
        await cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => undefined)

  return cached || (await network) || Response.error()
}
