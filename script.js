/**
 * ====================================================================
 * BEIÇO STREET — JOGO DE FUTEBOL DE RUA ARCADE (FAVELA EDITION)
 * "Futebol de rua, só os cria joga."
 * 
 * Totalmente em Vanilla JavaScript, Canvas 2D e Web Audio API.
 * Sem dependências externas.
 * ====================================================================
 */

// ====================================================================
// 1. SISTEMA DE ÁUDIO PROCEDURAL (WEB AUDIO API)
// ====================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return !this.isMuted;
  }

  // Apito do Juiz da Quebrada (trinado de dois tons)
  playWhistle(long = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      const dur = long ? 0.9 : 0.28;

      osc1.frequency.setValueAtTime(2800, t);
      osc2.frequency.setValueAtTime(2950, t);

      // Efeito de vibração do apito
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(28, t);
      lfoGain.gain.setValueAtTime(150, t);
      lfo.connect(osc1.frequency);
      lfo.start(t);
      lfo.stop(t + dur);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + dur);
      osc2.stop(t + dur);
    } catch (e) { }
  }

  // Chute na bola (grave soco + estalo)
  playKick(power = 0.5) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = 160 + power * 120;
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.14);

      const vol = 0.15 + power * 0.25;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);

      // Se for chute forte, adiciona estalo
      if (power > 0.6) {
        this.playSnap(power);
      }
    } catch (e) { }
  }

  playSnap(power) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const node = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.01));
      }
      node.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2 * power, t);
      node.connect(gain);
      gain.connect(this.ctx.destination);
      node.start(t);
    } catch (e) { }
  }

  // Bola batendo na parede / trave
  playBounce() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) { }
  }

  // Trave (eco metálico)
  playPost() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.35);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.35);
    } catch (e) { }
  }

  // Comemoração de GOL (buzina de favela + explosão de torcida)
  playGoal() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Buzina Festiva
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.setValueAtTime(440, t + 0.2);
      osc.frequency.setValueAtTime(554, t + 0.4);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.2);

      // Barulho de Torcida (White Noise filtrado)
      this.playCheer();
    } catch (e) { }
  }

  playCheer() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 2.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.linearRampToValueAtTime(1400, t + 1.0);
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 2.2);
    } catch (e) { }
  }

  // Beep de contagem 3, 2, 1, JOGA!
  playCountdown(isGo = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isGo ? 'square' : 'sine';
      osc.frequency.setValueAtTime(isGo ? 880 : 440, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isGo ? 0.35 : 0.18));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + (isGo ? 0.35 : 0.18));
    } catch (e) { }
  }

  // Clique de interface
  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.06);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) { }
  }

  // Drible de rua / caneta / chapéu
  playDribble() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(750, t + 0.12);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) { }
  }
}

const audio = new SoundFX();

// ====================================================================
// 2. CONSTANTES DA QUADRA E DIMENSÕES MUNDIAIS
// ====================================================================
const WORLD = {
  width: 1300,
  height: 760,
  // Limites da Quadra de Cimento
  courtLeft: 120,
  courtRight: 1180,
  courtTop: 180,
  courtBottom: 680,
  // Gols (Metragem e Profundidade - Gol aumentado para futebol de rua dinâmico)
  goalYTop: 295,
  goalYBottom: 565,
  goalDepth: 60,
  postRadius: 6,
  // Física da Bola (Mais rápida e fluida com bom rolamento)
  ballRadius: 10,
  friction: 0.962,
  wallRestitution: 0.68
};

// ====================================================================
// 3. SISTEMA DE PARTÍCULAS E EFEITOS VISUAIS
// ====================================================================
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.confetti = [];
  }

  // Poeira de corrida e friçcão do cimento
  addDust(x, y, color = 'rgba(210, 195, 175, 0.45)', count = 2) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 8 - 4),
        y: y + (Math.random() * 4 - 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 3 + 2,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03
      });
    }
  }

  // Faíscas e rastro de chute forte
  addSparks(x, y, vx, vy, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: -vx * 0.2 + Math.cos(angle) * speed,
        vy: -vy * 0.2 + Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.4 ? '#facc15' : '#ff4444',
        life: 1.0,
        decay: Math.random() * 0.06 + 0.04
      });
    }
  }

  // Chuva de confetes na comemoração de Gol
  triggerGoalConfetti() {
    const colors = ['#ffe600', '#00ff88', '#ff0055', '#00e5ff', '#ffffff', '#ff9900'];
    for (let i = 0; i < 180; i++) {
      this.confetti.push({
        x: Math.random() * WORLD.width,
        y: -20 - Math.random() * 150,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 3,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 1.0,
        decay: 0.004 + Math.random() * 0.003
      });
    }
  }

  update() {
    // Atualizar partículas simples
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Atualizar confetes
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx + Math.sin(c.y * 0.05) * 1.2;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.life -= c.decay;
      if (c.y > WORLD.height + 40 || c.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Desenhar partículas
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Desenhar confetes
    for (const c of this.confetti) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, c.life * 1.5);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
    this.confetti = [];
  }
}

