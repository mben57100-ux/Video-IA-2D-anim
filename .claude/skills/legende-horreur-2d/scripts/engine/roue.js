// =================== Format « ROUE DES LÉGENDES » ===================
// Composants : intro roues (sauveur bleu / cauchemar rouge), écran VS, bandeau d'épisode + puces,
// fiche légende (niveau de menace), poster vintage « la légende », horloge, sous-titres phrase, VFX de combat.
const ROUE = { blue: '#3d8bff', blueD: '#0b1a3a', red: '#ff3b3b', redD: '#3a0b10', cream: '#f3e6c8' };
const ROUE_DEFS = `
<linearGradient id="rBlueBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122b"/><stop offset="1" stop-color="#0f2c5c"/></linearGradient>
<linearGradient id="rRedBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a0f16"/><stop offset="1" stop-color="#1e0508"/></linearGradient>
<linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f2e"/><stop offset="1" stop-color="#0c0e16"/></linearGradient>
<filter id="neonB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="vintPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe2c4"/><stop offset="1" stop-color="#e2d0a8"/></linearGradient>
<linearGradient id="waterCol" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#cfe6ff" stop-opacity=".9"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></linearGradient>`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---- carte de légende (vignette de roue) ----
// L = {name, lvl (1-10), draw: (s)=>svg centré (0,0) dans ~ 300x420}
function legendCard(L, x, y, s, col, hi = 0, dim = 0) {
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${1 - dim * .65}">
    <rect x="-110" y="-160" width="220" height="320" rx="22" fill="url(#cardBg)" stroke="${col}" stroke-opacity="${.35 + hi * .65}" stroke-width="${3 + hi * 4}"/>
    <clipPath id="cc${esc(L.name).replace(/\W/g, '')}"><rect x="-100" y="-130" width="200" height="250" rx="12"/></clipPath>
    <g clip-path="url(#cc${esc(L.name).replace(/\W/g, '')})"><rect x="-100" y="-130" width="200" height="250" fill="#141826"/>${L.draw(.32)}</g>
    <text x="0" y="-138" text-anchor="middle" font-family="NU" font-weight="900" font-size="20" fill="#fff" opacity=".8">${String(L.lvl).padStart(2, '0')}</text>
    <rect x="-92" y="126" width="184" height="26" rx="6" fill="#000" opacity=".7"/>
    <text x="0" y="146" text-anchor="middle" font-family="NU" font-weight="900" font-size="18" fill="#fff">${esc(L.name.toUpperCase())}</text>
  </g>`;
}
// ---- bande qui défile (roulette) : s'arrête sur `target` ----
function wheelStrip(t, cfg) {
  // cfg: {y, col, roster, target, t0, dur, spins}
  const n = cfg.roster.length, step = 240;
  const p = clamp((t - cfg.t0) / cfg.dur);
  const e = 1 - Math.pow(1 - p, 3.2);
  const total = (cfg.spins || 3) * n + cfg.target;
  const pos = e * total;                      // index « au centre »
  const landed = p >= 1;
  let g = '';
  for (let k = -3; k <= 3; k++) {
    const idx = Math.floor(pos) + k, frac = pos - Math.floor(pos);
    const L = cfg.roster[((idx % n) + n) % n];
    const x = 540 + (k - frac) * step;
    const isC = landed && k === 0;
    g += legendCard(L, x, cfg.y, 1, cfg.col, isC ? 1 : 0, landed && !isC ? prog(t, cfg.t0 + cfg.dur, cfg.t0 + cfg.dur + .4) : 0);
  }
  const hiPulse = landed ? 1 + .04 * Math.sin((t - cfg.t0) * 12) : 1;
  g += `<rect x="${540 - 122 * hiPulse}" y="${cfg.y - 176 * hiPulse}" width="${244 * hiPulse}" height="${352 * hiPulse}" rx="24" fill="none" stroke="${cfg.col}" stroke-width="6" filter="url(#neonB)"/>
        <path d="M528,${cfg.y - 186} l12,14 l12,-14z M528,${cfg.y + 186} l12,-14 l12,14z" fill="${cfg.col}"/>`;
  return g;
}
function roueHalf(top, title, sub, col, t) {
  const y0 = top ? 0 : 960, bg = top ? 'url(#rBlueBg)' : 'url(#rRedBg)';
  let rings = ''; for (let i = 1; i <= 4; i++) rings += `<circle cx="540" cy="${y0 + 560}" r="${i * 170}" fill="none" stroke="${col}" stroke-opacity="${.08 + .04 * Math.sin(t * 2 + i)}" stroke-width="3"/>`;
  return `<rect x="0" y="${y0}" width="1080" height="960" fill="${bg}"/>${rings}
    <text x="540" y="${y0 + (top ? 185 : 120)}" text-anchor="middle" font-family="NU" font-weight="900" font-size="38" fill="#fff" opacity=".9">${sub}</text>
    <text x="540" y="${y0 + (top ? 265 : 200)}" text-anchor="middle" font-family="NU" font-weight="900" font-size="96" fill="${col}" filter="url(#neonB)">${title}</text>`;
}
function episodePill(n, y = 70, s = 1) {
  return `<g transform="translate(540,${y}) scale(${s})"><rect x="-230" y="-30" width="460" height="60" rx="30" fill="#fff"/>
    <text x="0" y="12" text-anchor="middle" font-family="NU" font-weight="900" font-size="32" fill="#0b0b10">ROUE DES LÉGENDES · N°${n}</text></g>`;
}
// Bandeau permanent pendant l'histoire (épisode + puces sauveur / cauchemar)
function roueHeader(n, sauveur, cauchemar) {
  const chip = (x, txt, col, anchor) => {
    const w = txt.length * 15 + 40;
    const x0 = anchor === 'end' ? x - w : x;
    return `<rect x="${x0}" y="128" width="${w}" height="40" rx="20" fill="${col}"/><text x="${x0 + w / 2}" y="156" text-anchor="middle" font-family="NU" font-weight="900" font-size="24" fill="#fff">${esc(txt)}</text>`;
  };
  return `${episodePill(n, 80, .85)}${chip(530, 'SAUVEUR · ' + sauveur.toUpperCase(), '#2f6fe0', 'end')}${chip(550, 'CAUCHEMAR · ' + cauchemar.toUpperCase(), '#d8263a', 'start')}`;
}
// Intro complète (≈ 0–9 s) : cfg = {n, roster, sauveur, cauchemar (index), tTop:[t0,dur], tBot:[t0,dur], tVs, captions:[[t, html]]}
function roueIntro(t, cfg) {
  const R = cfg.roster, S = R[cfg.sauveur], C = R[cfg.cauchemar];
  if (t < cfg.tVs) {
    let g = roueHalf(true, 'SAUVEUR', 'LA ROUE BLEUE', ROUE.blue, t) + roueHalf(false, 'CAUCHEMAR', 'LA ROUE ROUGE', ROUE.red, t);
    g += wheelStrip(t, { y: 560, col: ROUE.blue, roster: R, target: cfg.sauveur, t0: cfg.tTop[0], dur: cfg.tTop[1], spins: 3 });
    g += wheelStrip(t, { y: 1440, col: ROUE.red, roster: R, target: cfg.cauchemar, t0: cfg.tBot[0], dur: cfg.tBot[1], spins: 4 });
    if (t > cfg.tTop[0] + cfg.tTop[1] + .3) g += `<text x="540" y="785" text-anchor="middle" font-family="NU" font-weight="900" font-size="34" fill="#fff">${String(S.lvl).padStart(2, '0')} – ${esc(S.name.toUpperCase())}</text>`;
    if (t > cfg.tBot[0] + cfg.tBot[1] + .3) g += `<text x="540" y="1665" text-anchor="middle" font-family="NU" font-weight="900" font-size="34" fill="#fff">${String(C.lvl).padStart(2, '0')} – ${esc(C.name.toUpperCase())}</text>`;
    g += `<rect x="0" y="956" width="1080" height="8" fill="#fff" opacity=".85" filter="url(#neonB)"/>
          <circle cx="540" cy="960" r="58" fill="#0b0b10" stroke="#fff" stroke-width="6"/><text x="540" y="978" text-anchor="middle" font-family="NU" font-weight="900" font-size="48" fill="#fff">VS</text>`;
    g += episodePill(cfg.n, 50, .8);
    return g;
  }
  // écran VS
  const lt = t - cfg.tVs, a = E.back(prog(lt, 0, .35));
  let g = `<rect width="1080" height="960" fill="url(#rBlueBg)"/><rect y="960" width="1080" height="960" fill="url(#rRedBg)"/>
    <rect x="0" y="956" width="1080" height="8" fill="#fff" opacity=".85" filter="url(#neonB)"/>`;
  g += `<g transform="translate(${lerp(-300, 300, a)},960) scale(1.45)">${legendCard(S, 0, 0, 1, ROUE.blue, 1)}<text x="0" y="-180" text-anchor="middle" font-family="NU" font-weight="900" font-size="26" fill="${ROUE.blue}">SAUVEUR</text><text x="0" y="205" text-anchor="middle" font-family="NU" font-weight="900" font-size="40" fill="#fff">${esc(S.name.toUpperCase())}</text></g>`;
  g += `<g transform="translate(${lerp(1380, 780, a)},960) scale(1.45)">${legendCard(C, 0, 0, 1, ROUE.red, 1)}<text x="0" y="-180" text-anchor="middle" font-family="NU" font-weight="900" font-size="26" fill="${ROUE.red}">CAUCHEMAR</text><text x="0" y="205" text-anchor="middle" font-family="NU" font-weight="900" font-size="40" fill="#fff">${esc(C.name.toUpperCase())}</text></g>`;
  g += `<circle cx="540" cy="960" r="${70 * a}" fill="#0b0b10" stroke="#fff" stroke-width="6"/><text x="540" y="982" text-anchor="middle" font-family="NU" font-weight="900" font-size="${56 * a}" fill="#fff">VS</text>`;
  g += episodePill(cfg.n, 50, .8);
  return g;
}
// Légende des captions de l'intro (MAJUSCULES, mots bleus/rouges) : parts = [['LA ROUE ', ''], ['BLEUE', 'b'], ...]
function roueCaption(parts, y = 1830, size = 50, op = 1) {
  const nch = parts.reduce((a, [w]) => a + w.length, 0); size = Math.min(size, 1000 / (nch * .6));
  const c = { b: ROUE.blue, r: ROUE.red, '': '#fff' };
  return `<text x="540" y="${y}" text-anchor="middle" font-family="NU" font-weight="900" font-size="${size}" opacity="${op}" stroke="#000" stroke-width="8" paint-order="stroke">${parts.map(([w, k]) => `<tspan fill="${c[k || '']}">${esc(w)}</tspan>`).join('')}</text>`;
}

// ---- fiche légende (niveau de menace) ---- (mettre { subY: 1730 } sur le plan pour passer les sous-titres sous la fiche)
// cfg = {side:'cauchemar'|'sauveur', name, flag, region, lvl (0-10), label:'EXTRÊME'|'ALLIÉ…?', draw(s)}
function legendProfile(lt, cfg) {
  const col = cfg.side === 'sauveur' ? ROUE.blue : ROUE.red;
  const tag = cfg.side === 'sauveur' ? 'LA ROUE BLEUE · SAUVEUR' : 'LA ROUE ROUGE · CAUCHEMAR';
  const a = E.back(prog(lt, 0, .35)), fillN = Math.round(clamp((lt - .5) / 1.4) * cfg.lvl * 2);
  let bar = '';
  for (let i = 0; i < 20; i++) {
    const c = i < 7 ? '#2ecc71' : i < 13 ? '#f1c40f' : '#e74c3c';
    bar += `<rect x="${-300 + i * 30}" y="-470" width="24" height="30" rx="4" fill="${i < fillN ? c : '#2a2f40'}"/>`;
  }
  return `<rect width="1080" height="1920" fill="#0e0b12"/><g transform="translate(540,1000) scale(${.85 + .15 * a})" opacity="${a}">
    <rect x="-400" y="-760" width="800" height="1320" rx="40" fill="#121420" stroke="${col}" stroke-width="6"/>
    <rect x="-380" y="-740" width="760" height="1280" rx="30" fill="none" stroke="${col}" stroke-opacity=".4" stroke-width="2"/>
    <rect x="-290" y="-715" width="580" height="56" rx="28" fill="${col}"/><text x="0" y="-677" text-anchor="middle" font-family="NU" font-weight="900" font-size="30" fill="#fff">${tag}</text>
    <text x="0" y="-560" text-anchor="middle" font-family="NU" font-weight="900" font-size="110" fill="${ROUE.cream}">${esc(cfg.name.toUpperCase())}</text>
    ${flag(cfg.flag, -200, -530, 66)}<text x="-110" y="-494" font-family="NU" font-weight="900" font-size="38" fill="#fff">${esc(cfg.region.toUpperCase())}</text>
    <text x="0" y="-412" text-anchor="middle" font-family="NU" font-weight="900" font-size="30" fill="#8a90a8">NIVEAU DE MENACE</text>
    <g transform="translate(0,90)">${bar}</g>
    <text x="0" y="-320" text-anchor="middle" font-family="NU" font-weight="900" font-size="40" fill="${cfg.side === 'sauveur' ? '#f1c40f' : '#e74c3c'}" opacity="${prog(lt, 1.9, 2.1)}">${esc(cfg.label)}</text>
    <rect x="-320" y="-270" width="640" height="760" rx="24" fill="#16121c" stroke="${col}" stroke-width="5"/>
    <clipPath id="profClip"><rect x="-320" y="-270" width="640" height="760" rx="24"/></clipPath>
    <g clip-path="url(#profClip)">${cfg.draw(.9)}</g>
  </g>`;
}
// ---- poster vintage « la légende » ----
// cfg = {kicker:'la légende', title:'IL EMPORTE LES ENFANTS', silhouette: svg (sera noirci), scenery:'village'|'forest'|'river'}
function vintagePoster(lt, cfg) {
  let scen = '';
  if (cfg.scenery === 'village') for (let i = 0; i < 6; i++) { const x = -330 + i * 130, h = 90 + (i % 3) * 40; scen += `<path d="M${x},300 v${-h} l60,-60 l60,60 v${h}z" fill="#120d08"/>`; }
  if (cfg.scenery === 'forest') for (let i = 0; i < 7; i++) { const x = -360 + i * 120; scen += `<path d="M${x},300 l60,-${260 + (i % 2) * 80} l60,${260 + (i % 2) * 80}z" fill="#120d08"/>`; }
  if (cfg.scenery === 'river') scen += `<rect x="-380" y="210" width="760" height="120" fill="#7a6a50" opacity=".5"/>${[0, 1, 2, 3].map(i => `<line x1="-300" y1="${230 + i * 24}" x2="300" y2="${230 + i * 24}" stroke="#5a4a34" stroke-width="3"/>`).join('')}`;
  const zoom = 1 + lt * .02;
  return `<rect width="1080" height="1920" fill="url(#vintPaper)"/><g transform="translate(540,960) scale(${zoom})">
    <rect x="-420" y="-700" width="840" height="1260" fill="none" stroke="#3a2e20" stroke-width="5"/>
    <rect x="-400" y="-680" width="800" height="1220" fill="none" stroke="#3a2e20" stroke-width="2"/>
    <text x="0" y="-560" text-anchor="middle" font-family="PF" font-style="italic" font-weight="700" font-size="40" fill="#3a2e20">— ${esc(cfg.kicker || 'la légende')} —</text>
    <text x="0" y="-470" text-anchor="middle" font-family="PF" font-weight="900" font-size="${Math.min(66, 760 / (cfg.title.length * .62))}" fill="#1a130c">${esc(cfg.title.toUpperCase())}</text>
    <rect x="-360" y="-420" width="720" height="760" fill="none" stroke="#3a2e20" stroke-width="4"/>
    <clipPath id="vintClip"><rect x="-360" y="-420" width="720" height="760"/></clipPath>
    <g clip-path="url(#vintClip)"><g filter="url(#toBlack)" opacity=".92">${cfg.silhouette}</g>${scen}</g>
    <path d="M-80,420 q40,-20 80,0 q40,20 80,0" stroke="#3a2e20" stroke-width="3" fill="none"/>
  </g><rect width="1080" height="1920" fill="#7a5a30" opacity=".06"/>`;
}
// ---- horloge digitale (« 02:19 ») ----
function clockBadge(txt, y = 400, op = 1) {
  return `<g transform="translate(540,${y})" opacity="${op}"><rect x="-120" y="-44" width="240" height="88" rx="22" fill="#0b0b10" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>
    <text x="0" y="20" text-anchor="middle" font-family="NU" font-weight="900" font-size="56" fill="#fff">${esc(txt)}</text></g>`;
}
// ---- sous-titres « phrase » (minuscules, 1–3 mots, gros, centrés bas) ----
function buildChunksRoue(words, maxW = 3, maxC = 16) {
  const chunks = []; let cur = null;
  for (const w of words) {
    const len = cur ? cur.words.reduce((a, x) => a + x.w.length + 1, 0) : 0;
    if (!cur || cur.clip !== w.clip || cur.words.length >= maxW || len + w.w.length > maxC || cur.end) { cur = { clip: w.clip, words: [] }; chunks.push(cur); }
    cur.words.push(w);
    if (/[,.!?…:]$/.test(w.w)) cur.end = true;
  }
  chunks.forEach(c => { c.t0 = c.words[0].t0 - .03; });
  chunks.forEach((c, i) => { const nx = chunks[i + 1]; c.t1 = nx ? Math.min(nx.t0, c.words[c.words.length - 1].t1 + .35) : c.words[c.words.length - 1].t1 + .4; });
  return chunks;
}
function subtitlesRoue(t, chunks, shot) {
  const c = chunks.find(c => t >= c.t0 && t < c.t1);
  if (!c) return '';
  const pop = E.back(prog(t, c.t0, c.t0 + .1)), sc = .85 + .15 * pop;
  const txt = c.words.map(w => w.w).join(' ');
  const italic = c.words[0].style !== 'narr';
  return `<g transform="translate(540,${(shot && shot.subY) || 1450}) scale(${sc})" filter="url(#subsh)"><text text-anchor="middle" font-family="NU" font-weight="900" font-size="80" ${italic ? 'font-style="italic"' : ''}
     fill="#fff" stroke="#000" stroke-width="12" stroke-linejoin="round" paint-order="stroke">${esc(txt)}</text></g>`;
}
// ---- VFX de combat ----
// bras fantômes : n rubans ondulants de (x0,y0) vers (x1,y1), p = progression 0..1
function ghostArms(t, x0, y0, x1, y1, p = 1, n = 5) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 60, pts = [];
    for (let k = 0; k <= 10; k++) {
      const u = k / 10 * p;
      const x = lerp(x0 + off, x1 + off * .3, u) + Math.sin(u * 9 + t * 4 + i) * 60 * (1 - u * .5);
      const y = lerp(y0, y1, u) + Math.cos(u * 7 + t * 3 + i * 2) * 40;
      pts.push([x, y]);
    }
    const d = smooth(pts);
    g += `<path d="${d}" stroke="#bfe0ff" stroke-width="34" fill="none" stroke-linecap="round" opacity=".35" filter="url(#b8)"/><path d="${d}" stroke="#eef7ff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/>`;
  }
  return g;
}
// colonne d'eau qui jaillit vers le ciel
function waterColumn(x, yBase, p, t) {
  const h = 1600 * E.out(p), w = 200 + 60 * Math.sin(t * 8);
  let drops = ''; const r = rng(31);
  for (let i = 0; i < 40; i++) drops += `<circle cx="${x + (r() - .5) * w * 2.2}" cy="${yBase - r() * h}" r="${3 + r() * 6}" fill="#e6f2ff" opacity="${.5 * p}"/>`;
  return `<path d="M${x - w / 2},${yBase} L${x - w * .3},${yBase - h} L${x + w * .3},${yBase - h} L${x + w / 2},${yBase}Z" fill="url(#waterCol)" opacity="${.85 * p}" filter="url(#b3)"/>${drops}`;
}
// anneau de glace / onde au sol
function iceRing(x, y, p) {
  return `<ellipse cx="${x}" cy="${y}" rx="${80 + p * 420}" ry="${20 + p * 90}" fill="none" stroke="#dff1ff" stroke-width="${10 * (1 - p)}" opacity="${1 - p}"/>
    <ellipse cx="${x}" cy="${y}" rx="${60 + p * 300}" ry="${14 + p * 60}" fill="#cfe8ff" opacity="${.25 * (1 - p)}"/>`;
}
// brouillard au sol
function fogBands(t, y = 1300, op = .25) {
  let g = ''; for (let i = 0; i < 4; i++) g += `<ellipse cx="${(t * (20 + i * 8) + i * 300) % 1600 - 260}" cy="${y + i * 60}" rx="520" ry="70" fill="#dfe6f5" opacity="${op}" filter="url(#b50)"/>`;
  return g;
}

