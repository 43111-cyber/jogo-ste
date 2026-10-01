/**
 * STREET GOAL - FUTEBOL DE RUA ARCADE
 * Jogo completo em JavaScript Puro com Canvas 2D e Web Audio API.
 * Sem dependências externas.
 */

// =============================================================================
// 1. CONFIGURAÇÃO E CONSTANTES
// =============================================================================
const CONFIG = {
  WORLD_WIDTH: 1360,
  WORLD_HEIGHT: 760,
  COURT_LEFT: 100,
  COURT_RIGHT: 1260,
  COURT_TOP: 70,
  COURT_BOTTOM: 690,
  GOAL_TOP: 300,
  GOAL_BOTTOM: 460,
  GOAL_DEPTH: 60,
  POST_RADIUS: 7,

  PLAYER_RADIUS: 18,
  BALL_RADIUS: 9,
  MATCH_DURATION_SECONDS: 180, // 3 minutos
  GOAL_CELEBRATION_DURATION: 2.2, // segundos

  BASE_SPEED: 260,
  BASE_ACCEL: 1800,
  FRICTION_PLAYER: 0.88,
  FRICTION_BALL: 0.984,
  MAX_BALL_SPEED: 780,

  DEFAULT_SOUND_MUTED: false
};

// =============================================================================
// 2. DADOS DOS TIMES REAIS
// =============================================================================
const TEAMS_DATA = [
  {
    id: "real_madrid",
    name: "Real Madrid",
    shortName: "RMA",
    country: "Espanha",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D4AF37", // Dourado
    accentColor: "#172347",
    textColor: "#0C1427",
    badgeLetter: "RM",
    players: [
      {
        id: "vini_jr",
        name: "Vinícius Jr",
        number: 7,
        position: "ATA",
        skin: "#744628",
        hair: "#111111",
        speed: 97,
        dribble: 96,
        shooting: 86,
        control: 93,
        strength: 78
      },
      {
        id: "mbappe",
        name: "Kylian Mbappé",
        number: 9,
        position: "ATA",
        skin: "#855436",
        hair: "#1a1614",
        speed: 98,
        dribble: 94,
        shooting: 95,
        control: 91,
        strength: 84
      },
      {
        id: "bellingham",
        name: "Jude Bellingham",
        number: 5,
        position: "MEI",
        skin: "#784b30",
        hair: "#1a1a1a",
        speed: 85,
        dribble: 89,
        shooting: 89,
        control: 94,
        strength: 90
      },
      {
        id: "courtois",
        name: "Thibaut Courtois",
        number: 1,
        position: "GOL",
        skin: "#e6b998",
        hair: "#3a2a1a",
        speed: 70,
        dribble: 60,
        shooting: 65,
        control: 80,
        strength: 92,
        isGk: true,
        gkReflex: 95,
        gkReach: 95
      }
    ]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    shortName: "BAR",
    country: "Espanha",
    primaryColor: "#A50044", // Grená
    secondaryColor: "#004D98", // Azul
    accentColor: "#EDBB00", // Ouro
    textColor: "#FFFFFF",
    badgeLetter: "FCB",
    players: [
      {
        id: "yamal",
        name: "Lamine Yamal",
        number: 19,
        position: "ATA",
        skin: "#7b4f32",
        hair: "#1f1f1f",
        speed: 93,
        dribble: 96,
        shooting: 84,
        control: 95,
        strength: 72
      },
      {
        id: "lewandowski",
        name: "R. Lewandowski",
        number: 9,
        position: "ATA",
        skin: "#ecc4a4",
        hair: "#2b2118",
        speed: 79,
        dribble: 83,
        shooting: 97,
        control: 88,
        strength: 91
      },
      {
        id: "pedri",
        name: "Pedri González",
        number: 8,
        position: "MEI",
        skin: "#e4bb99",
        hair: "#221c18",
        speed: 84,
        dribble: 94,
        shooting: 82,
        control: 97,
        strength: 74
      },
      {
        id: "ter_stegen",
        name: "Marc Ter Stegen",
        number: 1,
        position: "GOL",
        skin: "#ecc6a8",
        hair: "#705436",
        speed: 74,
        dribble: 68,
        shooting: 70,
        control: 86,
        strength: 88,
        isGk: true,
        gkReflex: 92,
        gkReach: 91
      }
    ]
  },
  {
    id: "man_city",
    name: "Manchester City",
    shortName: "MCI",
    country: "Inglaterra",
    primaryColor: "#6CABDD", // Celeste
    secondaryColor: "#1C2C5B", // Marinho
    accentColor: "#FFFFFF",
    textColor: "#1C2C5B",
    badgeLetter: "MC",
    players: [
      {
        id: "haaland",
        name: "Erling Haaland",
        number: 9,
        position: "ATA",
        skin: "#f2cdb1",
        hair: "#e5c57e",
        speed: 92,
        dribble: 80,
        shooting: 98,
        control: 84,
        strength: 98
      },
      {
        id: "de_bruyne",
        name: "Kevin De Bruyne",
        number: 17,
        position: "MEI",
        skin: "#f0cbb0",
        hair: "#bd6b34",
        speed: 81,
        dribble: 87,
        shooting: 93,
        control: 98,
        strength: 85
      },
      {
        id: "foden",
        name: "Phil Foden",
        number: 47,
        position: "ATA",
        skin: "#eccbb2",
        hair: "#2e2925",
        speed: 90,
        dribble: 93,
        shooting: 88,
        control: 94,
        strength: 76
      },
      {
        id: "ederson",
        name: "Ederson Moraes",
        number: 31,
        position: "GOL",
        skin: "#caa080",
        hair: "#1b1816",
        speed: 78,
        dribble: 75,
        shooting: 72,
        control: 89,
        strength: 90,
        isGk: true,
        gkReflex: 90,
        gkReach: 90
      }
    ]
  },
  {
    id: "psg",
    name: "Paris Saint-Germain",
    shortName: "PSG",
    country: "França",
    primaryColor: "#001E3D", // Azul Escuro
    secondaryColor: "#DA291C", // Vermelho
    accentColor: "#FFFFFF",
    textColor: "#FFFFFF",
    badgeLetter: "PSG",
    players: [
      {
        id: "dembele",
        name: "Ousmane Dembélé",
        number: 10,
        position: "ATA",
        skin: "#5f381f",
        hair: "#111111",
        speed: 95,
        dribble: 95,
        shooting: 83,
        control: 91,
        strength: 74
      },
      {
        id: "barcola",
        name: "Bradley Barcola",
        number: 29,
        position: "ATA",
        skin: "#623d26",
        hair: "#111111",
        speed: 94,
        dribble: 90,
        shooting: 84,
        control: 88,
        strength: 77
      },
      {
        id: "vitinha",
        name: "Vitinha",
        number: 17,
        position: "MEI",
        skin: "#e2b895",
        hair: "#463022",
        speed: 83,
        dribble: 89,
        shooting: 85,
        control: 94,
        strength: 75
      },
      {
        id: "donnarumma",
        name: "G. Donnarumma",
        number: 1,
        position: "GOL",
        skin: "#e6bc9a",
        hair: "#2b221a",
        speed: 68,
        dribble: 62,
        shooting: 60,
        control: 78,
        strength: 95,
        isGk: true,
        gkReflex: 94,
        gkReach: 96
      }
    ]
  },
  {
    id: "bayern",
    name: "Bayern Munich",
    shortName: "BAY",
    country: "Alemanha",
    primaryColor: "#DC052D", // Vermelho
    secondaryColor: "#FFFFFF",
    accentColor: "#0066B2", // Azul
    textColor: "#FFFFFF",
    badgeLetter: "FCB",
    players: [
      {
        id: "kane",
        name: "Harry Kane",
        number: 9,
        position: "ATA",
        skin: "#f2cdb3",
        hair: "#8e6d49",
        speed: 80,
        dribble: 84,
        shooting: 97,
        control: 91,
        strength: 90
      },
      {
        id: "musiala",
        name: "Jamal Musiala",
        number: 42,
        position: "MEI",
        skin: "#9a6c4c",
        hair: "#1f1a18",
        speed: 92,
        dribble: 97,
        shooting: 86,
        control: 95,
        strength: 75
      },
      {
        id: "sane",
        name: "Leroy Sané",
        number: 10,
        position: "ATA",
        skin: "#8b5f40",
        hair: "#1a1614",
        speed: 94,
        dribble: 91,
        shooting: 87,
        control: 89,
        strength: 78
      },
      {
        id: "neuer",
        name: "Manuel Neuer",
        number: 1,
        position: "GOL",
        skin: "#ecc6a7",
        hair: "#735c44",
        speed: 75,
        dribble: 76,
        shooting: 75,
        control: 88,
        strength: 93,
        isGk: true,
        gkReflex: 91,
        gkReach: 94
      }
    ]
  },
  {
    id: "flamengo",
    name: "Flamengo",
    shortName: "FLA",
    country: "Brasil",
    primaryColor: "#C3281E", // Vermelho
    secondaryColor: "#111111", // Preto
    accentColor: "#FFFFFF",
    textColor: "#FFFFFF",
    badgeLetter: "CRF",
    players: [
      {
        id: "arrascasta",
        name: "G. De Arrascaeta",
        number: 14,
        position: "MEI",
        skin: "#e2b794",
        hair: "#31261d",
        speed: 83,
        dribble: 93,
        shooting: 89,
        control: 96,
        strength: 77
      },
      {
        id: "pedro",
        name: "Pedro",
        number: 9,
        position: "ATA",
        skin: "#ecc7a8",
        hair: "#2b221a",
        speed: 78,
        dribble: 83,
        shooting: 95,
        control: 89,
        strength: 91
      },
      {
        id: "gerson",
        name: "Gerson",
        number: 8,
        position: "MEI",
        skin: "#6a4329",
        hair: "#111111",
        speed: 84,
        dribble: 88,
        shooting: 85,
        control: 92,
        strength: 90
      },
      {
        id: "rossi",
        name: "Agustín Rossi",
        number: 1,
        position: "GOL",
        skin: "#ecc8aa",
        hair: "#29211a",
        speed: 73,
        dribble: 65,
        shooting: 66,
        control: 81,
        strength: 89,
        isGk: true,
        gkReflex: 90,
        gkReach: 91
      }
    ]
  },
  {
    id: "palmeiras",
    name: "Palmeiras",
    shortName: "PAL",
    country: "Brasil",
    primaryColor: "#006437", // Verde
    secondaryColor: "#FFFFFF",
    accentColor: "#D4AF37",
    textColor: "#FFFFFF",
    badgeLetter: "SEP",
    players: [
      {
        id: "estevao",
        name: "Estêvão Willian",
        number: 41,
        position: "ATA",
        skin: "#6a442b",
        hair: "#111111",
        speed: 94,
        dribble: 96,
        shooting: 85,
        control: 93,
        strength: 73
      },
      {
        id: "veiga",
        name: "Raphael Veiga",
        number: 23,
        position: "MEI",
        skin: "#e8c2a2",
        hair: "#362a20",
        speed: 81,
        dribble: 86,
        shooting: 93,
        control: 90,
        strength: 83
      },
      {
        id: "felipe_anderson",
        name: "Felipe Anderson",
        number: 9,
        position: "ATA",
        skin: "#744b30",
        hair: "#181818",
        speed: 88,
        dribble: 89,
        shooting: 85,
        control: 89,
        strength: 80
      },
      {
        id: "weverton",
        name: "Weverton",
        number: 21,
        position: "GOL",
        skin: "#6d472f",
        hair: "#141414",
        speed: 72,
        dribble: 64,
        shooting: 65,
        control: 82,
        strength: 91,
        isGk: true,
        gkReflex: 90,
        gkReach: 91
      }
    ]
  },
  {
    id: "santos",
    name: "Santos FC",
    shortName: "SAN",
    country: "Brasil",
    primaryColor: "#FFFFFF",
    secondaryColor: "#111111", // Preto
    accentColor: "#D4AF37", // Dourado
    textColor: "#111111",
    badgeLetter: "SFC",
    players: [
      {
        id: "neymar",
        name: "Neymar Jr",
        number: 10,
        position: "ATA",
        skin: "#855839",
        hair: "#2b221a",
        speed: 89,
        dribble: 98,
        shooting: 91,
        control: 98,
        strength: 75
      },
      {
        id: "giuliano",
        name: "Giuliano",
        number: 20,
        position: "MEI",
        skin: "#ecc6a7",
        hair: "#30241b",
        speed: 78,
        dribble: 85,
        shooting: 84,
        control: 89,
        strength: 79
      },
      {
        id: "guilherme",
        name: "Guilherme",
        number: 11,
        position: "ATA",
        skin: "#6f4830",
        hair: "#161616",
        speed: 90,
        dribble: 87,
        shooting: 84,
        control: 85,
        strength: 78
      },
      {
        id: "brazao",
        name: "Gabriel Brazão",
        number: 77,
        position: "GOL",
        skin: "#744d32",
        hair: "#181818",
        speed: 74,
        dribble: 62,
        shooting: 64,
        control: 80,
        strength: 90,
        isGk: true,
        gkReflex: 89,
        gkReach: 90
      }
    ]
  }
];