// ====================================================================
// 4. ENTIDADE BOLA
// ====================================================================
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = WORLD.ballRadius;
    this.rotation = 0;
    this.spinSpeed = 0;
    this.trail = [];
    this.isSuperShot = false;
    this.lastTouchPlayer = null;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.spinSpeed = 0;
    this.trail = [];
    this.isSuperShot = false;
    this.lastTouchPlayer = null;
  }

  update(particles) {
    // Salvar rastro de movimento
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 4) {
      this.trail.unshift({ x: this.x, y: this.y, speed: speed });
      if (this.trail.length > (this.isSuperShot ? 14 : 7)) {
        this.trail.pop();
      }
      if (this.isSuperShot && Math.random() < 0.6) {
        particles.addSparks(this.x, this.y, this.vx, this.vy, 2);
      }
    } else {
      if (this.trail.length > 0) this.trail.pop();
      this.isSuperShot = false;
    }

    // Movimentação
    this.x += this.vx;
    this.y += this.vy;

    // Rotação visual
    this.rotation += speed * 0.1;

    // Atrito
    this.vx *= WORLD.friction;
    this.vy *= WORLD.friction;

    // Parar quando a velocidade for imperceptível
    if (Math.abs(this.vx) < 0.05) this.vx = 0;
    if (Math.abs(this.vy) < 0.05) this.vy = 0;

    // Colisão com os muros e limites
    this.checkWallCollisions();
  }

  checkWallCollisions() {
    const minX = WORLD.courtLeft + this.radius;
    const maxX = WORLD.courtRight - this.radius;
    const minY = WORLD.courtTop + this.radius;
    const maxY = WORLD.courtBottom - this.radius;

    // Parede Superior e Inferior
    if (this.y < minY) {
      this.y = minY;
      this.vy = -this.vy * WORLD.wallRestitution;
      audio.playBounce();
      game.triggerShake(3);
    } else if (this.y > maxY) {
      this.y = maxY;
      this.vy = -this.vy * WORLD.wallRestitution;
      audio.playBounce();
      game.triggerShake(3);
    }

    // Colisão com as traves e redes dos gols
    // LADO ESQUERDO (Gol Rivais ou Beiço)
    const inGoalYRange = (this.y >= WORLD.goalYTop - this.radius && this.y <= WORLD.goalYBottom + this.radius);

    if (inGoalYRange) {
      // Dentro da boca do gol esquerdo
      const goalLeftLimit = WORLD.courtLeft - WORLD.goalDepth + this.radius;
      if (this.x < goalLeftLimit) {
        this.x = goalLeftLimit;
        this.vx = -this.vx * 0.35; // Amortece na rede
      }
      // Fundo do gol esquerdo (teto/chão do gol)
      if (this.x < WORLD.courtLeft) {
        if (this.y < WORLD.goalYTop + this.radius) {
          this.y = WORLD.goalYTop + this.radius;
          this.vy = -this.vy * 0.5;
        } else if (this.y > WORLD.goalYBottom - this.radius) {
          this.y = WORLD.goalYBottom - this.radius;
          this.vy = -this.vy * 0.5;
        }
      }
    } else {
      // Parede Esquerda comum (fora do gol)
      if (this.x < minX) {
        this.x = minX;
        this.vx = -this.vx * WORLD.wallRestitution;
        audio.playBounce();
        game.triggerShake(3);
      }
    }

    // LADO DIREITO
    if (inGoalYRange) {
      // Dentro da boca do gol direito
      const goalRightLimit = WORLD.courtRight + WORLD.goalDepth - this.radius;
      if (this.x > goalRightLimit) {
        this.x = goalRightLimit;
        this.vx = -this.vx * 0.35; // Amortece na rede
      }
      // Teto/chão do gol direito
      if (this.x > WORLD.courtRight) {
        if (this.y < WORLD.goalYTop + this.radius) {
          this.y = WORLD.goalYTop + this.radius;
          this.vy = -this.vy * 0.5;
        } else if (this.y > WORLD.goalYBottom - this.radius) {
          this.y = WORLD.goalYBottom - this.radius;
          this.vy = -this.vy * 0.5;
        }
      }
    } else {
      // Parede Direita comum (fora do gol)
      if (this.x > maxX) {
        this.x = maxX;
        this.vx = -this.vx * WORLD.wallRestitution;
        audio.playBounce();
        game.triggerShake(3);
      }
    }

    // Colisão com as 4 traves metálicas (cantos dos gols)
    const posts = [
      { x: WORLD.courtLeft, y: WORLD.goalYTop },
      { x: WORLD.courtLeft, y: WORLD.goalYBottom },
      { x: WORLD.courtRight, y: WORLD.goalYTop },
      { x: WORLD.courtRight, y: WORLD.goalYBottom }
    ];

    for (const post of posts) {
      const dx = this.x - post.x;
      const dy = this.y - post.y;
      const dist = Math.hypot(dx, dy);
      const minDist = this.radius + WORLD.postRadius;

      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x = post.x + nx * minDist;
        this.y = post.y + ny * minDist;
        // Reflexão de velocidade
        const dot = this.vx * nx + this.vy * ny;
        this.vx = (this.vx - 2 * dot * nx) * 0.85;
        this.vy = (this.vy - 2 * dot * ny) * 0.85;
        audio.playPost();
        game.triggerShake(7);
      }
    }
  }

  draw(ctx) {
    // Sombra da bola no chão
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 4, this.radius * 1.1, this.radius * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Rastro de velocidade estilo arcade
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length; i++) {
        const tr = this.trail[i];
        const alpha = (1 - i / this.trail.length) * (this.isSuperShot ? 0.7 : 0.4);
        const radius = this.radius * (1 - i / (this.trail.length * 1.5));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.isSuperShot ? '#facc15' : '#ffffff';
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Desenho da Bola de Futebol de Rua (estilo couro costurado)
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Corpo da bola
    const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, this.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#e2e8f0');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Contorno
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Gomos pretos estilizados (futebol de rua)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (this.radius * 0.75), Math.sin(a) * (this.radius * 0.75), this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ====================================================================
// 5. CLASSE JOGADOR (CRIAS DA FAVELA & RIVAIS)
// ====================================================================
class Player {
  constructor(config) {
    this.name = config.name || 'Cria';
    this.team = config.team; // 'beico' ou 'rivais'
    this.isControlled = config.isControlled || false;
    this.controlId = config.controlId || 1; // 1 = P1 (WASD), 2 = P2 (SETAS)
    this.role = config.role || 'striker'; // 'striker', 'defender', 'goalkeeper'
    this.homeX = config.homeX;
    this.homeY = config.homeY;

    this.x = this.homeX;
    this.y = this.homeY;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = config.team === 'beico' ? 0 : Math.PI;
    this.radius = 16;
    this.speed = config.speed || 1.72; // Cadência mais lerda, controlada e precisa
    this.kickPowerMax = 7.8; // Chute calibrado com a nova velocidade da bola

    // Visual / Aparência
    this.skinTone = config.skinTone || '#8d5524';
    this.shirtColor = config.shirtColor || (config.team === 'beico' ? '#facc15' : '#ef4444');
    this.shortsColor = config.shortsColor || (config.team === 'beico' ? '#047857' : '#4338ca');
    this.hairStyle = config.hairStyle || 'afro'; // 'buzz', 'afro', 'blonde', 'cap', 'dreads'
    this.hairColor = config.hairColor || '#1c1917';
    this.number = config.number || '10';

    // Animações
    this.walkCycle = 0;
    this.kickAnimTimer = 0;
    this.kickCooldown = 0; // Cooldown de 1 segundo (60 frames)
    this.dribbleCooldown = 0;
    this.tackleCooldown = 0;

    // Chute Carregado e Condução
    this.isChargingKick = false;
    this.kickCharge = 0; // 0.0 a 1.0
    this.conductionTimer = 0;
  }

  reset() {
    this.x = this.homeX;
    this.y = this.homeY;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = this.team === 'beico' ? 0 : Math.PI;
    this.isChargingKick = false;
    this.kickCharge = 0;
    this.kickAnimTimer = 0;
    this.kickCooldown = 0;
    this.possessionTimer = 0;
    this.conductionTimer = 0;
  }

  update(inputKeys, ball, players, particles) {
    let moveX = 0;
    let moveY = 0;

    // 1. Controle Manual pelo Teclado com Suporte a Diagonais Fluidas
    if (this.isControlled) {
      const isSinglePlayer = (window.game && window.game.gameMode === '1P');
      if (this.controlId === 1) {
        // Player 1: W A S D (e também Setas se estiver jogando no modo 1 Jogador!)
        const up = !!(inputKeys['KeyW'] || inputKeys['w'] || inputKeys['W'] || (isSinglePlayer && (inputKeys['ArrowUp'] || inputKeys['arrowup'])));
        const down = !!(inputKeys['KeyS'] || inputKeys['s'] || inputKeys['S'] || (isSinglePlayer && (inputKeys['ArrowDown'] || inputKeys['arrowdown'])));
        const left = !!(inputKeys['KeyA'] || inputKeys['a'] || inputKeys['A'] || (isSinglePlayer && (inputKeys['ArrowLeft'] || inputKeys['arrowleft'])));
        const right = !!(inputKeys['KeyD'] || inputKeys['d'] || inputKeys['D'] || (isSinglePlayer && (inputKeys['ArrowRight'] || inputKeys['arrowright'])));

        // Suporte direto para teclas diagonais no teclado numérico (7, 9, 1, 3)
        if (inputKeys['Numpad7'] || inputKeys['Home']) { moveY -= 1; moveX -= 1; }
        else if (inputKeys['Numpad9'] || inputKeys['PageUp']) { moveY -= 1; moveX += 1; }
        else if (inputKeys['Numpad1'] || inputKeys['End']) { moveY += 1; moveX -= 1; }
        else if (inputKeys['Numpad3'] || inputKeys['PageDown']) { moveY += 1; moveX += 1; }
        else {
          if (up) moveY -= 1;
          if (down) moveY += 1;
          if (left) moveX -= 1;
          if (right) moveX += 1;
        }

        // Chute P1 (Espaço, ou Enter/X no modo 1P)
        const isKickDown = !!inputKeys['Space'] || (isSinglePlayer && (!!inputKeys['Enter'] || !!inputKeys['KeyX'] || !!inputKeys['x']));
        this.handleKickButton(isKickDown, ball, players, particles);

      } else if (this.controlId === 2) {
        // Player 2: Setas + Enter
        const up = !!(inputKeys['ArrowUp'] || inputKeys['arrowup']);
        const down = !!(inputKeys['ArrowDown'] || inputKeys['arrowdown']);
        const left = !!(inputKeys['ArrowLeft'] || inputKeys['arrowleft']);
        const right = !!(inputKeys['ArrowRight'] || inputKeys['arrowright']);

        if (inputKeys['Numpad7']) { moveY -= 1; moveX -= 1; }
        else if (inputKeys['Numpad9']) { moveY -= 1; moveX += 1; }
        else if (inputKeys['Numpad1']) { moveY += 1; moveX -= 1; }
        else if (inputKeys['Numpad3']) { moveY += 1; moveX += 1; }
        else {
          if (up) moveY -= 1;
          if (down) moveY += 1;
          if (left) moveX -= 1;
          if (right) moveX += 1;
        }

        // Chute P2 (Enter ou Numpad 0)
        const isKickDown = !!inputKeys['Enter'] || !!inputKeys['Numpad0'];
        this.handleKickButton(isKickDown, ball, players, particles);
      }
    } else {
      // 2. Inteligência Artificial (IA)
      const aiInput = this.computeAI(ball, players);
      moveX = aiInput.x;
      moveY = aiInput.y;
      if (aiInput.wantPass && aiInput.passTarget) {
        this.passTo(aiInput.passTarget, ball, particles);
      } else if (aiInput.wantKick) {
        this.executeInstantKick(ball, particles, aiInput.kickPower || 0.65);
      }
    }

    // Normalização e física de movimento diagonal
    const len = Math.hypot(moveX, moveY);
    if (len > 0) {
      moveX /= len;
      moveY /= len;
      this.facingAngle = Math.atan2(moveY, moveX);
      this.vx = moveX * this.speed;
      this.vy = moveY * this.speed;
      this.walkCycle += 0.11; // Animação cadenciada sincronizada com os passos

      // Soltar poeira do asfalto ao correr
      if (Math.random() < 0.22) {
        particles.addDust(this.x - moveX * 6, this.y + 12 - moveY * 3);
      }
    } else {
      this.vx *= 0.6;
      this.vy *= 0.6;
      this.walkCycle = 0;
    }

    // Movimentar jogador
    this.x += this.vx;
    this.y += this.vy;

    // Limites de quadra para jogadores
    this.x = Math.max(WORLD.courtLeft + this.radius, Math.min(WORLD.courtRight - this.radius, this.x));
    this.y = Math.max(WORLD.courtTop + this.radius, Math.min(WORLD.courtBottom - this.radius, this.y));

    // Decréscimo de cooldowns
    if (this.kickCooldown > 0) this.kickCooldown--;
    if (this.dribbleCooldown > 0) this.dribbleCooldown--;
    if (this.tackleCooldown > 0) this.tackleCooldown--;
    if (this.kickAnimTimer > 0) this.kickAnimTimer--;

    // Interação com a Bola (condução e empurrãozinho leve)
    this.handleBallContact(ball, particles);
  }

  // Lógica de segurar para carregar chute e pedir passe
  handleKickButton(isKeyDown, ball, players, particles) {
    if (this.kickCooldown > 0) {
      this.isChargingKick = false;
      this.kickCharge = 0;
      return;
    }

    const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
    const inBallRange = distToBall <= (this.radius + ball.radius + 24);

    if (isKeyDown) {
      if (inBallRange) {
        // Perto da bola: carrega o chute
        this.isChargingKick = true;
        this.kickCharge = Math.min(1.0, this.kickCharge + 0.035);
      } else {
        // Longe da bola apertou o botão: pede passe pro companheiro bot ("Toca pra mim!")
        const botTeammate = players && players.find(p => p.team === this.team && p !== this && !p.isControlled);
        if (botTeammate) {
          const distBot = Math.hypot(ball.x - botTeammate.x, ball.y - botTeammate.y);
          if (distBot < botTeammate.radius + ball.radius + 26) {
            botTeammate.passTo(this, ball, particles);
          }
        }
      }
    } else if (this.isChargingKick) {
      // Soltou o botão: dispara o chute!
      this.executeKick(ball, particles);
      this.isChargingKick = false;
      this.kickCharge = 0;
    }
  }

  executeKick(ball, particles) {
    if (this.kickCooldown > 0) return;
    const dist = Math.hypot(ball.x - this.x, ball.y - this.y);
    const kickRange = this.radius + ball.radius + 20;

    // Se estiver no alcance da bola
    if (dist <= kickRange) {
      const powerPct = Math.max(0.2, this.kickCharge);
      const minPower = 3.6;
      const maxPower = 9.8; // Bola mais rápida e potente
      const totalPower = minPower + powerPct * (maxPower - minPower);

      // Direção do chute: para onde o jogador está virado ou pro gol
      let angle = this.facingAngle;
      const targetGoalX = this.team === 'beico' ? WORLD.courtRight : WORLD.courtLeft;
      const targetGoalY = (WORLD.goalYTop + WORLD.goalYBottom) / 2;

      // Leve auxílio de mira arcade em direção ao gol adversário
      const angleToGoal = Math.atan2(targetGoalY - this.y, targetGoalX - this.x);
      // Pondera a direção do jogador e do gol
      angle = angle * 0.45 + angleToGoal * 0.55;

      ball.vx = Math.cos(angle) * totalPower;
      ball.vy = Math.sin(angle) * totalPower;
      ball.isSuperShot = (powerPct > 0.75);
      ball.lastTouchPlayer = this;

      this.kickAnimTimer = 14;
      this.kickCooldown = 60; // 1 segundo (60 frames) de intervalo para poder chutar de novo

      // Sons e Efeitos
      audio.playKick(powerPct);
      if (ball.isSuperShot) {
        game.triggerShake(7);
        particles.addSparks(ball.x, ball.y, ball.vx, ball.vy, 14);
      } else {
        particles.addSparks(ball.x, ball.y, ball.vx, ball.vy, 4);
      }
    }
  }

  executeInstantKick(ball, particles, power = 0.55) {
    if (this.kickCooldown > 0) return;
    const dist = Math.hypot(ball.x - this.x, ball.y - this.y);
    const kickRange = this.radius + ball.radius + 18;

    if (dist <= kickRange) {
      const targetGoalX = this.team === 'beico' ? WORLD.courtRight : WORLD.courtLeft;
      const targetGoalY = (WORLD.goalYTop + WORLD.goalYBottom) / 2 + (Math.random() * 60 - 30);
      const angle = Math.atan2(targetGoalY - this.y, targetGoalX - this.x);

      const minPower = 3.4;
      const maxPower = 7.8;
      const totalPower = minPower + power * (maxPower - minPower);

      ball.vx = Math.cos(angle) * totalPower;
      ball.vy = Math.sin(angle) * totalPower;
      ball.isSuperShot = (power > 0.85);
      ball.lastTouchPlayer = this;

      this.kickAnimTimer = 12;
      this.kickCooldown = 60; // 1 segundo de intervalo para poder chutar de novo
      audio.playKick(power);
      if (ball.isSuperShot) {
        game.triggerShake(5);
        particles.addSparks(ball.x, ball.y, ball.vx, ball.vy, 8);
      }
    }
  }

  // Passe direcionado inteligente do bot para o companheiro
  passTo(targetPlayer, ball, particles) {
    if (this.kickCooldown > 0) return;
    const dist = Math.hypot(ball.x - this.x, ball.y - this.y);
    const kickRange = this.radius + ball.radius + 24;

    if (dist <= kickRange) {
      // Calcular antecipação na direção de movimento do companheiro
      const leadX = targetPlayer.x + targetPlayer.vx * 7;
      const leadY = targetPlayer.y + targetPlayer.vy * 7;
      const angle = Math.atan2(leadY - this.y, leadX - this.x);
      const distToPartner = Math.hypot(leadX - this.x, leadY - this.y);

      // Força de passe calculada para chegar rápida e precisa nos pés
      const passPower = Math.min(6.8, Math.max(3.4, distToPartner * 0.012 + 2.8));

      ball.vx = Math.cos(angle) * passPower;
      ball.vy = Math.sin(angle) * passPower;
      ball.isSuperShot = false;
      ball.lastTouchPlayer = this;

      this.facingAngle = angle;
      this.kickAnimTimer = 12;
      this.kickCooldown = 60; // 1 segundo de intervalo

      audio.playKick(0.35);
      particles.addSparks(ball.x, ball.y, ball.vx, ball.vy, 4);
    }
  }

  // Condução da bola suave nos pés (drible arcade de rua controlado e dinâmico)
  handleBallContact(ball, particles) {
    // Se acabou de chutar a bola, não captura de volta imediatamente
    if (this.kickAnimTimer > 0) return;

    const dx = ball.x - this.x;
    const dy = ball.y - this.y;
    const dist = Math.hypot(dx, dy);
    const controlDist = this.radius + ball.radius + 14;

    if (dist < controlDist) {
      ball.lastTouchPlayer = this;

      const playerSpeed = Math.hypot(this.vx, this.vy);

      if (playerSpeed > 0.15) {
        // Condução limpa: a bola fica logo à frente do jogador na direção do movimento
        const leadDist = this.radius + ball.radius + 4;
        const targetX = this.x + Math.cos(this.facingAngle) * leadDist;
        const targetY = this.y + Math.sin(this.facingAngle) * leadDist;

        // Atração magnética suave para a frente dos pés, permitindo condução em velocidade
        const pullFactor = 0.26;
        ball.vx = ball.vx * 0.32 + (targetX - ball.x) * pullFactor + this.vx * 0.72;
        ball.vy = ball.vy * 0.32 + (targetY - ball.y) * pullFactor + this.vy * 0.72;

        // Drible de rua / caneta se estiver em velocidade com cooldown
        if (playerSpeed > 1.2 && this.dribbleCooldown <= 0) {
          this.dribbleCooldown = 120;
          audio.playDribble();
        }
      } else {
        // Jogador parado ou quase parado: amortece a bola suavemente
        ball.vx *= 0.55;
        ball.vy *= 0.55;
        const minDist = this.radius + ball.radius;
        if (dist < minDist) {
          const nx = Math.cos(this.facingAngle);
          const ny = Math.sin(this.facingAngle);
          ball.x = this.x + nx * minDist;
          ball.y = this.y + ny * minDist;
        }
      }
    }
  }

  // Comportamento Inteligente da IA: CONDUZ A BOLA, DRIBLA E CHUTA NO MOMENTO CERTO
  computeAI(ball, players) {
    const input = { x: 0, y: 0, wantKick: false, wantPass: false, passTarget: null, kickPower: 0.65 };

    const targetGoalX = this.team === 'beico' ? WORLD.courtRight : WORLD.courtLeft;
    const ownGoalX = this.team === 'beico' ? WORLD.courtLeft : WORLD.courtRight;
    const midGoalY = (WORLD.goalYTop + WORLD.goalYBottom) / 2;

    const distToBall = Math.hypot(ball.x - this.x, ball.y - this.y);
    const distToTargetGoal = Math.hypot(targetGoalX - this.x, midGoalY - this.y);
    const hasBall = (distToBall < this.radius + ball.radius + 16);

    // Companheiro de time
    const teammate = players && players.find(p => p.team === this.team && p !== this);
    const humanTeammate = teammate && teammate.isControlled ? teammate : null;

    // Encontrar adversário mais próximo para simular finta / drible
    let nearestOpponent = null;
    let minOppDist = 9999;
    if (players) {
      for (const p of players) {
        if (p.team !== this.team) {
          const d = Math.hypot(p.x - this.x, p.y - this.y);
          if (d < minOppDist) {
            minOppDist = d;
            nearestOpponent = p;
          }
        }
      }
    }

    if (hasBall) {
      this.conductionTimer = (this.conductionTimer || 0) + 1;
    } else {
      this.conductionTimer = 0;
    }

    // =================================================================
    // 1. QUANDO O BOT ESTÁ COM A BOLA: CONDUZ, FAZ FINTAS E NÃO SÓ CHUTA
    // =================================================================
    if (hasBall) {
      // Variação orgânica para drible de rua (fintas suaves e ondulação na condução)
      const weave = Math.sin(this.conductionTimer * 0.08) * 55;
      const targetY = Math.max(WORLD.courtTop + 70, Math.min(WORLD.courtBottom - 70, midGoalY + weave));

      // Vetor de corrida avançando com a bola em direção ao gol rival
      let moveDirX = targetGoalX - this.x;
      let moveDirY = targetY - this.y;

      // Finta de corpo / desvio lateral se o adversário estiver vindo de frente
      if (nearestOpponent && minOppDist < 85) {
        const oppDx = nearestOpponent.x - this.x;
        const isOppInFront = (this.team === 'beico' && oppDx > 0) || (this.team === 'rivais' && oppDx < 0);
        if (isOppInFront) {
          const dodgeSign = (this.y < nearestOpponent.y) ? -1 : 1;
          moveDirY += dodgeSign * 100;
        }
      }

      const moveLen = Math.hypot(moveDirX, moveDirY);
      if (moveLen > 5) {
        input.x = moveDirX / moveLen;
        input.y = moveDirY / moveLen;
      }

      // DECISÃO DO BOT COMPANHEIRO DO JOGADOR HUMANO (ex: Biel):
      if (humanTeammate) {
        // Biel conduz a bola avançando pelo campo (não toca instantaneamente)
        if (this.conductionTimer > 45 && this.kickCooldown <= 0) {
          // Se Biel estiver perto da área do gol, ele bate firme pro gol!
          if (distToTargetGoal < 260) {
            input.wantKick = true;
            input.kickPower = 0.85;
            this.conductionTimer = 0;
            return input;
          }
          // Caso contrário, faz o passe açucarado para o jogador humano
          input.wantPass = true;
          input.passTarget = humanTeammate;
          this.conductionTimer = 0;
          return input;
        }
        return input;
      }

      // DECISÃO DOS BOTS ADVERSÁRIOS / ATACANTE:
      if (this.role === 'striker') {
        // Conduz a bola para o ataque; só finaliza após conduzir (pelo menos 35 frames ~ 0.6s)
        const canShoot = (this.conductionTimer >= 35 && this.kickCooldown <= 0);

        if (canShoot) {
          // Finaliza se estiver no terço final (< 300px do gol) ou conduziu bastante tempo
          if (distToTargetGoal < 300 || this.conductionTimer > 80 || (minOppDist < 45 && distToTargetGoal < 450)) {
            input.wantKick = true;
            input.kickPower = distToTargetGoal < 260 ? 0.9 : 0.75;
            this.conductionTimer = 0;
            return input;
          }
        }
        return input;
      } else {
        // Defensor (Zika): quando desarma, conduz tirando da área antes de passar ou chutar
        if (this.conductionTimer > 35 && this.kickCooldown <= 0) {
          if (teammate) {
            input.wantPass = true;
            input.passTarget = teammate;
            this.conductionTimer = 0;
            return input;
          } else {
            input.wantKick = true;
            input.kickPower = 0.8;
            this.conductionTimer = 0;
            return input;
          }
        }
        return input;
      }
    }

    // =================================================================
    // 2. QUANDO O BOT NÃO ESTÁ COM A BOLA: BUSCA E POSICIONAMENTO
    // =================================================================
    if (this.role === 'striker') {
      // Atacante corre em direção à bola para dominar e conduzir
      const dx = ball.x - this.x;
      const dy = ball.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        input.x = dx / dist;
        input.y = dy / dist;
      }

      // Rebote imediato apenas se a bola estiver solta na pequena área (< 140px)
      if (distToBall < this.radius + ball.radius + 12 && distToTargetGoal < 140 && this.kickCooldown <= 0) {
        input.wantKick = true;
        input.kickPower = 0.95;
      }
    } else {
      // Defensor / Goleiro da linha
      const guardX = ownGoalX + (this.team === 'beico' ? 140 : -140);
      const guardY = Math.max(WORLD.goalYTop - 20, Math.min(WORLD.goalYBottom + 20, ball.y));

      const ballInDefense = (this.team === 'beico' && ball.x < WORLD.courtLeft + 380) ||
                            (this.team === 'rivais' && ball.x > WORLD.courtRight - 380);

      if (ballInDefense || distToBall < 190) {
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          input.x = dx / dist;
          input.y = dy / dist;
        }
      } else {
        // Posicionamento defensivo protegendo o gol
        const dx = guardX - this.x;
        const dy = guardY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10) {
          input.x = dx / dist;
          input.y = dy / dist;
        }
      }
    }

    return input;
  }

  draw(ctx) {
    const speed = Math.hypot(this.vx, this.vy);
    const isMoving = speed > 0.12;
    const cosA = Math.cos(this.facingAngle);
    const sinA = Math.sin(this.facingAngle);

    // Determinar orientação visual do boneco
    const isFacingLeft = cosA < -0.15;
    const isFacingUp = sinA < -0.3; // Costas do jogador (subindo a quadra na diagonal/reto)
    const isDiagonal = Math.abs(cosA) > 0.35 && Math.abs(sinA) > 0.35;

    // 1. Sombra do Jogador (estica e inclina dinamicamente com a corrida)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    const shadowW = this.radius * (1.05 + (isMoving ? 0.18 : 0));
    const shadowH = this.radius * 0.48;
    const shadowTilt = isMoving ? cosA * 0.15 : 0;
    ctx.ellipse(this.x, this.y + 12, shadowW, shadowH, shadowTilt, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Anel de Destaque para Jogador Controlado
    if (this.isControlled) {
      ctx.save();
      const ringColor = this.controlId === 1 ? '#facc15' : '#ef4444';
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y + 6, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();

      // Indicador de seta acima do jogador
      ctx.fillStyle = ringColor;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 34);
      ctx.lineTo(this.x - 6, this.y - 42);
      ctx.lineTo(this.x + 6, this.y - 42);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 3. Desenho do Personagem Estilizado com Rotação/Inclinação Diagonal
    ctx.save();
    ctx.translate(this.x, this.y);

    // Inclinação de corrida na direção do movimento (lean)
    if (isMoving) {
      const lean = (isFacingLeft ? -1 : 1) * Math.min(0.18, speed * 0.08) + (isFacingUp ? -0.05 : 0.05);
      ctx.rotate(lean);
    }

    // Se estiver virado para a esquerda, espelha no eixo X para dar a direção correta
    if (isFacingLeft) {
      ctx.scale(-1, 1);
    }

    // Balanço de corrida
    const legOffset = Math.sin(this.walkCycle) * 6;
    const isKicking = this.kickAnimTimer > 0;

    // Pernas / Tênis de rua
    ctx.fillStyle = this.skinTone;
    // Perna esquerda (traseira)
    ctx.fillRect(-8, 2 - legOffset * 0.4, 5, 12);
    // Perna direita (dianteira)
    ctx.fillRect(3, 2 + legOffset * 0.4 + (isKicking ? -4 : 0), 5, 12);

    // Tênis (All Star / Chuteira de Futsal)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, 12 - legOffset * 0.4, 7, 5);
    ctx.fillRect(3, 12 + legOffset * 0.4 + (isKicking ? -4 : 0), 7, 5);
    // Detalhe de sola/faixa vermelha no tênis
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-9, 15 - legOffset * 0.4, 6, 2);
    ctx.fillRect(4, 15 + legOffset * 0.4 + (isKicking ? -4 : 0), 6, 2);

    // Bermuda Jeans ou Calção de Time
    ctx.fillStyle = this.shortsColor;
    ctx.fillRect(-9, -2, 18, 10);

    // Camiseta / Regata
    ctx.fillStyle = this.shirtColor;
    ctx.beginPath();
    ctx.roundRect(-10, -18, 20, 18, [4, 4, 0, 0]);
    ctx.fill();

    // Faixa esportiva lateral na camisa
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-10, -18, 3, 18);

    // Número da camisa
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Outfit';
    ctx.textAlign = 'center';
    if (isFacingUp) {
      // Costas
      ctx.fillText(this.number, 0, -8);
    } else {
      // Frente / Peito
      ctx.fillText(this.number, 2, -8);
    }

    // Cabeça
    ctx.fillStyle = this.skinTone;
    ctx.beginPath();
    ctx.arc(0, -24, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Rosto (olhos focados de cria e sorriso) quando de frente/diagonal
    if (!isFacingUp) {
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(2, -26, 2, 2.5);
      if (!isDiagonal) {
        ctx.fillRect(-3, -26, 2, 2.5);
      }
      ctx.strokeStyle = '#5c3826';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(2, -22, 2, 0.2, Math.PI * 0.8);
      ctx.stroke();
    }

    // Cabelo / Boné do Cria (orientado na diagonal)
    this.drawHair(ctx, isFacingUp, isDiagonal);

    ctx.restore();

    // 4. Nome do Jogador em Cima
    ctx.save();
    ctx.font = 'bold 10px Outfit';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.name, this.x, this.y - 24 - 18);
    ctx.restore();
  }

  drawHair(ctx, isFacingUp = false, isDiagonal = false) {
    ctx.fillStyle = this.hairColor;
    if (this.hairStyle === 'afro') {
      ctx.beginPath();
      ctx.arc(0, -28, 8.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.hairStyle === 'blonde') {
      // Corte Nevou (Loirinho pivete)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -27, 8, Math.PI, Math.PI * 2);
      ctx.fill();
      if (!isFacingUp) {
        ctx.fillRect(0, -27, 6, 2.5);
      }
    } else if (this.hairStyle === 'cap') {
      // Boné virado na diagonal com estilo de cria!
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -27, 8, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      if (isFacingUp) {
        // Visto de costas: aba virada pra trás
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(-9, -26, 6, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-2, -25, 4, 2); // Fecho snapback
      } else {
        // Visto de frente/diagonal: Aba estilizada na diagonal de cria
        ctx.fillStyle = '#b91c1c';
        ctx.save();
        ctx.translate(4, -26);
        ctx.rotate(isDiagonal ? 0.35 : 0.15); // Aba na diagonal
        ctx.fillRect(0, -1, 7, 3.5);
        ctx.restore();
      }
    } else if (this.hairStyle === 'dreads') {
      // Dreads estilizados
      ctx.beginPath();
      ctx.arc(0, -27, 8, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-7, -26, 3, 8);
      ctx.fillRect(4, -26, 3, 8);
      if (isFacingUp) {
        ctx.fillRect(-2, -26, 3, 9);
      }
    } else {
      // Cabelo raspado / buzz
      ctx.beginPath();
      ctx.arc(0, -26, 8, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
    }
  }
}

// ====================================================================
// 6. MOTOR DO CENÁRIO DA FAVELA (QUADRA, CASAS, GRAFITES, VARAL)
// ====================================================================
// ====================================================================
// 6. MOTOR DO CENÁRIO DA FAVELA DE DIA (QUADRA CERCADA DE FAVELA)
// ====================================================================
class FavelaScenery {
  constructor() {
    this.windTime = 0;
    this.smokeTime = 0;

    // Torcida animada distribuída pelas lajes, sacadas e calçadas ao redor de toda a quadra
    this.fans = [
      // Fundo - Lajes Superiores
      { x: -80, y: 125, color: '#facc15', hair: '#111', bobSpeed: 3.4, jump: 0 },
      { x: 30, y: 130, color: '#ef4444', hair: '#fef08a', bobSpeed: 4.1, jump: 0 },
      { x: 160, y: 125, color: '#10b981', hair: '#111', bobSpeed: 3.2, jump: 0 },
      { x: 230, y: 120, color: '#facc15', hair: '#fef08a', bobSpeed: 4.3, jump: 0 },
      { x: 340, y: 132, color: '#3b82f6', hair: '#38bdf8', bobSpeed: 2.9, jump: 0 },
      { x: 440, y: 124, color: '#ec4899', hair: '#111', bobSpeed: 3.7, jump: 0 },
      { x: 520, y: 118, color: '#f59e0b', hair: '#fef08a', bobSpeed: 4.0, jump: 0 },
      { x: 620, y: 126, color: '#8b5cf6', hair: '#111', bobSpeed: 3.5, jump: 0 },
      { x: 740, y: 122, color: '#ef4444', hair: '#fff', bobSpeed: 4.4, jump: 0 },
      { x: 840, y: 128, color: '#facc15', hair: '#111', bobSpeed: 3.1, jump: 0 },
      { x: 940, y: 122, color: '#38bdf8', hair: '#fef08a', bobSpeed: 3.8, jump: 0 },
      { x: 1040, y: 126, color: '#10b981', hair: '#111', bobSpeed: 4.2, jump: 0 },
      { x: 1130, y: 120, color: '#f97316', hair: '#fef08a', bobSpeed: 3.6, jump: 0 },
      { x: 1260, y: 128, color: '#ec4899', hair: '#111', bobSpeed: 4.1, jump: 0 },
      { x: 1380, y: 124, color: '#facc15', hair: '#fef08a', bobSpeed: 3.3, jump: 0 },

      // Lado Esquerdo - Sacadas e Escadão
      { x: 35, y: 230, color: '#10b981', hair: '#111', bobSpeed: 3.2, jump: 0 },
      { x: 80, y: 270, color: '#facc15', hair: '#38bdf8', bobSpeed: 4.1, jump: 0 },
      { x: 45, y: 410, color: '#ef4444', hair: '#fef08a', bobSpeed: 3.5, jump: 0 },
      { x: 85, y: 560, color: '#38bdf8', hair: '#111', bobSpeed: 4.0, jump: 0 },

      // Lado Direito - Lajes e Viela
      { x: 1215, y: 230, color: '#38bdf8', hair: '#fef08a', bobSpeed: 3.7, jump: 0 },
      { x: 1265, y: 280, color: '#ec4899', hair: '#111', bobSpeed: 3.0, jump: 0 },
      { x: 1220, y: 420, color: '#facc15', hair: '#111', bobSpeed: 4.3, jump: 0 },
      { x: 1260, y: 570, color: '#10b981', hair: '#fef08a', bobSpeed: 3.6, jump: 0 },

      // Calçada Inferior - Espectadores apoiados na mureta
      { x: 210, y: 702, color: '#facc15', hair: '#111', bobSpeed: 2.8, jump: 0 },
      { x: 410, y: 704, color: '#ef4444', hair: '#fef08a', bobSpeed: 3.4, jump: 0 },
      { x: 610, y: 702, color: '#38bdf8', hair: '#111', bobSpeed: 3.2, jump: 0 },
      { x: 830, y: 703, color: '#10b981', hair: '#111', bobSpeed: 3.9, jump: 0 },
      { x: 1050, y: 702, color: '#f59e0b', hair: '#fef08a', bobSpeed: 3.5, jump: 0 }
    ];
  }

  update() {
    this.windTime += 0.04;
    this.smokeTime += 0.05;
    for (const fan of this.fans) {
      fan.jump = Math.sin(this.windTime * fan.bobSpeed) * 3;
    }
  }

  draw(ctx, width, height) {
    // 1. Céu Tropical Panorâmico de Dia Ensolarado com Sol, Nuvens e Pipas
    this.drawSkyAndSun(ctx);

    // 2. Morro Denso ao Fundo com Centenas de Casinhas de Favela, Vegetação e Bandeira
    this.drawFarHill(ctx);

    // 3. Casas de Tijolo e Lajes no Meio-Cenário (Fundo da Quadra)
    this.drawMidHouses(ctx);

    // 4. Fios de Poste com Tênis Pendurados e Roupas no Varal ao Vento
    this.drawWiresAndLaundry(ctx);

    // 5. Torcida nas Lajes e Sacadas
    this.drawCrowd(ctx);

    // 6. Muro dos Fundos com Grafites e Alambrado de Proteção
    this.drawGraffitiWall(ctx);

    // 7. Quadra de Cimento Iluminada de Dia
    this.drawCourt(ctx);

    // 8. LADO ESQUERDO DA QUADRA (Casas, Boteco com toldo, Churrasqueira com fumaça, Escadão)
    this.drawLeftSideFavela(ctx);

    // 9. LADO DIREITO DA QUADRA (Casas, Viela dos Crias, Motos estacionadas, Paredão de Som)
    this.drawRightSideFavela(ctx);

    // 10. PARTE INFERIOR (Calçada completa, Cadeiras de boteco, Isopor, Vira-lata Caramelo, Bike, Carrinho de picolé)
    this.drawBottomFavela(ctx);

    // 11. Traves e Redes dos Gols
    this.drawGoals(ctx);
  }

  drawSkyAndSun(ctx) {
    ctx.save();
    const minX = -600;
    const maxX = 1900;
    const minY = -400;
    const topY = WORLD.courtTop;
    const fullW = maxX - minX;

    // Céu azul tropical vibrante cobrindo toda a extensão panorâmica
    const skyGrad = ctx.createLinearGradient(0, minY, 0, topY);
    skyGrad.addColorStop(0, '#0284c7');   // Azul celeste profundo
    skyGrad.addColorStop(0.55, '#38bdf8'); // Azul céu vibrante
    skyGrad.addColorStop(1, '#bae6fd');   // Haze claro do horizonte ensolarado
    ctx.fillStyle = skyGrad;
    ctx.fillRect(minX, minY, fullW, topY - minY);

    // Sol Brilhante de Meio-Dia Tropical
    const sunX = 960;
    const sunY = 55;

    // Raios suaves do sol girando suavemente
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 + this.windTime * 0.05;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(a) * 36, sunY + Math.sin(a) * 36);
      ctx.lineTo(sunX + Math.cos(a) * 80, sunY + Math.sin(a) * 80);
      ctx.stroke();
    }

    // Brilho e núcleo do Sol
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 70);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fef08a');
    sunGrad.addColorStop(0.7, 'rgba(250, 204, 21, 0.38)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Nuvens Brancas de Verão Deslizando
    this.drawCloud(ctx, ((-200 + this.windTime * 5) % (fullW + 300)) + minX, 40, 56);
    this.drawCloud(ctx, ((180 + this.windTime * 4.2) % (fullW + 300)) + minX, 55, 64);
    this.drawCloud(ctx, ((620 + this.windTime * 3.8) % (fullW + 300)) + minX, 35, 58);
    this.drawCloud(ctx, ((1080 + this.windTime * 4.5) % (fullW + 300)) + minX, 60, 68);
    this.drawCloud(ctx, ((1520 + this.windTime * 3.5) % (fullW + 300)) + minX, 42, 54);

    // Pipas de Combate no Céu (clássico do céu da quebrada)
    this.drawKite(ctx, 180, 48 + Math.sin(this.windTime * 2.2) * 8, '#facc15', '#10b981');
    this.drawKite(ctx, 420, 36 + Math.sin(this.windTime * 1.9 + 1) * 7, '#ef4444', '#facc15');
    this.drawKite(ctx, 780, 42 + Math.sin(this.windTime * 2.1 + 2) * 9, '#0284c7', '#ffffff');
    this.drawKite(ctx, 1180, 34 + Math.sin(this.windTime * 1.8 + 3) * 6, '#ec4899', '#fef08a');

    ctx.restore();
  }

  drawCloud(ctx, x, y, size) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.35, y - size * 0.16, size * 0.42, 0, Math.PI * 2);
    ctx.arc(x + size * 0.72, y, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawKite(ctx, x, y, color1, color2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(this.windTime * 2) * 0.15);

    // Losango da Pipa
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 15);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();

    // Faixa central contrastante
    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(0, 5);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, -5);
    ctx.closePath();
    ctx.fill();

    // Vareta central e envergação
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(0, 15);
    ctx.stroke();

    // Rabiola ondulando ao vento
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    for (let i = 1; i <= 6; i++) {
      const rx = Math.sin(this.windTime * 4 + i) * 7;
      const ry = 15 + i * 9;
      ctx.lineTo(rx, ry);
    }
    ctx.stroke();

    // Lacinhos coloridos da rabiola
    const laceColors = [color1, color2, '#ffffff'];
    for (let i = 1; i <= 5; i++) {
      const rx = Math.sin(this.windTime * 4 + i) * 7;
      const ry = 15 + i * 9;
      ctx.fillStyle = laceColors[i % laceColors.length];
      ctx.fillRect(rx - 3, ry - 1, 6, 2.5);
    }

    ctx.restore();
  }

  drawFarHill(ctx) {
    ctx.save();
    const minX = -600;
    const maxX = 1900;

    // 1. Morros distantes de Mata Atlântica (verde profundo)
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(minX, 160);
    ctx.bezierCurveTo(-200, 50, 400, 30, 1000, 70);
    ctx.bezierCurveTo(1350, 95, 1650, 45, maxX, 110);
    ctx.lineTo(maxX, WORLD.courtTop);
    ctx.lineTo(minX, WORLD.courtTop);
    ctx.closePath();
    ctx.fill();

    // 2. Camada intermediária de morro mais próxima
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(minX, 165);
    ctx.bezierCurveTo(-150, 80, 350, 55, 850, 95);
    ctx.bezierCurveTo(1200, 120, 1600, 75, maxX, 135);
    ctx.lineTo(maxX, WORLD.courtTop);
    ctx.lineTo(minX, WORLD.courtTop);
    ctx.closePath();
    ctx.fill();

    // Manchas de vegetação tropical e rochas
    ctx.fillStyle = '#166534';
    for (let rx = -500; rx <= 1800; rx += 180) {
      ctx.beginPath();
      ctx.arc(rx, 90 + Math.sin(rx * 0.01) * 20, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Comunidade de Favela Gigante: mais de 160 casinhas empilhadas no morro
    const houseColors = ['#ea580c', '#c2410c', '#d97706', '#9a3412', '#cbd5e1', '#b45309', '#e2e8f0', '#78350f'];
    for (let i = 0; i < 165; i++) {
      const hx = -520 + i * 14 + (i % 5) * 3;
      const hy = 62 + Math.sin(i * 0.35) * 30 + (i % 3) * 16;
      const color = houseColors[i % houseColors.length];

      // Casinha de tijolo baiano/reboco
      ctx.fillStyle = color;
      ctx.fillRect(hx, hy, 16, 17);

      // Telhado de amianto cinza
      ctx.fillStyle = '#64748b';
      ctx.fillRect(hx - 1, hy - 2, 18, 3.5);

      // Caixa d'água azul Fortlev miniatura
      if (i % 2 === 0) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(hx + 3, hy - 7, 7, 5);
      }

      // Janelinha com luz/sombra
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(hx + 4, hy + 5, 3.5, 4.5);
    }

    // Bandeira do Brasil tremulando em um mastro alto no topo da favela
    const flagPoleX = 480;
    const flagPoleY = 40;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(flagPoleX, flagPoleY + 45);
    ctx.lineTo(flagPoleX, flagPoleY);
    ctx.stroke();

    // Bandeira verde, amarela e azul
    const wave = Math.sin(this.windTime * 4) * 3;
    ctx.fillStyle = '#15803d'; // Verde
    ctx.beginPath();
    ctx.moveTo(flagPoleX, flagPoleY);
    ctx.lineTo(flagPoleX + 24, flagPoleY + wave);
    ctx.lineTo(flagPoleX + 24, flagPoleY + 15 + wave);
    ctx.lineTo(flagPoleX, flagPoleY + 15);
    ctx.closePath();
    ctx.fill();

    // Losango amarelo
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(flagPoleX + 4, flagPoleY + 7.5 + wave * 0.3);
    ctx.lineTo(flagPoleX + 12, flagPoleY + 2 + wave * 0.5);
    ctx.lineTo(flagPoleX + 20, flagPoleY + 7.5 + wave * 0.8);
    ctx.lineTo(flagPoleX + 12, flagPoleY + 13 + wave * 0.5);
    ctx.closePath();
    ctx.fill();

    // Círculo azul
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(flagPoleX + 12, flagPoleY + 7.5 + wave * 0.5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawMidHouses(ctx) {
    ctx.save();
    // Casas de Tijolo Baiano, Concreto e Lajes Grandes em toda a extensão do fundo da quadra
    const houses = [
      { x: -520, w: 135, h: 98, color: '#c2410c', tank: true },
      { x: -375, w: 140, h: 105, color: '#ea580c', tank: true },
      { x: -225, w: 125, h: 90, color: '#9a3412', tank: false },
      { x: -90, w: 130, h: 110, color: '#b45309', tank: true },
      { x: 50, w: 140, h: 102, color: '#ea580c', tank: true },
      { x: 200, w: 125, h: 92, color: '#c2410c', tank: false },
      { x: 335, w: 145, h: 112, color: '#b45309', tank: true },
      { x: 490, w: 130, h: 95, color: '#ea580c', tank: false },
      { x: 630, w: 150, h: 108, color: '#c2410c', tank: true },
      { x: 790, w: 135, h: 94, color: '#9a3412', tank: false },
      { x: 935, w: 150, h: 115, color: '#ea580c', tank: true },
      { x: 1095, w: 140, h: 100, color: '#b45309', tank: true },
      { x: 1245, w: 135, h: 96, color: '#c2410c', tank: false },
      { x: 1390, w: 145, h: 106, color: '#ea580c', tank: true },
      { x: 1545, w: 140, h: 98, color: '#b45309', tank: true },
      { x: 1695, w: 150, h: 110, color: '#9a3412', tank: false }
    ];

    for (const h of houses) {
      const topY = WORLD.courtTop - h.h;

      // Paredes de tijolo com textura
      ctx.fillStyle = h.color;
      ctx.fillRect(h.x, topY, h.w, h.h);

      // Vigas e pilares de concreto cinza
      ctx.fillStyle = '#78716c';
      ctx.fillRect(h.x + 6, topY - 14, 8, 14);
      ctx.fillRect(h.x + h.w - 14, topY - 14, 8, 14);

      // Ferros da laje expostos (vergalhões de espera)
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(h.x + 9, topY - 14);
      ctx.lineTo(h.x + 9, topY - 26);
      ctx.moveTo(h.x + h.w - 11, topY - 14);
      ctx.lineTo(h.x + h.w - 11, topY - 26);
      ctx.stroke();

      // Caixa d'água azul Fortlev com tampa
      if (h.tank) {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(h.x + h.w / 2 - 16, topY - 21, 32, 21, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(h.x + h.w / 2 - 18, topY - 24, 36, 4); // Tampa
      }

      // Janelas de alumínio com cortinas coloridas
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(h.x + 16, topY + 22, 22, 26);
      ctx.fillRect(h.x + h.w - 38, topY + 22, 22, 26);
      // Cortinas coloridas
      ctx.fillStyle = (h.x % 2 === 0) ? '#facc15' : '#ef4444';
      ctx.fillRect(h.x + 16, topY + 22, 8, 26);
    }
    ctx.restore();
  }

  drawWiresAndLaundry(ctx) {
    ctx.save();
    // Emaranhado clássico de fiação elétrica de alta e baixa tensão
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1.7;

    ctx.beginPath();
    ctx.moveTo(-600, 50);
    ctx.bezierCurveTo(-150, 110, 450, 115, 1050, 65);
    ctx.bezierCurveTo(1350, 40, 1650, 90, 1900, 60);

    ctx.moveTo(-600, 80);
    ctx.bezierCurveTo(-100, 140, 520, 135, 1120, 85);
    ctx.bezierCurveTo(1400, 60, 1700, 110, 1900, 85);

    ctx.moveTo(180, 80);
    ctx.lineTo(420, 160);
    ctx.moveTo(750, 85);
    ctx.lineTo(1020, 165);
    ctx.stroke();

    // O CLÁSSICO TÊNIS AMARRADO NO FIO DE ALTA TENSÃO (Ícone da favela brasileira)
    this.drawHangingSneakers(ctx, 360, 108);
    this.drawHangingSneakers(ctx, 890, 104);

    // Roupas no Varal Fluttering ao Vento nas Lajes
    const clothes = [
      { x: -140, y: 122, color: '#facc15', w: 14, h: 18 },
      { x: -115, y: 124, color: '#ffffff', w: 13, h: 20 },
      { x: 90, y: 122, color: '#10b981', w: 15, h: 18 },
      { x: 115, y: 124, color: '#ffffff', w: 13, h: 22 },
      { x: 270, y: 122, color: '#facc15', w: 14, h: 18 },
      { x: 295, y: 123, color: '#ffffff', w: 12, h: 20 },
      { x: 318, y: 124, color: '#ef4444', w: 16, h: 16 },
      { x: 670, y: 122, color: '#10b981', w: 15, h: 18 },
      { x: 695, y: 124, color: '#ffffff', w: 13, h: 22 },
      { x: 720, y: 121, color: '#38bdf8', w: 15, h: 17 },
      { x: 885, y: 123, color: '#f43f5e', w: 14, h: 18 },
      { x: 1150, y: 122, color: '#facc15', w: 14, h: 18 },
      { x: 1175, y: 124, color: '#38bdf8', w: 15, h: 20 }
    ];

    for (const c of clothes) {
      const flutter = Math.sin(this.windTime * 4 + c.x) * 4;
      ctx.fillStyle = c.color;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(flutter * 0.05);
      ctx.fillRect(-c.w / 2, 0, c.w, c.h);
      ctx.restore();
    }
    ctx.restore();
  }

  drawHangingSneakers(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const swing = Math.sin(this.windTime * 2.5 + x) * 0.08;
    ctx.rotate(swing);

    // Cadarço pendurado no fio
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-4, 14);
    ctx.moveTo(0, 0);
    ctx.lineTo(4, 18);
    ctx.stroke();

    // Tênis 1 (esquerdo)
    ctx.fillStyle = '#dc2626'; // Vermelho clássico All Star
    ctx.fillRect(-9, 14, 9, 6);
    ctx.fillStyle = '#ffffff'; // Biqueira branca
    ctx.fillRect(-10, 17, 3, 3);
    ctx.fillRect(-9, 19, 9, 2);

    // Tênis 2 (direito)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(1, 18, 9, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 21, 3, 3);
    ctx.fillRect(1, 23, 9, 2);

    ctx.restore();
  }

  drawCrowd(ctx) {
    ctx.save();
    for (const fan of this.fans) {
      const fy = fan.y + fan.jump;
      // Corpo
      ctx.fillStyle = fan.color;
      ctx.fillRect(fan.x - 6, fy + 8, 12, 16);
      // Cabeça
      ctx.fillStyle = '#8d5524';
      ctx.beginPath();
      ctx.arc(fan.x, fy, 6, 0, Math.PI * 2);
      ctx.fill();
      // Cabelo ou boné
      ctx.fillStyle = fan.hair;
      ctx.beginPath();
      ctx.arc(fan.x, fy - 2, 6, Math.PI, Math.PI * 2);
      ctx.fill();
      // Braços vibrando e comemorando
      ctx.strokeStyle = fan.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fan.x - 6, fy + 12);
      ctx.lineTo(fan.x - 12, fy + 4 + fan.jump * 1.5);
      ctx.moveTo(fan.x + 6, fy + 12);
      ctx.lineTo(fan.x + 12, fy + 4 - fan.jump * 1.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGraffitiWall(ctx) {
    ctx.save();
    const wallY = WORLD.courtTop - 36;
    const wallH = 36;
    const startX = WORLD.courtLeft - 40;
    const endX = WORLD.courtRight + 40;
    const wallW = endX - startX;

    // Muro de Concreto do Fundo
    ctx.fillStyle = '#334155';
    ctx.fillRect(startX, wallY, wallW, wallH);

    // Grafites de Rua Estilizados
    ctx.font = 'bold 16px "Permanent Marker", cursive';
    ctx.fillStyle = '#facc15';
    ctx.fillText('É O BEIÇO ⚡', 220, wallY + 24);

    ctx.fillStyle = '#ff0055';
    ctx.fillText('FAVELA VENCE!', 500, wallY + 24);

    ctx.fillStyle = '#10b981';
    ctx.fillText('RUA 10 ⚽', 820, wallY + 24);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SÓ OS CRIA', 990, wallY + 24);

    // Alambrado / Grade Metálica de Proteção
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    for (let x = startX; x <= endX; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, wallY);
      ctx.lineTo(x, wallY - 18);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(startX, wallY - 18);
    ctx.lineTo(endX, wallY - 18);
    ctx.stroke();

    ctx.restore();
  }

  // ====================================================================
  // LADO ESQUERDO DA QUADRA (Casas empilhadas, Boteco com toldo, Churrasqueira com fumaça, Escadão)
  // ====================================================================
  drawLeftSideFavela(ctx) {
    ctx.save();
    const leftW = WORLD.courtLeft; // 120px de largura lateral

    // Casas empilhadas de tijolo e concreto subindo à esquerda (estende até -600)
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(-600, 160, 600 + leftW, 530);

    // Fachadas de casas adjacentes com cores variadas
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-450, 160, 220, 530);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(-220, 160, 210, 530);

    // Divisórias de andares e lajes de concreto
    ctx.fillStyle = '#78716c';
    ctx.fillRect(-600, 310, 600 + leftW, 12);
    ctx.fillRect(-600, 480, 600 + leftW, 12);

    // Janelas com grades em todos os andares
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(18, 200, 35, 45);
    ctx.fillRect(68, 200, 35, 45);
    ctx.fillRect(18, 340, 35, 45);
    ctx.fillRect(68, 340, 35, 45);

    // Caixas d'água no topo esquerdo
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(25, 138, 44, 22);
    ctx.fillRect(-120, 138, 42, 22);

    // BOTECO DA ESQUINA (com toldo listrado vermelho e amarelo)
    const botecoY = 500;
    const stripes = ['#ef4444', '#facc15', '#ef4444', '#facc15', '#ef4444', '#facc15', '#ef4444', '#facc15'];
    for (let i = 0; i < stripes.length; i++) {
      ctx.fillStyle = stripes[i];
      ctx.fillRect(i * 15 - 10, botecoY, 15, 24);
    }

    // Balcão de madeira do Boteco
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, botecoY + 24, 105, 30);
    // Letreiro do Boteco
    ctx.font = 'bold 10px Outfit';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('BOTECO DO ZÉ', 12, botecoY + 42);

    // Engradados de cerveja amarelos e vermelhos empilhados
    ctx.fillStyle = '#facc15';
    ctx.fillRect(10, botecoY + 54, 24, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(36, botecoY + 54, 24, 16);

    // CHURRASQUEIRA DE LATÃO NA CALÇADA SOLTANDO FUMACINHA
    const grillX = 82;
    const grillY = botecoY + 50;

    // Tambor de ferro
    ctx.fillStyle = '#18181b';
    ctx.fillRect(grillX, grillY, 24, 18);
    // Pés de ferro
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(grillX + 3, grillY + 18);
    ctx.lineTo(grillX - 1, grillY + 28);
    ctx.moveTo(grillX + 21, grillY + 18);
    ctx.lineTo(grillX + 25, grillY + 28);
    ctx.stroke();

    // Brasas vermelhas e espetinhos assando
    ctx.fillStyle = '#f97316';
    ctx.fillRect(grillX + 2, grillY + 1, 20, 3);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(grillX + 4, grillY - 2, 16, 2.5); // Espetinho

    // Fumaça cinza suave subindo proceduralmente da churrasqueira
    ctx.save();
    for (let p = 0; p < 4; p++) {
      const prog = (this.smokeTime * 0.8 + p * 0.25) % 1.0;
      const smX = grillX + 12 + Math.sin(this.smokeTime * 3 + p) * (prog * 18);
      const smY = grillY - (prog * 45);
      const smR = 4 + prog * 10;
      const alpha = (1.0 - prog) * 0.35;
      ctx.fillStyle = `rgba(220, 225, 235, ${alpha})`;
      ctx.beginPath();
      ctx.arc(smX, smY, smR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Escadão da favela subindo à esquerda com degraus pintados
    const stepColors = ['#0284c7', '#facc15', '#ef4444', '#10b981', '#f97316', '#8b5cf6'];
    for (let s = 0; s < 6; s++) {
      ctx.fillStyle = stepColors[s % stepColors.length];
      ctx.fillRect(4, 610 + s * 10, 65 - s * 5, 8);
    }

    // Grafite vertical na parede esquerda
    ctx.font = 'bold 15px "Permanent Marker", cursive';
    ctx.fillStyle = '#facc15';
    ctx.save();
    ctx.translate(108, 420);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('BEIÇO 10 ⚡', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  // ====================================================================
  // LADO DIREITO DA QUADRA (Casas, Viela dos Crias, Motos estacionadas, Paredão de Som)
  // ====================================================================
  drawRightSideFavela(ctx) {
    ctx.save();
    const rightX = WORLD.courtRight; // 1180px
    const rightW = WORLD.width - rightX; // 120px

    // Edificações de tijolo e reboco à direita (estendendo até 1900)
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(rightX, 160, 800, 530);

    ctx.fillStyle = '#c2410c';
    ctx.fillRect(rightX + 160, 160, 260, 530);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(rightX + 430, 160, 300, 530);

    // Lajes intermediárias de concreto
    ctx.fillStyle = '#78716c';
    ctx.fillRect(rightX, 300, 800, 12);
    ctx.fillRect(rightX, 470, 800, 12);

    // Janelas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(rightX + 15, 200, 35, 45);
    ctx.fillRect(rightX + 65, 200, 35, 45);
    ctx.fillRect(rightX + 15, 335, 35, 45);
    ctx.fillRect(rightX + 65, 335, 35, 45);

    // Caixa d'água no topo direito
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(rightX + 45, 138, 44, 22);

    // Antena Parabólica espinha de peixe
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(rightX + 80, 160);
    ctx.lineTo(rightX + 80, 118);
    for (let r = 0; r < 4; r++) {
      ctx.moveTo(rightX + 70 + r * 5, 124 + r * 6);
      ctx.lineTo(rightX + 90 - r * 5, 124 + r * 6);
    }
    ctx.stroke();

    // VIELA / BECO DA QUEBRADA COM MOTOCAS ESTACIONADAS NO GRAU
    const motoY = 560;
    const motoX = rightX + 28;

    // Sombra da moto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(motoX + 24, motoY + 28, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rodas da CG 160
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(motoX + 6, motoY + 24, 9, 0, Math.PI * 2);
    ctx.arc(motoX + 42, motoY + 24, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(motoX + 6, motoY + 24, 4, 0, Math.PI * 2);
    ctx.arc(motoX + 42, motoY + 24, 4, 0, Math.PI * 2);
    ctx.fill();

    // Quadro e escapamento cromado
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(motoX + 16, motoY + 24);
    ctx.lineTo(motoX + 40, motoY + 26);
    ctx.stroke();

    // Tanque Vermelho da Titan 160
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(motoX + 16, motoY + 10, 18, 9, [4, 6, 2, 2]);
    ctx.fill();

    // Banco preto e guidão
    ctx.fillStyle = '#111827';
    ctx.fillRect(motoX + 28, motoY + 11, 14, 5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(motoX + 14, motoY + 12);
    ctx.lineTo(motoX + 10, motoY + 4);
    ctx.stroke();

    // PAREDÃO DE SOM AUTOMOTIVO DA QUEBRADA
    const soundY = 485;
    const soundX = rightX + 68;

    // Estrutura das caixas de som pretas empilhadas
    ctx.fillStyle = '#18181b';
    ctx.fillRect(soundX, soundY, 44, 48);

    // Alto-falantes graves (woofers) com LEDs brilhantes pulsando
    const pulse = 0.5 + Math.sin(this.windTime * 8) * 0.5;
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(soundX + 14, soundY + 16, 9, 0, Math.PI * 2);
    ctx.arc(soundX + 32, soundY + 16, 9, 0, Math.PI * 2);
    ctx.arc(soundX + 22, soundY + 36, 11, 0, Math.PI * 2);
    ctx.fill();

    // Anéis de LED azuis e vermelhos brilhando
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + pulse * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(soundX + 14, soundY + 16, 9, 0, Math.PI * 2);
    ctx.arc(soundX + 32, soundY + 16, 9, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(soundX + 22, soundY + 36, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Grafite vertical na parede direita
    ctx.font = 'bold 15px "Permanent Marker", cursive';
    ctx.fillStyle = '#00ff88';
    ctx.save();
    ctx.translate(rightX + 14, 420);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('RUA 10 ⚽', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  // ====================================================================
  // PARTE INFERIOR (Calçada completa, Cadeiras de boteco, Isopor, Vira-lata Caramelo, Bike, Carrinho de picolé)
  // ====================================================================
  drawBottomFavela(ctx) {
    ctx.save();
    const botY = WORLD.courtBottom; // 680px
    const botH = 280; // Estende bem para baixo da tela

    // Calçada de cimento panorâmica
    ctx.fillStyle = '#475569';
    ctx.fillRect(-600, botY, 2500, botH);

    // Meio-fio de concreto pintado de amarelo/cinza
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-600, botY, 2500, 6);

    // Mureta de contenção com grafites de rua
    ctx.fillStyle = '#334155';
    ctx.fillRect(-600, botY + 48, 2500, botH - 48);

    // Grafites na mureta inferior
    ctx.font = 'bold 14px "Permanent Marker", cursive';
    ctx.fillStyle = '#facc15';
    ctx.fillText('⚽ QUEBRADA UNIDA', 180, botY + 70);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('★ SÓ OS CRIA DA GROTA ★', 540, botY + 70);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('RESPEITA A FAVELA ⚡', 920, botY + 70);

    // Cadeiras de Plástico de Boteco (Amarela Skol e Vermelha Brahma)
    this.drawPlasticChair(ctx, 270, botY + 12, '#facc15');
    this.drawPlasticChair(ctx, 305, botY + 12, '#ef4444');
    this.drawPlasticChair(ctx, 890, botY + 12, '#ef4444');
    this.drawPlasticChair(ctx, 925, botY + 12, '#facc15');

    // Mesinha de plástico com garrafas e latinhas
    ctx.fillStyle = '#facc15';
    ctx.fillRect(288, botY + 16, 16, 12);
    ctx.fillStyle = '#10b981'; // Garrafa de Guaraná/Heineken
    ctx.fillRect(293, botY + 10, 4, 7);

    // Caixa de Isopor Branca com Latinhas e Gelo
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(345, botY + 18, 30, 20);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(344, botY + 16, 32, 4); // Tampa azul

    // O CLÁSSICO CACHORRO VIRA-LATA CARAMELO DEITADO NO SOL
    const dogX = 720;
    const dogY = botY + 22;

    // Sombra do caramelo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(dogX + 12, dogY + 12, 19, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corpo caramelo
    ctx.fillStyle = '#d97706'; // Amarelo queimado/caramelo
    ctx.beginPath();
    ctx.roundRect(dogX, dogY, 25, 12, [6, 6, 4, 4]);
    ctx.fill();

    // Cabeça do cão
    ctx.beginPath();
    ctx.arc(dogX - 3, dogY + 3, 6.5, 0, Math.PI * 2);
    ctx.fill();
    // Orelha caída
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(dogX - 5, dogY + 5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Focinho
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(dogX - 8, dogY + 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Rabinho abanando no sol com o vento
    const tailWag = Math.sin(this.windTime * 5) * 4;
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dogX + 23, dogY + 4);
    ctx.lineTo(dogX + 30, dogY + 2 + tailWag);
    ctx.stroke();

    // Potinho de água do caramelo
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(dogX - 16, dogY + 8, 8, 5);

    // Gatinho preto e branco equilibrado na mureta
    const catX = 660;
    const catY = botY + 42;
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(catX, catY, 9, 5, 0, 0, Math.PI * 2);
    ctx.arc(catX - 6, catY - 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Orelhinhas pontudas
    ctx.beginPath();
    ctx.moveTo(catX - 8, catY - 5);
    ctx.lineTo(catX - 6, catY - 9);
    ctx.lineTo(catX - 4, catY - 5);
    ctx.fill();

    // Bicicletinha aro 20 encostada no muro
    const bikeX = 460;
    const bikeY = botY + 12;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    // Rodas
    ctx.beginPath();
    ctx.arc(bikeX, bikeY + 14, 8, 0, Math.PI * 2);
    ctx.arc(bikeX + 26, bikeY + 14, 8, 0, Math.PI * 2);
    ctx.stroke();
    // Quadro da bike
    ctx.beginPath();
    ctx.moveTo(bikeX, bikeY + 14);
    ctx.lineTo(bikeX + 12, bikeY + 6);
    ctx.lineTo(bikeX + 26, bikeY + 14);
    ctx.moveTo(bikeX + 12, bikeY + 6);
    ctx.lineTo(bikeX + 8, bikeY + 2); // guidão
    ctx.stroke();

    // Carrinho de Picolé do Zeca com guarda-sol colorido
    const cartX = 140;
    const cartY = botY + 16;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cartX, cartY, 26, 18);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cartX + 3, cartY + 18, 7, 7); // Rodinha
    ctx.fillRect(cartX + 16, cartY + 18, 7, 7);
    // Guarda-sol do carrinho
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cartX + 13, cartY - 8, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cartX + 13, cartY - 8, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cartX + 13, cartY - 8);
    ctx.lineTo(cartX + 13, cartY);
    ctx.stroke();

    ctx.restore();
  }

  drawPlasticChair(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    // Encosto
    ctx.fillRect(x, y, 14, 16);
    // Assento
    ctx.fillRect(x - 2, y + 14, 18, 5);
    // Pernas
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 1, y + 19, 2.5, 9);
    ctx.fillRect(x + 13, y + 19, 2.5, 9);
    ctx.restore();
  }

  // ====================================================================
  // QUADRA DE CIMENTO ILUMINADA DE DIA
  // ====================================================================
  drawCourt(ctx) {
    ctx.save();
    const cl = WORLD.courtLeft;
    const cr = WORLD.courtRight;
    const ct = WORLD.courtTop;
    const cb = WORLD.courtBottom;
    const cw = cr - cl;
    const ch = cb - ct;

    // Piso de Cimento Iluminado pelo Sol de Dia
    const courtGrad = ctx.createLinearGradient(cl, ct, cl, cb);
    courtGrad.addColorStop(0, '#475569');   // Cimento cinza médio
    courtGrad.addColorStop(0.5, '#3b4354'); // Textura de concreto firme
    courtGrad.addColorStop(1, '#2f3543');   // Base de cimento
    ctx.fillStyle = courtGrad;
    ctx.fillRect(cl, ct, cw, ch);

    // Manchas de sol e desgaste do asfalto
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(cl + 90, ct + 50, 240, 160);
    ctx.fillRect(cl + 520, ct + 80, 260, 220);
    ctx.fillRect(cl + 340, ct + 300, 280, 140);

    // Linhas Pintadas com Tinta Spray Nítidas no Sol (Branco e Amarelo)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    // Borda da Quadra
    ctx.strokeRect(cl, ct, cw, ch);

    // Linha do Meio de Campo
    const midX = (cl + cr) / 2;
    ctx.beginPath();
    ctx.moveTo(midX, ct);
    ctx.lineTo(midX, cb);
    ctx.stroke();

    // Círculo Central
    const midY = (ct + cb) / 2;
    ctx.beginPath();
    ctx.arc(midX, midY, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Ponto Central
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(midX, midY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pequenas Áreas / Linhas de Pênalti (Proporcionais ao novo gol ampliado)
    // Lado Esquerdo
    ctx.strokeRect(cl, midY - 145, 125, 290);
    ctx.beginPath();
    ctx.arc(cl + 90, midY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Lado Direito
    ctx.strokeRect(cr - 125, midY - 145, 125, 290);
    ctx.beginPath();
    ctx.arc(cr - 90, midY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Marcações de spray no chão: "BEIÇO STREET"
    ctx.font = '900 24px Outfit';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
    ctx.fillText('★ BEIÇO STREET ★', midX, midY + 45);

    ctx.restore();
  }

  drawGoals(ctx) {
    ctx.save();
    const gt = WORLD.goalYTop;
    const gb = WORLD.goalYBottom;
    const gd = WORLD.goalDepth;
    const cl = WORLD.courtLeft;
    const cr = WORLD.courtRight;

    // 1. GOL ESQUERDO
    // Rede do fundo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fillRect(cl - gd, gt, gd, gb - gt);

    for (let y = gt; y <= gb; y += 12) {
      ctx.beginPath();
      ctx.moveTo(cl - gd, y);
      ctx.lineTo(cl, y);
      ctx.stroke();
    }
    for (let x = cl - gd; x <= cl; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, gt);
      ctx.lineTo(x, gb);
      ctx.stroke();
    }

    // Traves metálicas esquerdas (ferro branco pintado)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cl - gd, gt);
    ctx.lineTo(cl, gt);
    ctx.lineTo(cl, gb);
    ctx.lineTo(cl - gd, gb);
    ctx.stroke();

    // 2. GOL DIREITO
    // Rede do fundo
    ctx.fillRect(cr, gt, gd, gb - gt);

    for (let y = gt; y <= gb; y += 12) {
      ctx.beginPath();
      ctx.moveTo(cr, y);
      ctx.lineTo(cr + gd, y);
      ctx.stroke();
    }
    for (let x = cr; x <= cr + gd; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, gt);
      ctx.lineTo(x, gb);
      ctx.stroke();
    }

    // Traves metálicas direitas
    ctx.beginPath();
    ctx.moveTo(cr + gd, gt);
    ctx.lineTo(cr, gt);
    ctx.lineTo(cr, gb);
    ctx.lineTo(cr + gd, gb);
    ctx.stroke();

    ctx.restore();
  }
}

// ====================================================================
// 7. CÂMERA DINÂMICA (ZOOM, SEGUIMENTO, TREMOR)
// ====================================================================
class GameCamera {
  constructor() {
    this.x = WORLD.width / 2;
    this.y = WORLD.height / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    this.shakeIntensity = 0;
  }

  shake(amount) {
    this.shakeIntensity = Math.min(25, this.shakeIntensity + amount);
  }

  update(ball, p1, p2, state) {
    if (state === 'MENU') {
      // Movimento cinematográfico suave no menu
      this.targetX = WORLD.width / 2 + Math.sin(Date.now() * 0.0006) * 90;
      this.targetY = WORLD.height / 2 + Math.cos(Date.now() * 0.0008) * 40;
      this.targetZoom = 0.95;
    } else {
      // Foco dinâmico entre a bola e os jogadores
      let focusX = ball.x * 0.6 + p1.x * 0.4;
      let focusY = ball.y * 0.6 + p1.y * 0.4;

      if (p2) {
        focusX = ball.x * 0.5 + (p1.x + p2.x) * 0.25;
        focusY = ball.y * 0.5 + (p1.y + p2.y) * 0.25;
      }

      this.targetX = focusX;
      this.targetY = focusY;

      // Zoom dinâmico (mais perto perto da área, afasta em lançamentos)
      const ballSpeed = Math.hypot(ball.vx, ball.vy);
      if (ballSpeed > 10) {
        this.targetZoom = 0.96;
      } else {
        this.targetZoom = 1.06;
      }
    }

    // Interpolação suave (lerp)
    this.x += (this.targetX - this.x) * 0.07;
    this.y += (this.targetY - this.y) * 0.07;
    this.zoom += (this.targetZoom - this.zoom) * 0.05;

    // Amortecimento do tremor
    if (this.shakeIntensity > 0) {
      this.shakeIntensity *= 0.88;
      if (this.shakeIntensity < 0.2) this.shakeIntensity = 0;
    }
  }

  applyTransform(ctx, canvasWidth, canvasHeight) {
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Efeito de tremor (screen shake)
    if (this.shakeIntensity > 0) {
      const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
      const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(offsetX, offsetY);
    }

    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restoreTransform(ctx) {
    ctx.restore();
  }
}

// ====================================================================
// 8. MOTOR PRINCIPAL DO JOGO (GAME LOOP & ESTADOS)
// ====================================================================
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.state = 'MENU'; // 'MENU', 'COUNTDOWN', 'PLAYING', 'GOAL', 'GAMEOVER'
    this.gameMode = '1P'; // '1P' ou '2P'

    // Tempo de Partida (2 minutos = 120 segundos)
    this.matchDuration = 120;
    this.timer = this.matchDuration;
    this.timerInterval = null;

    // Placar
    this.scoreBeico = 0;
    this.scoreRivais = 0;

    // Entidades
    this.camera = new GameCamera();
    this.scenery = new FavelaScenery();
    this.particles = new ParticleSystem();
    this.ball = new Ball(WORLD.width / 2, (WORLD.courtTop + WORLD.courtBottom) / 2);

    // Configuração dos 2 Times (2v2 Street Soccer)
    this.players = [];
    this.initPlayers();

    // Gerenciador de Teclas
    this.keys = {};
    this.initInputListeners();

    // Elementos DOM da Interface
    this.hudElement = document.getElementById('hud');
    this.scoreBeicoEl = document.getElementById('score-beico');
    this.scoreRivaisEl = document.getElementById('score-rivais');
    this.timerEl = document.getElementById('match-timer');
    this.goalBanner = document.getElementById('goal-banner');
    this.goalScorerEl = document.getElementById('goal-scorer');
    this.countdownBanner = document.getElementById('countdown-banner');
    this.countdownTextEl = document.getElementById('countdown-text');
    this.popupsContainer = document.getElementById('arcade-popups-container');

    this.p1PowerFill = document.getElementById('p1-power-fill');
    this.p2PowerHud = document.getElementById('p2-power-hud');
    this.p2PowerFill = document.getElementById('p2-power-fill');

    // Telas Overlays
    this.mainMenu = document.getElementById('main-menu');
    this.howToPlayModal = document.getElementById('how-to-play-modal');
    this.gameOverScreen = document.getElementById('game-over-screen');

    // Ajuste de Resolução
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Botões de Ação
    this.bindUIButtons();

    // Iniciar Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initPlayers() {
    this.players = [
      // TIME BEIÇO
      new Player({
        name: 'Beiço #10',
        team: 'beico',
        isControlled: true,
        controlId: 1,
        role: 'striker',
        homeX: 520,
        homeY: 430,
        skinTone: '#8d5524',
        shirtColor: '#facc15',
        shortsColor: '#047857',
        hairStyle: 'blonde', // Nevou
        number: '10'
      }),
      new Player({
        name: 'Biel #4',
        team: 'beico',
        isControlled: false,
        controlId: null,
        role: 'defender',
        homeX: 320,
        homeY: 430,
        skinTone: '#5c3826',
        shirtColor: '#facc15',
        shortsColor: '#047857',
        hairStyle: 'dreads',
        number: '4'
      }),

      // TIME RIVAIS
      new Player({
        name: 'Caveira #9',
        team: 'rivais',
        isControlled: false, // Pode virar P2 no modo 2 Jogadores
        controlId: 2,
        role: 'striker',
        homeX: 780,
        homeY: 430,
        skinTone: '#a16207',
        shirtColor: '#ef4444',
        shortsColor: '#4338ca',
        hairStyle: 'buzz',
        number: '9'
      }),
      new Player({
        name: 'Zika #5',
        team: 'rivais',
        isControlled: false,
        controlId: null,
        role: 'defender',
        homeX: 980,
        homeY: 430,
        skinTone: '#3f2512',
        shirtColor: '#ef4444',
        shortsColor: '#4338ca',
        hairStyle: 'cap',
        number: '5'
      })
    ];
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.key) {
        this.keys[e.key.toLowerCase()] = true;
        this.keys[e.key] = true;
      }

      // Impedir que espaço e setas rolem a página
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) || [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      // Ativar áudio na primeira interação do usuário
      audio.init();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.key) {
        this.keys[e.key.toLowerCase()] = false;
        this.keys[e.key] = false;
      }
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  bindUIButtons() {
    // 1 Jogador
    document.getElementById('btn-1player').addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.startMatch('1P');
    });

    // 2 Jogadores
    document.getElementById('btn-2players').addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.startMatch('2P');
    });

    // Como Jogar
    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.howToPlayModal.classList.remove('hidden');
      this.howToPlayModal.classList.add('active');
    });

    // Fechar Como Jogar
    const closeHow = () => {
      audio.playClick();
      this.howToPlayModal.classList.remove('active');
      this.howToPlayModal.classList.add('hidden');
    };
    document.getElementById('btn-close-how').addEventListener('click', closeHow);
    document.getElementById('btn-back-menu').addEventListener('click', closeHow);

    // Revanche / Jogar Novamente
    document.getElementById('btn-rematch').addEventListener('click', () => {
      audio.playClick();
      this.startMatch(this.gameMode);
    });

    // Voltar pro Menu
    document.getElementById('btn-return-menu').addEventListener('click', () => {
      audio.playClick();
      this.returnToMenu();
    });

    // Som Ligar/Desligar
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    soundBtn.addEventListener('click', () => {
      audio.init();
      const isSoundOn = audio.toggleMute();
      soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
    });

    // Pausa rápida / Menu
    document.getElementById('btn-pause-toggle').addEventListener('click', () => {
      audio.playClick();
      this.returnToMenu();
    });
  }

  startMatch(mode = '1P') {
    this.gameMode = mode;
    this.scoreBeico = 0;
    this.scoreRivais = 0;
    this.timer = this.matchDuration;

    // Atualizar quem é controlado
    const p1 = this.players[0]; // Beiço
    const p2 = this.players[2]; // Caveira

    p1.isControlled = true;
    p1.controlId = 1;

    if (mode === '2P') {
      p2.isControlled = true;
      p2.controlId = 2;
      this.p2PowerHud.classList.remove('hidden');
      document.getElementById('hud-match-hint').textContent = 'P1: [WASD + ESPAÇO] | P2: [SETAS + ENTER]';
    } else {
      p2.isControlled = false;
      p2.controlId = null;
      this.p2PowerHud.classList.add('hidden');
      document.getElementById('hud-match-hint').textContent = 'P1: [WASD ou SETAS + ESPAÇO]';
    }

    // Esconder menus e mostrar HUD
    this.mainMenu.classList.remove('active');
    this.mainMenu.classList.add('hidden');
    this.gameOverScreen.classList.remove('active');
    this.gameOverScreen.classList.add('hidden');
    this.hudElement.classList.remove('hidden');

    this.updateScoreboard();
    this.updateTimerDisplay();

    // Iniciar Contagem Regressiva
    this.startCountdown();
  }

  startCountdown() {
    this.state = 'COUNTDOWN';
    this.resetPositions();

    const counts = ['3', '2', '1', 'JOGA!'];
    let step = 0;

    this.countdownBanner.classList.remove('hidden');

    const tick = () => {
      this.countdownTextEl.textContent = counts[step];
      const isGo = (step === counts.length - 1);
      audio.playCountdown(isGo);

      if (isGo) {
        this.triggerShake(6);
        audio.playWhistle(false);
        this.state = 'PLAYING';
        this.startTimerInterval();
        setTimeout(() => {
          this.countdownBanner.classList.add('hidden');
        }, 500);
        return;
      }

      step++;
      setTimeout(tick, 800);
    };

    tick();
  }

  startTimerInterval() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.state === 'PLAYING') {
        this.timer--;
        this.updateTimerDisplay();

        if (this.timer <= 0) {
          this.endMatch();
        }
      }
    }, 1000);
  }

  resetPositions() {
    for (const player of this.players) {
      player.reset();
    }
    this.ball.reset(WORLD.width / 2, (WORLD.courtTop + WORLD.courtBottom) / 2);
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timer / 60);
    const secs = this.timer % 60;
    this.timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (this.timer <= 15) {
      this.timerEl.classList.add('hurry-up');
    } else {
      this.timerEl.classList.remove('hurry-up');
    }
  }

  updateScoreboard() {
    this.scoreBeicoEl.textContent = this.scoreBeico;
    this.scoreRivaisEl.textContent = this.scoreRivais;
  }

  triggerGoal(scoringTeam) {
    if (this.state !== 'PLAYING') return;

    this.state = 'GOAL';
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (scoringTeam === 'beico') {
      this.scoreBeico++;
      this.scoreBeicoEl.classList.add('score-bump');
      this.goalScorerEl.textContent = `${this.ball.lastTouchPlayer ? this.ball.lastTouchPlayer.name : 'TIME BEIÇO'} BROCOU NO ÂNGULO!`;
    } else {
      this.scoreRivais++;
      this.scoreRivaisEl.classList.add('score-bump');
      this.goalScorerEl.textContent = `${this.ball.lastTouchPlayer ? this.ball.lastTouchPlayer.name : 'RIVAIS'} MANDOU PRA REDE!`;
    }

    setTimeout(() => {
      this.scoreBeicoEl.classList.remove('score-bump');
      this.scoreRivaisEl.classList.remove('score-bump');
    }, 600);

    this.updateScoreboard();

    // Efeitos Sonoros e Visuais de Gol
    audio.playGoal();
    audio.playWhistle(true);
    this.triggerShake(14);
    this.particles.triggerGoalConfetti();

    this.goalBanner.classList.remove('hidden');

    // Após 2.5s, reinicia a partida no centro
    setTimeout(() => {
      this.goalBanner.classList.add('hidden');
      if (this.timer > 0) {
        this.startCountdown();
      } else {
        this.endMatch();
      }
    }, 2400);
  }

  endMatch() {
    this.state = 'GAMEOVER';
    if (this.timerInterval) clearInterval(this.timerInterval);

    audio.playWhistle(true);

    const titleEl = document.getElementById('game-over-title');
    const subEl = document.getElementById('game-over-subtitle');

    document.getElementById('final-score-beico').textContent = this.scoreBeico;
    document.getElementById('final-score-rivais').textContent = this.scoreRivais;

    if (this.scoreBeico > this.scoreRivais) {
      titleEl.textContent = 'É O BEIÇO!';
      titleEl.style.color = '#facc15';
      subEl.textContent = 'A taça da favela fica em casa! Respeita os cria!';
      this.particles.triggerGoalConfetti();
      audio.playCheer();
    } else if (this.scoreRivais > this.scoreBeico) {
      titleEl.textContent = 'HOJE NÃO DEU...';
      titleEl.style.color = '#ef4444';
      subEl.textContent = 'Os rivais levaram essa. Mas amanhã tem revanche na quadra!';
    } else {
      titleEl.textContent = 'EMPATE HISTÓRICO!';
      titleEl.style.color = '#38bdf8';
      subEl.textContent = 'Jogo pegado do início ao fim! Ninguém arrefeceu!';
    }

    this.gameOverScreen.classList.remove('hidden');
    this.gameOverScreen.classList.add('active');
  }

  returnToMenu() {
    this.state = 'MENU';
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.hudElement.classList.add('hidden');
    this.goalBanner.classList.add('hidden');
    this.countdownBanner.classList.add('hidden');
    this.gameOverScreen.classList.remove('active');
    this.gameOverScreen.classList.add('hidden');

    this.mainMenu.classList.remove('hidden');
    this.mainMenu.classList.add('active');

    // Deixar a IA jogando uma pelada no fundo do menu!
    this.players[0].isControlled = false;
    this.players[2].isControlled = false;
    this.resetPositions();
  }

  triggerShake(amount) {
    this.camera.shake(amount);
  }

  spawnArcadePopup(worldX, worldY, text) {
    // Mensagens na tela desativadas a pedido do jogador
    return;
  }

  // ====================================================================
  // LOOP PRINCIPAL DO JOGO
  // ====================================================================
  gameLoop(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 1. Atualizações
    this.update();

    // 2. Renderização
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update() {
    // Atualização do cenário (vento, torcida)
    this.scenery.update();

    const p1 = this.players[0];
    const p2 = this.players[2];

    // No estado COUNTDOWN, todos devem permanecer 100% parados em seus lugares
    if (this.state === 'COUNTDOWN') {
      for (const player of this.players) {
        player.x = player.homeX;
        player.y = player.homeY;
        player.vx = 0;
        player.vy = 0;
        player.walkCycle = 0;
        player.isChargingKick = false;
        player.kickCharge = 0;
        player.kickAnimTimer = 0;
        player.kickCooldown = 0;
        player.conductionTimer = 0;
        player.facingAngle = player.team === 'beico' ? 0 : Math.PI;
      }
      this.ball.x = WORLD.width / 2;
      this.ball.y = (WORLD.courtTop + WORLD.courtBottom) / 2;
      this.ball.vx = 0;
      this.ball.vy = 0;
      this.ball.vz = 0;
      this.ball.z = 0;
      this.ball.trail = [];
    } else {
      // Atualização dos jogadores
      for (const player of this.players) {
        player.update(this.keys, this.ball, this.players, this.particles);
      }

      // Colisão entre jogadores (não atravessam um ao outro)
      for (let i = 0; i < this.players.length; i++) {
        for (let j = i + 1; j < this.players.length; j++) {
          const pA = this.players[i];
          const pB = this.players[j];
          const dx = pB.x - pA.x;
          const dy = pB.y - pA.y;
          const dist = Math.hypot(dx, dy);
          const minDist = pA.radius + pB.radius;
          if (dist < minDist && dist > 0) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            pA.x -= nx * overlap;
            pA.y -= ny * overlap;
            pB.x += nx * overlap;
            pB.y += ny * overlap;
          }
        }
      }

      // Atualização da bola
      this.ball.update(this.particles);

      // Checagem de Gol
      if (this.state === 'PLAYING') {
        // Gol no lado esquerdo (Gol para os Rivais)
        if (this.ball.x < WORLD.courtLeft - 10 && this.ball.y > WORLD.goalYTop && this.ball.y < WORLD.goalYBottom) {
          this.triggerGoal('rivais');
        }
        // Gol no lado direito (Gol para o Beiço)
        else if (this.ball.x > WORLD.courtRight + 10 && this.ball.y > WORLD.goalYTop && this.ball.y < WORLD.goalYBottom) {
          this.triggerGoal('beico');
        }
      }
    }

    // Atualizar partículas
    this.particles.update();

    // Atualizar câmera
    this.camera.update(this.ball, p1, p2, this.state);

    // Atualizar barras de força do HUD
    if (p1) {
      this.p1PowerFill.style.width = `${p1.kickCharge * 100}%`;
    }
    if (p2 && this.gameMode === '2P') {
      this.p2PowerFill.style.width = `${p2.kickCharge * 100}%`;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Limpar tela
    ctx.clearRect(0, 0, w, h);

    // Aplicar Transformação da Câmera
    this.camera.applyTransform(ctx, w, h);

    // 1. Cenário da Favela & Quadra
    this.scenery.draw(ctx, WORLD.width, WORLD.height);

    // 2. Partículas do chão (poeira)
    this.particles.draw(ctx);

    // 3. Jogadores e Bola com Ordenação de Profundidade (Y-Sorting)
    const renderList = [...this.players, this.ball];
    renderList.sort((a, b) => a.y - b.y);

    for (const item of renderList) {
      item.draw(ctx);
    }

    // Restaurar Câmera
    this.camera.restoreTransform(ctx);
  }
}

// Inicializar quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});