// =================== VERSION 2 (référence « what.if.lab », format prioritaire) ===================
// Roues très chargées (~20 légendes), cartes à sommet arrondi teintées bleu/rouge, VS en diagonale avec glitch,
// pas de bandeau ni de fiche, sous-titres karaoké MAJUSCULES (lib.js subtitles) avec [mot]B bleu / R rouge / J jaune,
// fin : le sac se referme -> écran noir, yeux qui brillent, dernier mot rouge.
const ROUE2_DEFS = `
<filter id="tintBlue"><feColorMatrix type="matrix" values=".15 .15 .15 0 0  .25 .3 .3 0 .02  .5 .55 .6 0 .12  0 0 0 1 0"/></filter>
<filter id="tintRed"><feColorMatrix type="matrix" values=".6 .55 .5 0 .12  .15 .15 .15 0 0  .15 .15 .15 0 .01  0 0 0 1 0"/></filter>
<filter id="rgbSplit" x="-10%" y="-10%" width="120%" height="120%">
  <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="-9" result="ro"/>
  <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/><feOffset in="gb" dx="9" result="gbo"/>
  <feBlend in="ro" in2="gbo" mode="screen"/></filter>`;

// Mini-portraits génériques (silhouettes) pour remplir les roues
function miniPortrait(kind, s = 1) {
  const eyes = (y = -10, c = '#fff', r = 9, dx = 26) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${dx}" cy="${y}" r="${r}" fill="${c}"/>`;
  const body = `<path d="M-110,260 Q-100,90 0,80 Q100,90 110,260Z" fill="#1c1c24"/>`;
  const K = {
    horns: `${body}<ellipse cy="0" rx="70" ry="85" fill="#3a2418"/><path d="M-50,-60 Q-110,-120 -90,-170 Q-70,-110 -25,-80Z M50,-60 Q110,-120 90,-170 Q70,-110 25,-80Z" fill="#d8c8a0"/>${eyes(-5, '#ff3b2a', 10)}`,
    hat: `${body}<ellipse cy="0" rx="62" ry="80" fill="#121216"/><rect x="-55" y="-140" width="110" height="80" fill="#0a0a0c"/><rect x="-100" y="-66" width="200" height="16" rx="8" fill="#0a0a0c"/>${eyes(-5, '#ff3b2a', 8)}`,
    hood: `<path d="M-120,260 Q-120,-40 0,-150 Q120,-40 120,260Z" fill="#141418"/><ellipse cy="10" rx="48" ry="60" fill="#000"/>${eyes(0, '#fff', 7, 18)}`,
    longhair: `<path d="M-90,-40 Q-100,-140 0,-140 Q100,-140 90,-40 L110,260 L-110,260Z" fill="#0b0b0e"/><ellipse cy="-20" rx="56" ry="74" fill="#ecebe6"/>${eyes(-30, '#0a0a0c', 15, 22)}<path d="M-22,-14 v50 M22,-14 v50" stroke="#555" stroke-width="5"/>`,
    skull: `${body}<ellipse cy="-10" rx="70" ry="82" fill="#e9e4d4"/>${eyes(-15, '#0a0a0c', 18, 28)}<path d="M-6,20 l6,-14 6,14z" fill="#0a0a0c"/><path d="M-36,48 h72" stroke="#0a0a0c" stroke-width="8" stroke-dasharray="8 6"/>`,
    blob: `<ellipse cy="60" rx="120" ry="150" fill="#2a3a2a"/>${eyes(10, '#ffd34d', 14, 34)}<path d="M-40,70 Q0,100 40,70" stroke="#0a0a0c" stroke-width="8" fill="none"/>`,
    wings: `<path d="M0,0 L-160,-80 L-120,60 L-160,160 L0,90 L160,160 L120,60 L160,-80Z" fill="#141418"/><ellipse cy="10" rx="50" ry="90" fill="#1c1c24"/>${eyes(-30, '#ff2a2a', 12, 22)}`,
    mask: `${body}<ellipse cy="-6" rx="66" ry="84" fill="#f0ece2"/><path d="M-50,-30 h36 M14,-30 h36" stroke="#0a0a0c" stroke-width="10"/><path d="M-60,30 Q0,90 60,30" stroke="#b3261e" stroke-width="10" fill="none"/>`,
    witch: `${body}<ellipse cy="0" rx="62" ry="78" fill="#8a8f6a"/><path d="M-90,-50 L0,-210 L90,-50Z" fill="#0a0a0c"/><path d="M-6,0 q20,30 -4,50" stroke="#5a5f3a" stroke-width="10" fill="none"/>${eyes(-14, '#ffd34d', 7, 24)}`,
    dog: `<path d="M-110,200 Q-90,40 -20,10 L-70,-90 L-20,-40 L20,-40 L70,-90 L20,10 Q90,40 110,200Z" fill="#0e0e12"/><path d="M-30,10 Q0,70 30,10Z" fill="#0e0e12"/>${eyes(-20, '#ff3b2a', 9, 22)}`,
    round: `${body}<circle cy="0" r="76" fill="#d9d3c4"/>${eyes(-6, '#0a0a0c', 12, 26)}<path d="M-30,40 Q0,20 30,40" stroke="#0a0a0c" stroke-width="7" fill="none"/>`,
  };
  return `<g transform="scale(${s})">${K[kind] || K.round}</g>`;
}
// Liste de légendes du monde (pour remplir les roues). draw est remplacé par le vrai personnage pour les 2 élus.
const LEGENDES = [
  ['The Golem', 'round'], ['Grim Reaper', 'hood'], ['Black Shuck', 'dog'], ['Jersey Devil', 'wings'], ['Domovoi', 'blob'],
  ['Bloody Mary', 'longhair'], ['Banshee', 'longhair'], ['Kappa', 'blob'], ['Nuckelavee', 'skull'], ['Kuchisake-onna', 'mask'],
  ['Strigoi', 'hood'], ['Krampus', 'horns'], ['Baba Yaga', 'witch'], ['Mothman', 'wings'], ['Leshy', 'horns'],
  ['Chupacabra', 'dog'], ['Jiangshi', 'hat'], ['Tokoloshe', 'blob'], ['The Hat Man', 'hat'], ['La Llorona', 'longhair'],
  ['Baku', 'round'], ['La Ghoula', 'longhair'], ['Teke Teke', 'longhair'], ['Nahual', 'dog'], ['Charro Negro', 'hat'],
  ['Aïcha Kandicha', 'longhair'], ['Wendigo', 'skull'], ['Slenderman', 'mask'],
];
// roster(choix) : construit une liste d'entrées {name, num, draw}. special = {Nom: (s)=>svg} pour les vrais personnages.
function rosterV2(special = {}) {
  return LEGENDES.map(([name, kind], i) => ({ name, num: i + 1, draw: special[name] || (s => miniPortrait(kind, s)) }));
}
function legendCardV2(L, x, y, s, col, hi = 0, dim = 0, tint = true) {
  const id = 'c2' + L.name.replace(/\W/g, '');
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${1 - dim * .75}">
    <path d="M-95,150 L-95,-70 A95,95 0 0 1 95,-70 L95,150Z" fill="#0c0f18" stroke="${col}" stroke-opacity="${.4 + hi * .6}" stroke-width="${3 + hi * 5}"/>
    <clipPath id="${id}"><path d="M-85,110 L-85,-70 A85,85 0 0 1 85,-70 L85,110Z"/></clipPath>
    <g clip-path="url(#${id})"><rect x="-90" y="-160" width="180" height="280" fill="${col === ROUE.blue ? '#0d1b3a' : '#2a0b10'}"/>
      <g ${tint && !hi ? `filter="url(#${col === ROUE.blue ? 'tintBlue' : 'tintRed'})"` : ''}>${L.draw(.42)}</g></g>
    <text x="0" y="-150" text-anchor="middle" font-family="RC" font-weight="800" font-size="20" fill="#fff" opacity=".8">${String(L.num).padStart(2, '0')}</text>
    <text x="0" y="138" text-anchor="middle" font-family="RC" font-weight="800" font-size="19" fill="#fff">${esc(L.name.toUpperCase())}</text>
  </g>`;
}
function wheelStripV2(t, cfg) {
  const n = cfg.roster.length, step = 205;
  const p = clamp((t - cfg.t0) / cfg.dur), e = 1 - Math.pow(1 - p, 3.4);
  const total = (cfg.spins || 2) * n + cfg.target, pos = e * total, landed = p >= 1;
  const blur = landed ? 0 : Math.min(6, (1 - e) * 14);
  let g = `<g ${blur > .5 ? `filter="url(#b3)"` : ''}>`;
  for (let k = -3; k <= 3; k++) {
    const idx = Math.floor(pos) + k, frac = pos - Math.floor(pos);
    const L = cfg.roster[((idx % n) + n) % n], isC = landed && k === 0;
    g += legendCardV2(L, 540 + (k - frac) * step, cfg.y, isC ? 1.08 : 1, cfg.col, isC ? 1 : 0, landed && !isC ? prog(t, cfg.t0 + cfg.dur, cfg.t0 + cfg.dur + .35) : 0);
  }
  g += `</g><path d="M${540 - 104},${cfg.y - 175} L${540 - 104},${cfg.y + 165} M${540 + 104},${cfg.y - 175} L${540 + 104},${cfg.y + 165}" stroke="${cfg.col}" stroke-width="5" filter="url(#neonB)" opacity=".9"/>`;
  if (landed) { const L = cfg.roster[cfg.target]; g += `<text x="540" y="${cfg.y + 215}" text-anchor="middle" font-family="RC" font-weight="800" font-size="40" fill="${cfg.col}" opacity="${prog(t, cfg.t0 + cfg.dur, cfg.t0 + cfg.dur + .3)}">${String(L.num).padStart(2, '0')} – ${esc(L.name.toUpperCase())}</text>`; }
  return g;
}
function roueHalfV2(top, col, t) {
  const y0 = top ? 0 : 960, bg = top ? 'url(#rBlueBg)' : 'url(#rRedBg)';
  let rings = ''; for (let i = 1; i <= 4; i++) rings += `<circle cx="540" cy="${y0 + 520}" r="${i * 160}" fill="none" stroke="${col}" stroke-opacity="${.07 + .04 * Math.sin(t * 2 + i)}" stroke-width="3"/>`;
  return `<rect x="0" y="${y0}" width="1080" height="960" fill="${bg}"/>${rings}
    <text x="540" y="${y0 + (top ? 70 : 125)}" text-anchor="middle" font-family="RC" font-weight="800" font-size="30" fill="#fff" opacity=".7">${top ? 'LA ROUE BLEUE' : 'LA ROUE ROUGE'}</text>
    <text x="540" y="${y0 + (top ? 140 : 195)}" text-anchor="middle" font-family="RC" font-weight="800" font-size="84" fill="${col}" filter="url(#neonB)">${top ? 'SAUVEUR' : 'CAUCHEMAR'}</text>
    <path d="M${top ? '355,95 l-16,16 l16,16 l16,-16z' : '355,150 l-16,16 l16,16 l16,-16z'} M${top ? '725,95 l-16,16 l16,16 l16,-16z' : '725,150 l-16,16 l16,16 l16,-16z'}" fill="none" stroke="${col}" stroke-width="3" opacity=".7"/>`;
}
// cfg = {roster, sauveur, cauchemar, tTop:[t0,dur], tBot:[t0,dur], tVs}
function roueIntroV2(t, cfg) {
  if (t < cfg.tVs) {
    let g = roueHalfV2(true, ROUE.blue, t) + roueHalfV2(false, ROUE.red, t);
    g += wheelStripV2(t, { y: 500, col: ROUE.blue, roster: cfg.roster, target: cfg.sauveur, t0: cfg.tTop[0], dur: cfg.tTop[1], spins: 2 });
    g += wheelStripV2(t, { y: 1440, col: ROUE.red, roster: cfg.roster, target: cfg.cauchemar, t0: cfg.tBot[0], dur: cfg.tBot[1], spins: 2 });
    g += `<rect x="0" y="956" width="1080" height="8" fill="#fff" opacity=".85" filter="url(#neonB)"/>
      <circle cx="540" cy="960" r="44" fill="#0b0b10" stroke="#fff" stroke-width="5"/><text x="540" y="975" text-anchor="middle" font-family="RC" font-weight="800" font-size="38" fill="#fff">VS</text>`;
    return g;
  }
  return vsDiagonal(t, t - cfg.tVs, cfg.roster[cfg.sauveur], cfg.roster[cfg.cauchemar]);
}
// Écran VS en diagonale (sauveur à gauche, cauchemar à droite), flash + glitch RGB à l'impact
function vsDiagonal(t, lt, S, C) {
  const a = E.back(prog(lt, 0, .3)), gl = lt > .25 && lt < .55;
  let g = `<rect width="1080" height="1920" fill="#120509"/>
    <path d="M0,0 L760,0 L320,1920 L0,1920Z" fill="url(#rRedBg)"/><path d="M760,0 L1080,0 L1080,1920 L320,1920Z" fill="#0a0d1c"/>
    <path d="M760,0 L320,1920" stroke="#fff" stroke-width="6" filter="url(#neonB)"/>`;
  const card = (L, col, x, y, nameCol) => `<g transform="translate(${x},${y}) scale(1.9)">${legendCardV2(L, 0, 0, 1, col, 1, 0, false)}</g>
     <text x="${x}" y="${y + 340}" text-anchor="middle" font-family="RC" font-weight="800" font-size="64" fill="${nameCol}" stroke="#000" stroke-width="6" paint-order="stroke">${esc(L.name.toUpperCase())}</text>`;
  let cards = card(S, ROUE.blue, lerp(-200, 300, a), 900, ROUE.blue) + card(C, ROUE.red, lerp(1280, 790, a), 960, ROUE.red);
  cards += `<circle cx="545" cy="930" r="${70 * a}" fill="#fff"/><circle cx="545" cy="930" r="${62 * a}" fill="#0b0b10"/><text x="545" y="955" text-anchor="middle" font-family="RC" font-weight="800" font-size="${64 * a}" fill="#fff">VS</text>`;
  g += gl ? `<g filter="url(#rgbSplit)">${cards}</g>` : cards;
  const fl = 1 - prog(lt, .25, .6);
  if (lt > .25 && fl > 0) g += `<rect width="1080" height="1920" fill="#fff" opacity="${fl * .3}"/>`;
  return g;
}
// Le sac se referme sur la caméra (p 0..1)
function sackClose(p) {
  const y = lerp(-1300, 0, E.in(p));
  return `<g transform="translate(0,${y})"><path d="M-100,-200 L1180,-200 L1180,1100 Q540,1450 -100,1100Z" fill="#6b4a2a"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${80 + i * 180},-200 L${100 + i * 180},1100" stroke="#5a3d22" stroke-width="8" opacity=".6"/>`).join('')}
    <path d="M-100,1100 Q540,1450 1180,1100" stroke="#3e2914" stroke-width="30" fill="none"/></g>`;
}
// Écran noir final avec deux yeux qui brillent
function blackEyes(t, color = '#ff8a1a', y = 900, sc = 1.8) {
  const b = (Math.floor(t * 2.3) % 7 === 6) ? .15 : 1;
  return `<rect width="1080" height="1920" fill="#000"/><g transform="translate(540,${y}) scale(${sc})">
    <circle cx="-48" cy="0" r="44" fill="${color}" opacity=".35" filter="url(#b20)"/><circle cx="48" cy="0" r="44" fill="${color}" opacity=".35" filter="url(#b20)"/>
    <ellipse cx="-48" cy="0" rx="20" ry="${12 * b}" fill="${color}"/><ellipse cx="48" cy="0" rx="20" ry="${12 * b}" fill="${color}"/>
    <ellipse cx="-48" cy="0" rx="4" ry="${10 * b}" fill="#200"/><ellipse cx="48" cy="0" rx="4" ry="${10 * b}" fill="#200"/></g>`;
}
