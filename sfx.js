// Звуковая библиотека BatonCHIK Games
const SFX = {
    _ctx: null,
    _musicGain: null,
    _musicOsc: null,
    _musicPlaying: false,
    
    // Инициализация аудиоконтекста (вызвать при первом клике)
    init() {
        if (!this._ctx) {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._musicGain = this._ctx.createGain();
            this._musicGain.gain.value = 0.03;
            this._musicGain.connect(this._ctx.destination);
        }
    },
    
    // Простой звуковой эффект
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
    click() { this.play(800, 'square', 0.08, 0.05); },
    coin() { this.play(1200, 'square', 0.1, 0.08); this.play(1600, 'square', 0.1, 0.06); },
    eat() { this.play(400, 'sine', 0.12, 0.07); },
    death() { this.play(200, 'sawtooth', 0.4, 0.2); setTimeout(() => this.play(150, 'sawtooth', 0.4, 0.3), 150); },
    shoot() { this.play(100, 'square', 0.06, 0.03); },
    explosion() { this.play(60, 'sawtooth', 0.3, 0.2); },
    lineClear() { this.play(600, 'square', 0.15, 0.1); setTimeout(() => this.play(900, 'square', 0.15, 0.1), 100); },
    drop() { this.play(300, 'triangle', 0.1, 0.05); },
    match() { this.play(500, 'sine', 0.15, 0.08); setTimeout(() => this.play(700, 'sine', 0.15, 0.08), 80); },
    win() { this.play(523, 'square', 0.2, 0.1); setTimeout(() => this.play(659, 'square', 0.2, 0.1), 150); setTimeout(() => this.play(784, 'square', 0.3, 0.2), 300); },
    
    // Фоновая музыка — простой пентатонический loop
    startMusic() {
        this.init();
        if (this._musicPlaying) return;
        this._musicPlaying = true;
        const notes = [262, 294, 330, 392, 440]; // C D E G A
        let i = 0;
        const playNote = () => {
            if (!this._musicPlaying) return;
            const osc = this._ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = notes[i % notes.length];
            osc.connect(this._musicGain);
            osc.start(this._ctx.currentTime);
            osc.stop(this._ctx.currentTime + 0.3);
            i++;
            setTimeout(playNote, 500);
        };
        playNote();
    },
    
    stopMusic() {
        this._musicPlaying = false;
    }
};
