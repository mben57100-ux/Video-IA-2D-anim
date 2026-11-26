// =================== Bibliothèque de personnages / décors (style « sticker » des premières vidéos) ===================
// Inclure PERSO_DEFS + PERSO_POSTER_DEFS dans story.defs. Un scenes.js peut redéfinir n'importe quelle fonction.
const PERSO_DEFS = `
<linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040817"/><stop offset=".55" stop-color="#101c3f"/><stop offset="1" stop-color="#2a3b6a"/></linearGradient>
<linearGradient id="skyS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a5e"/><stop offset=".35" stop-color="#a8507a"/><stop offset=".62" stop-color="#ee8a58"/><stop offset=".8" stop-color="#fbc77c"/></linearGradient>
<linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d97dc"/><stop offset="1" stop-color="#b6e2f7"/></linearGradient>
<linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151a3d"/><stop offset=".5" stop-color="#4b3566"/><stop offset=".85" stop-color="#c06a5a"/></linearGradient>
<linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7c94"/><stop offset="1" stop-color="#c9c3b8"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient>
<linearGradient id="beamV" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#245d9c"/><stop offset=".5" stop-color="#2d6fb5"/><stop offset="1" stop-color="#22558f"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3ead2"/><stop offset="1" stop-color="#d9caa4"/></linearGradient>
<radialGradient id="faceShade" cx="50%" cy="35%" r="65%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="headl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3c0" stop-opacity=".65"/><stop offset="1" stop-color="#fff3c0" stop-opacity="0"/></linearGradient>
`;

