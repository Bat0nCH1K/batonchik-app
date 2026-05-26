// Space Invaders
let siInterval = null, siScore = 0, siLives = 3;
let player = { x: 150, y: 350, w: 30, h: 20 };
let bullets = [];
let enemies = [];
let enemyBullets = [];
let siLeft = false, siRight = false;
let siEnemyDir = 1;
let siEnemySpeed = 0.5;

function initInvaders() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="stopSpaceInvaders(); showMain();">← Назад</button>
            <h2>👾 Space Invaders</h2>
            <div style="display:flex;justify-content:center;gap:30px;margin:10px 0;">
                <span>Очки: <span id="siScore">0</span></span>
                <span>Жизни: <span id="siLives">3</span></span>
            </div>
            <canvas class="si-canvas" id="siCanvas" width="300" height="400"></canvas>
            <div style="display:flex;justify-content:center;gap:10px;margin-top:10px;">
                <button class="snake-ctrl" id="siLeftBtn">←</button>
                <button class="snake-ctrl" id="siShootBtn" style="width:80px;">ОГОНЬ</button>
                <button class="snake-ctrl" id="siRightBtn">→</button>
            </div>
        </div>
    `;
    const el = loadGameHTML('spaceInvadersScreen', html);
    if (el._init) { startSpaceInvaders(); return; }
    el._init = true;

    document.getElementById('siLeftBtn').addEventListener('pointerdown', () => { siLeft = true; });
    document.getElementById('siLeftBtn').addEventListener('pointerup', () => { siLeft = false; });
    document.getElementById('siRightBtn').addEventListener('pointerdown', () => { siRight = true; });
    document.getElementById('siRightBtn').addEventListener('pointerup', () => { siRight = false; });
    document.getElementById('siShootBtn').addEventListener('click', shootBullet);
    startSpaceInvaders();
}

function startSpaceInvaders() {
    siScore = 0; siLives = 3;
    document.getElementById('siScore').textContent = '0';
    document.getElementById('siLives').textContent = '3';
    player.x = 150;
    bullets = [];
    enemies = [];
    enemyBullets = [];
    siEnemyDir = 1;
    siEnemySpeed = 0.5;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 8; c++) {
            enemies.push({ x: c * 30 + 30, y: r * 30 + 30, w: 25, h: 20, alive: true });
        }
    }
    if (siInterval) clearInterval(siInterval);
    siInterval = setInterval(updateSI, 50);
}

function stopSpaceInvaders() {
    if (siInterval) { clearInterval(siInterval); siInterval = null; }
}

function shootBullet() {
    if (bullets.length < 3) {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, vy: -6 });
    }
}

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
                e.alive = false;
                b.y = -1;
                siScore += 10;
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
            siLives--;
            document.getElementById('siLives').textContent = siLives;
            b.y = 999;
            if (siLives <= 0) {
                stopSpaceInvaders();
                addXP(Math.floor(siScore / 2));
                alert('💀 Игра окончена! +' + Math.floor(siScore / 2) + ' XP');
                startSpaceInvaders();
            }
        }
    });
    enemyBullets = enemyBullets.filter(b => b.y < 400);
    
    drawSI();
}

function drawSI() {
    const canvas = document.getElementById('siCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#ff0000';
    enemies.forEach(e => { if (e.alive) ctx.fillRect(e.x, e.y, e.w, e.h); });
    ctx.fillStyle = '#ffffff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 3, 8));
    ctx.fillStyle = '#ffff00';
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, 3, 8));
}

document.getElementById('btnSpaceInvaders').addEventListener('click', () => {
    showOnly('spaceInvadersScreen');
    initInvaders();
});
