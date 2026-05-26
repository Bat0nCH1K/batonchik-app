// Pac-Man
let pmInterval = null, pmScore = 0;
let pmPlayer = { x: 5, y: 5 }, pmDir = 'right', pmDots = [], pmWalls = [];

function initPacman() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="stopPacman(); showMain();">← Назад</button>
            <h2>🟡 Pac-Man</h2>
            <div class="flappy-score">Очки: <span id="pmScore">0</span></div>
            <canvas class="pm-canvas" id="pmCanvas" width="300" height="300"></canvas>
            <div style="display:flex;justify-content:center;gap:10px;margin-top:10px;">
                <button class="snake-ctrl" id="pmUp">↑</button>
            </div>
            <div style="display:flex;justify-content:center;gap:10px;margin-top:5px;">
                <button class="snake-ctrl" id="pmLeft">←</button>
                <button class="snake-ctrl" id="pmDown">↓</button>
                <button class="snake-ctrl" id="pmRight">→</button>
            </div>
        </div>
    `;
    const el = loadGameHTML('pacmanScreen', html);
    if (el._init) { startPacman(); return; }
    el._init = true;

    document.getElementById('pmUp').addEventListener('click', () => pmDir = 'up');
    document.getElementById('pmDown').addEventListener('click', () => pmDir = 'down');
    document.getElementById('pmLeft').addEventListener('click', () => pmDir = 'left');
    document.getElementById('pmRight').addEventListener('click', () => pmDir = 'right');
    startPacman();
}

function startPacman() {
    pmScore = 0;
    document.getElementById('pmScore').textContent = '0';
    pmPlayer = { x: 5, y: 5 };
    pmDir = 'right';
    pmDots = [];
    pmWalls = [];
    for (let r = 0; r < 15; r++) {
        pmWalls[r] = [];
        for (let c = 0; c < 15; c++) {
            pmWalls[r][c] = (r === 0 || r === 14 || c === 0 || c === 14);
            if (!pmWalls[r][c]) pmDots.push({ x: c, y: r });
        }
    }
    if (pmInterval) clearInterval(pmInterval);
    pmInterval = setInterval(updatePM, 200);
}

function stopPacman() {
    if (pmInterval) { clearInterval(pmInterval); pmInterval = null; }
}

function updatePM() {
    const head = { ...pmPlayer };
    if (pmDir === 'up') head.y--;
    if (pmDir === 'down') head.y++;
    if (pmDir === 'left') head.x--;
    if (pmDir === 'right') head.x++;
    
    if (!pmWalls[head.y] || pmWalls[head.y][head.x]) return;
    pmPlayer = head;
    
    const dotIdx = pmDots.findIndex(d => d.x === pmPlayer.x && d.y === pmPlayer.y);
    if (dotIdx !== -1) {
        pmDots.splice(dotIdx, 1);
        pmScore += 10;
        document.getElementById('pmScore').textContent = pmScore;
    }
    
    if (pmDots.length === 0) {
        stopPacman();
        addXP(40);
        alert('🎉 Все точки собраны! +40 XP');
        startPacman();
    }
    
    drawPM();
}

function drawPM() {
    const canvas = document.getElementById('pmCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(pmPlayer.x * 20 + 2, pmPlayer.y * 20 + 2, 16, 16);
    ctx.fillStyle = '#ffffff';
    pmDots.forEach(d => ctx.fillRect(d.x * 20 + 8, d.y * 20 + 8, 4, 4));
    ctx.fillStyle = '#3333ff';
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            if (pmWalls[r][c]) ctx.fillRect(c * 20, r * 20, 20, 20);
        }
    }
}

document.getElementById('btnPacman').addEventListener('click', () => {
    showOnly('pacmanScreen');
    initPacman();
});
