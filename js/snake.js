// Змейка
let snake = [], food = {}, direction = 'right', snakeInterval = null, snakeScoreVal = 0, snakeRunning = false;
const gridSize = 15, cellSize = 20;

function initSnake() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="stopSnake(); showMain(); addXP(Math.floor(snakeScoreVal / 5));">← Назад</button>
            <h2>🐍 Змейка</h2>
            <div class="snake-score">Очки: <span id="snakeScore">0</span></div>
            <canvas class="snake-canvas" id="snakeCanvas" width="300" height="300"></canvas>
            <div class="snake-controls">
                <div class="snake-row"><button class="snake-ctrl" id="snakeUp">↑</button></div>
                <div class="snake-row">
                    <button class="snake-ctrl" id="snakeLeft">←</button>
                    <button class="snake-ctrl" id="snakeDown">↓</button>
                    <button class="snake-ctrl" id="snakeRight">→</button>
                </div>
            </div>
            <button class="btn" id="startSnakeBtn" style="margin-top:10px;">▶ Старт</button>
        </div>
    `;
    const el = loadGameHTML('snakeScreen', html);
    if (el._init) { resetSnakeUI(); return; }
    el._init = true;

    document.getElementById('startSnakeBtn').addEventListener('click', startSnakeCountdown);
    document.getElementById('snakeUp').addEventListener('click', () => { if (direction !== 'down') direction = 'up'; });
    document.getElementById('snakeDown').addEventListener('click', () => { if (direction !== 'up') direction = 'down'; });
    document.getElementById('snakeLeft').addEventListener('click', () => { if (direction !== 'right') direction = 'left'; });
    document.getElementById('snakeRight').addEventListener('click', () => { if (direction !== 'left') direction = 'right'; });
    resetSnakeUI();
}

function resetSnakeUI() {
    snakeScoreVal = 0; document.getElementById('snakeScore').textContent = '0';
    snake = [{x: 7, y: 7}, {x: 6, y: 7}, {x: 5, y: 7}]; direction = 'right'; snakeRunning = false;
    if (snakeInterval) clearInterval(snakeInterval);
    placeFood(); drawSnake();
    document.getElementById('startSnakeBtn').style.display = 'block';
    document.getElementById('startSnakeBtn').textContent = '▶ Старт';
    document.getElementById('startSnakeBtn').disabled = false;
}

function startSnakeCountdown() {
    if (snakeRunning) return;
    const btn = document.getElementById('startSnakeBtn');
    btn.disabled = true; let count = 3; btn.textContent = count;
    const cd = setInterval(() => { count--; if (count <= 0) { clearInterval(cd); btn.style.display = 'none'; btn.disabled = false; startSnake(); } else { btn.textContent = count; } }, 500);
}

function startSnake() { snakeScoreVal = 0; document.getElementById('snakeScore').textContent = '0'; snake = [{x: 7, y: 7}, {x: 6, y: 7}, {x: 5, y: 7}]; direction = 'right'; snakeRunning = true; placeFood(); if (snakeInterval) clearInterval(snakeInterval); snakeInterval = setInterval(updateSnake, 120); }
function stopSnake() { if (snakeInterval) { clearInterval(snakeInterval); snakeInterval = null; } snakeRunning = false; }
function placeFood() { do { food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; } while (snake.some(s => s.x === food.x && s.y === food.y)); }
function updateSnake() { const head = { ...snake[0] }; if (direction === 'up') head.y--; if (direction === 'down') head.y++; if (direction === 'left') head.x--; if (direction === 'right') head.x++; if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(s => s.x === head.x && s.y === head.y)) { stopSnake(); alert('Игра окончена! Очки: ' + snakeScoreVal); resetSnakeUI(); return; } snake.unshift(head); if (head.x === food.x && head.y === food.y) { snakeScoreVal += 10; document.getElementById('snakeScore').textContent = snakeScoreVal; placeFood(); } else { snake.pop(); } drawSnake(); }
function drawSnake() { const canvas = document.getElementById('snakeCanvas'); if (!canvas) return; const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#e94560'; snake.forEach(s => ctx.fillRect(s.x * cellSize + 1, s.y * cellSize + 1, cellSize - 2, cellSize - 2)); ctx.fillStyle = '#4caf84'; ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4); }

document.getElementById('btnSnake').addEventListener('click', () => {
    showOnly('snakeScreen');
    initSnake();
});