// ---------------- éléments de décor ----------------
function rect(c, o = 1) { return `<rect x="-200" y="-200" width="1480" height="2320" fill="${c}" opacity="${o}"/>`; }
function moon(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r * 4.5}" fill="url(#moonGlow)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="#f6f1dc"/>
  <circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .18}" fill="#e2dbc0"/><circle cx="${x + r * .25}" cy="${y + r * .3}" r="${r * .22}" fill="#e2dbc0"/>
  <circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .1}" fill="#e2dbc0"/><circle cx="${x - r * .4}" cy="${y + r * .35}" r="${r * .09}" fill="#e2dbc0"/>`;
}
function stars(t, n = 90, yMax = 1100, seed = 3) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * 1280 - 100, y = r() * yMax - 100, rad = .8 + r() * 2.2, ph = r() * 6.28;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(1)}" fill="#fff" opacity="${(.35 + .5 * Math.abs(Math.sin(t * 1.3 + ph))).toFixed(2)}"/>`;
  }
  return s;
}
function dune(yb, amp, fr, ph, fill, crest, x0 = -300, x1 = 1380) {
  const pts = [];
  for (let x = x0; x <= x1; x += 80) pts.push([x, yb - amp * (Math.sin(x * fr + ph) * .65 + Math.sin(x * fr * 2.3 + ph * 1.7) * .35)]);
  const top = smooth(pts);
  return `<path d="${top} L${x1},2300 L${x0},2300Z" fill="${fill}"/>` + (crest ? `<path d="${top}" fill="none" stroke="${crest}" stroke-width="5" opacity=".55"/>` : '');
}
function dunesNight(shift = 0) {
  return dune(1150, 70, .004, 1 + shift, '#1a2546', '#4d64a0') + dune(1320, 90, .003, 2.5 + shift, '#141d3a', '#3f5590') + dune(1560, 110, .0025, 4 + shift, '#0e1530', '#33477c');
}
function dunesSunset() {
  return dune(1180, 60, .004, 1, '#c9734a', '#f2a66a') + dune(1350, 80, .003, 2.2, '#a85a3c', '#e08a5a') + dune(1600, 100, .0025, 3.6, '#8a4632', '#c06a48');
}
function dunesDay() {
  return dune(1080, 70, .004, .5, '#f0c27a', '#fff0c0') + dune(1180, 60, .0035, 2, '#e4ae63', '#f8d79a');
}
function palm(x, y, s, fill = '#2d5a3a', trunk = '#7a5a3a') {
  let fr = '';
  const angles = [-160, -125, -95, -60, -25, 10];
  for (const a of angles) {
    const rad = a * Math.PI / 180, L = 150;
    const ex = Math.cos(rad) * L, ey = Math.sin(rad) * L * .7 + 40;
    fr += `<path d="M0,0 Q${ex * .5},${ey * .5 - 60} ${ex},${ey} Q${ex * .45},${ey * .5 - 20} 0,0Z" fill="${fill}"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-10,0 Q-25,180 10,360 L28,360 Q-5,180 10,0Z" fill="${trunk}"/>${fr}</g>`;
}
function ksar(x, y, s, mode) {
  const C = { day: ['#d39a5e', '#b8804a', '#2c6fb3'], sunset: ['#8a4b3a', '#6f3a2e', '#3b2430'], night: ['#1d2340', '#161b33', '#ffc76b'] }[mode];
  const houses = [[-260, 160, 150], [-120, 200, 120], [10, 260, 160], [160, 180, 130], [280, 140, 110]];
  let g = '';
  for (const [hx, hh, hw] of houses) {
    g += `<rect x="${hx}" y="${-hh}" width="${hw}" height="${hh}" fill="${C[0]}"/><rect x="${hx + hw * .72}" y="${-hh}" width="${hw * .28}" height="${hh}" fill="${C[1]}"/>`;
    for (let k = 0; k < hw / 22; k++) g += `<rect x="${hx + k * 22}" y="${-hh - 14}" width="12" height="14" fill="${C[0]}"/>`;
    g += `<rect x="${hx + hw * .3}" y="${-hh * .6}" width="16" height="22" fill="${C[2]}" ${mode === 'night' ? 'filter="url(#glowS)"' : ''}/>`;
  }
  g += `<rect x="-60" y="-340" width="56" height="340" fill="${C[0]}"/><path d="M-66,-340 L-32,-380 L2,-340Z" fill="${C[0]}"/>`; // minaret
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function goat(x, y, s, flip = 1, t = 0) {
  const bob = Math.sin(t * 3) * 3;
  return `<g transform="translate(${x},${y}) scale(${s * flip},${s})" filter="url(#stkThin)">
    <rect x="-55" y="0" width="12" height="55" rx="5" fill="#6b4a2f"/><rect x="-30" y="0" width="12" height="55" rx="5" fill="#6b4a2f"/>
    <rect x="20" y="0" width="12" height="55" rx="5" fill="#6b4a2f"/><rect x="42" y="0" width="12" height="55" rx="5" fill="#6b4a2f"/>
    <ellipse cx="0" cy="-5" rx="72" ry="42" fill="#f1ece2"/><ellipse cx="-20" cy="-15" rx="25" ry="18" fill="#7b5634"/>
    <g transform="translate(70,${-40 + bob})"><ellipse cx="0" cy="0" rx="26" ry="34" fill="#f1ece2" transform="rotate(25)"/>
    <path d="M-8,-28 Q-30,-70 -40,-50" stroke="#5a4a3a" stroke-width="7" fill="none"/><path d="M6,-28 Q0,-75 -18,-62" stroke="#5a4a3a" stroke-width="7" fill="none"/>
    <circle cx="8" cy="-6" r="4" fill="#222"/><path d="M10,25 L6,45 L16,30Z" fill="#d9d2c3"/></g></g>`;
}

// ---------------- personnages ----------------
function eyesFor(expr, look = 0, y = -120) {
  const L = -36, R = 36;
  if (expr === 'neutral' || expr === 'worried' || expr === 'relief')
    return `<ellipse cx="${L + look}" cy="${y}" rx="11" ry="${expr === 'relief' ? 3 : 14}" fill="#1a1210"/><ellipse cx="${R + look}" cy="${y}" rx="11" ry="${expr === 'relief' ? 3 : 14}" fill="#1a1210"/>`;
  const rr = expr === 'shout' ? 22 : 20, pr = expr === 'scared' ? 7 : 9;
  return `<circle cx="${L}" cy="${y}" r="${rr}" fill="#fff"/><circle cx="${R}" cy="${y}" r="${rr}" fill="#fff"/>
    <circle cx="${L + look}" cy="${y + 1}" r="${pr}" fill="#1a1210"/><circle cx="${R + look}" cy="${y + 1}" r="${pr}" fill="#1a1210"/>`;
}
function browsFor(expr, y = -160) {
  if (expr === 'worried' || expr === 'scared') return `<path d="M-56,${y + 6} L-20,${y - 8}" stroke="#24170f" stroke-width="7" stroke-linecap="round"/><path d="M56,${y + 6} L20,${y - 8}" stroke="#24170f" stroke-width="7" stroke-linecap="round"/>`;
  if (expr === 'shout') return `<path d="M-58,${y - 10} Q-38,${y - 26} -18,${y - 14}" stroke="#24170f" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M58,${y - 10} Q38,${y - 26} 18,${y - 14}" stroke="#24170f" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return `<path d="M-54,${y} L-22,${y - 4}" stroke="#24170f" stroke-width="7" stroke-linecap="round"/><path d="M54,${y} L22,${y - 4}" stroke="#24170f" stroke-width="7" stroke-linecap="round"/>`;
}
function mouthFor(expr, y = -62, open = 0) {
  if (expr === 'shout') return `<ellipse cx="0" cy="${y + 6}" rx="34" ry="40" fill="#5a1414"/><ellipse cx="0" cy="${y + 30}" rx="20" ry="10" fill="#d0605a"/>`;
  if (expr === 'surprised' || expr === 'scared') return `<ellipse cx="0" cy="${y}" rx="${10 + open * 8}" ry="${13 + open * 10}" fill="#4a1a14"/>`;
  if (expr === 'worried') return `<path d="M-18,${y + 2} Q0,${y - 8} 18,${y + 2}" stroke="#4a1a14" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (open > 0) return `<ellipse cx="0" cy="${y}" rx="${12 + open * 6}" ry="${4 + open * 14}" fill="#4a1a14"/>`;
  return `<path d="M-18,${y - 4} Q0,${y + 10} 18,${y - 4}" stroke="#4a1a14" stroke-width="6" fill="none" stroke-linecap="round"/>`;
}

// Garçon / homme. Origine = base du cou.
function boy(o = {}) {
  const skin = o.skin || '#c48a5c', hair = '#24170f', shirt = o.shirt || '#d9443a', shorts = o.adult || o.tall ? (o.pants || '#2b2f3a') : '#35507e';
  const ph = o.run ?? null;
  // course « Ghoula » (±40°) conservée pour l'enfant ; pour un ado/adulte grand (tall) les bras restent vers l'extérieur
  const aL = ph !== null ? (o.tall ? 18 + Math.sin(ph) * 22 : Math.sin(ph) * 40) : (o.armL || 0);
  const aR = ph !== null ? (o.tall ? -18 + Math.sin(ph) * 22 : -Math.sin(ph) * 40) : (o.armR || 0);
  const lL = ph !== null ? Math.sin(ph) * 28 : 0, lR = -lL;
  const legLen = o.tall ? 320 : (o.adult ? 190 : 150), torso = o.tall ? 300 : (o.adult ? 230 : 190);
  let body = `
   <g transform="rotate(${lL},-35,${torso + 70})"><rect x="-62" y="${torso + 60}" width="36" height="${legLen}" rx="17" fill="${o.adult || o.tall ? (o.pants || '#2b2f3a') : skin}"/><ellipse cx="-44" cy="${torso + 60 + legLen}" rx="28" ry="12" fill="#3a2a22"/></g>
   <g transform="rotate(${lR},35,${torso + 70})"><rect x="26" y="${torso + 60}" width="36" height="${legLen}" rx="17" fill="${o.adult || o.tall ? (o.pants || '#2b2f3a') : skin}"/><ellipse cx="44" cy="${torso + 60 + legLen}" rx="28" ry="12" fill="#3a2a22"/></g>
   <path d="M-82,${torso - 5} L82,${torso - 5} L86,${torso + 85} L6,${torso + 85} L0,${torso + 55} L-6,${torso + 85} L-86,${torso + 85}Z" fill="${shorts}"/>
   <rect x="-18" y="-34" width="36" height="44" fill="${skin}"/>
   <path d="M-78,0 Q-88,70 -82,${torso} L82,${torso} Q88,70 78,0 Q0,-22 -78,0Z" fill="${shirt}"/>
   <path d="M-30,-8 Q0,22 30,-8" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="6"/>
   <g transform="rotate(${aL},-80,12)"><rect x="-112" y="2" width="38" height="70" rx="18" fill="${shirt}"/><rect x="-108" y="60" width="30" height="${torso - 60}" rx="15" fill="${skin}"/><circle cx="-93" cy="${torso + 2}" r="19" fill="${skin}"/>${o.lamp ? `<rect x="-104" y="${torso - 10}" width="22" height="58" rx="6" fill="#444"/><circle cx="-93" cy="${torso + 52}" r="13" fill="#fff6c8" filter="url(#glowS)"/>` : ''}</g>
   <g transform="rotate(${aR},80,12)"><rect x="74" y="2" width="38" height="70" rx="18" fill="${shirt}"/><rect x="78" y="60" width="30" height="${torso - 60}" rx="15" fill="${skin}"/><circle cx="93" cy="${torso + 2}" r="19" fill="${skin}"/></g>`;
  if (o.adult) body = body.replace(/fill="#e9a92f"/g, `fill="${shirt}"`);
  let head;
  const hy = -125;
  if (o.view === 'back') {
    head = `<circle cx="-98" cy="${hy}" r="20" fill="${skin}"/><circle cx="98" cy="${hy}" r="20" fill="${skin}"/>
      <circle cx="0" cy="${hy}" r="100" fill="${skin}"/><path d="M-102,${hy + 5} C-110,${hy - 130} 110,${hy - 130} 102,${hy + 5} C80,${hy + 60} -80,${hy + 60} -102,${hy + 5}Z" fill="${hair}"/>
      <path d="M-60,${hy - 92} L-48,${hy - 138} L-26,${hy - 106} L-8,${hy - 148} L10,${hy - 108} L34,${hy - 138} L40,${hy - 95}Z" fill="${hair}"/>`;
  } else {
    const e = o.expr || 'neutral';
    head = `<circle cx="-98" cy="${hy}" r="20" fill="${skin}"/><circle cx="98" cy="${hy}" r="20" fill="${skin}"/>
      <circle cx="0" cy="${hy}" r="100" fill="${skin}"/>
      ${o.adult ? `<path d="M-90,${hy + 20} Q-80,${hy + 100} 0,${hy + 102} Q80,${hy + 100} 90,${hy + 20} Q60,${hy + 75} 0,${hy + 78} Q-60,${hy + 75} -90,${hy + 20}Z" fill="#3a2a22" opacity=".55"/>` : ''}
      <path d="M-110,${hy + 12} C-130,${hy - 160} 130,${hy - 160} 110,${hy + 12} C104,${hy - 46} 76,${hy - 60} 44,${hy - 56} C28,${hy - 74} -8,${hy - 54} -30,${hy - 66} C-62,${hy - 58} -98,${hy - 40} -110,${hy + 12}Z" fill="${hair}"/>
      ${o.adult ? '' : `<path d="M-60,${hy - 95} L-48,${hy - 140} L-26,${hy - 108} L-8,${hy - 150} L10,${hy - 110} L34,${hy - 140} L40,${hy - 98}Z" fill="${hair}"/>`}
      <circle cx="-62" cy="${hy + 22}" r="14" fill="#e07a6a" opacity=".35"/><circle cx="62" cy="${hy + 22}" r="14" fill="#e07a6a" opacity=".35"/>
      ${eyesFor(e, o.look || 0, hy + 5)}${browsFor(e, hy - 35)}${mouthFor(e, hy + 58, o.talk || 0)}
      ${o.sweat ? `<path d="M88,${hy - 40} q10,22 0,30 q-10,-8 0,-30z" fill="#bfe6ff"/>` : ''}
      ${o.pale ? `<circle cx="0" cy="${hy}" r="100" fill="#9fb6d8" opacity=".3"/>` : ''}`;
  }
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1}) rotate(${o.rot || 0})">
    <g filter="url(#stk)"><g ${o.tint ? `filter="url(#${o.tint})"` : ''}>${o.bust ? '' : body}${o.bust ? `<path d="M-78,0 Q-88,70 -90,420 L90,420 Q88,70 78,0 Q0,-22 -78,0Z" fill="${shirt}"/><rect x="-18" y="-34" width="36" height="44" fill="${skin}"/>` : ''}${o.tall ? `<g transform="translate(0,8) scale(.78)">${head}</g>` : head}</g></g></g>`;
}

// Grand-mère. Origine = base du cou.
function grandma(o = {}) {
  const skin = o.pale ? '#c4ad95' : '#a8744e', robe = '#f0b92e', scarf = '#7a1f3d';
  const hy = -120, e = o.expr || 'stern';
  let arm = '';
  if (o.finger === 'up') arm = `<path d="M-80,30 Q-150,10 -150,-110" stroke="${robe}" stroke-width="52" fill="none" stroke-linecap="round"/>
     <g transform="translate(-150,-140) rotate(-6)">
       <rect x="-34" y="-104" width="22" height="84" rx="11" fill="${skin}"/>
       <rect x="-36" y="-34" width="72" height="70" rx="24" fill="${skin}"/>
       <path d="M-10,-30 v20 M8,-28 v20 M24,-24 v18" stroke="#7a4c30" stroke-width="4" stroke-linecap="round"/>
       <rect x="-30" y="4" width="46" height="18" rx="9" fill="#96623f"/>
     </g>`;
  else if (o.finger === 'lips') arm = `<path d="M80,30 Q100,120 40,70" stroke="${robe}" stroke-width="52" fill="none" stroke-linecap="round"/>
     <circle cx="20" cy="-50" r="30" fill="${skin}"/><rect x="-6" y="${hy + 30}" width="20" height="70" rx="10" fill="${skin}"/>`;
  const eyes = e === 'worried' || o.pale
    ? `<circle cx="-36" cy="${hy + 2}" r="16" fill="#fff"/><circle cx="36" cy="${hy + 2}" r="16" fill="#fff"/><circle cx="-36" cy="${hy + 3}" r="7" fill="#1a1210"/><circle cx="36" cy="${hy + 3}" r="7" fill="#1a1210"/>`
    : `<ellipse cx="-36" cy="${hy + 2}" rx="11" ry="8" fill="#1a1210"/><ellipse cx="36" cy="${hy + 2}" rx="11" ry="8" fill="#1a1210"/><path d="M-50,${hy - 6} L-22,${hy - 8}M50,${hy - 6} L22,${hy - 8}" stroke="${skin}" stroke-width="6"/>`;
  const brows = e === 'worried' || o.pale
    ? `<path d="M-56,${hy - 22} L-20,${hy - 36}M56,${hy - 22} L20,${hy - 36}" stroke="#d6d0c8" stroke-width="9" stroke-linecap="round"/>`
    : `<path d="M-58,${hy - 34} L-18,${hy - 22}M58,${hy - 34} L18,${hy - 22}" stroke="#d6d0c8" stroke-width="10" stroke-linecap="round"/>`;
  const talk = o.talk || 0;
  const mouth = talk > 0 ? `<ellipse cx="0" cy="${hy + 62}" rx="${12 + talk * 4}" ry="${3 + talk * 11}" fill="#3a1410"/>` :
    `<path d="M-22,${hy + 64} Q0,${hy + 58} 22,${hy + 64}" stroke="#3a1410" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})"><g filter="url(#stk)"><g ${o.tint ? `filter="url(#${o.tint})"` : ''}>
    <path d="M-100,10 Q-120,200 -130,600 L130,600 Q120,200 100,10 Q0,-25 -100,10Z" fill="${robe}"/>
    <rect x="-125" y="200" width="250" height="22" fill="#c0392b"/><rect x="-125" y="228" width="250" height="10" fill="#2e8b57"/>
    <path d="M-125,250 ${Array.from({ length: 10 }, (_, i) => `L${-125 + i * 25 + 12},270 L${-125 + (i + 1) * 25},250`).join(' ')}" stroke="#c0392b" stroke-width="7" fill="none"/>
    <rect x="-125" y="290" width="250" height="16" fill="#1f6fa8"/>
    <path d="M-100,10 Q-60,120 -20,160 L20,160 Q60,120 100,10 Q0,-25 -100,10Z" fill="${scarf}"/>
    ${arm}
    <path d="M-130,${hy - 10} C-140,${hy - 170} 140,${hy - 170} 130,${hy - 10} L120,${hy + 120} L-120,${hy + 120}Z" fill="${scarf}"/>
    <circle cx="0" cy="${hy}" r="94" fill="${skin}"/>
    <path d="M-104,${hy - 30} C-100,${hy - 140} 100,${hy - 140} 104,${hy - 30} C70,${hy - 70} -70,${hy - 70} -104,${hy - 30}Z" fill="${scarf}"/>
    <path d="M-100,${hy - 48} C-60,${hy - 82} 60,${hy - 82} 100,${hy - 48}" stroke="#e0a91f" stroke-width="12" fill="none"/>
    ${[-70, -35, 0, 35, 70].map(x => `<circle cx="${x}" cy="${hy - 100 + Math.abs(x) * .4}" r="5" fill="#e0a91f"/>`).join('')}
    <path d="M-40,${hy - 52} q20,-6 40,0 M-28,${hy - 40} q14,-5 28,0" stroke="#7a4c30" stroke-width="3" fill="none" opacity=".6"/>
    ${eyes}${brows}
    <path d="M-62,${hy + 10} q6,10 0,20 M62,${hy + 10} q-6,10 0,20 M-30,${hy + 40} q-10,14 -4,30 M30,${hy + 40} q10,14 4,30" stroke="#7a4c30" stroke-width="3.5" fill="none" opacity=".7"/>
    <path d="M-10,${hy + 32} q10,10 20,0" stroke="#7a4c30" stroke-width="4" fill="none"/>
    ${mouth}
    <path d="M0,${hy + 74} v22 M-10,${hy + 78} l10,8 l10,-8" stroke="#2a5d6b" stroke-width="4" fill="none"/><circle cx="-12" cy="${hy + 92}" r="3" fill="#2a5d6b"/><circle cx="12" cy="${hy + 92}" r="3" fill="#2a5d6b"/><circle cx="0" cy="${hy - 62}" r="0"/>
    <path d="M0,${hy - 62} l-6,8 6,8 6,-8z" fill="#2a5d6b"/>
    ${o.pale ? `<circle cx="0" cy="${hy}" r="94" fill="#c9d6e8" opacity=".28"/>` : ''}
  </g></g></g>`;
}

// Ghoula de dos, assise, qui se coiffe. Origine = sol.
function ghoulaBack(o = {}, t = 0) {
  const a = Math.sin(t * 2.2) * .5 + .5;
  const hx = 70 + a * 20, hy = -420 + a * 240;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})">
    <path d="M-150,0 Q-140,-190 -78,-300 L78,-300 Q140,-190 150,0Z" fill="#07070b"/>
    <path d="M-150,0 Q-140,-190 -78,-300" stroke="#5d6f9e" stroke-width="5" fill="none" opacity=".7"/>
    <path d="M-80,-420 C-110,-330 -120,-200 -100,-60 C-60,-40 60,-40 100,-60 C120,-200 110,-330 80,-420Z" fill="#050507"/>
    ${[-70, -40, -10, 20, 50, 75].map((x, i) => `<path d="M${x},-380 Q${x + Math.sin(t * 1.5 + i) * 12 - 10},-200 ${x + 6},-50" stroke="#1b1d2b" stroke-width="5" fill="none"/>`).join('')}
    <circle cx="0" cy="-430" r="82" fill="#050507"/>
    <path d="M-82,-430 A82,82 0 0 1 82,-430" stroke="#6f80b0" stroke-width="5" fill="none" opacity=".75"/>
    <path d="M90,-300 Q150,-330 ${hx + 10},${hy + 20}" stroke="#07070b" stroke-width="34" fill="none" stroke-linecap="round"/>
    <g transform="translate(${hx},${hy}) rotate(${-20 + a * 30})"><circle r="20" fill="#bdb6a2"/><rect x="-6" y="-46" width="16" height="60" rx="3" fill="#d8c9a0"/>
      ${[0, 1, 2, 3, 4, 5].map(k => `<rect x="-22" y="${-44 + k * 9}" width="16" height="4" fill="#d8c9a0"/>`).join('')}
      <path d="M8,-18 l26,-6 M8,-6 l28,0 M8,6 l26,6" stroke="#bdb6a2" stroke-width="5" stroke-linecap="round"/></g>
  </g>`;
}
// Visage de la Ghoula. Origine = centre du visage.
function ghoulaFace(o = {}) {
  const sm = o.smile ?? .6, op = o.open || 0, sk = '#c9c2ad';
  const w = 70 + 170 * sm, my = 70;
  const corner = my - 34 * sm, bottom = my + 30 * sm + op * 70;
  let teeth = '';
  const n = Math.max(4, Math.round(w / 16));
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (i + .5) * (w / n), yTop = my - 6 * sm + (Math.abs(x) / (w / 2)) ** 2 * (corner - my);
    teeth += `<path d="M${x - w / n / 2 + 1},${yTop} L${x},${yTop + 22 + sm * 10} L${x + w / n / 2 - 1},${yTop}Z" fill="#f1ece0"/>`;
    if (sm > .3) teeth += `<path d="M${x - w / n / 2 + 2},${bottom - 3} L${x},${bottom - 18 - sm * 6} L${x + w / n / 2 - 2},${bottom - 3}Z" fill="#e8e2d2"/>`;
  }
  const eyeC = o.red ? '#ff4a2a' : '#f3c623';
  const eyeW = o.eyeOpen ?? 1;
  const eye = (x) => `<ellipse cx="${x}" cy="-12" rx="40" ry="32" fill="#2b2522" opacity=".6"/>
    <circle cx="${x}" cy="-12" r="44" fill="url(#eyeGlow)" opacity="${o.red ? .85 : .55}"/>
    <path d="M${x - 28},-12 Q${x},${-12 - 20 * eyeW} ${x + 28},-12 Q${x},${-12 + 16 * eyeW} ${x - 28},-12Z" fill="${eyeC}"/>
    <ellipse cx="${x + (o.look || 0)}" cy="-12" rx="4" ry="${12 * eyeW}" fill="#120a04"/>`;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})">
    <path d="M-170,-120 C-230,40 -260,300 -300,700 L300,700 C260,300 230,40 170,-120 C150,-250 -150,-250 -170,-120Z" fill="#050507"/>
    <path d="M-260,700 Q-200,300 -130,170 L130,170 Q200,300 260,700Z" fill="#0b0b12"/>
    <ellipse cx="0" cy="0" rx="100" ry="140" fill="${sk}"/>
    <ellipse cx="0" cy="0" rx="100" ry="140" fill="url(#faceShade)"/>
    ${eye(-40)}${eye(40)}
    <path d="M-72,-58 L-14,-40 M72,-58 L14,-40" stroke="#141010" stroke-width="7" stroke-linecap="round"/>
    <path d="M-8,26 l-4,10 M8,26 l4,10" stroke="#3a302a" stroke-width="5" stroke-linecap="round"/>
    <path d="M${-w / 2},${corner} Q0,${my - 14 * sm} ${w / 2},${corner} Q${w * .3},${bottom} 0,${bottom} Q${-w * .3},${bottom} ${-w / 2},${corner}Z" fill="#2a0707"/>
    ${teeth}
    ${sm > .55 ? `<path d="M${-w / 2 - 8},${corner - 10} q-10,20 4,36 M${w / 2 + 8},${corner - 10} q10,20 -4,36" stroke="#6a5f52" stroke-width="4" fill="none"/>` : ''}
    <path d="M-30,-140 C-90,-110 -120,-40 -118,60 C-140,0 -150,-60 -120,-120Z" fill="#050507"/>
    <path d="M30,-140 C90,-110 120,-40 118,60 C140,0 150,-60 120,-120Z" fill="#050507"/>
    <path d="M-112,-10 C-138,-205 138,-205 112,-10 C98,-80 40,-104 4,-96 L0,-80 L-4,-96 C-40,-104 -98,-80 -112,-10Z" fill="#050507"/>
    ${o.shadow ? `<ellipse cx="0" cy="-10" rx="125" ry="150" fill="#000" opacity="${o.shadow}"/>` : ''}
  </g>`;
}
function eyesInDark(x, y, s, open = 1, red = false) {
  const c = red ? '#ff4a2a' : '#f3c623';
  const e = (dx) => `<circle cx="${dx}" cy="0" r="50" fill="url(#eyeGlow)" opacity=".8"/><path d="M${dx - 30},0 Q${dx},${-22 * open} ${dx + 30},0 Q${dx},${18 * open} ${dx - 30},0Z" fill="${c}"/><ellipse cx="${dx}" cy="0" rx="4" ry="${13 * open}" fill="#120a04"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${e(-55)}${e(55)}</g>`;
}

// ---------------- intérieurs / objets ----------------
function lamp(x, y, s, t) {
  const f = 1 + Math.sin(t * 13) * .06 + Math.sin(t * 7.3) * .05;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-60" r="${420 * f}" fill="url(#lampGlow)"/>
    <path d="M-40,0 L40,0 L30,-30 L-30,-30Z" fill="#8a6a2a"/><path d="M-30,-30 Q-50,-90 0,-120 Q50,-90 30,-30Z" fill="#f7e3a0" opacity=".85"/>
    <path d="M0,-50 q-12,-20 0,-48 q12,28 0,48z" fill="#ffd86b" transform="scale(1,${f})" filter="url(#glowS)"/><path d="M-6,-120 L6,-120 L0,-150Z" fill="#8a6a2a"/></g>`;
}
function roomWall(warm = true, t = 0) {
  let tiles = '';
  for (let i = 0; i < 12; i++) tiles += `<path d="M${i * 100 - 50},1500 l50,30 l50,-30 l-50,-30z" fill="${i % 2 ? '#2c5a7a' : '#c08a3a'}" opacity=".5"/>`;
  return `${rect(warm ? '#3d3450' : '#1c2038')}
    <rect x="-200" y="1380" width="1480" height="900" fill="${warm ? '#5a3a2e' : '#22202e'}"/>
    <rect x="-200" y="1440" width="1480" height="120" fill="${warm ? '#7a2e2a' : '#2a1d2a'}"/>${tiles}
    <rect x="-200" y="1372" width="1480" height="14" fill="#2a2030"/>`;
}
function bed(x, y, s, blanketUp = false) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-380" y="-40" width="760" height="110" rx="20" fill="#6a3b5a"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-380 + i * 110}" y="-40" width="40" height="110" fill="#e0a91f" opacity=".35"/>`).join('')}
    <ellipse cx="-280" cy="-50" rx="110" ry="45" fill="#efe6d2"/>
  </g>`;
}
function door(x, y, s, o = {}) {
  let studs = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) studs += `<circle cx="${-120 + c * 120}" cy="${-560 + r * 100}" r="9" fill="#1a3a5e"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-230,0 L-230,-640 Q0,-820 230,-640 L230,0Z" fill="#3a2f36"/>
    <path d="M-200,0 L-200,-620 Q0,-780 200,-620 L200,0Z" fill="url(#wood)"/>
    <line x1="0" y1="-740" x2="0" y2="0" stroke="#1d4a7c" stroke-width="8"/>
    ${[-140, -70, 70, 140].map(x => `<line x1="${x}" y1="${x === -140 || x === 140 ? -650 : -700}" x2="${x}" y2="0" stroke="#24578f" stroke-width="4"/>`).join('')}
    ${studs}
    <g transform="translate(${-40 + (o.bolt || 0) * 90},-320)"><rect x="-60" y="-14" width="120" height="28" rx="6" fill="#9a9a9a"/><rect x="-20" y="-34" width="18" height="34" rx="4" fill="#bbb"/></g>
    <rect x="70" y="-340" width="40" height="40" rx="6" fill="#777"/>
    <circle cx="140" cy="-260" r="16" fill="#c9a23a"/>
    ${o.scratch ? scratches(o.scratch) : ''}
  </g>`;
}
function scratches(p) {
  let s = '';
  for (let k = 0; k < 4; k++) {
    const len = 260, pk = clamp(p * 1.4 - k * .12);
    s += `<path d="M${-80 + k * 36},-520 L${-150 + k * 36},-260" stroke="#e8d7b8" stroke-width="10" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - pk)}" opacity=".9"/>
          <path d="M${-80 + k * 36},-520 L${-150 + k * 36},-260" stroke="#5a3a1a" stroke-width="4" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - pk)}"/>`;
  }
  return s;
}
function clock(x, y, s, t, hh = 3, mm = 0) {
  const sec = Math.floor(t) * 6, ha = (hh % 12) * 30 + mm * .5, ma = mm * 6;
  let ticks = ''; for (let i = 0; i < 12; i++) ticks += `<rect x="-5" y="-200" width="10" height="${i % 3 ? 18 : 32}" fill="#2a1a10" transform="rotate(${i * 30})"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="250" fill="#6a4426"/><circle r="225" fill="#f2e8d0"/>${ticks}
    <rect x="-9" y="-130" width="18" height="140" rx="9" fill="#2a1a10" transform="rotate(${ha})"/>
    <rect x="-7" y="-190" width="14" height="200" rx="7" fill="#2a1a10" transform="rotate(${ma})"/>
    <rect x="-2" y="-200" width="4" height="230" fill="#c0392b" transform="rotate(${sec})"/><circle r="14" fill="#2a1a10"/></g>`;
}
function knife(x, y, s, r = 0) {
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${r})"><path d="M0,-14 L300,-6 Q340,0 300,10 L0,14Z" fill="#cfd6dd"/><path d="M0,-14 L300,-6 L300,0 L0,0Z" fill="#eef3f7"/>
    <rect x="-150" y="-20" width="150" height="40" rx="14" fill="#6b3f1f"/><circle cx="-110" cy="0" r="6" fill="#d9b25a"/><circle cx="-40" cy="0" r="6" fill="#d9b25a"/></g>`;
}
function car(x, y, s, t, moving, lights = 1) {
  const wr = moving ? t * 600 : 0;
  const wheel = (cx) => `<g transform="translate(${cx},0) rotate(${wr})"><circle r="62" fill="#151515"/><circle r="32" fill="#8a8a8a"/>${[0, 60, 120].map(a => `<rect x="-4" y="-30" width="8" height="60" fill="#555" transform="rotate(${a})"/>`).join('')}</g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${lights > 0 ? `<path d="M330,-60 L1100,-180 L1100,120 Z" fill="url(#headl)" opacity="${lights}"/>` : ''}
    <path d="M-340,-20 L-330,-130 L-180,-150 L-110,-250 L150,-250 L230,-150 L340,-120 L350,-20Z" fill="#d8d2c0"/>
    <path d="M-95,-235 L140,-235 L205,-150 L-160,-150Z" fill="#1d2a40"/><line x1="25" y1="-235" x2="20" y2="-150" stroke="#d8d2c0" stroke-width="12"/>
    <rect x="320" y="-110" width="30" height="26" rx="5" fill="${lights > 0 ? '#fff3c0' : '#777'}"/><rect x="-345" y="-110" width="20" height="24" fill="#b0302a"/>
    <path d="M-340,-60 L350,-60" stroke="#a9a290" stroke-width="6"/>
    <g transform="translate(0,-10)">${wheel(-210)}${wheel(220)}</g>
  </g>`;
}
function poster(t, lt) {
  const name = 'LA GHOULA', nChars = Math.floor(clamp((lt - .5) / .9) * name.length);
  const fill = Math.floor(clamp((lt - 1.2) / 1.2) * 5.99);
  return `${rect('#0a0a0c')}
  <g transform="translate(540,960) rotate(-1.5)">
    <rect x="-360" y="-560" width="720" height="1080" fill="url(#paper)"/>
    <rect x="-360" y="-560" width="720" height="1080" fill="none" stroke="#b8a780" stroke-width="6"/>
    <circle cx="-260" cy="380" r="70" fill="#a08a5a" opacity=".15"/><circle cx="240" cy="-420" r="50" fill="#a08a5a" opacity=".15"/>
    <text x="0" y="-410" text-anchor="middle" font-family="AR" font-weight="700" font-size="150" fill="#1a1410">مطلوبة</text>
    <rect x="-250" y="-385" width="500" height="64" fill="#b3261e"/>
    <text x="0" y="-337" text-anchor="middle" font-family="RC" font-weight="900" font-size="54" fill="#f3ead2" letter-spacing="6">RECHERCHÉE</text>
    <rect x="-250" y="-290" width="500" height="430" fill="#0e1124"/>
    <g clip-path="url(#portraitClip)">${ghoulaFace({ x: 0, y: -60, s: 1.05, smile: .75 })}</g>
    <rect x="-250" y="-290" width="500" height="430" fill="none" stroke="#1a1410" stroke-width="8"/>
    <text x="-250" y="235" font-family="RC" font-weight="900" font-size="96" fill="#1a1410">${name.slice(0, nChars)}</text>
    <text x="250" y="235" text-anchor="end" font-family="AR" font-weight="700" font-size="64" fill="#5a4a3a" opacity="${clamp((lt - 1.3) * 3)}">الغولة</text>
    <text x="-250" y="315" font-family="RC" font-weight="800" font-size="35" fill="#1a1410">SIGNE : IMITE LA VOIX DE TES PROCHES</text>
    <circle cx="-236" cy="370" r="14" fill="#b3261e"/><text x="-210" y="384" font-family="RC" font-weight="800" font-size="42" fill="#1a1410">ALGÉRIE</text>
    <text x="-250" y="470" font-family="RC" font-weight="900" font-size="58" fill="#b3261e">DANGER</text>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${-40 + i * 62}" y="425" width="50" height="50" rx="4" fill="${i < fill ? '#b3261e' : 'none'}" stroke="#b3261e" stroke-width="5"/>`).join('')}
  </g>`;
}
const PERSO_POSTER_DEFS = `<clipPath id="portraitClip"><rect x="-250" y="-290" width="500" height="430"/></clipPath>`;


// ---------------- Ajouts « Roue des légendes » ----------------
// Petite fille (même gabarit que boy) : carré + pull rose
function girl(o = {}) {
  const hy = -125, s = o.s || 1;
  const base = boy(Object.assign({ shirt: '#e05a9a' }, o));
  const hair = '#3a2416';
  const bob = o.view === 'back'
    ? `<path d="M-112,${hy - 10} C-120,${hy - 150} 120,${hy - 150} 112,${hy - 10} L118,${hy + 70} Q0,${hy + 95} -118,${hy + 70}Z" fill="${hair}"/>`
    : `<path d="M-116,${hy + 70} L-112,${hy - 20} C-118,${hy - 150} 118,${hy - 150} 112,${hy - 20} L116,${hy + 70} L84,${hy + 70} L86,${hy - 40} C40,${hy - 70} -40,${hy - 70} -86,${hy - 40} L-84,${hy + 70}Z" fill="${hair}"/>
       <path d="M-20,${hy + 0 + 150} l8,-14 8,14 -14,-9 h16z" fill="#ffd34d" transform="translate(10,40)"/>`;
  return `<g>${base}<g transform="translate(${o.x || 0},${o.y || 0}) scale(${s}) rotate(${o.rot || 0})"><g ${o.tint ? `filter="url(#${o.tint})"` : ''}>${o.tall ? `<g transform="translate(0,8) scale(.78)">${bob}</g>` : bob}</g></g></g>`;
}
function teddy(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#stkThin)"><circle cx="-38" cy="-70" r="20" fill="#8a5a34"/><circle cx="38" cy="-70" r="20" fill="#8a5a34"/>
   <circle cx="0" cy="-40" r="52" fill="#a8703f"/><ellipse cx="0" cy="40" rx="58" ry="62" fill="#a8703f"/><ellipse cx="0" cy="-26" rx="20" ry="14" fill="#d9b08a"/>
   <circle cx="-18" cy="-50" r="6" fill="#222"/><circle cx="18" cy="-50" r="6" fill="#222"/><circle cx="0" cy="-30" r="6" fill="#222"/></g>`;
}

