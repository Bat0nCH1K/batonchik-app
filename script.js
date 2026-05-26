// Система опыта и званий
const RANKS = [
    { name: 'Новичок', minXP: 0, emoji: '🐣' },
    { name: 'Любитель', minXP: 100, emoji: '🎮' },
    { name: 'Профи', minXP: 500, emoji: '🔥' },
    { name: 'Мастер', minXP: 2000, emoji: '⚡' },
    { name: 'Легенда', minXP: 10000, emoji: '👑' },
];

let userData = JSON.parse(localStorage.getItem('batonchikProfile') || '{"xp":0,"clicker":0,"snake":0,"flappy":0,"game2048":0,"quiz":0,"spaceInvaders":0,"minesweeper":0,"pacman":0,"brickBreaker":0,"ticTacToe":0}');

function saveProfile() { localStorage.setItem('batonchikProfile', JSON.stringify(userData)); }
function addXP(amount) { userData.xp += amount; saveProfile(); updateRankDisplay(); }
function getRank() { let rank = RANKS[0]; for (const r of RANKS) { if (userData.xp >= r.minXP) rank = r; } return rank; }
function updateRankDisplay() { const rank = getRank(); const el = document.getElementById('rankDisplay'); if (el) el.innerHTML = `${rank.emoji} ${rank.name} (${userData.xp} XP)`; }

// Навигация
function showOnly(id) { document.querySelectorAll('.game-page').forEach(p => p.style.display = 'none'); document.getElementById('mainScreen').style.display = 'none'; document.getElementById(id).style.display = 'block'; }
function showMain() { document.querySelectorAll('.game-page').forEach(p => p.style.display = 'none'); document.getElementById('mainScreen').style.display = 'block'; updateRankDisplay(); }

document.getElementById('btnClicker').addEventListener('click', () => showOnly('clickerScreen'));
document.getElementById('btnQuiz').addEventListener('click', () => { showOnly('quizScreen'); getAIQuestion(); });
document.getElementById('btn2048').addEventListener('click', () => { showOnly('game2048Screen'); init2048(); });
document.getElementById('btnSnake').addEventListener('click', () => { showOnly('snakeScreen'); resetSnakeUI(); });
document.getElementById('btnFlappy').addEventListener('click', () => { showOnly('flappyScreen'); startFlappy(); });
document.getElementById('btnSpaceInvaders').addEventListener('click', () => { showOnly('spaceInvadersScreen'); startSpaceInvaders(); });
document.getElementById('btnMinesweeper').addEventListener('click', () => { showOnly('minesweeperScreen'); initMinesweeper(); });
document.getElementById('btnPacman').addEventListener('click', () => { showOnly('pacmanScreen'); startPacman(); });
document.getElementById('btnBrickBreaker').addEventListener('click', () => { showOnly('brickBreakerScreen'); startBrickBreaker(); });
document.getElementById('btnTicTacToe').addEventListener('click', () => { showOnly('ticTacToeScreen'); initTicTacToe(); });

document.getElementById('backClicker').addEventListener('click', () => { addXP(Math.floor(clickerScore / 10)); showMain(); });
document.getElementById('backQuiz').addEventListener('click', showMain);
document.getElementById('back2048').addEventListener('click', () => { addXP(Math.floor(score2048 / 10)); showMain(); });
document.getElementById('backSnake').addEventListener('click', () => { stopSnake(); addXP(Math.floor(snakeScoreVal / 5)); showMain(); });
document.getElementById('backFlappy').addEventListener('click', () => { stopFlappy(); addXP(Math.floor(flappyScoreVal / 5)); showMain(); });
document.getElementById('backSpaceInvaders').addEventListener('click', () => { stopSpaceInvaders(); showMain(); });
document.getElementById('backMinesweeper').addEventListener('click', () => { stopMS(); showMain(); });
document.getElementById('backPacman').addEventListener('click', () => { stopPacman(); showMain(); });
document.getElementById('backBrickBreaker').addEventListener('click', () => { stopBrickBreaker(); showMain(); });
document.getElementById('backTicTacToe').addEventListener('click', () => { showMain(); });

