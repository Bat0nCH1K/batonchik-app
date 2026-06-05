const CACHE = 'batonchik-v7';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/', '/index.html', '/main.html', '/titles.html',
        '/sfx.js', '/highscores.js', '/modals.js',
        '/clicker.html', '/quiz.html', '/game2048.html', '/snake.html',
        '/flappy.html', '/invaders.html', '/minesweeper.html', '/pacman.html',
        '/brickbreaker.html', '/tictactoe.html', '/match3.html', '/race.html',
        '/tetris.html', '/memory.html', '/puzzle.html',
        '/blockblast.html', '/fruitmerge.html', '/paperio.html',
        '/manifest.json',
        '/1000050389%20(1).jpg',
        '/1000050389.jpg'
      ]);
    })
  );
});

// Стратегия: сначала кеш, если нет — сеть, и сразу кладём в кеш
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      });
      return cached || fetched;
    })
  );
});
