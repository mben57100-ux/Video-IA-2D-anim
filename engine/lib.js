// ---------- Noyau du moteur : utilitaires, defs, caméra, sous-titres, CTA, overlays ----------
const W = 1080, H = 1920;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  lin: p => p,
  inOut: p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
  out: p => 1 - Math.pow(1 - p, 3),
  in: p => p * p * p,
  back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};
const prog = (t, a, b) => clamp((t - a) / (b - a));
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// Catmull-Rom -> Bézier
function smooth(pts, close = false) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return close ? d + 'Z' : d;
}

const BASE_DEFS = `
<filter id="stk" x="-30%" y="-30%" width="160%" height="160%">
  <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="d"/>
  <feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="o"/>
  <feGaussianBlur in="d" stdDeviation="14" result="sb"/><feOffset in="sb" dy="10" result="so"/>
  <feFlood flood-color="#000" flood-opacity=".45"/><feComposite in2="so" operator="in" result="sh"/>
  <feMerge><feMergeNode in="sh"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="stkThin" x="-30%" y="-30%" width="160%" height="160%">
  <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/>
  <feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="o"/>
  <feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glowS" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="b50" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="50"/></filter>
<filter id="night"><feColorMatrix type="matrix" values=".55 .05 .1 0 0  .05 .6 .15 0 0  .1 .15 .85 0 .02  0 0 0 1 0"/></filter>
<filter id="dusk"><feColorMatrix type="matrix" values=".8 .1 .05 0 .02  .05 .7 .05 0 0  .1 .1 .8 0 .03  0 0 0 1 0"/></filter>
<filter id="pale"><feColorMatrix type="saturate" values=".25"/></filter>
<filter id="subsh" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity=".7"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".75"/></radialGradient>
<radialGradient id="vigRed" cx="50%" cy="50%" r="70%"><stop offset="40%" stop-color="#600" stop-opacity="0"/><stop offset="100%" stop-color="#8a0000" stop-opacity=".8"/></radialGradient>
<radialGradient id="lampGlow"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".85"/><stop offset=".4" stop-color="#ff9e3d" stop-opacity=".3"/><stop offset="1" stop-color="#ff9e3d" stop-opacity="0"/></radialGradient>
<radialGradient id="moonGlow"><stop offset="0" stop-color="#fff8dc" stop-opacity=".55"/><stop offset=".35" stop-color="#cfe0ff" stop-opacity=".18"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>
<radialGradient id="eyeGlow"><stop offset="0" stop-color="#fff3a0"/><stop offset=".35" stop-color="#f5c518" stop-opacity=".8"/><stop offset="1" stop-color="#f5a000" stop-opacity="0"/></radialGradient>
`;

// ----- timeline helpers -----
let TL = null;
function setTimeline(tl) { TL = tl; }
function clipT(id, which = 0) { return TL.clips[id][which]; }
function wordT(id, startsWith, nth = 0, which = 't0') {
  const ws = TL.words.filter(w => w.clip === id && w.w.toLowerCase().replace(/[^a-zà-ÿ'-]/g, '').startsWith(startsWith.toLowerCase().replace(/[^a-zà-ÿ'-]/g, '')));
  if (!ws.length) throw new Error(`word not found ${id} ${startsWith}`);
  return ws[Math.min(nth, ws.length - 1)][which];
}
function speaking(t, clipId) {
  const ws = TL.words.filter(w => w.clip === clipId);
  for (const w of ws) if (t >= w.t0 && t <= w.t1 + .04) return .35 + .65 * Math.abs(Math.sin((t - w.t0) * 17));
  return 0;
}