// Кликер
let clickerScore = 0, perClick = 1, autoClicker = 0;
document.getElementById('clickBtn').addEventListener('click', () => { clickerScore += perClick; document.getElementById('score').textContent = clickerScore; document.getElementById('clicks').textContent = clickerScore; document.getElementById('upgrade1').disabled = clickerScore < 10; document.getElementById('upgrade2').disabled = clickerScore < 50; });
document.getElementById('upgrade1').addEventListener('click', () => { if (clickerScore >= 10) { clickerScore -= 10; perClick++; document.getElementById('score').textContent = clickerScore; document.getElementById('upgrade1').disabled = clickerScore < 10; } });
document.getElementById('upgrade2').addEventListener('click', () => { if (clickerScore >= 50) { clickerScore -= 50; autoClicker++; document.getElementById('upgrade2').disabled = clickerScore < 50; } });
setInterval(() => { if (autoClicker > 0) { clickerScore += autoClicker; document.getElementById('score').textContent = clickerScore; } }, 1000);

// Викторина
let quizCorrect = 0, quizTotal = 0, quizAnswered = false, currentQuestion = null;
document.getElementById('newQuestionBtn').addEventListener('click', getAIQuestion);
async function getAIQuestion() {
    const topic = document.getElementById('topicSelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    const btn = document.getElementById('newQuestionBtn');
    const card = document.getElementById('quizCard');
    btn.disabled = true; btn.textContent = '⏳ Генерация...'; card.style.display = 'block';
    document.getElementById('questionText').textContent = 'Нейросеть думает...';
    document.getElementById('optionsGrid').innerHTML = '';
    document.getElementById('feedback').textContent = '';
    quizAnswered = false;
    let retries = 0;
    while (retries < 3) {
        try {
            const resp = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    messages: [{ role: 'user', content: `Придумай новый уникальный вопрос для викторины на русском языке. Тема: "${topic}". Сложность: "${difficulty}". Ответ — строго валидный JSON: {"question":"вопрос","options":["a","b","c","d"],"correctIndex":0}. Не повторяй предыдущие вопросы.` }],
                    temperature: 1.2
                })
            });
            const data = await resp.json();
            const raw = data.choices[0].message.content.trim();
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { retries++; continue; }
            const q = JSON.parse(jsonMatch[0]);
            if (!q.question || !q.options || q.options.length !== 4 || typeof q.correctIndex !== 'number') { retries++; continue; }
            currentQuestion = q;
            document.getElementById('questionText').textContent = q.question;
            document.getElementById('difficultyBadge').textContent = difficulty;
            document.getElementById('difficultyBadge').className = `difficulty-badge difficulty-${difficulty}`;
            document.getElementById('optionsGrid').innerHTML = q.options.map((o, i) => `<button class="option-btn" data-index="${i}">${o}</button>`).join('');
            document.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', function() { checkQuiz(parseInt(this.dataset.index), this); }));
            btn.disabled = false; btn.textContent = '🎲 Новый вопрос';
            return;
        } catch (e) { retries++; }
    }
    document.getElementById('questionText').textContent = '😵 Не удалось. Попробуй ещё раз.';
    btn.disabled = false; btn.textContent = '🎲 Новый вопрос';
}
function checkQuiz(index, btn) {
    if (quizAnswered || !currentQuestion) return;
    quizAnswered = true; quizTotal++;
    const all = document.querySelectorAll('#optionsGrid .option-btn');
    all.forEach(b => b.disabled = true);
    if (index === currentQuestion.correctIndex) { btn.classList.add('correct'); document.getElementById('feedback').textContent = '✅ Правильно!'; quizCorrect++; addXP(10); }
    else { btn.classList.add('wrong'); all[currentQuestion.correctIndex].classList.add('correct'); document.getElementById('feedback').textContent = '❌ Неправильно!'; }
    document.getElementById('stats').textContent = `Правильных: ${quizCorrect} | Всего: ${quizTotal}`;
}

