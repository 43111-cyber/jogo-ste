const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

// ====================================================================
// RANKING GLOBAL DA TAÇA DAS FAVELAS (títulos por time)
// Guardado em ranking.json, compartilhado por todo mundo que joga.
// ====================================================================
// Em hospedagem online, aponte DATA_DIR para um disco persistente (ex.: /data)
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'ranking.json');
const COOLDOWN_MS = 60 * 1000; // um torneio inteiro leva minutos: 1 título por IP a cada 60s

// Times válidos (mesmos ids do jogo). Qualquer outro id é recusado.
const TEAM_IDS = new Set([
  'padre-anchieta',
  'costa-e-silva',
  'dic-vi',
  'santa-lucia',
  'santa-terezinha',
  'nilopolis',
  'cafezinho',
  'vila-rica',
  'carlos-lourenco',
  'sao-jose',
  'paranapanema',
  'jardim-rosalia',
  'san-martins',
  'florence-ii',
  'parque-oziel',
  'vista-alegre',
  'vila-vitoria',
  'jardim-shangai',
  'vila-31-marco',
  'jardim-capivari',
  'campo-belo',
  'sao-marcos',
  'parque-brasilia',
  'vila-bela',
  'vila-brandina',
  'sao-bernardo',
  'satelite-iris',
  'santa-barbara',
  'boa-vista',
  'novo-mundo',
  'eulina',
  'vila-esperanca',
  'parque-universitario'
]);

// { teamId: { wins: número, last: timestamp do último título } }
let ranking = {};
try {
  ranking = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
  ranking = {};
}

function saveRanking() {
  // Escrita atômica: grava num arquivo temporário e troca, para nunca corromper o ranking
  const tmp = DATA_FILE + '.tmp';
  fs.writeFile(tmp, JSON.stringify(ranking), (err) => {
    if (err) return console.warn('Não foi possível salvar o ranking:', err.message);
    fs.rename(tmp, DATA_FILE, (err2) => {
      if (err2) console.warn('Não foi possível salvar o ranking:', err2.message);
    });
  });
}

// Lista ordenada: mais títulos primeiro; empate = quem chegou àquele número antes fica na frente
function getRankingList() {
  return Object.entries(ranking)
    .filter(([id, r]) => TEAM_IDS.has(id) && r.wins > 0)
    .sort((a, b) => (b[1].wins - a[1].wins) || (a[1].last - b[1].last))
    .map(([id, r]) => ({ id, wins: r.wins }));
}

// ====================================================================
// HALL DOS CAMPEÕES: nome (ou apelido) de quem ganhou a Taça. Guardado em hall.json
// ====================================================================
const HALL_FILE = path.join(DATA_DIR, 'hall.json');
const NAME_WINDOW_MS = 30 * 60 * 1000; // dá 30 min pra colocar o nome depois do título
let hall = [];
try { hall = JSON.parse(fs.readFileSync(HALL_FILE, 'utf-8')); } catch (e) { hall = []; }

function saveHall() {
  const tmp = HALL_FILE + '.tmp';
  fs.writeFile(tmp, JSON.stringify(hall), (err) => {
    if (err) return console.warn('Não foi possível salvar o hall:', err.message);
    fs.rename(tmp, HALL_FILE, (err2) => {
      if (err2) console.warn('Não foi possível salvar o hall:', err2.message);
    });
  });
}

// Só letras, números, espaço, ponto, hífen e underline; até 16 caracteres
function cleanName(raw) {
  if (typeof raw !== 'string') return '';
  return raw.normalize('NFC').replace(/[^\p{L}\p{N} ._-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
}

function getHallList() {
  return hall
    .filter((h) => h.name && TEAM_IDS.has(h.teamId))
    .slice(-10)
    .reverse()
    .map((h) => ({ name: h.name, teamId: h.teamId, t: h.t }));
}

function readJSONBody(req, res, cb) {
  let body = '';
  let tooBig = false;
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1024) { tooBig = true; req.destroy(); }
  });
  req.on('end', () => {
    if (tooBig) return;
    let data;
    try { data = JSON.parse(body); } catch (e) { data = null; }
    cb(data || {});
  });
}