// ----- subtitles -----
function buildChunks(words) {
  const chunks = []; let cur = null;
  for (const w of words) {
    const len = cur ? cur.words.reduce((a, x) => a + x.w.length + 1, 0) : 0;
    if (!cur || cur.clip !== w.clip || cur.words.length >= 4 || len + w.w.length > 18 || cur.end) {
      cur = { clip: w.clip, words: [] }; chunks.push(cur);
    }
    cur.words.push(w);
    if (/[,.!?…:]$/.test(w.w)) cur.end = true;
  }
  chunks.forEach(c => { c.t0 = c.words[0].t0 - .05; });
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.t1 = next ? Math.min(next.t0, c.words[c.words.length - 1].t1 + .45) : c.words[c.words.length - 1].t1 + .5;
  });
  return chunks;
}
const COL = { J: '#F7B733', R: '#E5452F', Y: '#F7C948', P: '#F59BB5' };
function subtitles(t, chunks) {
  const c = chunks.find(c => t >= c.t0 && t < c.t1);
  if (!c) return '';
  const pop = E.back(prog(t, c.t0, c.t0 + .12));
  const sc = .88 + .12 * pop;
  let spans = '';
  for (const w of c.words) {
    const spoken = t >= w.t0;
    let col = '#fff';
    if (w.style === 'dlg_y') col = COL.Y;
    if (w.style === 'dlg_p') col = COL.P;
    if (w.color) col = COL[w.color];
    spans += `<tspan fill="${col}" fill-opacity="${spoken ? 1 : .42}">${w.w.toUpperCase().replace(/&/g, '&amp;')} </tspan>`;
  }
  const italic = c.words[0].style !== 'narr';
  return `<g transform="translate(540,1290) scale(${sc})" filter="url(#subsh)">
    <text x="0" y="0" text-anchor="middle" font-family="RC" font-weight="800" font-size="76" ${italic ? 'font-style="italic"' : ''}
      stroke="#000" stroke-width="10" stroke-linejoin="round" paint-order="stroke" letter-spacing="0.5">${spans.trim()}</text></g>`;
}

// ----- CTA bouton commente -----
function cta(t, t0, t1) {
  if (t < t0 || t > t1) return '';
  const a = E.back(prog(t, t0, t0 + .45)), b = 1 - E.in(prog(t, t1 - .35, t1));
  const y = lerp(-160, 230, a) - (1 - b) * 380;
  const pulse = 1 + .03 * Math.sin((t - t0) * 7);
  return `<g transform="translate(540,${y}) scale(${pulse})" opacity="${b}">
    <rect x="-470" y="-82" width="940" height="164" rx="82" fill="#0d0d12" fill-opacity=".9" stroke="#fff" stroke-width="5"/>
    <g transform="translate(-380,0)">
      <circle r="52" fill="#F7B733"/>
      <path d="M-26,-20 h52 a10,10 0 0 1 10,10 v26 a10,10 0 0 1 -10,10 h-28 l-16,14 v-14 h-8 a10,10 0 0 1 -10,-10 v-26 a10,10 0 0 1 10,-10z" fill="#0d0d12"/>
      <circle cx="-12" cy="3" r="4.5" fill="#F7B733"/><circle cx="2" cy="3" r="4.5" fill="#F7B733"/><circle cx="16" cy="3" r="4.5" fill="#F7B733"/>
    </g>
    <text x="45" y="-14" text-anchor="middle" font-family="RC" font-weight="800" font-size="46" fill="#fff">COMMENTE</text>
    <text x="45" y="44" text-anchor="middle" font-family="RC" font-weight="800" font-style="italic" font-size="46" fill="#F7B733">« FAIS LA LÉGENDE DE MON PAYS »</text>
  </g>`;
}

// ----- overlays -----
function vignette(op = 1) { return `<rect width="${W}" height="${H}" fill="url(#vig)" opacity="${op}"/>`; }
function grain(t) {
  const r = rng(Math.floor(t * 12) * 7919 + 1); let s = '';
  for (let i = 0; i < 70; i++) s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * H).toFixed(0)}" r="${(1 + r() * 2).toFixed(1)}" fill="#fff" opacity="${(r() * .06).toFixed(3)}"/>`;
  return s;
}
function flash(t, events) {
  let o = 0; for (const e of events) { const p = prog(t, e.t, e.t + (e.d || .25)); if (t >= e.t && p < 1) o = Math.max(o, (e.o || .85) * (1 - p)); }
  return o > 0 ? `<rect width="${W}" height="${H}" fill="${'#fff'}" opacity="${o.toFixed(3)}"/>` : '';
}
function shakeOffset(t, events) {
  let x = 0, y = 0;
  for (const e of events) {
    if (t >= e.t && t < e.t + e.d) {
      const k = (1 - (t - e.t) / e.d) * e.a;
      x += Math.sin(t * 93.1 + e.t) * k; y += Math.cos(t * 71.7 + e.t * 3) * k;
    }
  }
  return [x, y];
}
function camera(content, cam, p) {
  // cam: {s:[a,b], x:[a,b], y:[a,b], ease}
  const e = (cam.ease || E.inOut)(p);
  const s = lerp(cam.s[0], cam.s[1], e), x = lerp((cam.x || [0, 0])[0], (cam.x || [0, 0])[1], e), y = lerp((cam.y || [0, 0])[0], (cam.y || [0, 0])[1], e);
  return `<g transform="translate(540,960) scale(${s.toFixed(4)}) translate(${(-540 + x).toFixed(2)},${(-960 + y).toFixed(2)})">${content}</g>`;
}

