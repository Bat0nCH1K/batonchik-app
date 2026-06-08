const CACHE = 'batonchik-v8';
const ASSETS = [
  '/batonchik-app/',
  '/batonchik-app/index.html',
  '/batonchik-app/main.html',
  '/batonchik-app/titles.html',
  '/batonchik-app/sfx.js',
  '/batonchik-app/highscores.js',
  '/batonchik-app/modals.js',
  '/batonchik-app/manifest.json',
  '/batonchik-app/clicker.html',
  '/batonchik-app/quiz.html',
  '/batonchik-app/game2048.html',
  '/batonchik-app/snake.html',
  '/batonchik-app/flappy.html',
  '/batonchik-app/invaders.html',
  '/batonchik-app/minesweeper.html',
  '/batonchik-app/pacman.html',
  '/batonchik-app/brickbreaker.html',
  '/batonchik-app/tictactoe.html',
  '/batonchik-app/match3.html',
  '/batonchik-app/race.html',
  '/batonchik-app/tetris.html',
  '/batonchik-app/memory.html',
  '/batonchik-app/puzzle.html',
  '/batonchik-app/blockblast.html',
  '/batonchik-app/fruitmerge.html',
  '/batonchik-app/paperio.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE).then(cache => {
        cache.put(e.request, res.clone());
        return res;
      });
    }))
  );
});