// 2048
let board2048 = [], score2048 = 0;
function init2048() { board2048 = Array(4).fill().map(() => Array(4).fill(0)); score2048 = 0; addRandom2048(); addRandom2048(); draw2048(); }
function addRandom2048() { const empty = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (board2048[r][c] === 0) empty.push({r, c}); if (empty.length) { const {r, c} = empty[Math.floor(Math.random() * empty.length)]; board2048[r][c] = Math.random() < 0.9 ? 2 : 4; } }
function draw2048() { const board = document.getElementById('board2048'); board.innerHTML = ''; for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { const tile = document.createElement('div'); tile.className = 'tile'; const val = board2048[r][c]; if (val) { tile.textContent = val; tile.classList.add('tile-' + val); } board.appendChild(tile); } } document.getElementById('score2048').textContent = score2048; }
function move2048(dir) { const old = board2048.map(r => [...r]); if (dir === 'left' || dir === 'right') { for (let r = 0; r < 4; r++) { let row = board2048[r].filter(v => v); if (dir === 'right') row.reverse(); for (let i = 0; i < row.length - 1; i++) { if (row[i] && row[i] === row[i+1]) { row[i] *= 2; score2048 += row[i]; row.splice(i+1, 1); row.push(0); } } while (row.length < 4) row.push(0); if (dir === 'right') row.reverse(); board2048[r] = row; } } else { for (let c = 0; c < 4; c++) { let col = [board2048[0][c], board2048[1][c], board2048[2][c], board2048[3][c]].filter(v => v); if (dir === 'down') col.reverse(); for (let i = 0; i < col.length - 1; i++) { if (col[i] && col[i] === col[i+1]) { col[i] *= 2; score2048 += col[i]; col.splice(i+1, 1); col.push(0); } } while (col.length < 4) col.push(0); if (dir === 'down') col.reverse(); for (let r = 0; r < 4; r++) board2048[r][c] = col[r]; } } if (JSON.stringify(old) !== JSON.stringify(board2048)) { addRandom2048(); draw2048(); } }
document.getElementById('reset2048').addEventListener('click', init2048);
document.getElementById('arrowUp').addEventListener('click', () => move2048('up'));
document.getElementById('arrowDown').addEventListener('click', () => move2048('down'));
document.getElementById('arrowLeft').addEventListener('click', () => move2048('left'));
document.getElementById('arrowRight').addEventListener('click', () => move2048('right'));

// Змейка с таймером
let snake = [], food = {}, direction = 'right', snakeInterval = null, snakeScoreVal = 0, snakeRunning = false;
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');
const gridSize = 15, cellSize = 20;

function resetSnakeUI() {
    snakeScoreVal = 0; document.getElementById('snakeScore').textContent = '0';
    snake = [{x: 7, y: 7}, {x: 6, y: 7}, {x: 5, y: 7}]; direction = 'right';
    snakeRunning = false;
    if (snakeInterval) clearInterval(snakeInterval);
    placeFood(); drawSnake();
    document.getElementById('startSnakeBtn').style.display = 'block';
    document.getElementById('startSnakeBtn').textContent = '▶ Старт';
}

document.getElementById('startSnakeBtn').addEventListener('click', () => {
    if (snakeRunning) return;
    const btn = document.getElementById('startSnakeBtn');
    btn.disabled = true;
    let count = 3;
    btn.textContent = count;
    const cd = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(cd);
            btn.textContent = '▶ Старт';
            btn.style.display = 'none';
            btn.disabled = false;
            startSnake();
        } else {
            btn.textContent = count;
        }
    }, 500);
});

