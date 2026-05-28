// Звуковая библиотека BatonCHIK Games v6.0
const SFX = {
    _ctx: null,
    _musicGain: null,
    _currentMusic: null,
    _musicPlaying: false,
    
    // Инициализация
    init() {
        if (!this._ctx) {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._musicGain = this._ctx.createGain();
            this._musicGain.gain.value = 0.05;
            this._musicGain.connect(this._ctx.destination);
        }
    },
    
    // Синтезированные SFX
    play(freq, type, duration, vol = 0.1) {
        this.init();
        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();
        osc.connect(gain); gain.connect(this._ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this._ctx.currentTime);
        gain.gain.setValueAtTime(vol, this._ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this._ctx.currentTime + duration);
        osc.start(this._ctx.currentTime);
        osc.stop(this._ctx.currentTime + duration);
    },
    
    // Готовые звуки
    click() { this.play(800, 'square', 0.06, 0.05); },
    coin() { this.play(1200, 'square', 0.08, 0.07); this.play(1600, 'square', 0.08, 0.05); },
    eat() { this.play(400, 'sine', 0.1, 0.06); },
    death() { this.play(200, 'sawtooth', 0.35, 0.15); setTimeout(() => this.play(150, 'sawtooth', 0.35, 0.25), 150); },
    shoot() { this.play(80, 'square', 0.05, 0.03); },
    explosion() { this.play(50, 'sawtooth', 0.25, 0.15); },
    lineClear() { this.play(600, 'square', 0.12, 0.08); setTimeout(() => this.play(900, 'square', 0.12, 0.08), 80); },
    drop() { this.play(250, 'triangle', 0.08, 0.04); },
    match() { this.play(500, 'sine', 0.12, 0.06); setTimeout(() => this.play(700, 'sine', 0.12, 0.06), 60); },
    win() { this.play(523, 'square', 0.15, 0.08); setTimeout(() => this.play(659, 'square', 0.15, 0.08), 120); setTimeout(() => this.play(784, 'square', 0.2, 0.15), 240); },
    lose() { this.play(400, 'sawtooth', 0.2, 0.1); setTimeout(() => this.play(300, 'sawtooth', 0.3, 0.2), 200); },
    
    // Звуки для памяти (4 кнопки — 4 разных тона)
    memory0() { this.play(523, 'sine', 0.25, 0.12); }, // C
    memory1() { this.play(659, 'sine', 0.25, 0.12); }, // E
    memory2() { this.play(784, 'sine', 0.25, 0.12); }, // G
    memory3() { this.play(1047, 'sine', 0.25, 0.12); }, // C'
    
    // Фоновая музыка из релизов
    _musicTracks: {
        menu: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/C418_-_Sweden_30921677.mp3',
        calm: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Theme_-_Papers_Please_62974833.mp3',
        action: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Dimrain47_-_At_the_Speed_of_Light_Full_62880084.mp3',
        runner: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Subway_Surfers_-_OST_Glavnaya_tema_73599365.mp3',
    },
    
    playMusic(track) {
        this.init();
        this.stopMusic();
        const url = this._musicTracks[track];
        if (!url) return;
        this._currentMusic = new Audio(url);
        this._currentMusic.loop = true;
        this._currentMusic.volume = 0.05;
        this._currentMusic.play().catch(e => console.log('Музыка не загрузилась'));
        this._musicPlaying = true;
    },
    
    stopMusic() {
        if (this._currentMusic) {
            this._currentMusic.pause();
            this._currentMusic = null;
        }
        this._musicPlaying = false;
    }
};
