// =================== SCREAMERS & SCÈNES FLIPPANTES ===================
// Repris des références (Charro Negro, Hachishakusama, Llorona, Teke Teke, Nahual, roue des légendes) et adaptés au style réaliste.
// Toutes les fonctions renvoient du SVG ; les « plans » entiers prennent (t, lt) et remplissent l'écran.

// Entité humanoïde pâle (grande, maigre, bras trop longs, yeux noirs, sourire trop large). Origine = sol.
// o: x,y,s, smile 0..1, eyes 'black'|'white'|'glow', tilt (deg), arms 'down'|'reach'|'wall', crawl
function paleEntity(o = {}, t = 0) {
  const s = o.s || 1, sm = o.smile ?? .6, tilt = o.tilt || 0, skin = '#d9d6cf';
  const jit = o.jitter ? Math.sin(t * 47) * 2 : 0;
  const eye = (x) => o.eyes === 'white' ? `<ellipse cx="${x}" cy="-1090" rx="13" ry="16" fill="#fff" filter="url(#glowS)"/>` :
    o.eyes === 'glow' ? `<ellipse cx="${x}" cy="-1090" rx="11" ry="9" fill="#ffb02a" filter="url(#glowS)"/>` :
      `<ellipse cx="${x}" cy="-1090" rx="17" ry="21" fill="#050506"/><circle cx="${x}" cy="-1088" r="3" fill="#fff" opacity=".8"/>`;
  const w = 30 + sm * 60;
  let teeth = ''; for (let i = 0; i < Math.round(w / 7); i++) teeth += `<rect x="${-w / 2 + i * 7 + 1}" y="-1052" width="5" height="${6 + sm * 6}" fill="#efe9dc"/>`;
  const arm = (sd) => o.arms === 'reach' ? `<path d="M${sd * 70},-860 Q${sd * 160},-820 ${sd * 260},-900" stroke="${skin}" stroke-width="24" fill="none" stroke-linecap="round"/>${[0, 1, 2, 3].map(k => `<path d="M${sd * 260},-900 l${sd * 50},${-20 + k * 14}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`).join('')}` :
    `<path d="M${sd * 70},-860 Q${sd * 110},-600 ${sd * 96},-260" stroke="${skin}" stroke-width="24" fill="none" stroke-linecap="round"/>${[0, 1, 2, 3].map(k => `<path d="M${sd * 96},-260 l${sd * (-8 + k * 8)},60" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`).join('')}`;
  return `<g transform="translate(${(o.x || 0) + jit},${o.y || 0}) scale(${s})"><g filter="url(#softSh)">
    <path d="M-30,-480 L-36,0 M30,-480 L36,0" stroke="${skin}" stroke-width="26" stroke-linecap="round"/>
    <path d="M-74,-880 Q-90,-660 -50,-470 L50,-470 Q90,-660 74,-880 Q0,-910 -74,-880Z" fill="${skin}"/>
    <path d="M-20,-860 Q-10,-700 -24,-560 M20,-860 Q10,-700 24,-560" stroke="#b9b4aa" stroke-width="4" fill="none"/>
    ${[0, 1, 2, 3].map(k => `<path d="M-50,${-820 + k * 34} Q0,${-806 + k * 34} 50,${-820 + k * 34}" stroke="#b9b4aa" stroke-width="3" fill="none"/>`).join('')}
    ${arm(-1)}${arm(1)}
    <g transform="rotate(${tilt},0,-930)">
      <path d="M-18,-1010 L-16,-876 L16,-876 L18,-1010Z" fill="#c9c4b9"/>
      <ellipse cx="0" cy="-1080" rx="66" ry="92" fill="${skin}"/>
      ${eye(-26)}${eye(26)}
      <path d="M-6,-1072 l-4,10 M6,-1072 l4,10" stroke="#8a857a" stroke-width="3"/>
      <path d="M${-w / 2},-1052 Q0,${-1052 + 18 + sm * 22} ${w / 2},-1052 Q0,${-1046 + sm * 8} ${-w / 2},-1052Z" fill="#1a0606"/>${teeth}
    </g></g></g>`;
}
// Silhouette humaine noire (au loin / dans l'ombre), yeux optionnels
function figureSilhouette(x, y, s = 1, o = {}) {
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${o.op ?? 1}"><path d="M-40,0 L-44,-470 Q-96,-500 -90,-700 Q-80,-860 0,-870 Q80,-860 90,-700 Q96,-500 44,-470 L40,0 L8,0 L4,-430 L-4,-430 L-8,0Z" fill="#020203"/>
    <ellipse cx="0" cy="-950" rx="58" ry="76" fill="#020203"/>${o.eyes ? `<ellipse cx="-20" cy="-955" rx="7" ry="5" fill="${o.eyes}" filter="url(#glowS)"/><ellipse cx="20" cy="-955" rx="7" ry="5" fill="${o.eyes}" filter="url(#glowS)"/>` : ''}</g>`;
}
// PLAN : screamer plein écran (zoom-choc, secousse, RGB, flash rouge). kind 'pale'|'ghoula'|'llorona'|'krampus'|'silhouette'
function screamer(t, lt, kind = 'pale') {
  const punch = 1 + .6 * Math.max(0, 1 - lt / .12), jx = Math.sin(t * 91) * 14 * Math.max(.2, 1 - lt), jy = Math.cos(t * 77) * 12 * Math.max(.2, 1 - lt);
  let face = '';
  if (kind === 'pale') face = paleEntity({ x: 540, y: 4100, s: 3, smile: 1, eyes: 'black', jitter: true }, t);
  else if (kind === 'ghoula') face = ghoulaFace({ x: 540, y: 880, s: 4.2, smile: 1, open: .6, red: true });
  else if (kind === 'llorona') face = llorona({ x: 540, y: 1300, s: 5.2, face: 1, scream: 1 }, t);
  else if (kind === 'krampus') face = krampus({ x: 540, y: 1250, s: 3.4, roar: 1, sack: false }, t);
  else face = figureSilhouette(540, 2600, 2.6, { eyes: '#fff' });
  const red = Math.floor(lt * 10) % 3 === 0 ? .25 : .08;
  return `<rect width="1080" height="1920" fill="#000"/><g transform="translate(${540 + jx},${960 + jy}) scale(${punch}) translate(-540,-960)"><g filter="url(#rgbSplit)">${face}</g></g>
    <rect width="1080" height="1920" fill="#a00" opacity="${red}"/>${glitchBars(t, 1)}`;
}
// Bandes de glitch horizontales
function glitchBars(t, amount = 1) {
  const r = rng(Math.floor(t * 20) * 131 + 7); let g = '';
  for (let i = 0; i < Math.round(6 * amount); i++) if (r() < .6) g += `<rect x="${(r() - .5) * 80}" y="${r() * 1920}" width="1080" height="${4 + r() * 30}" fill="${r() < .5 ? '#fff' : '#000'}" opacity="${.08 + r() * .15}"/>`;
  return g;
}
// Visage qui apparaît derrière une vitre (fenêtre / pare-brise). inner = svg du visage ; p = apparition 0..1
function faceInWindow(t, x, y, w, h, p, inner) {
  return `<clipPath id="fiw${x}${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#fiw${x}${y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0b1020"/>
    <g opacity="${p}">${inner}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9fb4d8" opacity=".12"/>${windowDrops(t, x, y, w, h, 30)}</g>`;
}
// Main pâle sur l'épaule (entre par le bord du cadre). side 'l'|'r', p 0..1
function handOnShoulder(x, y, s = 1, p = 1, side = 'r') {
  const d = side === 'r' ? 1 : -1, off = (1 - E.out(p)) * 400 * d;
  return `<g transform="translate(${x + off},${y}) scale(${s * d},${s})"><path d="M400,-60 Q200,-40 60,-10" stroke="#d9d6cf" stroke-width="56" stroke-linecap="round" fill="none"/>
    <ellipse cx="40" cy="0" rx="58" ry="40" fill="#d9d6cf"/>${[0, 1, 2, 3].map(k => `<path d="M${20 - k * 4},${-20 + k * 16} Q${-40},${-10 + k * 18} ${-70 - (k === 1 || k === 2 ? 14 : 0)},${10 + k * 22}" stroke="#d9d6cf" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M${-70 - (k === 1 || k === 2 ? 14 : 0)},${10 + k * 22} l-10,4" stroke="#3a3030" stroke-width="8" stroke-linecap="round"/>`).join('')}</g>`;
}
// Ombre de deux pieds sous une porte (lumière du couloir), qui bougent
function feetUnderDoor(x, y, w, t, step = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="14" fill="#ffe6a8" opacity=".75" filter="url(#glowS)"/>
    <rect x="${x + w * .3 + Math.sin(step) * 10}" y="${y}" width="${w * .14}" height="14" fill="#000"/><rect x="${x + w * .56 - Math.sin(step) * 10}" y="${y}" width="${w * .14}" height="14" fill="#000"/>`;
}
// Visage qui se penche dans l'encadrement d'une porte (côté gauche). p 0..1
function peekDoor(x, y, s, p, kind = 'pale', t = 0) {
  const inner = kind === 'pale' ? `<g transform="translate(0,1080)">${paleEntity({ s: 1, smile: .9, tilt: -25 })}</g>` : ghoulaFace({ s: .9, smile: .9 });
  return `<g transform="translate(${x - 120 + p * 120},${y}) scale(${s})">${inner}</g>`;
}
// Overlay caméra (found footage) : REC + horodatage + cadre
function camRec(t, label = 'CAM 02', date = '03/11/2019') {
  const sec = Math.floor(t) % 60, tm = `03:1${Math.floor(t / 60) % 10}:${String(sec).padStart(2, '0')}`;
  return `<g font-family="SE" font-size="40" fill="#fff" opacity=".85"><circle cx="90" cy="120" r="16" fill="#ff2a2a" opacity="${Math.floor(t * 2) % 2 ? 1 : .2}"/><text x="120" y="134">REC</text>
    <text x="980" y="134" text-anchor="end">${label}</text><text x="90" y="1840">${date}</text><text x="990" y="1840" text-anchor="end">${tm}</text></g>
    <path d="M60,60 h80 M60,60 v80 M1020,60 h-80 M1020,60 v80 M60,1860 h80 M60,1860 v-80 M1020,1860 h-80 M1020,1860 v-80" stroke="#fff" stroke-width="5" opacity=".7"/>
    ${[...Array(48)].map((_, i) => `<rect y="${i * 40}" width="1080" height="2" fill="#000" opacity=".18"/>`).join('')}`;
}
// Séquence « il est plus près » : la silhouette avance à chaque coupe (n = 0,1,2...)
function closerEachCut(n, x0 = 540, yGround = 1450) {
  const s = [.25, .45, .8, 1.4][Math.min(n, 3)];
  return figureSilhouette(x0, yGround + n * 60, s, { eyes: n > 1 ? '#fff' : null });
}