// =============================================================================
// 3. SISTEMA DE ÁUDIO SINTÉTICO (WEB AUDIO API)
// =============================================================================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = CONFIG.DEFAULT_SOUND_MUTED;
    this.hasInteracted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.hasInteracted = true;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Chute na bola (punchy kick)
  playKick(power = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140 + power * 40, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);

      // Ruído de impacto do pé
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {
      // Ignora erro silenciosamente
    }
  }

  // Bola na trave (som metálico "CLANG")
  playPostHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [580, 840, 1260].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.46);
      });
    } catch (e) {}
  }

  // Apito do árbitro
  playWhistle(isFinal = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const bursts = isFinal ? [0, 0.22, 0.48] : [0];
      bursts.forEach((delay, idx) => {
        const dur = isFinal && idx === 2 ? 0.6 : 0.18;
        const t = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2600, t);
        osc.frequency.linearRampToValueAtTime(2450, t + dur);

        // Tremolo
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(40, t);
        lfoGain.gain.setValueAtTime(120, t);
        lfo.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + dur);

        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
      });
    } catch (e) {}
  }

  // Corneta / Sirene de Gol e Torcida
  playGoalSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Buzina de estádio (acorde potente)
      [196, 247, 294, 392].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.65);
      });

      // Ruído branco filtrado para torcida comemorando
      const bufferSize = this.ctx.sampleRate * 2.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, t);
      filter.Q.setValueAtTime(1.5, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, t);
      noiseGain.gain.linearRampToValueAtTime(0.35, t + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // Clique de interface
  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }
}

const sounds = new SoundManager();

// =============================================================================
// 4. GERENCIADOR DE TECLADO (INPUT MULTI-TECLAS SEGURO)
// =============================================================================
class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
    window.addEventListener("blur", () => this.clearAll());
  }

  onKeyDown(e) {
    sounds.init();
    // Bloqueia rolagem ou ativação indesejada do navegador com setas e espaço/enter
    const interceptedKeys = [
      "Space",
      "Enter",
      "NumpadEnter",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    if (interceptedKeys.includes(e.code)) {
      e.preventDefault();
    }

    if (!this.keys[e.code]) {
      this.justPressed[e.code] = true;
    }
    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
    this.justPressed[e.code] = false;
  }

  isDown(code) {
    return !!this.keys[code];
  }

  wasJustPressed(code) {
    if (this.justPressed[code]) {
      this.justPressed[code] = false;
      return true;
    }
    return false;
  }

  clearAll() {
    this.keys = {};
    this.justPressed = {};
  }
}

const input = new InputManager();

// =============================================================================
// 5. ESTADOS DO JOGO E VARIÁVEIS GLOBAIS
// =============================================================================
const GAME_STATES = {
  MENU: "MENU",
  TEAM_SELECT: "TEAM_SELECT",
  PLAYER_SELECT: "PLAYER_SELECT",
  VERSUS: "VERSUS",
  PLAYING: "PLAYING",
  GOAL: "GOAL",
  GAME_OVER: "GAME_OVER",
  PAUSED: "PAUSED"
};

let currentGameState = GAME_STATES.MENU;
let gameMode = "1P"; // '1P' ou '2P'

// Seleções de times e jogadores
let selectionStep = 1; // 1 = P1 escolhe, 2 = P2/IA escolhe
let teamHome = null;
let teamAway = null;
let playerP1 = null;
let playerP2 = null;

// Partida ativa
let scoreHome = 0;
let scoreAway = 0;
let matchTimer = CONFIG.MATCH_DURATION_SECONDS;
let goalCelebrationTimer = 0;
let goalScorerName = "";
let goalScoringTeam = "";

// Entidades em campo
let players = [];
let ball = null;
let particles = [];

// Câmera
const camera = {
  x: CONFIG.WORLD_WIDTH / 2,
  y: CONFIG.WORLD_HEIGHT / 2,
  zoom: 1,
  shakeAmount: 0,
  shakeDecay: 0.9,
  viewportW: 1360,
  viewportH: 760
};

// =============================================================================
// 6. CLASSE BOLA (BALL) COM FÍSICA ARCADE
// =============================================================================
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = CONFIG.BALL_RADIUS;
    this.owner = null;
    this.previousOwner = null;
    this.ownerCooldown = 0; // Cooldown para não re-pegar instantaneamente após chute
    this.rotation = 0;
    this.height = 0;
    this.vz = 0;
    this.isShot = false;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.height = 0;
    this.vz = 0;
    this.owner = null;
    this.previousOwner = null;
    this.ownerCooldown = 0;
    this.isShot = false;
  }

  update(dt) {
    if (this.ownerCooldown > 0) {
      this.ownerCooldown -= dt;
    }

    // Se estiver com dono, segue a condução do jogador
    if (this.owner) {
      const p = this.owner;
      // Posição ideal na frente do pé do jogador
      const reachDist = p.radius + this.radius + 3;
      const targetX = p.x + Math.cos(p.angle) * reachDist;
      const targetY = p.y + Math.sin(p.angle) * reachDist;

      // Interpolação suave para drible arcade dinâmico
      const dribbleFactor = 0.38 + (p.stats.dribble / 100) * 0.28;
      this.x += (targetX - this.x) * dribbleFactor;
      this.y += (targetY - this.y) * dribbleFactor;

      this.vx = p.vx;
      this.vy = p.vy;
      this.rotation += (p.vx + p.vy) * 0.04;
      this.height = 0;
      this.vz = 0;
      this.isShot = false;
      return;
    }

    // Movimento livre com física
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Altura (pulo/quique simples do chute)
    if (this.height > 0 || this.vz !== 0) {
      this.height += this.vz * dt;
      this.vz -= 980 * dt; // gravidade
      if (this.height <= 0) {
        this.height = 0;
        if (Math.abs(this.vz) > 100) {
          this.vz = -this.vz * 0.45; // quique
        } else {
          this.vz = 0;
        }
      }
    }

    // Atrito no solo
    this.vx *= Math.pow(CONFIG.FRICTION_BALL, dt * 60);
    this.vy *= Math.pow(CONFIG.FRICTION_BALL, dt * 60);

    const speed = Math.hypot(this.vx, this.vy);
    this.rotation += speed * dt * 0.12;

    if (speed < 6) {
      this.vx = 0;
      this.vy = 0;
      this.isShot = false;
    }

    // Efeito de rastro/partículas se for chute forte
    if (this.isShot && speed > 350 && Math.random() < 0.4) {
      particles.push(new BallTrailParticle(this.x, this.y));
    }
  }

  shoot(dirX, dirY, power, shooter) {
    this.owner = null;
    this.previousOwner = shooter;
    this.ownerCooldown = 0.28; // Cooldown de posse

    const speed = power;
    this.vx = dirX * speed;
    this.vy = dirY * speed;
    this.vz = 240 + (power / CONFIG.MAX_BALL_SPEED) * 160;
    this.height = 2;
    this.isShot = true;

    sounds.playKick(power / CONFIG.MAX_BALL_SPEED);

    // Efeito de tela tremer proporcional ao chute
    if (power > 550) {
      camera.shakeAmount = Math.max(camera.shakeAmount, 6.5);
    }
  }
}

