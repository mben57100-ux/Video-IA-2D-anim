// =================== La Ghoula — décors, personnages, plans ===================
const STORY_DEFS = `
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
const POSTER_DEFS = `<clipPath id="portraitClip"><rect x="-250" y="-290" width="500" height="430"/></clipPath>`;

// ---------------- plans ----------------
function buildStory(tl) {
  setTimeline(tl);
  const C = id => tl.clips[id];
  const w = (id, s, n = 0, k = 't0') => wordT(id, s, n, k);
  const end = tl.duration;
  const shots = [];
  const S = (t0, t1, draw, cam, extra = {}) => shots.push(Object.assign({ t0, t1, draw, cam }, extra));
  const nightBg = (t, shift = 0, mx = 820, my = 380, mr = 70) => `${rect('url(#skyN)')}${stars(t)}${moon(mx, my, mr)}${dunesNight(shift)}`;

  // 1 HOOK grand-mère au coucher du soleil
  S(0, C('02')[0], (t) => `${rect('url(#skyS)')}<circle cx="540" cy="1080" r="150" fill="#ffe2a0" opacity=".9" filter="url(#b8)"/>
     ${ksar(820, 1190, .9, 'sunset')}${palm(180, 1180, .9, '#3a2a30', '#3a2a30')}${dunesSunset()}
     ${grandma({ x: 560, y: 1120, s: 1.55, finger: 'up', talk: 0 })}`, { s: [1.02, 1.1], y: [40, 0] });
  // 2 la règle : silhouette sur la dune + onde "salam"
  const tSalam = w('02', 'salam');
  S(C('02')[0], w('02', 'parce'), (t) => {
    const rp = prog(t, tSalam, tSalam + 1.2);
    return `${nightBg(t)}<g transform="translate(560,1105)">${ghoulaBack({ s: .32 }, t)}</g>
      ${rp > 0 && rp < 1 ? `<circle cx="560" cy="980" r="${60 + rp * 420}" fill="none" stroke="#fff" stroke-width="${8 * (1 - rp)}" opacity="${1 - rp}"/>` : ''}
      ${boy({ x: 300, y: 1450, s: .9, view: 'back', tint: 'night' })}`;
  }, { s: [1, 1.12], x: [0, 60] });
  // 3 visage dans l'ombre, yeux qui s'allument
  const tManger = w('02', 'manger');
  S(w('02', 'parce'), C('03')[0], (t, lt, p) => `${rect('#05060c')}${ghoulaFace({ x: 540, y: 900, s: 2.2, smile: lerp(.15, .9, prog(t, tManger - .3, tManger + .4)), shadow: lerp(.92, .55, p) })}`,
    { s: [1, 1.15] }, { post: (t) => `<rect width="1080" height="1920" fill="url(#vigRed)" opacity="${prog(t, tManger, tManger + .3) * .9}"/>` });
  // 4 avis de recherche
  S(C('03')[0], C('04')[0], (t, lt) => poster(t, lt), { s: [1.05, 1.12] }, { noSubs: true });
  // 5 village de jour
  S(C('04')[0], w('04', 'un'), (t) => `${rect('url(#skyD)')}
     <ellipse cx="300" cy="300" rx="160" ry="50" fill="#fff" opacity=".9"/><ellipse cx="380" cy="280" rx="110" ry="50" fill="#fff" opacity=".9"/>
     ${dunesDay()}
     <rect x="-200" y="1250" width="1480" height="1000" fill="#e8c48c"/>
     ${ksar(250, 1250, 1.3, 'day')}${ksar(900, 1250, 1.1, 'day')}${palm(560, 1260, 1.2, '#3f8a4a')}${palm(1000, 1270, .9, '#3f8a4a')}
     ${door(760, 1300, .45)}
     ${grandma({ x: 760, y: 1110, s: .55 })}
     ${goat(300, 1420, .9, 1, t)}
     ${boy({ x: 520, y: 1430, s: 1.05, view: 'back' })}`, { s: [1, 1.07] });
  // 6 crépuscule, lampe dans les dunes
  S(w('04', 'un'), C('05')[0], (t) => {
    const bob = Math.abs(Math.sin(t * 5)) * 10;
    return `${rect('url(#skyDusk)')}${stars(t, 40, 700)}${dune(1150, 70, .004, 1, '#3a2c4a', '#7a5a7a')}${dune(1350, 90, .003, 2.5, '#2c2240', '#5a4a6a')}
      <circle cx="840" cy="1180" r="10" fill="#f1ece2" opacity=".7"/>
      <path d="M470,1360 L980,1080 L1000,1180Z" fill="url(#beam)" opacity=".7"/>
      ${boy({ x: 470, y: 1300 - bob, s: .95, view: 'back', lamp: true, tint: 'dusk' })}`;
  }, { s: [1, 1.08], x: [0, 40] });
  // 7 le vent s'arrête — gros plan garçon
  S(C('05')[0], w('05', 'sur'), (t, lt) => {
    let sand = ''; const r = rng(9);
    for (let i = 0; i < 40; i++) { const sp = lt < .6 ? 1 : Math.max(0, 1 - (lt - .6) * 3); const x = (r() * 1400 + t * 900 * sp) % 1300 - 100; sand += `<circle cx="${x.toFixed(0)}" cy="${(r() * 1900).toFixed(0)}" r="3" fill="#d9c7a0" opacity=".5"/>`; }
    return `${nightBg(t, .5)}${sand}${boy({ x: 540, y: 1080, s: 2.3, expr: lt > .5 ? 'worried' : 'neutral', bust: true, tint: 'night' })}`;
  }, { s: [1, 1.1] });
  // 8 femme de dos qui se coiffe
  S(w('05', 'sur'), w('05', 'retourne'), (t) => `${rect('url(#skyN)')}${stars(t)}${moon(560, 820, 230)}${dunesNight(1)}
     <g transform="translate(540,1300)">${ghoulaBack({ s: 1.15 }, t)}</g>`, { s: [1, 1.12], y: [0, -40] });
  // 9 elle se retourne
  const tRet = w('05', 'retourne');
  S(tRet, C('06')[0], (t, lt, p) => {
    const turn = E.inOut(prog(lt, .2, 1.4));
    return `${rect('url(#skyN)')}${moon(560, 600, 230)}${dunesNight(1)}
      <g opacity="${turn}">${ghoulaFace({ x: 540, y: 980, s: 2, smile: .3, open: prog(t, C('06')[0] - .8, C('06')[0]) * .4, shadow: lerp(.85, .5, p) })}</g>
      <g opacity="${1 - turn}"><circle cx="540" cy="980" r="250" fill="#050507"/><path d="M290,980 C260,1300 240,1600 200,2000 L880,2000 C840,1600 820,1300 790,980Z" fill="#050507"/></g>`;
  }, { s: [1, 1.15] });
  // 10 SALAM !
  S(C('06')[0], C('07')[0], (t) => `${nightBg(t, .5)}${boy({ x: 540, y: 1100, s: 2.6, expr: 'shout', bust: true, tint: 'night' })}`, { s: [1.15, 1.05], ease: E.out });
  // 11 le sourire disparaît
  S(C('07')[0], C('08')[0], (t, lt, p) => `${rect('#070910')}${moon(880, 300, 60)}${ghoulaFace({ x: 540, y: 900, s: 2.5, smile: lerp(.85, .05, E.inOut(prog(lt, .3, 1.1))) })}`, { s: [1, 1.08] });
  // 12 elle parle (gros plan yeux/bouche)
  S(C('08')[0], w('08', 'va.'), (t) => `${rect('#070910')}${ghoulaFace({ x: 540, y: 820, s: 3.4, smile: .25, open: speaking(t, '08') * .6 })}`, { s: [1, 1.12], y: [0, -60] });
  // 13 "Va. Pour ce soir." — elle désigne le village
  S(w('08', 'va.'), C('09')[0], (t) => `${nightBg(t, 1.5, 200, 330, 60)}${ksar(200, 1170, .5, 'night')}
     <g transform="translate(720,1250)">${ghoulaBack({ s: .9 }, 0)}</g>
     <path d="M640,1000 Q470,930 330,880" stroke="#07070b" stroke-width="30" stroke-linecap="round" fill="none"/>
     <path d="M330,880 l-50,-10 M330,880 l-46,6" stroke="#bdb6a2" stroke-width="8" stroke-linecap="round"/>`, { s: [1, 1.06] });
  // 14 tu cours
  S(C('09')[0], C('10')[0], (t) => {
    const ph = t * 11;
    return `${nightBg(t, t * .4)}<g opacity=".6"><g transform="translate(860,1150)">${ghoulaBack({ s: .22 }, t)}</g></g>
      <path d="M470,1290 L120,1700 L380,1760Z" fill="url(#beamV)" opacity=".35"/>
      ${boy({ x: 470, y: 1150 + Math.abs(Math.sin(ph)) * -18, s: 1.25, run: ph, expr: 'scared', lamp: true, tint: 'night' })}`;
  }, { s: [1.05, 1.1] });
  // 15 rire dans le noir : yeux
  S(C('10')[0], C('11')[0], (t, lt) => {
    const bl = (Math.floor(lt * 3) % 5 === 4) ? .1 : 1;
    return `${rect('#03040a')}${dune(1300, 80, .003, 2, '#0a0f22', '#1f2a4f')}${eyesInDark(540 + Math.sin(t * 20) * 6, 980, 1.6, bl)}`;
  }, { s: [1, 1.2] });
  // 16 grand-mère pâle
  S(C('11')[0], w('11', 'glisse'), (t) => `${roomWall(true, t)}${lamp(880, 1180, 1, t)}${grandma({ x: 500, y: 1100, s: 1.9, pale: true, expr: 'worried' })}`, { s: [1, 1.08] });
  // 17 couteau sous l'oreiller
  S(w('11', 'glisse'), w('11', 'ferme'), (t, lt) => `${roomWall(true, t)}${lamp(950, 1250, .8, t)}${bed(560, 1450, 1.4)}
     ${knife(lerp(980, 380, E.inOut(prog(lt, .1, 1.1))), 1390, 1, 0)}
     <ellipse cx="168" cy="1380" rx="160" ry="66" fill="#efe6d2"/>`, { s: [1.05, 1.15], x: [0, -60] });
  // 18 porte à double tour
  S(w('11', 'ferme'), C('12')[0], (t, lt) => `${roomWall(true, t)}${lamp(120, 1300, .7, t)}${door(560, 1600, 1.35, { bolt: E.inOut(prog(lt, .2, .8)) })}`, { s: [1.1, 1.2], y: [-120, -120] });
  // 19 consigne de la grand-mère
  S(C('12')[0], C('13')[0], (t) => `${roomWall(true, t)}${lamp(880, 1200, 1, t)}${grandma({ x: 520, y: 1050, s: 2, finger: 'up', talk: speaking(t, '12'), pale: false })}`, { s: [1, 1.1] });
  // 20 horloge 3h
  S(C('13')[0], w('13', 'on'), (t) => `${rect('#141726')}${clock(540, 900, 1.5, t, 3, 0)}`, { s: [1, 1.12] });
  // 21 on frappe
  S(w('13', 'on'), C('14')[0], (t) => `${roomWall(false, t)}${door(540, 1620, 1.3)}<rect x="-200" y="-200" width="1480" height="2400" fill="#0b1030" opacity=".35"/>`, { s: [1, 1.06] });
  // 22 garçon dans le lit (voix de papa)
  S(C('14')[0], C('15')[0], (t) => `${roomWall(false, t)}<g transform="translate(880,1350) scale(.45)">${door(0, 0, 1)}</g>
     ${boy({ x: 420, y: 1300, s: 1.3, expr: 'scared', look: 8, bust: true, tint: 'night' })}
     <path d="M-100,1330 Q200,1250 600,1320 Q900,1350 1200,1300 L1200,2000 L-100,2000Z" fill="#6a3b5a"/>
     ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-60 + i * 220}" y="1320" width="60" height="700" fill="#e0a91f" opacity=".18"/>`).join('')}
     <rect x="-200" y="-200" width="1480" height="2400" fill="#0b1030" opacity=".3"/>`, { s: [1, 1.1], x: [0, 40] });
  // 23 "Ton père est à Marseille" — gros plan
  S(C('15')[0], w('15', 'alors'), (t) => `${roomWall(false, t)}${boy({ x: 540, y: 1150, s: 2.5, expr: 'scared', look: -6, sweat: true, bust: true, tint: 'night' })}
     <path d="M-100,1260 Q300,1200 600,1260 Q900,1300 1200,1240 L1200,2000 L-100,2000Z" fill="#6a3b5a"/>`, { s: [1, 1.08] });
  // 24 on gratte le bois
  S(w('15', 'alors'), w('15', 'puis'), (t, lt) => `${rect('#10142a')}${door(540, 1700, 2, { scratch: E.out(prog(lt, .1, 1.3)) })}<rect x="-200" y="-200" width="1480" height="2400" fill="#0b1030" opacity=".35"/>`, { s: [1, 1.08], y: [-150, -150] });
  // 25-26 renifle sous la porte
  S(w('15', 'puis'), C('17')[0], (t, lt) => {
    let puff = '';
    const sn = speaking(t, '16') > 0 || (Math.floor(t * 2.5) % 2 === 0);
    for (let i = 0; i < 6; i++) puff += `<circle cx="${300 + i * 90 + Math.sin(t * 3 + i) * 20}" cy="${1215 + (sn ? -Math.abs(Math.sin(t * 9 + i)) * 40 : 0)}" r="${10 + (i % 3) * 5}" fill="#cbb98f" opacity="${sn ? .55 : .2}"/>`;
    return `${rect('#0d1024')}<rect x="-200" y="200" width="1480" height="1030" fill="url(#wood)"/><rect x="-200" y="200" width="1480" height="1030" fill="#000" opacity=".45"/>
      <rect x="-200" y="1230" width="1480" height="16" fill="#cfd9ff" opacity=".85" filter="url(#glowS)"/>
      <rect x="${420 + Math.sin(t * 1.5) * 60}" y="1230" width="260" height="16" fill="#000"/>
      ${[0,1,2,3,4,5,6].map(i => `<line x1="${-60 + i * 180}" y1="200" x2="${-60 + i * 180}" y2="1230" stroke="#163a63" stroke-width="6"/>`).join('')}
      ${[0,1,2,3,4,5].map(i => `<circle cx="${30 + i * 180}" cy="1120" r="12" fill="#0f2a48"/>`).join('')}
      ${puff}<rect x="-200" y="1246" width="1480" height="800" fill="#2a2030"/>
      ${(() => { const g = E.out(prog(t, C('16')[0] + .3, C('16')[1])); if (g <= 0) return ''; let f = '';
         [0, 1, 2, 3].forEach(i => { const L = g * (90 + (i === 1 || i === 2 ? 40 : 0)); const x = 470 + i * 46;
           f += `<path d="M${x},1240 L${x + 4},${1240 + L}" stroke="#bdb6a2" stroke-width="26" stroke-linecap="round"/><path d="M${x + 4},${1240 + L} l-6,22 l14,-4z" fill="#1a1410"/>`; });
         return `<g filter="url(#night)">${f}</g>`; })()}`;
  }, { s: [1, 1.15] });
  // 27 le matin
  S(C('17')[0], C('18')[0], (t) => `${rect('url(#skyDawn)')}<rect x="-200" y="1250" width="1480" height="1000" fill="#c9b48c"/>
     <rect x="-200" y="300" width="1480" height="950" fill="#a98a6a"/>${door(540, 1250, .9)}
     <path d="M300,1500 q120,80 260,40 q160,-40 300,60" stroke="#8a7458" stroke-width="18" fill="none" stroke-dasharray="30 30" opacity=".6"/>
     <circle cx="120" cy="1000" r="20" fill="none" stroke="#555" stroke-width="10"/>
     <path d="M120,1020 Q150,1150 230,1240 Q260,1300 300,1330" stroke="#8a6a3a" stroke-width="12" fill="none"/>
     <path d="M300,1330 l20,-14 M300,1330 l24,8 M300,1330 l10,20" stroke="#8a6a3a" stroke-width="6"/>
     <g transform="translate(700,1460)"><path d="M0,0 Q-40,-70 -10,-110" stroke="#5a4a3a" stroke-width="16" fill="none" stroke-linecap="round"/></g>
     ${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${380 + i * 110}" cy="${1600 + (i % 2) * 40}" rx="24" ry="10" fill="#f1ece2"/>`).join('')}
     <rect x="-200" y="-200" width="1480" height="2400" fill="#4a5a7a" opacity=".2"/>`, { s: [1.08, 1] });
  // 28 dix ans plus tard : voiture
  const tMot = w('18', 'moteur');
  S(C('18')[0], C('19')[0], (t) => {
    const moving = t < tMot + .3;
    const fl = moving ? 1 : ((Math.floor(t * 12) % 3) ? 0 : .8) * (t < tMot + 1.2 ? 1 : 0);
    const off = moving ? (t * 700) % 200 : (tMot * 700) % 200;
    let lines = ''; for (let i = -1; i < 8; i++) lines += `<rect x="${i * 200 - off}" y="1395" width="110" height="10" fill="#d8d2c0" opacity=".5"/>`;
    return `${rect('url(#skyN)')}${stars(t)}${moon(820, 420, 60)}${dunesNight(0)}<rect x="-200" y="1330" width="1480" height="140" fill="#1c1e26"/>${lines}
      ${car(500, 1440, 1.2, t, moving, fl)}`;
  }, { s: [1, 1.08] }, { fadeIn: .35 });
  // 29 POV pare-brise : la femme sur la dune
  S(C('19')[0], w('19', 'tu'), (t) => `${rect('url(#skyN)')}${stars(t)}${moon(700, 600, 160)}${dunesNight(1)}
     <g transform="translate(560,1150)">${ghoulaBack({ s: .55 }, t)}</g>
     <path d="M-200,-200 L1280,-200 L1280,300 Q540,180 -200,300Z" fill="#05060a"/>
     <path d="M-200,1450 Q540,1330 1280,1450 L1280,2200 L-200,2200Z" fill="#0b0c12"/>
     <circle cx="300" cy="1800" r="330" fill="none" stroke="#1d1f28" stroke-width="60"/>
     <rect x="470" y="300" width="160" height="60" rx="14" fill="#15161d"/>`, { s: [1, 1.08] });
  // 30 l'homme ouvre la bouche
  S(w('19', 'tu'), C('20')[0], (t, lt) => `${rect('#0a0d1c')}<rect x="-200" y="300" width="900" height="900" fill="#1c2a4f"/>
     ${boy({ x: 560, y: 1050, s: 2.2, adult: true, shirt: '#2e4a3e', expr: 'surprised', talk: E.out(prog(lt, .4, 1)), bust: true, tint: 'night' })}`, { s: [1, 1.1] });
  // 31 rétroviseur
  const tMur = w('20', 'murmure');
  S(C('20')[0], C('21')[0], (t) => `${rect('#05060a')}
     <g transform="translate(540,900)"><rect x="-420" y="-170" width="840" height="340" rx="60" fill="#1a1b22"/><rect x="-390" y="-140" width="780" height="280" rx="44" fill="#0c1020"/>
     <clipPath id="mir"><rect x="-390" y="-140" width="780" height="280" rx="44"/></clipPath>
     <g clip-path="url(#mir)">${eyesInDark(60, 0, 1, E.out(prog(t, tMur - .4, tMur + .2)))}</g>
     <rect x="-20" y="-400" width="40" height="230" fill="#1a1b22"/></g>`, { s: [1, 1.2] });
  // 32 elle se penche à ton oreille
  S(C('21')[0], tl.speech_end + .1, (t, lt, p) => `${rect('#0a0d1c')}
     ${boy({ x: 330, y: 1150, s: 2, adult: true, shirt: '#2e4a3e', expr: 'scared', look: 10, sweat: true, bust: true, tint: 'night' })}
     ${ghoulaFace({ x: lerp(1000, 780, E.out(p)), y: 860, s: 1.7, smile: lerp(.4, 1, p), open: speaking(t, '21') * .3 })}`, { s: [1, 1.15], x: [0, 80] });
  // 33 JUMPSCARE
  S(tl.speech_end + .1, end + 1, (t, lt) => lt > 2.3 ? rect('#000') : `${rect('#000')}${ghoulaFace({ x: 540, y: 880, s: 4.2, smile: 1, open: .6, red: true })}`,
    { s: [1.25, 1], ease: E.out }, { noSubs: true, vig: 1 });
  shots.forEach((s, i) => { if (i < shots.length - 1) s.t1 = shots[i + 1].t0; });

  const shakes = [
    { t: C('06')[0], d: .45, a: 22 }, { t: tManger, d: .35, a: 14 }, { t: w('05', 'coup'), d: .3, a: 8 },
    { t: w('13', 'frappe'), d: .25, a: 16 }, { t: w('13', 'frappe') + .45, d: .25, a: 16 }, { t: w('13', 'frappe') + .9, d: .25, a: 16 },
    { t: tMot, d: .4, a: 10 }, { t: tl.speech_end + .1, d: .8, a: 40 },
  ];
  const flashes = [{ t: C('06')[0], d: .2, o: .7 }, { t: tl.speech_end + .1, d: .25, o: .9 }];
  return {
    defs: STORY_DEFS + POSTER_DEFS, shots, shakes, flashes,
    chunks: buildChunks(tl.words),
    cta: [C('17')[0], C('18')[1]],
  };
}
