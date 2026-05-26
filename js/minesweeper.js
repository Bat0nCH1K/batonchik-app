// Сапёр
let msBoard = [];

function initMinesweeper() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="showMain()">← Назад</button>
            <h2>💣 Сапёр</h2>
            <div class="minesweeper-board" id="msBoard"></div>
            <button class="btn" id="resetMS" style="margin-top:10px;">🔄 Новая игра</button>
        </div>
    `;
    const el = loadGameHTML('minesweeperScreen', html);
    if (el._init) { startMS(); return; }
    el._init = true;

    document.getElementById('resetMS').addEventListener('click', startMS);
    startMS();
}

function startMS() {
    msBoard = Array(8).fill().map(() => Array(8).fill({ mine: false, revealed: false, flag: false, count: 0 }));
    // Расставляем мины
    for (let i = 0; i < 10; i++) {
        let r, c;
        do {
            r = Math.floor(Math.random() * 8);
            c = Math.floor(Math.random() * 8);
        } while (msBoard[r][c].mine);
        msBoard[r][c] = { ...msBoard[r][c], mine: true };
    }
    // Считаем соседей
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (msBoard[r][c].mine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && msBoard[nr][nc].mine) count++;
                }
            }
            msBoard[r][c] = { ...msBoard[r][c], count };
        }
    }
    drawMS();
}

function drawMS() {
    const board = document.getElementById('msBoard');
    if (!board) return;
    board.innerHTML = msBoard.map((row, r) => row.map((cell, c) => {
        let content = '';
        let cls = 'ms-cell';
        if (cell.revealed) {
            cls += ' revealed';
            content = cell.mine ? '💣' : cell.count || '';
        } else if (cell.flag) {
            cls += ' flag';
            content = '🚩';
        }
        return `<div class="${cls}" onclick="revealMS(${r},${c})" oncontextmenu="event.preventDefault();flagMS(${r},${c})">${content}</div>`;
    }).join('')).join('');
}

function revealMS(r, c) {
    if (msBoard[r][c].revealed || msBoard[r][c].flag) return;
    msBoard[r][c] = { ...msBoard[r][c], revealed: true };
    
    if (msBoard[r][c].mine) {
        alert('💥 Мина! Игра окончена');
        startMS();
        return;
    }
    
    if (msBoard[r][c].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !msBoard[nr][nc].revealed) {
                    revealMS(nr, nc);
                }
            }
        }
    }
    
    drawMS();
    
    // Проверка победы
    if (msBoard.every(row => row.every(cell => cell.revealed || cell.mine))) {
        addXP(30);
        alert('🎉 Победа! +30 XP');
        startMS();
    }
}

function flagMS(r, c) {
    if (!msBoard[r][c].revealed) {
        msBoard[r][c] = { ...msBoard[r][c], flag: !msBoard[r][c].flag };
        drawMS();
    }
}

window.revealMS = revealMS;
window.flagMS = flagMS;

document.getElementById('btnMinesweeper').addEventListener('click', () => {
    showOnly('minesweeperScreen');
    initMinesweeper();
});