// =============================================================================
// 7. CLASSE JOGADOR (PLAYER) COM MOVIMENTO ARCADE
// =============================================================================
class Player {
  constructor(data, team, isHome, isHuman, humanId = 1) {
    this.data = data;
    this.name = data.name;
    this.number = data.number;
    this.position = data.position;
    this.isGk = !!data.isGk;
    this.stats = {
      speed: data.speed || 80,
      dribble: data.dribble || 80,
      shooting: data.shooting || 80,
      control: data.control || 80,
      strength: data.strength || 80,
      gkReflex: data.gkReflex || 85,
      gkReach: data.gkReach || 85
    };

    this.team = team;
    this.isHome = isHome;
    this.isHuman = isHuman;
    this.humanId = humanId; // 1 (P1) ou 2 (P2)

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = CONFIG.PLAYER_RADIUS;
    this.angle = isHome ? 0 : Math.PI;

    // Animação de corrida
    this.walkCycle = 0;
    this.kickCooldown = 0;

    // Posição tática inicial
    this.homeBaseX = 0;
    this.homeBaseY = 0;
  }

  setHomePosition(x, y) {
    this.homeBaseX = x;
    this.homeBaseY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = this.isHome ? 0 : Math.PI;
  }

  update(dt) {
    if (this.kickCooldown > 0) {
      this.kickCooldown -= dt;
    }

    if (this.isHuman) {
      this.handleHumanInput(dt);
    } else if (this.isGk) {
      this.handleGoalkeeperAI(dt);
    } else {
      this.handleTeammateAI(dt);
    }

    // Aplica velocidade
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Desaceleração suave (atrito)
    this.vx *= Math.pow(CONFIG.FRICTION_PLAYER, dt * 60);
    this.vy *= Math.pow(CONFIG.FRICTION_PLAYER, dt * 60);

    // Ciclo de corrida para animação dos pés
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 10) {
      this.walkCycle += speed * dt * 0.05;
      // Poeira de corrida arcade ocasional
      if (speed > 200 && Math.random() < 0.2) {
        particles.push(new DustParticle(this.x, this.y + 12));
      }
    }

    // Colisão com os limites da quadra
    this.resolveCourtBoundaries();
  }

  handleHumanInput(dt) {
    let moveX = 0;
    let moveY = 0;
    let shootPressed = false;

    if (this.humanId === 1) {
      // Jogador 1: WASD + SPACE
      if (input.isDown("KeyW")) moveY -= 1;
      if (input.isDown("KeyS")) moveY += 1;
      if (input.isDown("KeyA")) moveX -= 1;
      if (input.isDown("KeyD")) moveX += 1;
      shootPressed = input.wasJustPressed("Space");
    } else {
      // Jogador 2: SETAS + ENTER
      if (input.isDown("ArrowUp")) moveY -= 1;
      if (input.isDown("ArrowDown")) moveY += 1;
      if (input.isDown("ArrowLeft")) moveX -= 1;
      if (input.isDown("ArrowRight")) moveX += 1;
      shootPressed = input.wasJustPressed("Enter") || input.wasJustPressed("NumpadEnter");
    }

    // Normaliza vetor de movimento diagonal
    const len = Math.hypot(moveX, moveY);
    if (len > 0) {
      moveX /= len;
      moveY /= len;
      this.angle = Math.atan2(moveY, moveX);

      // Velocidade máxima baseada no atributo
      const maxSpeed = CONFIG.BASE_SPEED * (0.8 + (this.stats.speed / 100) * 0.45);
      const accel = CONFIG.BASE_ACCEL * (0.85 + (this.stats.speed / 100) * 0.3);

      this.vx += moveX * accel * dt;
      this.vy += moveY * accel * dt;

      // Limita velocidade máxima
      const currentSpeed = Math.hypot(this.vx, this.vy);
      if (currentSpeed > maxSpeed) {
        this.vx = (this.vx / currentSpeed) * maxSpeed;
        this.vy = (this.vy / currentSpeed) * maxSpeed;
      }
    }

    // Chute imediato
    if (shootPressed && this.kickCooldown <= 0) {
      this.attemptShoot();
    }
  }

  attemptShoot() {
    const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
    const canShoot = ball.owner === this || (distToBall < this.radius + ball.radius + 16 && ball.ownerCooldown <= 0);

    if (canShoot) {
      this.kickCooldown = 0.25;

      // Direção do chute baseada no ângulo que o jogador olha
      let aimAngle = this.angle;

      // Leve auxílio de mira para as pontas da goleira adversária
      const targetGoalX = this.isHome ? CONFIG.COURT_RIGHT : CONFIG.COURT_LEFT;
      const angleToGoalTop = Math.atan2(CONFIG.GOAL_TOP + 20 - this.y, targetGoalX - this.x);
      const angleToGoalBottom = Math.atan2(CONFIG.GOAL_BOTTOM - 20 - this.y, targetGoalX - this.x);

      // Se o jogador estiver virado na direção geral do gol, direciona o chute com precisão
      const facingOpponentGoal = this.isHome ? Math.abs(aimAngle) < Math.PI / 2.3 : Math.abs(aimAngle) > Math.PI / 1.7;
      if (facingOpponentGoal) {
        // Mira no canto mais distante do goleiro
        const targetGoalY = this.y > CONFIG.WORLD_HEIGHT / 2 ? CONFIG.GOAL_TOP + 25 : CONFIG.GOAL_BOTTOM - 25;
        const autoAimAngle = Math.atan2(targetGoalY - this.y, targetGoalX - this.x);
        aimAngle = aimAngle * 0.4 + autoAimAngle * 0.6;
      }

      // Potência do chute baseada no atributo shooting
      const power = 480 + (this.stats.shooting / 100) * (CONFIG.MAX_BALL_SPEED - 480);
      ball.shoot(Math.cos(aimAngle), Math.sin(aimAngle), power, this);
    }
  }

  // ===========================================================================
  // 8. INTELIGÊNCIA ARTIFICIAL: COMPANHEIROS E ADVERSÁRIOS
  // ===========================================================================
  handleTeammateAI(dt) {
    const isAttackingTeam = ball.owner && ball.owner.isHome === this.isHome;
    const isDefendingTeam = ball.owner && ball.owner.isHome !== this.isHome;
    const opponentGoalX = this.isHome ? CONFIG.COURT_RIGHT : CONFIG.COURT_LEFT;
    const ownGoalX = this.isHome ? CONFIG.COURT_LEFT : CONFIG.COURT_RIGHT;

    let targetX = this.homeBaseX;
    let targetY = this.homeBaseY;

    // Se este jogador de IA estiver com a bola
    if (ball.owner === this) {
      // Conduz em direção ao gol adversário
      targetX = opponentGoalX;
      targetY = CONFIG.WORLD_HEIGHT / 2 + (this.homeBaseY > CONFIG.WORLD_HEIGHT / 2 ? 80 : -80);

      // Distância para o gol adversário
      const distToGoal = Math.abs(opponentGoalX - this.x);
      if (distToGoal < 360 && Math.random() < 0.04) {
        // Tenta chutar ao gol
        this.attemptShoot();
      }
    } else if (ball.owner === null) {
      // Bola solta: se for o companheiro mais próximo da bola, vai atrás dela!
      const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
      const isClosestToBall = players
        .filter((p) => p.isHome === this.isHome && !p.isGk)
        .every((p) => Math.hypot(ball.x - p.x, ball.y - p.y) >= distToBall);

      if (isClosestToBall && distToBall < 420) {
        targetX = ball.x;
        targetY = ball.y;
      } else {
        // Posicionamento de apoio
        targetX = this.homeBaseX + (ball.x - CONFIG.WORLD_WIDTH / 2) * 0.35;
        targetY = this.homeBaseY + (ball.y - CONFIG.WORLD_HEIGHT / 2) * 0.25;
      }
    } else if (isAttackingTeam) {
      // Time atacando: avança e procura espaço livre
      const forwardPush = this.isHome ? 220 : -220;
      targetX = this.homeBaseX + forwardPush;
      targetY = this.homeBaseY + (ball.y - CONFIG.WORLD_HEIGHT / 2) * 0.4;
    } else if (isDefendingTeam) {
      // Time defendendo: recua para proteger a linha de chute
      targetX = (ball.x + ownGoalX) * 0.5;
      targetY = ball.y * 0.7 + this.homeBaseY * 0.3;
    }

    // Move em direção ao alvo
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 18) {
      const dirX = dx / dist;
      const dirY = dy / dist;
      this.angle = Math.atan2(dirY, dirX);

      const speedFactor = (0.75 + (this.stats.speed / 100) * 0.35) * 0.88;
      const maxSpeed = CONFIG.BASE_SPEED * speedFactor;
      const accel = CONFIG.BASE_ACCEL * speedFactor;

      this.vx += dirX * accel * dt;
      this.vy += dirY * accel * dt;

      const curSpeed = Math.hypot(this.vx, this.vy);
      if (curSpeed > maxSpeed) {
        this.vx = (this.vx / curSpeed) * maxSpeed;
        this.vy = (this.vy / curSpeed) * maxSpeed;
      }
    }

    // Se estiver muito perto da bola solta, tenta chutar ou conduzir
    const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
    if (distToBall < this.radius + ball.radius + 12 && ball.owner !== this && ball.ownerCooldown <= 0) {
      if (Math.abs(opponentGoalX - this.x) < 400 && Math.random() < 0.05) {
        this.attemptShoot();
      }
    }
  }

  // ===========================================================================
  // 9. INTELIGÊNCIA ARTIFICIAL: GOLEIRO (GOALKEEPER)
  // ===========================================================================
  handleGoalkeeperAI(dt) {
    const goalX = this.isHome ? CONFIG.COURT_LEFT + 32 : CONFIG.COURT_RIGHT - 32;
    const opponentGoalX = this.isHome ? CONFIG.COURT_RIGHT : CONFIG.COURT_LEFT;

    // Mantém o goleiro na sua área da goleira
    this.x += (goalX - this.x) * 0.15;

    // Acompanha a bola no eixo Y dentro da trave
    const targetY = Math.max(CONFIG.GOAL_TOP + 22, Math.min(CONFIG.GOAL_BOTTOM - 22, ball.y));
    const dy = targetY - this.y;

    const reflex = (this.stats.gkReflex || 88) / 100;
    const maxGkSpeed = 260 * reflex;

    if (Math.abs(dy) > 6) {
      this.vy += Math.sign(dy) * 2200 * dt;
      if (Math.abs(this.vy) > maxGkSpeed) {
        this.vy = Math.sign(this.vy) * maxGkSpeed;
      }
    }

    this.angle = this.isHome ? 0 : Math.PI;

    // Reação e defesa de chutes
    const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
    const reach = 34 + ((this.stats.gkReach || 88) / 100) * 16;

    if (distToBall < reach && ball.owner !== this) {
      // Se a bola vier em direção ao gol, espalma para frente/laterais
      const clearAngle = this.isHome
        ? (Math.random() - 0.5) * 1.2
        : Math.PI + (Math.random() - 0.5) * 1.2;
      
      ball.shoot(Math.cos(clearAngle), Math.sin(clearAngle), 420, this);
      sounds.playKick(0.7);

      // Partículas de defesa do goleiro
      for (let i = 0; i < 5; i++) {
        particles.push(new SparkParticle(this.x, this.y));
      }
    }
  }

  resolveCourtBoundaries() {
    // Paredes da quadra
    if (this.x - this.radius < CONFIG.COURT_LEFT) {
      // Apenas goleiro pode entrar levemente na área de fundo
      this.x = CONFIG.COURT_LEFT + this.radius;
      this.vx = 0;
    } else if (this.x + this.radius > CONFIG.COURT_RIGHT) {
      this.x = CONFIG.COURT_RIGHT - this.radius;
      this.vx = 0;
    }

    if (this.y - this.radius < CONFIG.COURT_TOP) {
      this.y = CONFIG.COURT_TOP + this.radius;
      this.vy = 0;
    } else if (this.y + this.radius > CONFIG.COURT_BOTTOM) {
      this.y = CONFIG.COURT_BOTTOM - this.radius;
      this.vy = 0;
    }
  }
}