const lastWinByIp = new Map();

function sendJSON(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(obj));
}

function handleApi(req, res, reqPath) {
  if (reqPath === '/api/ranking' && req.method === 'GET') {
    const list = getRankingList();
    const total = list.reduce((s, r) => s + r.wins, 0);
    return sendJSON(res, 200, { ranking: list, total, hall: getHallList() });
  }

  if (reqPath === '/api/champion' && req.method === 'POST') {
    let body = '';
    let tooBig = false;
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024) { tooBig = true; req.destroy(); }
    });
    req.on('end', () => {
      if (tooBig) return;
      let teamId;
      try { teamId = JSON.parse(body).teamId; } catch (e) { teamId = null; }
      if (typeof teamId !== 'string' || !TEAM_IDS.has(teamId)) {
        return sendJSON(res, 400, { error: 'Time inválido' });
      }

      const ip = req.socket.remoteAddress || 'x';
      const now = Date.now();
      const prev = lastWinByIp.get(ip) || 0;
      if (now - prev < COOLDOWN_MS) {
        return sendJSON(res, 429, { error: 'Título registrado há pouco tempo', ranking: getRankingList() });
      }
      lastWinByIp.set(ip, now);

      const cur = ranking[teamId] || { wins: 0, last: 0 };
      ranking[teamId] = { wins: cur.wins + 1, last: now };
      saveRanking();

      const winId = crypto.randomBytes(6).toString('hex');
      hall.push({ id: winId, teamId, name: '', t: now });
      if (hall.length > 300) hall = hall.slice(-300);
      saveHall();

      const list = getRankingList();
      const position = list.findIndex((r) => r.id === teamId) + 1;
      sendJSON(res, 200, { ok: true, teamId, wins: ranking[teamId].wins, position, ranking: list, winId });
    });
    return;
  }

  if (reqPath === '/api/champion-name' && req.method === 'POST') {
    return readJSONBody(req, res, (data) => {
      const entry = hall.find((h) => h.id === data.winId);
      if (!entry) return sendJSON(res, 404, { error: 'Título não encontrado' });
      if (entry.name) return sendJSON(res, 409, { error: 'Nome já registrado' });
      if (Date.now() - entry.t > NAME_WINDOW_MS) return sendJSON(res, 410, { error: 'Tempo para registrar o nome acabou' });
      const name = cleanName(data.name);
      if (!name) return sendJSON(res, 400, { error: 'Nome inválido' });
      entry.name = name;
      saveHall();
      sendJSON(res, 200, { ok: true, hall: getHallList() });
    });
  }

  sendJSON(res, 404, { error: 'Rota não encontrada' });
}

// Arquivos que nunca devem ser servidos como página
const BLOCKED = new Set(['/server.js', '/ranking.json', '/ranking.json.tmp', '/hall.json', '/hall.json.tmp']);

function createServer(port) {
  const server = http.createServer((req, res) => {
    let reqPath;
    try {
      reqPath = decodeURI(req.url.split('?')[0]);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Requisição inválida');
      return;
    }

    if (reqPath.startsWith('/api/')) return handleApi(req, res, reqPath);

    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(__dirname, reqPath);
    // Impede sair da pasta do jogo (../) e acessar arquivos internos
    if (!filePath.startsWith(__dirname + path.sep) || BLOCKED.has(reqPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo não encontrado');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Arquivo não encontrado');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });

      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  server.on('error', (err) => {
    console.warn(`Não foi possível escutar na porta ${port}:`, err.message);
  });

  return server;
}

// Iniciar nas portas mais comuns para facilitar
// Em hospedagem online a porta vem em process.env.PORT; no PC usa as portas de sempre
if (process.env.PORT) {
  createServer(Number(process.env.PORT));
} else {
  [8080, 5500, 3000].forEach(port => createServer(port));
}
