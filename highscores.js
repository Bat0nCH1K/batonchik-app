// Система рекордов BatonCHIK Games v6.0
const Highscores = {
    keys: {
        clicker: 'hs_clicker', quiz: 'hs_quiz', game2048: 'hs_2048',
        snake: 'hs_snake', flappy: 'hs_flappy', invaders: 'hs_invaders',
        minesweeper: 'hs_minesweeper', pacman: 'hs_pacman',
        brickbreaker: 'hs_brickbreaker', tictactoe: 'hs_tictactoe',
        match3: 'hs_match3', race: 'hs_race', tetris: 'hs_tetris',
        memory: 'hs_memory', puzzle: 'hs_puzzle',
    },
    get(game) { return parseInt(localStorage.getItem(this.keys[game]) || '0'); },
    save(game, score) {
        const key = this.keys[game];
        if (!key) return false;
        const current = this.get(game);
        if (score > current) { localStorage.setItem(key, score); return true; }
        return false;
    },
    getAll() {
        const result = {};
        for (const [game, key] of Object.entries(this.keys)) {
            result[game] = parseInt(localStorage.getItem(key) || '0');
        }
        return result;
    }
};