// =============================================================================
// 10. FÍSICA E COLISÕES (BALL, POSTS, NET, PLAYERS)
// =============================================================================
function updateGamePhysics(dt) {
  // Atualiza Jogadores
  players.forEach((p) => p.update(dt));

  // Atualiza Bola
  ball.update(dt);

  // Colisão Jogador vs Jogador
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const p1 = players[i];
      const p2 = players[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = p1.radius + p2.radius;

      if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;

        p1.x -= nx * overlap;
        p1.y -= ny * overlap;
        p2.x += nx * overlap;
        p2.y += ny * overlap;

        // Desarme corpo a corpo se um deles estiver com a bola
        if (ball.owner === p1 && p2.isHome !== p1.isHome) {
          if (p2.stats.strength > p1.stats.strength && Math.random() < 0.05) {
            ball.owner = null;
            ball.ownerCooldown = 0.15;
            ball.vx = (p2.vx - p1.vx) * 1.5;
            ball.vy = (p2.vy - p1.vy) * 1.5;
          }
        } else if (ball.owner === p2 && p1.isHome !== p2.isHome) {
          if (p1.stats.strength > p2.stats.strength && Math.random() < 0.05) {
            ball.owner = null;
            ball.ownerCooldown = 0.15;
            ball.vx = (p1.vx - p2.vx) * 1.5;
            ball.vy = (p1.vy - p2.vy) * 1.5;
          }
        }
      }
    }
  }

  // Colisão Jogador vs Bola (Domínio e Posse da Bola)
  if (!ball.owner && ball.ownerCooldown <= 0) {
    let bestCandidate = null;
    let closestDist = Infinity;

    players.forEach((p) => {
      const dist = Math.hypot(ball.x - p.x, ball.y - p.y);
      const touchDist = p.radius + ball.radius + 6;

      if (dist < touchDist && dist < closestDist) {
        closestDist = dist;
        bestCandidate = p;
      }
    });

    if (bestCandidate) {
      ball.owner = bestCandidate;
      ball.isShot = false;
    }
  }

  // Colisão da Bola com as Paredes e Goleiras
  checkBallCourtCollisions();

  // Atualiza Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(dt);
    if (particles[i].dead) {
      particles.splice(i, 1);
    }
  }

  // Atualiza Câmera
  updateCamera(dt);
}

function checkBallCourtCollisions() {
  const r = ball.radius;

  // Paredes superior e inferior
  if (ball.y - r < CONFIG.COURT_TOP) {
    ball.y = CONFIG.COURT_TOP + r;
    ball.vy = -ball.vy * 0.72;
    sounds.playKick(0.3);
  } else if (ball.y + r > CONFIG.COURT_BOTTOM) {
    ball.y = CONFIG.COURT_BOTTOM - r;
    ball.vy = -ball.vy * 0.72;
    sounds.playKick(0.3);
  }

  // Verificação das Traves Metálicas (4 postes)
  const posts = [
    { x: CONFIG.COURT_LEFT, y: CONFIG.GOAL_TOP },
    { x: CONFIG.COURT_LEFT, y: CONFIG.GOAL_BOTTOM },
    { x: CONFIG.COURT_RIGHT, y: CONFIG.GOAL_TOP },
    { x: CONFIG.COURT_RIGHT, y: CONFIG.GOAL_BOTTOM }
  ];

  posts.forEach((post) => {
    const dx = ball.x - post.x;
    const dy = ball.y - post.y;
    const dist = Math.hypot(dx, dy);
    const minDist = r + CONFIG.POST_RADIUS;

    if (dist < minDist && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      ball.x = post.x + nx * minDist;
      ball.y = post.y + ny * minDist;

      // Quique elástico na trave
      const dot = ball.vx * nx + ball.vy * ny;
      ball.vx = (ball.vx - 2 * dot * nx) * 0.75;
      ball.vy = (ball.vy - 2 * dot * ny) * 0.75;

      sounds.playPostHit();
      camera.shakeAmount = Math.max(camera.shakeAmount, 5);
      for (let i = 0; i < 6; i++) {
        particles.push(new SparkParticle(post.x, post.y));
      }
    }
  });

  // Linhas de Fundo e Gols
  const inGoalMouthY = ball.y > CONFIG.GOAL_TOP && ball.y < CONFIG.GOAL_BOTTOM;

  // LADO ESQUERDO (Goleira do Time da Casa)
  if (ball.x - r < CONFIG.COURT_LEFT) {
    if (inGoalMouthY) {
      // Dentro da rede esquerda
      if (ball.x - r < CONFIG.COURT_LEFT - CONFIG.GOAL_DEPTH) {
        ball.x = CONFIG.COURT_LEFT - CONFIG.GOAL_DEPTH + r;
        ball.vx = -ball.vx * 0.35;
      }
      // Fundo e teto da rede
      if (ball.y - r < CONFIG.GOAL_TOP) {
        ball.y = CONFIG.GOAL_TOP + r;
        ball.vy = -ball.vy * 0.4;
      } else if (ball.y + r > CONFIG.GOAL_BOTTOM) {
        ball.y = CONFIG.GOAL_BOTTOM - r;
        ball.vy = -ball.vy * 0.4;
      }
      ball.vx *= 0.88;
      ball.vy *= 0.88;

      // Detecção de GOL para o TIME VISITANTE
      if (currentGameState === GAME_STATES.PLAYING && ball.x < CONFIG.COURT_LEFT - 12) {
        triggerGoal("AWAY");
      }
    } else {
      // Bateu na parede de fundo
      ball.x = CONFIG.COURT_LEFT + r;
      ball.vx = -ball.vx * 0.72;
      sounds.playKick(0.3);
    }
  }

  // LADO DIREITO (Goleira do Time Visitante)
  if (ball.x + r > CONFIG.COURT_RIGHT) {
    if (inGoalMouthY) {
      // Dentro da rede direita
      if (ball.x + r > CONFIG.COURT_RIGHT + CONFIG.GOAL_DEPTH) {
        ball.x = CONFIG.COURT_RIGHT + CONFIG.GOAL_DEPTH - r;
        ball.vx = -ball.vx * 0.35;
      }
      // Fundo e teto da rede
      if (ball.y - r < CONFIG.GOAL_TOP) {
        ball.y = CONFIG.GOAL_TOP + r;
        ball.vy = -ball.vy * 0.4;
      } else if (ball.y + r > CONFIG.GOAL_BOTTOM) {
        ball.y = CONFIG.GOAL_BOTTOM - r;
        ball.vy = -ball.vy * 0.4;
      }
      ball.vx *= 0.88;
      ball.vy *= 0.88;

      // Detecção de GOL para o TIME DA CASA
      if (currentGameState === GAME_STATES.PLAYING && ball.x > CONFIG.COURT_RIGHT + 12) {
        triggerGoal("HOME");
      }
    } else {
      // Bateu na parede de fundo
      ball.x = CONFIG.COURT_RIGHT - r;
      ball.vx = -ball.vx * 0.72;
      sounds.playKick(0.3);
    }
  }
}

