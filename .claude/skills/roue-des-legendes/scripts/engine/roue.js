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