// ----- frame assembly -----
function makeFrame(t, story) {
  const shot = story.shots.find(s => t >= s.t0 && t < s.t1) || story.shots[story.shots.length - 1];
  const lt = t - shot.t0, p = clamp(lt / (shot.t1 - shot.t0));
  let inner = shot.draw(t, lt, p, shot);
  inner = camera(inner, shot.cam || { s: [1, 1.06] }, p);
  const [sx, sy] = shakeOffset(t, story.shakes);
  let out = `<defs>${BASE_DEFS}${RIM_DEFS}${story.defs || ''}</defs><rect width="${W}" height="${H}" fill="#000"/>`;
  out += `<g transform="translate(${sx.toFixed(1)},${sy.toFixed(1)})">${inner}</g>`;
  out += (shot.noVig ? '' : vignette(shot.vig ?? 1)) + grain(t);
  if (shot.post) out += shot.post(t, lt, p);
  // fondu depuis noir au début du plan si demandé
  if (shot.fadeIn) { const o = 1 - prog(lt, 0, shot.fadeIn); if (o > 0) out += `<rect width="${W}" height="${H}" fill="#000" opacity="${o}"/>`; }
  if (shot.fadeOut) { const o = prog(t, shot.t1 - shot.fadeOut, shot.t1); if (o > 0) out += `<rect width="${W}" height="${H}" fill="#000" opacity="${o}"/>`; }
  out += flash(t, story.flashes);
  if (shot.fg) out += shot.fg(t, lt, p);  // avant-plan non soumis à la caméra (ex. silhouette floue)
  if (!shot.noSubs) out += subtitles(t, story.chunks);
  if (story.cta) out += cta(t, story.cta[0], story.cta[1]);
  return out;
}