function startSnake() {
    snakeScoreVal = 0; document.getElementById('snakeScore').textContent = '0';
    snake = [{x: 7, y: 7}, {x: 6, y: 7}, {x: 5, y: 7}]; direction = 'right';
    snakeRunning = true;
    placeFood();
    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 120);
}
function stopSnake() { if (snakeInterval) { clearInterval(snakeInterval); snakeInterval = null; } snakeRunning = false; }
function placeFood() { do { food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; } while (snake.some(s => s.x === food.x && s.y === food.y)); }
function updateSnake() {
    const head = { ...snake[0] };
    if (direction === 'up') head.y--; if (direction === 'down') head.y++; if (direction === 'left') head.x--; if (direction === 'right') head.x++;
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(s => s.x === head.x && s.y === head.y)) { stopSnake(); alert('Игра окончена! Очки: ' + snakeScoreVal); resetSnakeUI(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { snakeScoreVal += 10; document.getElementById('snakeScore').textContent = snakeScoreVal; placeFood(); } else { snake.pop(); }
    drawSnake();
}
function drawSnake() { snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height); snakeCtx.fillStyle = '#e94560'; snake.forEach(s => snakeCtx.fillRect(s.x * cellSize + 1, s.y * cellSize + 1, cellSize - 2, cellSize - 2)); snakeCtx.fillStyle = '#4caf84'; snakeCtx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4); }
document.getElementById('snakeUp').addEventListener('click', () => { if (direction !== 'down') direction = 'up'; });
document.getElementById('snakeDown').addEventListener('click', () => { if (direction !== 'up') direction = 'down'; });
document.getElementById('snakeLeft').addEventListener('click', () => { if (direction !== 'right') direction = 'left'; });
document.getElementById('snakeRight').addEventListener('click', () => { if (direction !== 'left') direction = 'right'; });

// Flappy Bird
let flappyInterval = null, flappyScoreVal = 0;
const flappyCanvas = document.getElementById('flappyCanvas');
const flappyCtx = flappyCanvas.getContext('2d');
let bird = { x: 50, y: 200, vy: 0, size: 18 };
let pipes = []; let frame = 0;
const gravity = 0.3, jumpPower = -6, pipeSpeed = 1.8, pipeWidth = 50, pipeGap = 150;
function startFlappy() { flappyScoreVal = 0; document.getElementById('flappyScore').textContent = '0'; bird = { x: 50, y: 200, vy: 0, size: 18 }; pipes = []; frame = 0; if (flappyInterval) clearInterval(flappyInterval); flappyInterval = setInterval(updateFlappy, 20); }
function stopFlappy() { if (flappyInterval) { clearInterval(flappyInterval); flappyInterval = null; } }
function updateFlappy() { bird.vy += gravity; bird.y += bird.vy; if (bird.y < 0 || bird.y > 400) { stopFlappy(); alert('Игра окончена! Очки: ' + flappyScoreVal); startFlappy(); return; } if (frame % 100 === 0) { const pipeY = Math.random() * (400 - pipeGap - 60) + 30; pipes.push({ x: 300, y: pipeY }); } for (let i = pipes.length - 1; i >= 0; i--) { pipes[i].x -= pipeSpeed; if (pipes[i].x + pipeWidth < 0) { pipes.splice(i, 1); flappyScoreVal++; document.getElementById('flappyScore').textContent = flappyScoreVal; continue; } if (bird.x + bird.size > pipes[i].x && bird.x - bird.size < pipes[i].x + pipeWidth) { if (bird.y - bird.size < pipes[i].y || bird.y + bird.size > pipes[i].y + pipeGap) { stopFlappy(); alert('Игра окончена! Очки: ' + flappyScoreVal); startFlappy(); return; } } } drawFlappy(); frame++; }
function drawFlappy() { flappyCtx.clearRect(0, 0, flappyCanvas.width, flappyCanvas.height); flappyCtx.fillStyle = '#e94560'; flappyCtx.fillRect(bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2); flappyCtx.fillStyle = '#4caf84'; pipes.forEach(p => { flappyCtx.fillRect(p.x, 0, pipeWidth, p.y); flappyCtx.fillRect(p.x, p.y + pipeGap, pipeWidth, 400 - p.y - pipeGap); }); }
function jumpFlappy() { bird.vy = jumpPower; }
document.getElementById('flappyCanvas').addEventListener('click', jumpFlappy);
document.getElementById('restartFlappy').addEventListener('click', () => { stopFlappy(); startFlappy(); });