// =============================================================================
// 11. DETECÇÃO E COMEMORAÇÃO DE GOL
// =============================================================================
function triggerGoal(scoringSide) {
  if (currentGameState !== GAME_STATES.PLAYING) return;

  currentGameState = GAME_STATES.GOAL;
  goalCelebrationTimer = CONFIG.GOAL_CELEBRATION_DURATION;

  let scorer = null;
  if (scoringSide === "HOME") {
    scoreHome++;
    goalScoringTeam = teamHome.name;
    scorer = ball.previousOwner && ball.previousOwner.isHome ? ball.previousOwner : playerP1;
  } else {
    scoreAway++;
    goalScoringTeam = teamAway.name;
    scorer = ball.previousOwner && !ball.previousOwner.isHome ? ball.previousOwner : playerP2;
  }

  goalScorerName = scorer ? `${scorer.name} #${scorer.number}` : "GOL";

  // Efeitos audiovisuais
  sounds.playWhistle(false);
  sounds.playGoalSound();
  camera.shakeAmount = 14;

  // Explosão de confetes e partículas na goleira
  const goalX = scoringSide === "HOME" ? CONFIG.COURT_RIGHT : CONFIG.COURT_LEFT;
  for (let i = 0; i < 90; i++) {
    particles.push(new ConfettiParticle(goalX, CONFIG.WORLD_HEIGHT / 2));
  }

  // Atualiza HUD e Exibe Banner
  updateScoreboardUI();
  showGoalOverlay();
}

function updateGoalCelebration(dt) {
  goalCelebrationTimer -= dt;
  if (goalCelebrationTimer <= 0) {
    hideGoalOverlay();
    resetPositionsForKickoff();
    currentGameState = GAME_STATES.PLAYING;
  }
}

// =============================================================================
// 12. CÂMERA DINÂMICA COM TREMOR E LIMITES
// =============================================================================
function updateCamera(dt) {
  // A câmera segue suavemente a bola com peso nos jogadores ativos
  let targetX = ball.x;
  let targetY = ball.y;

  if (playerP1) {
    targetX = ball.x * 0.65 + playerP1.x * 0.35;
    targetY = ball.y * 0.65 + playerP1.y * 0.35;
  }

  // Limites da câmera para não sair da quadra
  const halfViewW = camera.viewportW / 2;
  const halfViewH = camera.viewportH / 2;

  targetX = Math.max(halfViewW - 100, Math.min(CONFIG.WORLD_WIDTH - halfViewW + 100, targetX));
  targetY = Math.max(halfViewH - 60, Math.min(CONFIG.WORLD_HEIGHT - halfViewH + 60, targetY));

  // Interpolação suave
  camera.x += (targetX - camera.x) * 0.1;
  camera.y += (targetY - camera.y) * 0.1;

  // Tremor de tela
  if (camera.shakeAmount > 0.05) {
    camera.shakeAmount *= camera.shakeDecay;
  } else {
    camera.shakeAmount = 0;
  }
}

// =============================================================================
// 13. SISTEMA DE PARTÍCULAS (CONFETES, POEIRA, FAÍSCAS)
// =============================================================================
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = (Math.random() - 0.5) * Math.PI + (x < 680 ? 0 : Math.PI);
    const speed = 250 + Math.random() * 550;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 150;
    this.size = 5 + Math.random() * 6;
    this.color = ["#ffd000", "#ff0055", "#00f0ff", "#00ff77", "#ffffff"][Math.floor(Math.random() * 5)];
    this.life = 1.0;
    this.decay = 0.35 + Math.random() * 0.35;
    this.rotation = Math.random() * Math.PI * 2;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 450 * dt; // gravidade
    this.vx *= 0.98;
    this.rotation += 10 * dt;
    this.life -= this.decay * dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

class DustParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 40;
    this.vy = (Math.random() - 0.5) * 30;
    this.size = 4 + Math.random() * 5;
    this.life = 0.5;
    this.decay = 1.2;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.size += 6 * dt;
    this.life -= this.decay * dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 195, 215, ${Math.max(0, this.life * 0.25)})`;
    ctx.fill();
    ctx.restore();
  }
}

class SparkParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 120 + Math.random() * 240;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 0.35;
    this.decay = 2.4;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 150, ${Math.max(0, this.life * 2.5)})`;
    ctx.fill();
    ctx.restore();
  }
}

class BallTrailParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0.28;
    this.decay = 2.8;
    this.dead = false;
  }

  update(dt) {
    this.life -= this.decay * dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, CONFIG.BALL_RADIUS * (0.8 + this.life * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 120, 0, ${Math.max(0, this.life * 0.45)})`;
    ctx.fill();
    ctx.restore();
  }
}

// =============================================================================
// 14. RENDERIZAÇÃO GRÁFICA NO CANVAS 2D
// =============================================================================
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.viewportW = canvas.width;
  camera.viewportH = canvas.height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawGame() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Escala para ajustar a quadra à tela mantendo proporções
  const scaleX = canvas.width / CONFIG.WORLD_WIDTH;
  const scaleY = canvas.height / CONFIG.WORLD_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (canvas.width - CONFIG.WORLD_WIDTH * scale) / 2;
  const offsetY = (canvas.height - CONFIG.WORLD_HEIGHT * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Tremor de tela
  if (camera.shakeAmount > 0) {
    const sx = (Math.random() - 0.5) * camera.shakeAmount * 2;
    const sy = (Math.random() - 0.5) * camera.shakeAmount * 2;
    ctx.translate(sx, sy);
  }

  // 1. Desenha Quadra de Asfalto Urbano
  drawCourt(ctx);

  // 2. Desenha Redes e Goleiras (Fundo)
  drawGoalNets(ctx);

  // 3. Desenha Sombras das Entidades
  drawShadows(ctx);

  // 4. Desenha Partículas Abaixo da Bola/Jogadores
  particles.forEach((p) => p.draw(ctx));

  // 5. Desenha Jogadores
  players
    .slice()
    .sort((a, b) => a.y - b.y)
    .forEach((p) => drawPlayer(ctx, p));

  // 6. Desenha Bola
  drawBall(ctx, ball);

  // 7. Desenha Traves Metálicas (Frente)
  drawGoalPosts(ctx);

  // 8. Efeito de Iluminação Urbana (Vinheta e Holofotes)
  drawLighting(ctx);

  ctx.restore();
}

function drawCourt(ctx) {
  // Fundo Urbano Escuro ao redor da quadra
  ctx.fillStyle = "#0c1017";
  ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

  // Piso de Asfalto/Concreto da Quadra
  ctx.fillStyle = "#1b212c";
  ctx.fillRect(
    CONFIG.COURT_LEFT,
    CONFIG.COURT_TOP,
    CONFIG.COURT_RIGHT - CONFIG.COURT_LEFT,
    CONFIG.COURT_BOTTOM - CONFIG.COURT_TOP
  );

  // Textura sutil de placas de concreto
  ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
  ctx.lineWidth = 2;
  for (let x = CONFIG.COURT_LEFT + 145; x < CONFIG.COURT_RIGHT; x += 145) {
    ctx.beginPath();
    ctx.moveTo(x, CONFIG.COURT_TOP);
    ctx.lineTo(x, CONFIG.COURT_BOTTOM);
    ctx.stroke();
  }
  for (let y = CONFIG.COURT_TOP + 155; y < CONFIG.COURT_BOTTOM; y += 155) {
    ctx.beginPath();
    ctx.moveTo(CONFIG.COURT_LEFT, y);
    ctx.lineTo(CONFIG.COURT_RIGHT, y);
    ctx.stroke();
  }

  // Alambrado ao redor da quadra
  drawFence(ctx);

  // Linhas da Quadra (Tinta de Rua Neon / Spray)
  ctx.strokeStyle = "rgba(240, 245, 255, 0.8)";
  ctx.lineWidth = 4;
  ctx.strokeRect(
    CONFIG.COURT_LEFT,
    CONFIG.COURT_TOP,
    CONFIG.COURT_RIGHT - CONFIG.COURT_LEFT,
    CONFIG.COURT_BOTTOM - CONFIG.COURT_TOP
  );

  // Linha do Meio Campo
  const midX = (CONFIG.COURT_LEFT + CONFIG.COURT_RIGHT) / 2;
  const midY = (CONFIG.COURT_TOP + CONFIG.COURT_BOTTOM) / 2;

  ctx.beginPath();
  ctx.moveTo(midX, CONFIG.COURT_TOP);
  ctx.lineTo(midX, CONFIG.COURT_BOTTOM);
  ctx.stroke();

  // Círculo Central
  ctx.beginPath();
  ctx.arc(midX, midY, 90, 0, Math.PI * 2);
  ctx.stroke();

  // Ponto Central
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(midX, midY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Áreas das Goleiras
  // Área Esquerda
  ctx.strokeRect(CONFIG.COURT_LEFT, CONFIG.GOAL_TOP - 40, 140, CONFIG.GOAL_BOTTOM - CONFIG.GOAL_TOP + 80);
  ctx.beginPath();
  ctx.arc(CONFIG.COURT_LEFT + 140, midY, 45, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Área Direita
  ctx.strokeRect(CONFIG.COURT_RIGHT - 140, CONFIG.GOAL_TOP - 40, 140, CONFIG.GOAL_BOTTOM - CONFIG.GOAL_TOP + 80);
  ctx.beginPath();
  ctx.arc(CONFIG.COURT_RIGHT - 140, midY, 45, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.stroke();

  // Grafite nas Bordas da Quadra
  ctx.save();
  ctx.font = "900 36px 'Teko', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.textAlign = "center";
  ctx.fillText("STREET GOAL ARCADE", midX, CONFIG.COURT_TOP - 16);
  ctx.fillText("JOGA BONITO", midX, CONFIG.COURT_BOTTOM + 40);
  ctx.restore();
}

function drawFence(ctx) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  const step = 16;

  // Alambrado Superior
  ctx.save();
  ctx.beginPath();
  for (let x = CONFIG.COURT_LEFT; x <= CONFIG.COURT_RIGHT; x += step) {
    ctx.moveTo(x, CONFIG.COURT_TOP - 30);
    ctx.lineTo(x + step, CONFIG.COURT_TOP);
    ctx.moveTo(x + step, CONFIG.COURT_TOP - 30);
    ctx.lineTo(x, CONFIG.COURT_TOP);
  }
  ctx.stroke();

  // Alambrado Inferior
  ctx.beginPath();
  for (let x = CONFIG.COURT_LEFT; x <= CONFIG.COURT_RIGHT; x += step) {
    ctx.moveTo(x, CONFIG.COURT_BOTTOM);
    ctx.lineTo(x + step, CONFIG.COURT_BOTTOM + 30);
    ctx.moveTo(x + step, CONFIG.COURT_BOTTOM);
    ctx.lineTo(x, CONFIG.COURT_BOTTOM + 30);
  }
  ctx.stroke();
  ctx.restore();
}

function drawGoalNets(ctx) {
  // Goleira Esquerda (Fundo e Malha)
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(
    CONFIG.COURT_LEFT - CONFIG.GOAL_DEPTH,
    CONFIG.GOAL_TOP,
    CONFIG.GOAL_DEPTH,
    CONFIG.GOAL_BOTTOM - CONFIG.GOAL_TOP
  );

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.2;
  const netStep = 10;

  for (let x = CONFIG.COURT_LEFT - CONFIG.GOAL_DEPTH; x <= CONFIG.COURT_LEFT; x += netStep) {
    ctx.beginPath();
    ctx.moveTo(x, CONFIG.GOAL_TOP);
    ctx.lineTo(x, CONFIG.GOAL_BOTTOM);
    ctx.stroke();
  }
  for (let y = CONFIG.GOAL_TOP; y <= CONFIG.GOAL_BOTTOM; y += netStep) {
    ctx.beginPath();
    ctx.moveTo(CONFIG.COURT_LEFT - CONFIG.GOAL_DEPTH, y);
    ctx.lineTo(CONFIG.COURT_LEFT, y);
    ctx.stroke();
  }

  // Goleira Direita (Fundo e Malha)
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(
    CONFIG.COURT_RIGHT,
    CONFIG.GOAL_TOP,
    CONFIG.GOAL_DEPTH,
    CONFIG.GOAL_BOTTOM - CONFIG.GOAL_TOP
  );

  for (let x = CONFIG.COURT_RIGHT; x <= CONFIG.COURT_RIGHT + CONFIG.GOAL_DEPTH; x += netStep) {
    ctx.beginPath();
    ctx.moveTo(x, CONFIG.GOAL_TOP);
    ctx.lineTo(x, CONFIG.GOAL_BOTTOM);
    ctx.stroke();
  }
  for (let y = CONFIG.GOAL_TOP; y <= CONFIG.GOAL_BOTTOM; y += netStep) {
    ctx.beginPath();
    ctx.moveTo(CONFIG.COURT_RIGHT, y);
    ctx.lineTo(CONFIG.COURT_RIGHT + CONFIG.GOAL_DEPTH, y);
    ctx.stroke();
  }
}

function drawGoalPosts(ctx) {
  const posts = [
    { x: CONFIG.COURT_LEFT, y: CONFIG.GOAL_TOP },
    { x: CONFIG.COURT_LEFT, y: CONFIG.GOAL_BOTTOM },
    { x: CONFIG.COURT_RIGHT, y: CONFIG.GOAL_TOP },
    { x: CONFIG.COURT_RIGHT, y: CONFIG.GOAL_BOTTOM }
  ];

  posts.forEach((p) => {
    // Sombra do poste
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(p.x, p.y + 3, CONFIG.POST_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Poste metálico
    const grad = ctx.createRadialGradient(
      p.x - 2,
      p.y - 2,
      1,
      p.x,
      p.y,
      CONFIG.POST_RADIUS
    );
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.6, "#d8d8d8");
    grad.addColorStop(1, "#777777");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, CONFIG.POST_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function drawShadows(ctx) {
  // Sombra da Bola
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  const ballShadowRadius = Math.max(3, CONFIG.BALL_RADIUS - (ball.height || 0) * 0.15);
  ctx.ellipse(ball.x, ball.y + 4, ballShadowRadius, ballShadowRadius * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sombra dos Jogadores
  players.forEach((p) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 8, p.radius * 0.9, p.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  // Indicador visual sobre o jogador controlado por Humano
  if (p.isHuman) {
    const isP1 = p.humanId === 1;
    const indicatorColor = isP1 ? "#00f0ff" : "#f72585";
    const label = isP1 ? "P1" : "P2";

    // Anel pulsante nos pés
    ctx.strokeStyle = indicatorColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
    ctx.stroke();

    // Tag acima da cabeça
    ctx.fillStyle = indicatorColor;
    ctx.beginPath();
    ctx.moveTo(0, -p.radius - 8);
    ctx.lineTo(-5, -p.radius - 14);
    ctx.lineTo(5, -p.radius - 14);
    ctx.closePath();
    ctx.fill();

    ctx.font = "900 12px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, 0, -p.radius - 16);
  }

  // Rotação na direção que o jogador está olhando
  ctx.rotate(p.angle);

  // Pernas / Pés com animação de corrida
  const legOffset = Math.sin(p.walkCycle) * 7;
  ctx.fillStyle = "#1a1a1a"; // Chuteiras escuras
  // Pé esquerdo
  ctx.fillRect(-10, -p.radius - 2 + legOffset, 7, 5);
  // Pé direito
  ctx.fillRect(-10, p.radius - 3 - legOffset, 7, 5);

  // Corpo / Camisa do Time
  const teamPrimary = p.isGk ? "#f0e620" : p.team.primaryColor;
  const teamSecondary = p.isGk ? "#111111" : p.team.secondaryColor;

  ctx.fillStyle = teamPrimary;
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fill();

  // Detalhe / Listra da camisa
  ctx.fillStyle = teamSecondary;
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, -Math.PI / 3, Math.PI / 3);
  ctx.fill();

  // Contorno da camisa
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cabeça e Cabelo do Jogador
  ctx.fillStyle = p.data.skin || "#e0ac69";
  ctx.beginPath();
  ctx.arc(2, 0, p.radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Cabelo estilizado
  ctx.fillStyle = p.data.hair || "#222222";
  ctx.beginPath();
  ctx.arc(0, 0, p.radius * 0.48, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();

  // Número da Camisa nas costas
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = p.team.textColor || "#ffffff";
  ctx.font = "900 10px 'Outfit', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.number.toString(), 0, 6);
  ctx.restore();

  ctx.restore();
}

function drawBall(ctx, b) {
  ctx.save();
  // Elevação da bola quando chutada
  const ballY = b.y - (b.height || 0);
  ctx.translate(b.x, ballY);
  ctx.rotate(b.rotation);

  // Base branca da bola
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
  ctx.fill();

  // Gomos pretos clássicos de futebol
  ctx.fillStyle = "#111111";
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 4.5, Math.sin(a) * 4.5, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brilho e contorno
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function drawLighting(ctx) {
  // Gradiente radial escuro nas bordas para estética urbana noturna
  const midX = CONFIG.WORLD_WIDTH / 2;
  const midY = CONFIG.WORLD_HEIGHT / 2;
  const vignette = ctx.createRadialGradient(
    midX,
    midY,
    CONFIG.WORLD_WIDTH * 0.35,
    midX,
    midY,
    CONFIG.WORLD_WIDTH * 0.65
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(4, 7, 12, 0.4)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
}

// =============================================================================
// 15. GERENCIAMENTO DE PARTIDA E INTERFACE DO USUÁRIO (UI)
// =============================================================================
const ui = {
  menuScreen: document.getElementById("menu-screen"),
  teamSelectScreen: document.getElementById("team-select-screen"),
  playerSelectScreen: document.getElementById("player-select-screen"),
  versusScreen: document.getElementById("versus-screen"),
  hud: document.getElementById("hud"),
  goalOverlay: document.getElementById("goal-overlay"),
  gameOverOverlay: document.getElementById("game-over-overlay"),
  pauseOverlay: document.getElementById("pause-overlay"),
  howToPlayModal: document.getElementById("modal-how-to-play"),

  // Elementos do HUD
  hudBadgeHome: document.getElementById("hud-badge-home"),
  hudBadgeAway: document.getElementById("hud-badge-away"),
  hudNameHome: document.getElementById("hud-name-home"),
  hudNameAway: document.getElementById("hud-name-away"),
  hudPlayerHome: document.getElementById("hud-player-home"),
  hudPlayerAway: document.getElementById("hud-player-away"),
  hudScoreHome: document.getElementById("hud-score-home"),
  hudScoreAway: document.getElementById("hud-score-away"),
  hudTimer: document.getElementById("hud-timer"),

  // Telas Dinâmicas
  teamsGrid: document.getElementById("teams-grid"),
  playersGrid: document.getElementById("players-grid"),
  teamSelectStep: document.getElementById("team-select-step"),
  playerSelectStep: document.getElementById("player-select-step"),
  playerScreenTeamBadge: document.getElementById("player-screen-team-badge")
};

function initUIEvents() {
  // Menu Principal
  document.getElementById("btn-mode-1p").addEventListener("click", () => {
    sounds.playClick();
    gameMode = "1P";
    startTeamSelection(1);
  });

  document.getElementById("btn-mode-2p").addEventListener("click", () => {
    sounds.playClick();
    gameMode = "2P";
    startTeamSelection(1);
  });

  document.getElementById("btn-how-to-play").addEventListener("click", () => {
    sounds.playClick();
    ui.howToPlayModal.classList.remove("hidden");
  });

  document.getElementById("btn-close-how").addEventListener("click", () => {
    sounds.playClick();
    ui.howToPlayModal.classList.add("hidden");
  });

  document.getElementById("btn-understand").addEventListener("click", () => {
    sounds.playClick();
    ui.howToPlayModal.classList.add("hidden");
  });

  // Som
  const soundBtns = [
    document.getElementById("btn-sound-toggle"),
    document.getElementById("menu-sound-btn")
  ];
  soundBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sounds.init();
      const muted = sounds.toggleMute();
      updateSoundButtons(muted);
    });
  });

  // Pausa
  document.getElementById("btn-pause-toggle").addEventListener("click", togglePause);
  document.getElementById("btn-resume").addEventListener("click", togglePause);
  document.getElementById("btn-pause-menu").addEventListener("click", returnToMainMenu);

  // Voltar
  document.getElementById("btn-back-from-team").addEventListener("click", () => {
    sounds.playClick();
    if (selectionStep === 2) {
      startTeamSelection(1);
    } else {
      returnToMainMenu();
    }
  });

  document.getElementById("btn-back-from-player").addEventListener("click", () => {
    sounds.playClick();
    startTeamSelection(selectionStep);
  });

  // Versus Iniciar Partida
  document.getElementById("btn-start-match").addEventListener("click", () => {
    sounds.playClick();
    startMatch();
  });

  // Fim de Jogo: Revanche e Menu
  document.getElementById("btn-rematch").addEventListener("click", () => {
    sounds.playClick();
    rematch();
  });

  document.getElementById("btn-return-menu").addEventListener("click", () => {
    sounds.playClick();
    returnToMainMenu();
  });
}

function updateSoundButtons(muted) {
  const iconBtn = document.getElementById("btn-sound-toggle");
  const menuBtn = document.getElementById("menu-sound-btn");
  if (iconBtn) iconBtn.textContent = muted ? "🔇" : "🔊";
  if (menuBtn) menuBtn.textContent = muted ? "🔇 SOM MUDO" : "🔊 SOM ATIVO";
}

function returnToMainMenu() {
  currentGameState = GAME_STATES.MENU;
  ui.menuScreen.classList.remove("hidden");
  ui.teamSelectScreen.classList.add("hidden");
  ui.playerSelectScreen.classList.add("hidden");
  ui.versusScreen.classList.add("hidden");
  ui.hud.classList.add("hidden");
  ui.gameOverOverlay.classList.add("hidden");
  ui.pauseOverlay.classList.add("hidden");
  ui.goalOverlay.classList.add("hidden");
}

function togglePause() {
  if (currentGameState === GAME_STATES.PLAYING) {
    currentGameState = GAME_STATES.PAUSED;
    ui.pauseOverlay.classList.remove("hidden");
  } else if (currentGameState === GAME_STATES.PAUSED) {
    currentGameState = GAME_STATES.PLAYING;
    ui.pauseOverlay.classList.add("hidden");
  }
}

// -----------------------------------------------------------------------------
// FLUXO DE SELEÇÃO DE TIMES E JOGADORES
// -----------------------------------------------------------------------------
function startTeamSelection(step) {
  selectionStep = step;
  currentGameState = GAME_STATES.TEAM_SELECT;

  ui.menuScreen.classList.add("hidden");
  ui.playerSelectScreen.classList.add("hidden");
  ui.versusScreen.classList.add("hidden");
  ui.teamSelectScreen.classList.remove("hidden");

  const isP1 = step === 1;
  ui.teamSelectStep.textContent = isP1 ? "JOGADOR 1" : gameMode === "2P" ? "JOGADOR 2" : "ADVERSÁRIO (IA)";
  ui.teamSelectStep.className = isP1 ? "step-indicator" : "step-indicator p2";

  // Monta os cards dos clubes
  ui.teamsGrid.innerHTML = "";
  TEAMS_DATA.forEach((team) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.style.setProperty("--team-primary", team.primaryColor);

    const starPlayers = team.players
      .filter((p) => !p.isGk)
      .map((p) => p.name)
      .slice(0, 2)
      .join(" • ");

    card.innerHTML = `
      <div class="team-card-badge" style="background:${team.primaryColor}; color:${team.textColor}; border-color:${team.secondaryColor}">
        ${team.badgeLetter}
      </div>
      <div class="team-card-name">${team.name}</div>
      <div class="team-card-country">${team.country}</div>
      <div class="team-card-stars">Destaques: <span>${starPlayers}</span></div>
    `;

    card.addEventListener("click", () => {
      sounds.playClick();
      selectTeam(team);
    });

    ui.teamsGrid.appendChild(card);
  });
}

function selectTeam(team) {
  if (selectionStep === 1) {
    teamHome = team;
    startPlayerSelection(1, team);
  } else {
    teamAway = team;
    startPlayerSelection(2, team);
  }
}

function startPlayerSelection(step, team) {
  selectionStep = step;
  currentGameState = GAME_STATES.PLAYER_SELECT;

  ui.teamSelectScreen.classList.add("hidden");
  ui.playerSelectScreen.classList.remove("hidden");

  const isP1 = step === 1;
  ui.playerSelectStep.textContent = isP1 ? "JOGADOR 1" : gameMode === "2P" ? "JOGADOR 2" : "CRAQUE DO ADVERSÁRIO";
  ui.playerSelectStep.className = isP1 ? "step-indicator" : "step-indicator p2";

  ui.playerScreenTeamBadge.innerHTML = `
    <div class="team-badge" style="background:${team.primaryColor}; color:${team.textColor}; border-color:${team.secondaryColor}">
      ${team.badgeLetter}
    </div>
  `;

  // Monta cards dos jogadores de linha disponíveis
  ui.playersGrid.innerHTML = "";
  const outfieldPlayers = team.players.filter((p) => !p.isGk);

  outfieldPlayers.forEach((player) => {
    const card = document.createElement("div");
    card.className = isP1 ? "player-card" : "player-card p2-hover";

    card.innerHTML = `
      <div class="player-card-header">
        <div class="player-avatar" style="background:${team.primaryColor}; color:${team.textColor}; border-color:${team.secondaryColor}">
          #${player.number}
        </div>
        <div class="player-title">
          <div class="player-name">${player.name}</div>
          <span class="player-pos-tag">${player.position}</span>
        </div>
      </div>
      <div class="player-stats">
        <div class="stat-row">
          <span class="stat-label">Velocidade</span>
          <div class="stat-bar-container"><div class="stat-bar-fill" style="width:${player.speed}%"></div></div>
          <span class="stat-value">${player.speed}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Drible</span>
          <div class="stat-bar-container"><div class="stat-bar-fill" style="width:${player.dribble}%"></div></div>
          <span class="stat-value">${player.dribble}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Chute</span>
          <div class="stat-bar-container"><div class="stat-bar-fill" style="width:${player.shooting}%"></div></div>
          <span class="stat-value">${player.shooting}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Controle</span>
          <div class="stat-bar-container"><div class="stat-bar-fill" style="width:${player.control}%"></div></div>
          <span class="stat-value">${player.control}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      sounds.playClick();
      selectPlayer(player);
    });

    ui.playersGrid.appendChild(card);
  });
}

