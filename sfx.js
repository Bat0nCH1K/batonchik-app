// Звуковая библиотека BatonCHIK Games v7.0
const SFX = {
    _ctx: null,
    _musicGain: null,
    _currentMusic: null,
    _musicPlaying: false,
    _lastTrack: null,
    
    init() {
        if (!this._ctx) {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._musicGain = this._ctx.createGain();
            this._musicGain.gain.value = 0.08;
            this._musicGain.connect(this._ctx.destination);
        }
    },
    
    play(freq, type, duration, vol = 0.15) {
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
    
    click() { this.play(800, 'square', 0.06, 0.08); },
    coin() { this.play(1200, 'square', 0.08, 0.1); this.play(1600, 'square', 0.08, 0.08); },
    eat() { this.play(400, 'sine', 0.1, 0.08); },
    death() { this.play(200, 'sawtooth', 0.35, 0.2); setTimeout(() => this.play(150, 'sawtooth', 0.35, 0.3), 150); },
    shoot() { this.play(80, 'square', 0.05, 0.05); },
    explosion() { this.play(50, 'sawtooth', 0.25, 0.2); },
    lineClear() { this.play(600, 'square', 0.12, 0.1); setTimeout(() => this.play(900, 'square', 0.12, 0.1), 80); },
    drop() { this.play(250, 'triangle', 0.08, 0.06); },
    match() { this.play(500, 'sine', 0.12, 0.08); setTimeout(() => this.play(700, 'sine', 0.12, 0.08), 60); },
    win() { this.play(523, 'square', 0.2, 0.1); setTimeout(() => this.play(659, 'square', 0.2, 0.1), 120); setTimeout(() => this.play(784, 'square', 0.25, 0.2), 240); },
    lose() { this.play(400, 'sawtooth', 0.25, 0.15); setTimeout(() => this.play(300, 'sawtooth', 0.35, 0.25), 200); },
    memory0() { this.play(523, 'sine', 0.3, 0.15); },
    memory1() { this.play(659, 'sine', 0.3, 0.15); },
    memory2() { this.play(784, 'sine', 0.3, 0.15); },
    memory3() { this.play(1047, 'sine', 0.3, 0.15); },
    
    _musicTracks: {
        sweden: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/C418_-_Sweden_30921677.mp3',
        papers: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Theme_-_Papers_Please_62974833.mp3',
        action: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Dimrain47_-_At_the_Speed_of_Light_Full_62880084.mp3',
        subway: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Subway_Surfers_-_OST_Glavnaya_tema_73599365.mp3',
        snowy: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Toby_Fox_-_Snowy_64962758.mp3',
        bonetrousle: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Toby_Fox_-_Bonetrousle_64962766.mp3',
        tetris: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Video_Game_Players_-_Tetris_Theme_48152782.mp3',
        ruins: 'https://github.com/Bat0nCH1K/batonchik-app/releases/download/v1.0/Toby_Fox_-_Ruins_64962741.mp3',
        scheming: 'https://bat0nch1k.github.io/batonchik-app/music/Kevin_MacLeod_-_Scheming_Weasel_64951988.mp3',
        aria: 'https://bat0nch1k.github.io/batonchik-app/music/C418.Aria.Math.mp3',
        speedrun: 'https://bat0nch1k.github.io/batonchik-app/music/Dream_-_Speedrun_Music_73264908.mp3',
        darkfantasy: 'https://bat0nch1k.github.io/batonchik-app/music/Dustum_-_dark_fantasy_79987719.mp3',
        interstellar: 'https://bat0nch1k.github.io/batonchik-app/music/Hans_Zimmer_-_Interstellar_Theme_Song_71652021.mp3',
        joyfulchess: 'https://bat0nch1k.github.io/batonchik-app/music/joyful_-_chess_79030573.mp3',
        smeshariki: 'https://bat0nch1k.github.io/batonchik-app/music/Smeshariki_-_Muzyka_pogoni_66371495.mp3',
        asgore: 'https://bat0nch1k.github.io/batonchik-app/music/undertale_077.ASGORE.mp3',
        hopes: 'https://bat0nch1k.github.io/batonchik-app/music/undertale_087.Hopes.and.Dreams.mp3',
    },
    
    playMusic(track) {
        this.init();
        this.stopMusic();
        this._lastTrack = track;
        const url = this._musicTracks[track];
        if (!url) return;
        this._currentMusic = new Audio(url);
        this._currentMusic.loop = true;
        this._currentMusic.volume = 0.08;
        this._currentMusic.play().catch(e => console.log('Музыка не загрузилась'));
        this._musicPlaying = true;
    },
    
    stopMusic() {
        if (this._currentMusic) { this._currentMusic.pause(); this._currentMusic = null; }
        this._musicPlaying = false;
    },
    
    resumeMusic() {
        if (this._lastTrack && !this._musicPlaying) {
            this.playMusic(this._lastTrack);
        }
    }
};

document.addEventListener('visibilitychange', () => {
    if (document.hidden) SFX.stopMusic();
    else SFX.resumeMusic();
});
