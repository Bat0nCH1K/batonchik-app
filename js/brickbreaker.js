// Brick Breaker
let bbInterval = null, bbScore = 0;
let bbPaddle = { x: 120, y: 370, w: 60, h: 10 };
let bbBall = { x: 150, y: 350, vx: 2, vy: -3, r: 5 };
let bbBricks = [];
let bbRight = false, bbLeft = false;

function initBrickBreaker() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="stopBrickBreaker(); showMain();">← Назад</button>
            <h2>🧱 Brick Breaker</h2>
            <div class="flappy-score">Очки: <span id="bbScore">0</span></div>
            <canvas class="bb-canvas" id="bbCanvas" width="300" height="400"></canvas>
            <p style="color:var(--text-secondary);">Двигай платформу пальцем или стрелками</p>
        </div>
    `;
    const el = loadGameHTML('brickBreakerScreen', html);
    if (el._init) { startBrickBreaker(); return; }
    el._init = true;

    document.addEventListener('keydown', bbKeyDown);
    document.addEventListener('keyup', bbKeyUp);
    document.getElementById('bbCanvas').addEventListener('touchmove', bbTouchMove);
    startBrickBreaker();
}

function startBrickBreaker() {
    bbScore = 0;
    document.getElementById('bbScore').textContent = '0';
    bbPaddle.x = 120;
    bbBall = { x: 150, y: 350, vx: 2, vy: -3, r: 5 };
    bbBricks = [];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
            bbBricks.push({ x: c * 40 + 10, y: r * 25 + 10, w: 35, h: 20, alive: true });
        }
    }
    if (bbInterval) clearInterval(bbInterval);
    bbInterval = setInterval(updateBB, 20);
}

function stopBrickBreaker() {
    if (bbInterval) { clearInterval(bbInterval); bbInterval = null; }
    document.removeEventListener('keydown', bbKeyDown);
    document.removeEventListener('keyup', bbKeyUp);
    const canvas = document.getElementById('bbCanvas');
    if (canvas) canvas.removeEventListener('touchmove', bbTouchMove);
}

function bbKeyDown(e) { if (e.key === 'ArrowRight') bbRight = true; if (e.key === 'ArrowLeft') bbLeft = true; }
function bbKeyUp(e) { if (e.key === 'ArrowRight') bbRight = false; if (e.key === 'ArrowLeft') bbLeft = false; }
function bbTouchMove(e) { e.preventDefault(); const rect = e.target.getBoundingClientRect(); const x = e.touches[0].clientX - rect.left; bbPaddle.x = Math.max(0, Math.min(300 - bbPaddle.w, x - bbPaddle.w / 2)); }

function updateBB() {
    if (bbRight && bbPaddle.x < 300 - bbPaddle.w) bbPaddle.x += 6;
    if (bbLeft && bbPaddle.x > 0) bbPaddle.x -= 6;
    
    bbBall.x += bbBall.vx;
    bbBall.y += bbBall.vy;
    
    if (bbBall.x - bbBall.r <= 0 || bbBall.x + bbBall.r >= 300) bbBall.vx *= -1;
    if (bbBall.y - bbBall.r <= 0) bbBall.vy *= -1;
    
    if (bbBall.y + bbBall.r >= bbPaddle.y && bbBall.y - bbBall.r <= bbPaddle.y + bbPaddle.h && bbBall.x > bbPaddle.x && bbBall.x < bbPaddle.x + bbPaddle.w) {
        bbBall.vy *= -1;
        bbBall.y = bbPaddle.y - bbBall.r;
    }
    
    if (bbBall.y > 400) {
        stopBrickBreaker();
        addXP(Math.floor(bbScore / 5));
        alert('Игра окончена! +' + Math.floor(bbScore / 5) + ' XP');
        initBrickBreaker();
        return;
    }
    
    bbBricks.forEach(b => {
        if (!b.alive) return;
        if (bbBall.x + bbBall.r > b.x && bbBall.x - bbBall.r < b.x + b.w && bbBall.y + bbBall.r > b.y && bbBall.y - bbBall.r < b.y + b.h) {
            b.alive = false;
            bbBall.vy *= -1;
            bbScore += 10;
            document.getElementById('bbScore').textContent = bbScore;
        }
    });
    
    if (bbBricks.every(b => !b.alive)) {
        stopBrickBreaker();
        addXP(50);
        alert('🎉 Все кирпичи разбиты! +50 XP');
        initBrickBreaker();
    }
    
    drawBB();
}

function drawBB() {
    const canvas = document.getElementById('bbCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(bbPaddle.x, bbPaddle.y, bbPaddle.w, bbPaddle.h);
    ctx.beginPath();
    ctx.arc(bbBall.x, bbBall.y, bbBall.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e94560';
    bbBricks.forEach(b => { if (b.alive) ctx.fillRect(b.x, b.y, b.w, b.h); });
}

document.getElementById('btnBrickBreaker').addEventListener('click', () => {
    showOnly('brickBreakerScreen');
    initBrickBreaker();
});