function selectPlayer(player) {
  if (selectionStep === 1) {
    playerP1 = player;
    // Se for 2P ou 1P, prossegue para o time 2
    startTeamSelection(2);
  } else {
    playerP2 = player;
    showVersusScreen();
  }
}

function showVersusScreen() {
  currentGameState = GAME_STATES.VERSUS;
  ui.playerSelectScreen.classList.add("hidden");
  ui.versusScreen.classList.remove("hidden");

  // Casa
  document.getElementById("vs-badge-home").innerHTML = teamHome.badgeLetter;
  document.getElementById("vs-badge-home").style.background = teamHome.primaryColor;
  document.getElementById("vs-badge-home").style.color = teamHome.textColor;
  document.getElementById("vs-team-home").textContent = teamHome.name;
  document.getElementById("vs-player-name-home").textContent = playerP1.name;
  document.getElementById("vs-player-pos-home").textContent = `${playerP1.position} #${playerP1.number}`;
  document.getElementById("vs-avatar-home").textContent = `#${playerP1.number}`;

  // Visitante
  document.getElementById("vs-badge-away").innerHTML = teamAway.badgeLetter;
  document.getElementById("vs-badge-away").style.background = teamAway.primaryColor;
  document.getElementById("vs-badge-away").style.color = teamAway.textColor;
  document.getElementById("vs-team-away").textContent = teamAway.name;
  document.getElementById("vs-player-name-away").textContent = playerP2.name;
  document.getElementById("vs-player-pos-away").textContent = `${playerP2.position} #${playerP2.number}`;
  document.getElementById("vs-avatar-away").textContent = `#${playerP2.number}`;

  const awayRoleBadge = document.getElementById("vs-badge-role-away");
  if (gameMode === "2P") {
    awayRoleBadge.textContent = "JOGADOR 2 (SETAS + ENTER)";
  } else {
    awayRoleBadge.textContent = "ADVERSÁRIO (IA)";
  }
}