// =================== Effets ajoutés (analyse Teke Teke / Nahual) ===================
// Contours colorés selon la lumière (remplace le contour blanc en scène sombre) : filter="url(#rimRed)" etc.
const RIM_DEFS = ['Red:#ff3b30', 'Orange:#ff9a3c', 'Cyan:#5fe1ff', 'Moon:#bcd0ff'].map(s => {
  const [n, c] = s.split(':');
  return `<filter id="rim${n}" x="-30%" y="-30%" width="160%" height="160%">
  <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/><feFlood flood-color="${c}"/><feComposite in2="d" operator="in" result="o"/>
  <feGaussianBlur in="o" stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}).join('') + `<filter id="fgBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="toBlack"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>
<linearGradient id="rainG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3ff" stop-opacity="0"/><stop offset="1" stop-color="#cfe3ff" stop-opacity=".55"/></linearGradient>`;

// Carton noir avec un seul mot (ex. « DEUX. » en rouge) — à utiliser comme plan entier, avec noSubs:true
function blackCard(t, lt, word, color = '#E5452F') {
  const sc = .9 + .1 * E.back(prog(lt, 0, .18));
  return `${`<rect width="${W}" height="${H}" fill="#000"/>`}<g transform="translate(540,1000) scale(${sc})">
    <text text-anchor="middle" font-family="RC" font-weight="900" font-size="130" fill="${color}" stroke="#000" stroke-width="8" paint-order="stroke">${word}</text></g>`;
}
// Pluie (traits obliques) ; density 0..1
function rain(t, density = 1, angle = 12) {
  const r = rng(4242); let s = '';
  const n = Math.round(160 * density);
  for (let i = 0; i < n; i++) {
    const x0 = r() * 1400 - 160, sp = 1800 + r() * 900, L = 40 + r() * 50, ph = r();
    const y = ((t * sp + ph * 2200) % 2200) - 140, x = x0 + y * Math.tan(angle * Math.PI / 180);
    s += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + L * Math.tan(angle * Math.PI / 180)).toFixed(0)}" y2="${(y + L).toFixed(0)}" stroke="url(#rainG)" stroke-width="3"/>`;
  }
  return s;
}
// Gouttes sur une vitre (pour plan derrière une fenêtre)
function windowDrops(t, x, y, w, h, n = 40) {
  const r = rng(77); let s = '';
  for (let i = 0; i < n; i++) {
    const dx = r() * w, slide = (r() < .3) ? ((t * 40 * (1 + r())) % h) : r() * h;
    s += `<ellipse cx="${(x + dx).toFixed(0)}" cy="${(y + slide).toFixed(0)}" rx="${(3 + r() * 4).toFixed(1)}" ry="${(5 + r() * 6).toFixed(1)}" fill="#e6f0ff" opacity=".35"/>`;
  }
  return s;
}
// Neige
function snow(t, density = 1) {
  const r = rng(99); let s = '';
  for (let i = 0; i < Math.round(120 * density); i++) {
    const x0 = r() * 1200 - 60, sp = 60 + r() * 120, ph = r() * 2000, rad = 2 + r() * 5;
    const y = (t * sp + ph) % 2000 - 40, x = x0 + Math.sin(t * .8 + i) * 30;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(1)}" fill="#fff" opacity="${(.4 + r() * .5).toFixed(2)}"/>`;
  }
  return s;
}
// Néon / lampe qui grésille : renvoie une opacité 0..1 (à multiplier sur la lumière)
function flicker(t, amount = 1, seed = 1) {
  const k = Math.floor(t * 18 + seed * 13);
  const r = rng(k * 2654435761 >>> 0)();
  return r < .18 * amount ? .15 : (r < .3 * amount ? .6 : 1);
}
// Cône de lumière d'une lampe (plafonnier, réverbère)
function lightCone(x, y, w, h, op = 1, color = '#fff6d8') {
  return `<path d="M${x - 18},${y} L${x + 18},${y} L${x + w / 2},${y + h} L${x - w / 2},${y + h}Z" fill="${color}" opacity="${(.16 * op).toFixed(3)}" filter="url(#b20)"/>
    <circle cx="${x}" cy="${y}" r="26" fill="${color}" opacity="${op}" filter="url(#glowS)"/>`;
}
// Ombre portée sur un mur (silhouette d'une forme SVG, décalée/étirée) — l'ombre révèle la vraie nature
function wallShadow(shapeSvg, dx = -60, sx = 1.25, skew = -18, op = .45) {
  return `<g opacity="${op}" transform="translate(${dx},0) skewX(${skew}) scale(${sx},1)" filter="url(#b3)"><g filter="url(#toBlack)">${shapeSvg}</g></g>`;
}
// Bande de police (preuves / faits divers)
function policeTape(y, rot = -6, t = 0) {
  let s = ''; for (let i = -2; i < 14; i++) s += `<rect x="${i * 120 + (t * 20 % 120)}" y="-22" width="60" height="44" fill="#111"/>`;
  return `<g transform="translate(-100,${y}) rotate(${rot})"><rect x="0" y="-22" width="1400" height="44" fill="#f2c230"/>${s}</g>`;
}
// Écran de télé « infos du soir »
function tvNews(x, y, s, inner, t = 0) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-190" width="600" height="380" rx="24" fill="#16171c"/>
    <rect x="-275" y="-168" width="550" height="310" fill="#0d1a2e"/><g>${inner || ''}</g>
    <rect x="-275" y="100" width="550" height="42" fill="#c0392b"/><text x="-260" y="130" font-family="RC" font-weight="900" font-size="28" fill="#fff">INFOS · DERNIÈRE MINUTE</text>
    <rect x="-275" y="-168" width="550" height="310" fill="#fff" opacity="${(.03 + .03 * Math.sin(t * 40)).toFixed(3)}"/></g>`;
}
