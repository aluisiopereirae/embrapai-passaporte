/* EmbrapAI Rural — service worker
   Deixa o aplicativo 100% funcional OFFLINE depois da primeira abertura:
   essencial no campo, onde o sinal é fraco. Os dados do produtor já ficam
   no aparelho (localStorage); aqui guardamos também a "casca" do app. */

const CACHE = 'embrapai-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icones/icone-192.png',
  './icones/icone-512.png',
  './icones/icone-maskable-512.png',
  './icones/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

/* Estratégia: cache primeiro (o app abre mesmo sem internet);
   se for uma chamada de API (/api/), tenta a rede primeiro. */
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() => new Response(
      JSON.stringify({ offline: true, erro: 'Sem conexão. Seus dados locais continuam disponíveis.' }),
      { headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) =>
      hit || fetch(e.request).then((resp) => {
        if (resp.ok && e.request.method === 'GET' && url.origin === location.origin) {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copia));
        }
        return resp;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