// -----------------------------------------------------------------------------
// INICIALIZAÇÃO DA PARTIDA
// -----------------------------------------------------------------------------
function startMatch() {
  ui.versusScreen.classList.add("hidden");
  ui.gameOverOverlay.classList.add("hidden");
  ui.hud.classList.remove("hidden");

  scoreHome = 0;
  scoreAway = 0;
  matchTimer = CONFIG.MATCH_DURATION_SECONDS;

  setupMatchEntities();
  resetPositionsForKickoff();

  currentGameState = GAME_STATES.PLAYING;
  sounds.playWhistle(false);
  updateScoreboardUI();
}

function setupMatchEntities() {
  players = [];
  ball = new Ball(CONFIG.WORLD_WIDTH / 2, CONFIG.WORLD_HEIGHT / 2);

  // Time da Casa (4 jogadores: 1 Humano P1, 2 IA Teammates, 1 IA GK)
  const homeOutfield = teamHome.players.filter((p) => !p.isGk);
  const homeGkData = teamHome.players.find((p) => p.isGk);

  // Jogador controlado pelo P1
  const p1Instance = new Player(playerP1, teamHome, true, true, 1);
  players.push(p1Instance);

  // Demais jogadores de linha do time da casa
  homeOutfield
    .filter((p) => p.id !== playerP1.id)
    .forEach((pData) => {
      players.push(new Player(pData, teamHome, true, false));
    });

  // Goleiro da Casa
  if (homeGkData) {
    players.push(new Player(homeGkData, teamHome, true, false));
  }

  // Time Visitante (4 jogadores: 1 Humano P2 ou IA, 2 IA Teammates, 1 IA GK)
  const awayOutfield = teamAway.players.filter((p) => !p.isGk);
  const awayGkData = teamAway.players.find((p) => p.isGk);

  const isP2Human = gameMode === "2P";
  const p2Instance = new Player(playerP2, teamAway, false, isP2Human, 2);
  players.push(p2Instance);

  awayOutfield
    .filter((p) => p.id !== playerP2.id)
    .forEach((pData) => {
      players.push(new Player(pData, teamAway, false, false));
    });

  // Goleiro Visitante
  if (awayGkData) {
    players.push(new Player(awayGkData, teamAway, false, false));
  }
}

function resetPositionsForKickoff() {
  const midX = CONFIG.WORLD_WIDTH / 2;
  const midY = CONFIG.WORLD_HEIGHT / 2;

  // Bola no centro
  ball.reset(midX, midY);

  // Separa jogadores por time
  const homeTeamPlayers = players.filter((p) => p.isHome);
  const awayTeamPlayers = players.filter((p) => !p.isHome);

  // Posicionamento tático Casa (Esquerda para Direita)
  homeTeamPlayers.forEach((p) => {
    if (p.isGk) {
      p.setHomePosition(CONFIG.COURT_LEFT + 32, midY);
    } else if (p.data.id === playerP1.id) {
      // Jogador 1 no centro do meio campo
      p.setHomePosition(midX - 70, midY);
    } else if (p.position === "ATA") {
      p.setHomePosition(midX - 160, midY - 140);
    } else {
      p.setHomePosition(midX - 220, midY + 120);
    }
  });

  // Posicionamento tático Visitante (Direita para Esquerda)
  awayTeamPlayers.forEach((p) => {
    if (p.isGk) {
      p.setHomePosition(CONFIG.COURT_RIGHT - 32, midY);
    } else if (p.data.id === playerP2.id) {
      p.setHomePosition(midX + 70, midY);
    } else if (p.position === "ATA") {
      p.setHomePosition(midX + 160, midY + 140);
    } else {
      p.setHomePosition(midX + 220, midY - 120);
    }
  });
}

function updateScoreboardUI() {
  ui.hudScoreHome.textContent = scoreHome.toString();
  ui.hudScoreAway.textContent = scoreAway.toString();

  ui.hudNameHome.textContent = teamHome.shortName;
  ui.hudNameAway.textContent = teamAway.shortName;

  ui.hudPlayerHome.textContent = `${playerP1.name} (P1)`;
  ui.hudPlayerAway.textContent = gameMode === "2P" ? `${playerP2.name} (P2)` : `${playerP2.name} (IA)`;

  ui.hudBadgeHome.innerHTML = teamHome.badgeLetter;
  ui.hudBadgeHome.style.background = teamHome.primaryColor;
  ui.hudBadgeHome.style.color = teamHome.textColor;

  ui.hudBadgeAway.innerHTML = teamAway.badgeLetter;
  ui.hudBadgeAway.style.background = teamAway.primaryColor;
  ui.hudBadgeAway.style.color = teamAway.textColor;
}

function showGoalOverlay() {
  document.getElementById("goal-scorer-info").textContent = goalScorerName;
  document.getElementById("goal-score-display").textContent = `${teamHome.name} ${scoreHome} - ${scoreAway} ${teamAway.name}`;
  ui.goalOverlay.classList.remove("hidden");
}

function hideGoalOverlay() {
  ui.goalOverlay.classList.add("hidden");
}

function finishMatch() {
  currentGameState = GAME_STATES.GAME_OVER;
  sounds.playWhistle(true);

  // Placar final
  document.getElementById("result-score-home").textContent = scoreHome;
  document.getElementById("result-score-away").textContent = scoreAway;
  document.getElementById("result-name-home").textContent = teamHome.name;
  document.getElementById("result-name-away").textContent = teamAway.name;

  document.getElementById("result-badge-home").innerHTML = teamHome.badgeLetter;
  document.getElementById("result-badge-home").style.background = teamHome.primaryColor;
  document.getElementById("result-badge-home").style.color = teamHome.textColor;

  document.getElementById("result-badge-away").innerHTML = teamAway.badgeLetter;
  document.getElementById("result-badge-away").style.background = teamAway.primaryColor;
  document.getElementById("result-badge-away").style.color = teamAway.textColor;

  const winnerElem = document.getElementById("winner-announcement");
  if (scoreHome > scoreAway) {
    winnerElem.textContent = `VITÓRIA DO ${teamHome.name.toUpperCase()}!`;
  } else if (scoreAway > scoreHome) {
    winnerElem.textContent = `VITÓRIA DO ${teamAway.name.toUpperCase()}!`;
  } else {
    winnerElem.textContent = "EMPATE HISTÓRICO NA RUA!";
  }

  ui.gameOverOverlay.classList.remove("hidden");
}

function rematch() {
  ui.gameOverOverlay.classList.add("hidden");
  startMatch();
}

// =============================================================================
// 16. LOOP PRINCIPAL DO JOGO (REQUEST ANIMATION FRAME COM DELTA TIME)
// =============================================================================
let lastTimestamp = performance.now();

function gameLoop(now) {
  const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
  lastTimestamp = now;

  if (currentGameState === GAME_STATES.PLAYING) {
    // Cronômetro da Partida
    matchTimer -= dt;
    if (matchTimer <= 0) {
      matchTimer = 0;
      finishMatch();
    }

    const minutes = Math.floor(matchTimer / 60);
    const seconds = Math.floor(matchTimer % 60);
    ui.hudTimer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Atualização de Física
    updateGamePhysics(dt);
  } else if (currentGameState === GAME_STATES.GOAL) {
    updateGoalCelebration(dt);
    updateGamePhysics(dt);
  }

  // Renderiza Sempre
  drawGame();

  requestAnimationFrame(gameLoop);
}

// Inicializa a aplicação ao carregar
window.addEventListener("DOMContentLoaded", () => {
  initUIEvents();
  requestAnimationFrame(gameLoop);
});
