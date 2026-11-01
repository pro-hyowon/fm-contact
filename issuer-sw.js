/* 시리얼 발급 (핸드폰판) — 인터넷 없이도 열리게 화면 파일만 저장. 열쇠·기록은 저장하지 않음 (그건 화면의 localStorage에만) */
const C = 'fm-issuer-v1'; const FILES = ['issuer.html', 'issuer.webmanifest', 'issuer-nacl.js', 'issuer-qr.js', 'issuer-font.woff', 'issuer-icon-192.png', 'issuer-icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (u.origin !== location.origin || e.request.method !== 'GET') return;
  const name = u.pathname.split('/').pop() || 'issuer.html'; if (!FILES.includes(name)) return;
  /* 인터넷 되면 새 파일, 안 되면 저장해 둔 것 */
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(name, cp)); } return r; }).catch(() => caches.match(name, { ignoreSearch: true })));
});