// Space Invaders (исправленный)
let siInterval = null, siScore = 0, siLives = 3;
const siCanvas = document.getElementById('siCanvas');
const siCtx = siCanvas.getContext('2d');
let player = { x: 150, y: 350, w: 30, h: 20 };
let bullets = [];
let enemies = [];
let enemyBullets = [];
let siLeft = false, siRight = false;
let siEnemyDir = 1;
let siEnemySpeed = 0.5;

function startSpaceInvaders() {
    siScore = 0; siLives = 3;
    document.getElementById('siScore').textContent = '0';
    document.getElementById('siLives').textContent = '3';
    player.x = 150;
    bullets = []; enemies = []; enemyBullets = [];
    siEnemyDir = 1; siEnemySpeed = 0.5;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 8; c++) {
            enemies.push({ x: c * 30 + 30, y: r * 30 + 30, w: 25, h: 20, alive: true });
        }
    }
    if (siInterval) clearInterval(siInterval);
    siInterval = setInterval(updateSI, 50);
}

function stopSpaceInvaders() { if (siInterval) { clearInterval(siInterval); siInterval = null; } }

document.getElementById('siLeftBtn').addEventListener('pointerdown', () => { siLeft = true; });
document.getElementById('siLeftBtn').addEventListener('pointerup', () => { siLeft = false; });
document.getElementById('siRightBtn').addEventListener('pointerdown', () => { siRight = true; });
document.getElementById('siRightBtn').addEventListener('pointerup', () => { siRight = false; });
document.getElementById('siShootBtn').addEventListener('click', shootBullet);

function shootBullet() { if (bullets.length < 3) { bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, vy: -6 }); } }

function updateSI() {
    if (siLeft && player.x > 0) player.x -= 5;
    if (siRight && player.x < 300 - player.w) player.x += 5;

    const aliveEnemies = enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) {
        stopSpaceInvaders();
        addXP(50);
        alert('🎉 Победа! +50 XP');
        startSpaceInvaders();
        return;
    }

    const rightmost = Math.max(...aliveEnemies.map(e => e.x + e.w));
    const leftmost = Math.min(...aliveEnemies.map(e => e.x));

    if (rightmost + siEnemySpeed >= 300 || leftmost - siEnemySpeed <= 0) {
        siEnemyDir *= -1;
        enemies.forEach(e => { if (e.alive) e.y += 10; });
    }

    enemies.forEach(e => {
        if (!e.alive) return;
        e.x += siEnemyDir * siEnemySpeed;
        if (e.y + e.h >= player.y) {
            stopSpaceInvaders();
            addXP(Math.floor(siScore / 2));
            alert('💀 Враги достигли базы! +' + Math.floor(siScore / 2) + ' XP');
            startSpaceInvaders();
            return;
        }
    });

    bullets = bullets.filter(b => b.y > 0);
    bullets.forEach(b => b.y += b.vy);
    bullets.forEach(b => {
        enemies.forEach(e => {
            if (!e.alive) return;
            if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                e.alive = false; b.y = -1; siScore += 10;
                document.getElementById('siScore').textContent = siScore;
            }
        });
    });
    bullets = bullets.filter(b => b.y > 0);

    if (Math.random() < 0.01) {
        const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        enemyBullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, vy: 3 });
    }
    enemyBullets = enemyBullets.filter(b => b.y < 400);
    enemyBullets.forEach(b => b.y += b.vy);
    enemyBullets.forEach(b => {
        if (b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
            siLives--; document.getElementById('siLives').textContent = siLives; b.y = 999;
            if (siLives <= 0) { stopSpaceInvaders(); addXP(Math.floor(siScore / 2)); alert('💀 Игра окончена! +' + Math.floor(siScore / 2) + ' XP'); startSpaceInvaders(); }
        }
    });
    enemyBullets = enemyBullets.filter(b => b.y < 400);

    drawSI();
}

function dr
