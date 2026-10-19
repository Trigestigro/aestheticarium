// sw.js: "service worker" do aestheticarium. Ele guarda os arquivos do app no aparelho (cache)
// para o app abrir mesmo sem internet. Ao mudar qualquer arquivo do app, troque o número da versão abaixo.
const VERSAO = "aestheticarium-v1";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

// Instalação: guarda todos os arquivos no cache.
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS)));
  self.skipWaiting();                          // usa a versão nova assim que possível
});

// Ativação: apaga caches de versões antigas.
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n)))));
});

// A cada pedido de arquivo: usa o do cache e, se não tiver, busca na internet.
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((guardado) => guardado || fetch(e.request)));
});