// La Llorona : robe blanche, voile, cheveux noirs. Origine = base du cou.
// o.face 0..1 (visage révélé), o.cry (mains sur le visage), o.arms 'down'|'up'|'reach', o.scream 0..1
function llorona(o = {}, t = 0) {
  const sway = Math.sin(t * 1.3) * 6, f = o.face ?? 0, sc = o.scream || 0;
  let hem = ''; for (let i = 0; i < 14; i++) hem += `L${-230 + i * 35 + 17},${620 + (i % 2 ? 0 : 30)} `;
  const arm = (side) => {
    const sx = side * 70;
    if (o.arms === 'up') return `<path d="M${sx},20 Q${sx + side * 120},-120 ${sx + side * 140},-300" stroke="#efeee8" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M${sx + side * 140},-300 l${side * 10},-50 M${sx + side * 140},-300 l${side * 30},-40 M${sx + side * 140},-300 l${side * -12},-48" stroke="#d8d4c8" stroke-width="10" stroke-linecap="round"/>`;
    if (o.arms === 'reach') return `<path d="M${sx},20 Q${sx + side * 160},60 ${sx + side * 250},40" stroke="#efeee8" stroke-width="32" fill="none" stroke-linecap="round"/><path d="M${sx + side * 250},40 l${side * 45},-10 M${sx + side * 250},40 l${side * 45},10 M${sx + side * 250},40 l${side * 40},28" stroke="#d8d4c8" stroke-width="9" stroke-linecap="round"/>`;
    if (o.cry) return `<path d="M${sx},20 Q${sx + side * 70},-40 ${side * 30},-110" stroke="#efeee8" stroke-width="32" fill="none" stroke-linecap="round"/><ellipse cx="${side * 30}" cy="-120" rx="34" ry="44" fill="#e6e2d8"/>`;
    return `<path d="M${sx},20 Q${sx + side * 40},200 ${sx + side * 30},360" stroke="#efeee8" stroke-width="32" fill="none" stroke-linecap="round"/><path d="M${sx + side * 30},360 l${side * 4},50 M${sx + side * 30},360 l${side * 18},44 M${sx + side * 30},360 l${side * -10},46" stroke="#d8d4c8" stroke-width="9" stroke-linecap="round"/>`;
  };
  const face = `<g opacity="${f}">
     <ellipse cx="0" cy="-130" rx="74" ry="100" fill="#f2f0ea"/>
     <circle cx="-30" cy="-140" r="${24 + sc * 6}" fill="#0a0a0c"/><circle cx="30" cy="-140" r="${24 + sc * 6}" fill="#0a0a0c"/>
     <circle cx="-30" cy="-140" r="${36 + sc * 8}" fill="#0a0a0c" opacity=".35" filter="url(#b8)"/><circle cx="30" cy="-140" r="${36 + sc * 8}" fill="#0a0a0c" opacity=".35" filter="url(#b8)"/>
     <circle cx="-30" cy="-140" r="5" fill="#fff"/><circle cx="30" cy="-140" r="5" fill="#fff"/>
     <path d="M-34,-114 L-38,-40 M34,-114 L38,-40" stroke="#6f7480" stroke-width="7" stroke-linecap="round" opacity=".8"/>
     ${sc > .1 ? `<ellipse cx="0" cy="-62" rx="${18 + sc * 16}" ry="${20 + sc * 40}" fill="#0a0a0c"/>` : `<path d="M-20,-62 Q0,-74 20,-62" stroke="#0a0a0c" stroke-width="6" fill="none" stroke-linecap="round"/>`}
  </g>`;
  return `<g transform="translate(${o.x || 0},${(o.y || 0)}) scale(${o.s || 1})"><g transform="translate(${sway},0)" filter="url(#${o.noStk ? 'glowS' : 'stk'})">
    <path d="M-150,-260 Q-190,100 -250,640 L250,640 Q190,100 150,-260 Q0,-310 -150,-260Z" fill="#f4f3ee" opacity=".55"/>
    <path d="M-80,0 Q-150,200 -230,620 ${hem} L230,620 Q150,200 80,0 Q0,-20 -80,0Z" fill="#f7f6f1"/>
    <path d="M-60,40 L-120,600 M0,40 L0,610 M60,40 L120,600" stroke="#dcdad2" stroke-width="5"/>
    ${arm(-1)}${arm(1)}
    <path d="M-95,-150 C-100,-260 100,-260 95,-150 L100,80 Q0,110 -100,80Z" fill="#0b0b0e"/>
    ${face}
    ${f < 1 ? `<path d="M-80,-200 C-60,-250 60,-250 80,-200 L84,${-40 + f * -150} Q0,${-20 + f * -150} -84,${-40 + f * -150}Z" fill="#0b0b0e" opacity="${1 - f * .9}"/>` : ''}
    <path d="M-95,-150 C-100,-260 100,-260 95,-150 C70,-215 -70,-215 -95,-150Z" fill="#0b0b0e"/>
  </g></g>`;
}

