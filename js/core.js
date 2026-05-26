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
function showOnly(id) {
    document.querySelectorAll('.game-page').forEach(p => p.style.display = 'none');
    document.getElementById('mainScreen').style.display = 'none';
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

function showMain() {
    document.querySelectorAll('.game-page').forEach(p => p.style.display = 'none');
    document.getElementById('mainScreen').style.display = 'block';
    updateRankDisplay();
}

// Динамическая загрузка HTML-экранов игр
function loadGameHTML(gameId, html) {
    const container = document.getElementById('gameContainer');
    const existing = document.getElementById(gameId);
    if (existing) return existing;
    
    const div = document.createElement('div');
    div.id = gameId;
    div.className = 'game-page';
    div.innerHTML = html;
    container.appendChild(div);
    return div;
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    updateRankDisplay();
});
