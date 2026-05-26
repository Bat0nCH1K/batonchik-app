// Flappy Bird
let flappyInterval = null, flappyScoreVal = 0;
let bird = { x: 50, y: 200, vy: 0, size: 18 };
let pipes = [];
let frame = 0;
const gravity = 0.3, jumpPower = -6, pipeSpeed = 1.8, pipeWidth = 50, pipeGap = 150;

function initFlappy() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="stopFlappy(); showMain(); addXP(Math.floor(flappyScoreVal / 5));">← Назад</button>
            <h2>🐦 Flappy Bird</h2>
            <div class="flappy-score">Очки: <span id="flappyScore">0</span></div>
            <canvas class="flappy-canvas" id="flappyCanvas" width="300" height="400"></canvas>
            <p style="color:var(--text-secondary); margin-top:8px;">Нажми на экран или пробел, чтобы лететь</p>
            <button class="btn" id="restartFlappy" style="margin-top:10px;">🔄 Заново</button>
        </div>
    `;
    const el = loadGameHTML('flappyScreen', html);
    if (el._init) { startFlappy(); return; }
    el._init = true;

    document.getElementById('flappyCanvas').addEventListener('click', jumpFlappy);
    document.getElementById('restartFlappy').addEventListener('click', () => { stopFlappy(); startFlappy(); });
    startFlappy();
}

function startFlappy() {
    flappyScoreVal = 0;
    document.getElementById('flappyScore').textContent = '0';
    bird = { x: 50, y: 200, vy: 0, size: 18 };
    pipes = [];
    frame = 0;
    if (flappyInterval) clearInterval(flappyInterval);
    flappyInterval = setInterval(updateFlappy, 20);
}

function stopFlappy() {
    if (flappyInterval) { clearInterval(flappyInterval); flappyInterval = null; }
}

function updateFlappy() {
    bird.vy += gravity;
    bird.y += bird.vy;
    
    if (bird.y < 0 || bird.y > 400) {
        stopFlappy();
        alert('Игра окончена! Очки: ' + flappyScoreVal);
        startFlappy();
        return;
    }
    
    if (frame % 100 === 0) {
        const pipeY = Math.random() * (400 - pipeGap - 60) + 30;
        pipes.push({ x: 300, y: pipeY });
    }
    
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            flappyScoreVal++;
            document.getElementById('flappyScore').textContent = flappyScoreVal;
            continue;
        }
        if (bird.x + bird.size > pipes[i].x && bird.x - bird.size < pipes[i].x + pipeWidth) {
            if (bird.y - bird.size < pipes[i].y || bird.y + bird.size > pipes[i].y + pipeGap) {
                stopFlappy();
                alert('Игра окончена! Очки: ' + flappyScoreVal);
                startFlappy();
                return;
            }
        }
    }
    
    drawFlappy();
    frame++;
}

function drawFlappy() {
    const canvas = document.getElementById('flappyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e94560';
    ctx.fillRect(bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2);
    ctx.fillStyle = '#4caf84';
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.y);
        ctx.fillRect(p.x, p.y + pipeGap, pipeWidth, 400 - p.y - pipeGap);
    });
}

function jumpFlappy() { bird.vy = jumpPower; }

document.getElementById('btnFlappy').addEventListener('click', () => {
    showOnly('flappyScreen');
    initFlappy();
});
