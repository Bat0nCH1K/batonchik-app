// Кликер
let clickerScore = 0, perClick = 1, autoClicker = 0;

function initClicker() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="showMain(); addXP(Math.floor(clickerScore / 10));">← Назад</button>
            <h2>🔴 Кликер</h2>
            <div class="clicker-score" id="score">0</div>
            <p>Очков: <span id="clicks">0</span></p>
            <button class="click-btn" id="clickBtn">ЖМИ</button>
            <div>
                <button class="upgrade-btn" id="upgrade1" disabled>+1 за клик (10 очков)</button>
                <button class="upgrade-btn" id="upgrade2" disabled>Автокликер 1/сек (50 очков)</button>
            </div>
        </div>
    `;
    const el = loadGameHTML('clickerScreen', html);
    if (el._init) return;
    el._init = true;

    document.getElementById('clickBtn').addEventListener('click', () => {
        clickerScore += perClick;
        document.getElementById('score').textContent = clickerScore;
        document.getElementById('clicks').textContent = clickerScore;
        document.getElementById('upgrade1').disabled = clickerScore < 10;
        document.getElementById('upgrade2').disabled = clickerScore < 50;
    });
    document.getElementById('upgrade1').addEventListener('click', () => {
        if (clickerScore >= 10) { clickerScore -= 10; perClick++; document.getElementById('score').textContent = clickerScore; document.getElementById('upgrade1').disabled = clickerScore < 10; }
    });
    document.getElementById('upgrade2').addEventListener('click', () => {
        if (clickerScore >= 50) { clickerScore -= 50; autoClicker++; document.getElementById('upgrade2').disabled = clickerScore < 50; }
    });
    setInterval(() => { if (autoClicker > 0) { clickerScore += autoClicker; document.getElementById('score').textContent = clickerScore; } }, 1000);
}

document.getElementById('btnClicker').addEventListener('click', () => {
    showOnly('clickerScreen');
    initClicker();
});
