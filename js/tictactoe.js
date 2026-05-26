// Крестики-нолики с ИИ
let tttBoard = [], tttGameOver = false;

function initTicTacToe() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="showMain()">← Назад</button>
            <h2>❌ Крестики-нолики</h2>
            <p style="color:var(--text-secondary);margin-bottom:10px;">Ты: ❌ | Нейросеть: ⭕</p>
            <div class="ttt-board" id="tttBoard"></div>
            <p class="feedback" id="tttFeedback"></p>
            <button class="btn" id="resetTTT" style="margin-top:10px;">🔄 Новая игра</button>
        </div>
    `;
    const el = loadGameHTML('ticTacToeScreen', html);
    if (el._init) { startTTT(); return; }
    el._init = true;

    document.getElementById('resetTTT').addEventListener('click', startTTT);
    startTTT();
}

function startTTT() {
    tttBoard = Array(9).fill('');
    tttGameOver = false;
    document.getElementById('tttFeedback').textContent = 'Твой ход';
    drawTTT();
}

function drawTTT() {
    const board = document.getElementById('tttBoard');
    if (!board) return;
    board.innerHTML = tttBoard.map((v, i) => `<div class="ttt-cell" onclick="tttMove(${i})">${v}</div>`).join('');
}

async function tttMove(i) {
    if (tttBoard[i] || tttGameOver) return;
    
    tttBoard[i] = '❌';
    drawTTT();
    
    if (checkTTT('❌')) {
        document.getElementById('tttFeedback').textContent = 'Ты победил!';
        tttGameOver = true;
        addXP(20);
        return;
    }
    if (tttBoard.every(v => v)) {
        document.getElementById('tttFeedback').textContent = 'Ничья!';
        tttGameOver = true;
        return;
    }
    
    document.getElementById('tttFeedback').textContent = 'Нейросеть думает...';
    
    try {
        const resp = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
                messages: [{ role: 'user', content: `Игра в крестики-нолики. Ты играешь за ⭕. Текущее поле (0-8): ${JSON.stringify(tttBoard)}. Сделай лучший ход. Ответ — только число от 0 до 8.` }],
                temperature: 0.3
            })
        });
        const data = await resp.json();
        const move = parseInt(data.choices[0].message.content.trim());
        
        if (isNaN(move) || tttBoard[move] || move < 0 || move > 8) {
            const empty = tttBoard.map((v, i) => v ? -1 : i).filter(v => v >= 0);
            tttBoard[empty[Math.floor(Math.random() * empty.length)]] = '⭕';
        } else {
            tttBoard[move] = '⭕';
        }
    } catch (e) {
        const empty = tttBoard.map((v, i) => v ? -1 : i).filter(v => v >= 0);
        tttBoard[empty[Math.floor(Math.random() * empty.length)]] = '⭕';
    }
    
    drawTTT();
    
    if (checkTTT('⭕')) {
        document.getElementById('tttFeedback').textContent = 'Нейросеть победила!';
        tttGameOver = true;
        return;
    }
    if (tttBoard.every(v => v)) {
        document.getElementById('tttFeedback').textContent = 'Ничья!';
        tttGameOver = true;
        return;
    }
    
    document.getElementById('tttFeedback').textContent = 'Твой ход';
}

function checkTTT(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w => w.every(i => tttBoard[i] === p));
}

window.tttMove = tttMove;

document.getElementById('btnTicTacToe').addEventListener('click', () => {
    showOnly('ticTacToeScreen');
    initTicTacToe();
});
