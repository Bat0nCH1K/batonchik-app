// 2048 с анимациями
let board2048 = [], score2048 = 0, mergingTiles = [];

function init2048() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="showMain(); addXP(Math.floor(score2048 / 10));">← Назад</button>
            <h2>🧩 2048</h2>
            <div class="score-2048">Очки: <span id="score2048">0</span></div>
            <div class="game-2048-board" id="board2048"></div>
            <div class="arrow-controls">
                <div class="arrow-row"><button class="arrow-btn" id="arrowUp">↑</button></div>
                <div class="arrow-row">
                    <button class="arrow-btn" id="arrowLeft">←</button>
                    <button class="arrow-btn" id="arrowDown">↓</button>
                    <button class="arrow-btn" id="arrowRight">→</button>
                </div>
            </div>
            <button class="btn" id="reset2048" style="margin-top:10px;">🔄 Новая игра</button>
        </div>
    `;
    const el = loadGameHTML('game2048Screen', html);
    if (el._init) { start2048(); return; }
    el._init = true;

    document.getElementById('reset2048').addEventListener('click', start2048);
    document.getElementById('arrowUp').addEventListener('click', () => move2048('up'));
    document.getElementById('arrowDown').addEventListener('click', () => move2048('down'));
    document.getElementById('arrowLeft').addEventListener('click', () => move2048('left'));
    document.getElementById('arrowRight').addEventListener('click', () => move2048('right'));
    start2048();
}

function start2048() { board2048 = Array(4).fill().map(() => Array(4).fill(0)); score2048 = 0; mergingTiles = []; addRandom2048(); addRandom2048(); draw2048(); }
function addRandom2048() { const empty = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (board2048[r][c] === 0) empty.push({r, c}); if (empty.length) { const {r, c} = empty[Math.floor(Math.random() * empty.length)]; board2048[r][c] = Math.random() < 0.9 ? 2 : 4; } }
function draw2048() { const board = document.getElementById('board2048'); if (!board) return; board.innerHTML = ''; for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { const tile = document.createElement('div'); tile.className = 'tile'; const val = board2048[r][c]; if (val) { tile.textContent = val; tile.classList.add('tile-' + val); if (!mergingTiles.some(m => m.r === r && m.c === c)) { tile.style.animation = 'popIn 0.2s ease'; } if (mergingTiles.some(m => m.r === r && m.c === c)) { tile.style.animation = 'merge 0.3s ease'; } } board.appendChild(tile); } } document.getElementById('score2048').textContent = score2048; mergingTiles = []; }
function move2048(dir) { const old = board2048.map(r => [...r]); mergingTiles = []; if (dir === 'left' || dir === 'right') { for (let r = 0; r < 4; r++) { let row = board2048[r].filter(v => v); if (dir === 'right') row.reverse(); for (let i = 0; i < row.length - 1; i++) { if (row[i] && row[i] === row[i+1]) { row[i] *= 2; score2048 += row[i]; mergingTiles.push({r, c: dir === 'right' ? 3 - i : i}); row.splice(i+1, 1); row.push(0); } } while (row.length < 4) row.push(0); if (dir === 'right') row.reverse(); board2048[r] = row; } } else { for (let c = 0; c < 4; c++) { let col = [board2048[0][c], board2048[1][c], board2048[2][c], board2048[3][c]].filter(v => v); if (dir === 'down') col.reverse(); for (let i = 0; i < col.length - 1; i++) { if (col[i] && col[i] === col[i+1]) { col[i] *= 2; score2048 += col[i]; mergingTiles.push({r: dir === 'down' ? 3 - i : i, c}); col.splice(i+1, 1); col.push(0); } } while (col.length < 4) col.push(0); if (dir === 'down') col.reverse(); for (let r = 0; r < 4; r++) board2048[r][c] = col[r]; } } if (JSON.stringify(old) !== JSON.stringify(board2048)) { addRandom2048(); draw2048(); } }

document.getElementById('btn2048').addEventListener('click', () => {
    showOnly('game2048Screen');
    init2048();
});