// Krampus : fourrure, cornes, yeux rouges, langue, chaînes + clochettes, sac. Origine = base du cou.
function krampus(o = {}, t = 0) {
  const br = Math.sin(t * 2) * 4, roar = o.roar || 0;
  let fur = ''; for (let i = 0; i < 18; i++) { const a = -Math.PI * .1 + i * Math.PI * 1.2 / 17; fur += `L${Math.cos(a) * 190 * (i % 2 ? 1 : 1.12)},${Math.sin(a) * 120 + 260 * (i % 2 ? 1 : 1.05)} `; }
  let chain = ''; for (let i = 0; i < 11; i++) chain += `<ellipse cx="${-120 + i * 24}" cy="${60 + i * 26}" rx="11" ry="7" fill="none" stroke="#d8d8d0" stroke-width="5" transform="rotate(40,${-120 + i * 24},${60 + i * 26})"/>`;
  let bells = ''; for (let i = 0; i < 5; i++) bells += `<path d="M${-90 + i * 45},300 l-14,30 h28z" fill="#d9a92e"/><line x1="-110" y1="298" x2="110" y2="298" stroke="#d8d8d0" stroke-width="5"/>`;
  const eyeR = o.eyes ?? 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})"><g filter="url(#${o.noStk ? 'glowS' : 'stk'})">
    ${o.sack !== false ? `<ellipse cx="170" cy="120" rx="120" ry="190" fill="#6b4a2a"/><path d="M110,-50 q60,-40 110,0" stroke="#4a3018" stroke-width="16" fill="none"/>` : ''}
    <path d="M-150,330 L-130,620 L-80,620 L-70,360Z M150,330 L130,620 L80,620 L70,360Z" fill="#3a2414"/>
    <path d="M-140,600 l-20,40 h70 l-10,-40z M140,600 l20,40 h-70 l10,-40z" fill="#1a1008"/>
    <path d="M-170,-10 Q-210,150 -170,340 ${fur} L170,340 Q210,150 170,-10 Q0,-60 -170,-10Z" fill="#4a2e1a"/>
    <ellipse cx="0" cy="150" rx="95" ry="140" fill="#5e3b22"/>
    ${chain}${bells}
    <path d="M-170,0 Q-260,140 -230,${300 + br}" stroke="#4a2e1a" stroke-width="60" fill="none" stroke-linecap="round"/>
    <path d="M170,0 Q260,140 230,${300 - br}" stroke="#4a2e1a" stroke-width="60" fill="none" stroke-linecap="round"/>
    ${[-1, 1].map(sd => [0, 1, 2, 3].map(k => `<path d="M${sd * 230 + (k - 1.5) * 16},${330} l${sd * 4},40" stroke="#ece4d0" stroke-width="7" stroke-linecap="round"/>`).join('')).join('')}
    ${o.twigs !== false ? `<g transform="translate(-235,330) rotate(25)">${[0, 1, 2, 3, 4, 5].map(k => `<line x1="0" y1="0" x2="${-30 + k * 12}" y2="220" stroke="#b49a6a" stroke-width="4"/>`).join('')}</g>` : ''}
    <g transform="translate(0,-150)">
      <path d="M-70,-50 C-200,-120 -230,-260 -150,-330 C-180,-240 -150,-160 -40,-90Z" fill="#e8dcc0"/>
      <path d="M70,-50 C200,-120 230,-260 150,-330 C180,-240 150,-160 40,-90Z" fill="#e8dcc0"/>
      <path d="M-150,-20 l-60,-30 l40,50z M150,-20 l60,-30 l-40,50z" fill="#4a2e1a"/>
      <path d="M-110,-40 Q-120,80 -60,130 L60,130 Q120,80 110,-40 Q0,-110 -110,-40Z" fill="#2e1c10"/>
      <path d="M-70,60 Q0,${110 + roar * 50} 70,60 Q0,${80 + roar * 20} -70,60Z" fill="#1a0606"/>
      ${[-50, -25, 0, 25, 50].map(x => `<path d="M${x - 9},62 l9,${18 + roar * 8} l9,-18z" fill="#f2ece0"/>`).join('')}
      <path d="M-10,${90 + roar * 30} Q0,${170 + roar * 40} 14,${230 + roar * 30} Q22,${170 + roar * 30} 10,${90 + roar * 30}Z" fill="#c0283a"/>
      <circle cx="-42" cy="0" r="${34 * eyeR}" fill="#ff2a1a" opacity=".45" filter="url(#b8)"/><circle cx="42" cy="0" r="${34 * eyeR}" fill="#ff2a1a" opacity=".45" filter="url(#b8)"/>
      <ellipse cx="-42" cy="0" rx="${16 * eyeR}" ry="${12 * eyeR}" fill="#ff3b2a"/><ellipse cx="42" cy="0" rx="${16 * eyeR}" ry="${12 * eyeR}" fill="#ff3b2a"/>
      <circle cx="-42" cy="0" r="4" fill="#ffe0a0"/><circle cx="42" cy="0" r="4" fill="#ffe0a0"/>
      <path d="M-80,-30 L-15,-10 M80,-30 L15,-10" stroke="#120804" stroke-width="9" stroke-linecap="round"/>
    </g>
  </g></g>`;
}

// Drapeaux simples (w = largeur ; ratio 3:2)
function flag(code, x, y, w = 60) {
  const h = w * 2 / 3, r = (cx, cy, rr, c) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${c}"/>`;
  const F = {
    DZ: `<rect width="${w / 2}" height="${h}" fill="#006233"/><rect x="${w / 2}" width="${w / 2}" height="${h}" fill="#fff"/>${r(w * .52, h / 2, h * .28, '#d21034')}${r(w * .57, h / 2, h * .23, '#fff')}<rect x="${w / 2}" width="${w * .02}" height="0"/>`,
    MA: `<rect width="${w}" height="${h}" fill="#c1272d"/><path d="M${w / 2},${h * .22} L${w * .58},${h * .72} L${w * .38},${h * .42} L${w * .62},${h * .42} L${w * .42},${h * .72}Z" fill="none" stroke="#006233" stroke-width="${w * .03}"/>`,
    TN: `<rect width="${w}" height="${h}" fill="#e70013"/>${r(w / 2, h / 2, h * .3, '#fff')}${r(w * .52, h / 2, h * .2, '#e70013')}${r(w * .55, h / 2, h * .16, '#fff')}`,
    MX: `<rect width="${w / 3}" height="${h}" fill="#006847"/><rect x="${w / 3}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${2 * w / 3}" width="${w / 3}" height="${h}" fill="#ce1126"/>${r(w / 2, h / 2, h * .12, '#8a5a2a')}`,
    AT: `<rect width="${w}" height="${h}" fill="#ed2939"/><rect y="${h / 3}" width="${w}" height="${h / 3}" fill="#fff"/>`,
    JP: `<rect width="${w}" height="${h}" fill="#fff"/>${r(w / 2, h / 2, h * .3, '#bc002d')}`,
    FR: `<rect width="${w / 3}" height="${h}" fill="#0055a4"/><rect x="${w / 3}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${2 * w / 3}" width="${w / 3}" height="${h}" fill="#ef4135"/>`,
    BR: `<rect width="${w}" height="${h}" fill="#009c3b"/><path d="M${w / 2},${h * .1} L${w * .92},${h / 2} L${w / 2},${h * .9} L${w * .08},${h / 2}Z" fill="#ffdf00"/>${r(w / 2, h / 2, h * .22, '#002776')}`,
    PH: `<rect width="${w}" height="${h / 2}" fill="#0038a8"/><rect y="${h / 2}" width="${w}" height="${h / 2}" fill="#ce1126"/><path d="M0,0 L${w * .45},${h / 2} L0,${h}Z" fill="#fff"/>`,
  }[code] || `<rect width="${w}" height="${h}" fill="#888"/>`;
  return `<g transform="translate(${x},${y})">${F}<rect width="${w}" height="${h}" fill="none" stroke="#000" stroke-opacity=".3"/></g>`;
}
// Sapin enneigé
function pine(x, y, s, dark = '#0e1a22', snowc = '#dfe8f2') {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-12" y="-20" width="24" height="60" fill="#2a1d14"/>
   ${[0, 1, 2, 3].map(i => `<path d="M0,${-380 + i * 90} L${110 + i * 25},${-250 + i * 90} L${-110 - i * 25},${-250 + i * 90}Z" fill="${dark}"/><path d="M0,${-380 + i * 90} L${50 + i * 10},${-318 + i * 90} Q0,${-300 + i * 90} ${-50 - i * 10},${-318 + i * 90}Z" fill="${snowc}" opacity=".9"/>`).join('')}</g>`;
}
function snowForest(t, seed = 5, yb = 1250) {
  const r = rng(seed); let g = `<rect x="-200" y="-200" width="1480" height="2400" fill="#060a14"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 8; i++) g += pine(-120 + i * 170 + r() * 60, yb - 200 + row * 110, .7 + row * .25 + r() * .15, ['#0a1219', '#0d1720', '#122030'][row]);
  g += `<path d="M-200,${yb + 80} Q540,${yb + 20} 1280,${yb + 80} L1280,2200 L-200,2200Z" fill="#cdd8e6"/><path d="M-200,${yb + 80} Q540,${yb + 20} 1280,${yb + 80}" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/>`;
  return g;
}
