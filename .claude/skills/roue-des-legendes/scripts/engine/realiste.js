// =================== Style RÉALISTE 2D (séries « thread horreur ») ===================
// Personnages aux proportions réelles (~7 têtes), voitures détaillées (berline, police FR/US, vue de face, intérieur),
// policiers, décors de nuit (rue, maison, chambre, couloir, route en forêt), téléphone / messages, cartes « thread ».
// Origine des personnages et des voitures = SOL (pieds / roues), x centré.
const REAL_DEFS = `
<linearGradient id="rSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03050c"/><stop offset=".6" stop-color="#0c1428"/><stop offset="1" stop-color="#18223c"/></linearGradient>
<linearGradient id="rAsphalt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15171d"/><stop offset="1" stop-color="#22252e"/></linearGradient>
<linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d7393" stop-opacity=".9"/><stop offset=".45" stop-color="#1b2436" stop-opacity=".95"/><stop offset="1" stop-color="#0b0f18"/></linearGradient>
<linearGradient id="chromeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#8a9098"/><stop offset="1" stop-color="#d0d4d8"/></linearGradient>
<radialGradient id="headGlare"><stop offset="0" stop-color="#fffbe8"/><stop offset=".25" stop-color="#fff3c0" stop-opacity=".85"/><stop offset="1" stop-color="#fff3c0" stop-opacity="0"/></radialGradient>
<linearGradient id="beamR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6d0" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></linearGradient>
<linearGradient id="beamUp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6d0" stop-opacity=".45"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></linearGradient>
<radialGradient id="streetLightG"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb24a" stop-opacity="0"/></radialGradient>
<radialGradient id="phoneLight"><stop offset="0" stop-color="#9fd0ff" stop-opacity=".6"/><stop offset="1" stop-color="#9fd0ff" stop-opacity="0"/></radialGradient>
<linearGradient id="shadeR" x1="0" y1="0" x2="1" y2="0"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
<linearGradient id="wallN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f2e"/><stop offset="1" stop-color="#2a3044"/></linearGradient>
<filter id="softSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".55"/></filter>`;

// ---------------- PERSONNAGE ----------------
// o: x,y,s, view 'front'|'back', skin, hair:'short'|'long'|'bun'|'buzz'|'curly'|'policeCap'|'hood', hairCol,
//    top:'hoodie'|'jacket'|'tshirt'|'police'|'policeUS'|'coat', topCol, pants, shoes,
//    arms:'down'|'phone'|'phoneLook'|'point'|'raise'|'flashlight'|'hands'|'cross', expr:'neutral'|'worried'|'fear'|'scream'|'sleep'|'talk',
//    walk/run: phase, talk: 0..1, phoneGlow: bool, lightFilter: 'night'|'dusk'|...
function human(o = {}) {
  const s = o.s || 1, skin = o.skin || '#dcae8c', skinD = shade(skin, -.18), hairCol = o.hairCol || '#2a1d16';
  const top = o.top || 'hoodie', topCol = o.topCol || ({ police: '#1d2b4c', policeUS: '#1a1f2b', jacket: '#3a3f4a', coat: '#4a3a2e', tshirt: '#8a2f2f' }[top] || '#3b4a5e');
  const pants = o.pants || (top === 'police' ? '#1d2b4c' : top === 'policeUS' ? '#1a1f2b' : '#2d3a52'), shoes = o.shoes || '#141414';
  const ph = o.run ?? o.walk ?? null, amp = o.run != null ? 1 : .45;
  const sw = ph !== null ? Math.sin(ph) * amp : 0;
  const bob = ph !== null ? Math.abs(Math.sin(ph)) * 10 * amp : 0;
  // jambes
  const leg = (side, a) => {
    const hx = side * 28, kx = hx + Math.sin(a) * 120 * .5, ky = -230, fx = hx + Math.sin(a) * 120, fy = 0 - Math.max(0, -Math.cos(a + side)) * 0;
    return `<path d="M${hx},-440 L${kx},${ky} L${fx},${fy - 20}" stroke="${pants}" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M${hx + 14},-430 L${kx + 14},${ky}" stroke="#000" stroke-opacity=".18" stroke-width="16" fill="none"/>
      <path d="M${fx - 30},${fy - 6} Q${fx - 30},${fy - 34} ${fx},${fy - 34} Q${fx + 38},${fy - 30} ${fx + 40},${fy - 6}Z" fill="${shoes}"/>`;
  };
  const legs = leg(-1, sw * .7) + leg(1, -sw * .7);
  // bras : épaule (±92,-690) -> coude -> main
  const SH = { l: [-92, -688], r: [92, -688] };
  const poses = {
    down: { l: [[-112, -540], [-118, -400]], r: [[112, -540], [118, -400]] },
    phone: { l: [[-112, -540], [-118, -400]], r: [[120, -600], [52, -780]] },
    phoneLook: { l: [[-90, -560], [-20, -600]], r: [[90, -560], [20, -600]] },
    point: { l: [[-112, -540], [-118, -400]], r: [[190, -700], [300, -720]] },
    raise: { l: [[-170, -800], [-150, -930]], r: [[170, -800], [150, -930]] },
    flashlight: { l: [[-112, -540], [-118, -400]], r: [[150, -600], [240, -580]] },
    hands: { l: [[-60, -790], [-30, -800]], r: [[60, -790], [30, -800]] },
    cross: { l: [[-80, -560], [60, -600]], r: [[80, -560], [-60, -610]] },
  };
  let P = JSON.parse(JSON.stringify(poses[o.arms || 'down']));
  if (ph !== null && (o.arms || 'down') === 'down') { P.l = [[-112 + sw * 30, -540], [-118 + sw * 70, -410]]; P.r = [[112 - sw * 30, -540], [118 - sw * 70, -410]]; }
  const sleeve = top === 'tshirt' ? skin : topCol;
  const arm = (side) => {
    const [sx, sy] = SH[side], [[ex, ey], [hx, hy]] = P[side];
    return `<path d="M${sx},${sy} L${ex},${ey}" stroke="${topCol}" stroke-width="40" stroke-linecap="round"/>
      <path d="M${ex},${ey} L${hx},${hy}" stroke="${sleeve}" stroke-width="${top === 'tshirt' ? 28 : 34}" stroke-linecap="round"/>
      <ellipse cx="${hx}" cy="${hy}" rx="17" ry="20" fill="${skin}"/>`;
  };
  const armsBack = o.view === 'back' ? arm('l') + arm('r') : '';
  const armsFront = o.view === 'back' ? '' : arm('l') + arm('r');
  // objets en main
  let held = '';
  const [rhx, rhy] = P.r[1];
  if (o.arms === 'phone') held = `<rect x="${rhx - 4}" y="${rhy - 40}" width="22" height="44" rx="5" fill="#0d0d10"/>`;
  if (o.arms === 'phoneLook') held = `<rect x="-26" y="-640" width="52" height="92" rx="8" fill="#0d0d10" transform="rotate(-8,0,-600)"/><rect x="-21" y="-634" width="42" height="80" rx="5" fill="#a8d4ff" transform="rotate(-8,0,-600)" filter="url(#glowS)"/>`;
  if (o.arms === 'flashlight') held = `<rect x="${rhx - 8}" y="${rhy - 12}" width="60" height="22" rx="6" fill="#222"/><circle cx="${rhx + 56}" cy="${rhy}" r="12" fill="#fff8d8" filter="url(#glowS)"/>`;
  // torse
  let torso = `<path d="M-96,-700 Q-108,-560 -86,-430 L86,-430 Q108,-560 96,-700 Q0,-730 -96,-700Z" fill="${topCol}"/>
    <path d="M30,-708 Q100,-560 86,-430 L40,-430 Q60,-560 10,-710Z" fill="#000" opacity=".18"/>`;
  if (top === 'hoodie' && o.view !== 'back') torso += `<path d="M-58,-712 Q0,-670 58,-712 Q40,-740 0,-742 Q-40,-740 -58,-712Z" fill="${shade(topCol, -.25)}"/><path d="M-14,-700 v60 M14,-700 v56" stroke="#e8e8e8" stroke-width="4"/><path d="M-60,-540 h120 l-14,60 h-92z" fill="#000" opacity=".15"/>`;
  if (top === 'jacket' || top === 'coat') torso += `<path d="M0,-720 V-430" stroke="#111" stroke-width="5"/><path d="M-36,-712 L0,-650 L36,-712" stroke="${shade(topCol, -.3)}" stroke-width="16" fill="none"/>`;
  if (top === 'police' && o.view !== 'back') torso += `<path d="M-36,-712 L0,-660 L36,-712" stroke="#13203a" stroke-width="10" fill="none"/><rect x="-96" y="-470" width="192" height="26" fill="#0d0d0d"/><rect x="40" y="-476" width="34" height="44" rx="6" fill="#111"/>
     <path d="M-62,-640 l18,-6 18,6 v20 q-18,14 -36,0z" fill="#c9a23a"/><rect x="18" y="-650" width="62" height="20" rx="3" fill="#fff"/><text x="49" y="-635" text-anchor="middle" font-family="MS" font-weight="900" font-size="14" fill="#1d2b4c">POLICE</text>
     <rect x="-96" y="-700" width="16" height="60" fill="#2b6cd8"/><rect x="80" y="-700" width="16" height="60" fill="#d8263a" opacity=".0"/>`;
  if (top === 'police' && o.view === 'back') torso += `<rect x="-70" y="-640" width="140" height="44" rx="4" fill="#0f1a30"/><text x="0" y="-607" text-anchor="middle" font-family="MS" font-weight="900" font-size="34" fill="#fff">POLICE</text><rect x="-96" y="-470" width="192" height="26" fill="#0d0d0d"/>`;
  if (top === 'policeUS' && o.view !== 'back') torso += `<rect x="-96" y="-470" width="192" height="26" fill="#0d0d0d"/><path d="M-62,-640 l12,-14 12,14 -4,22 h-16z" fill="#d9b23a"/><rect x="40" y="-660" width="30" height="40" rx="4" fill="#111"/>`;
  // cou + tête
  const hy = -810, e = o.expr || 'neutral', talk = o.talk || 0;
  const neck = `<path d="M-20,-750 L-22,-700 Q0,-690 22,-700 L20,-750Z" fill="${skinD}"/>`;
  let head;
  if (o.view === 'back') {
    head = `<path d="M-50,${hy - 20} C-54,${hy - 72} 54,${hy - 72} 50,${hy - 20} C52,${hy + 20} 40,${hy + 58} 0,${hy + 66} C-40,${hy + 58} -52,${hy + 20} -50,${hy - 20}Z" fill="${skin}"/>
      <ellipse cx="-52" cy="${hy + 4}" rx="9" ry="16" fill="${skinD}"/><ellipse cx="52" cy="${hy + 4}" rx="9" ry="16" fill="${skinD}"/>` + hairBack(o.hair || 'short', hairCol, hy);
  } else {
    const ey = hy - 2, wide = e === 'fear' || e === 'scream' ? 1.5 : 1;
    const eye = (x) => e === 'sleep' ? `<path d="M${x - 10},${ey} q10,6 20,0" stroke="#2a1a12" stroke-width="3" fill="none"/>` :
      `<path d="M${x - 11},${ey} Q${x},${ey - 7 * wide} ${x + 11},${ey} Q${x},${ey + 5 * wide} ${x - 11},${ey}Z" fill="#f4efe8"/>
       <circle cx="${x + (o.look || 0)}" cy="${ey}" r="${e === 'fear' ? 3.6 : 4.6}" fill="${o.eyeCol || '#4a2f1e'}"/><circle cx="${x + (o.look || 0)}" cy="${ey}" r="2" fill="#000"/>
       <path d="M${x - 12},${ey - 1} Q${x},${ey - 8 * wide} ${x + 12},${ey - 1}" stroke="#1a100a" stroke-width="2.6" fill="none"/>`;
    const browY = hy - 18 - (e === 'fear' || e === 'scream' || e === 'worried' ? 5 : 0);
    const brow = (x, d) => {
      const inner = e === 'worried' || e === 'fear' ? -6 : (e === 'angry' ? 6 : 0);
      return `<path d="M${x - d * 13},${browY + 1} Q${x},${browY - 4} ${x + d * 13},${browY + inner}" stroke="${shade(hairCol, .05)}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
    };
    const my = hy + 40;
    let mouth = `<path d="M-13,${my} Q0,${my + 3} 13,${my}" stroke="#7a3a30" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
    if (e === 'worried') mouth = `<path d="M-12,${my + 2} Q0,${my - 3} 12,${my + 2}" stroke="#7a3a30" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
    if (e === 'fear') mouth = `<ellipse cx="0" cy="${my + 2}" rx="8" ry="${7 + talk * 4}" fill="#2a0e0c"/>`;
    if (e === 'scream') mouth = `<ellipse cx="0" cy="${my + 6}" rx="15" ry="20" fill="#2a0e0c"/><path d="M-10,${my - 8} h20" stroke="#f0ece4" stroke-width="5"/>`;
    if (talk > 0 && e !== 'fear' && e !== 'scream') mouth = `<ellipse cx="0" cy="${my + 1}" rx="${10 + talk * 3}" ry="${2 + talk * 8}" fill="#2a0e0c"/>`;
    head = `<ellipse cx="-52" cy="${hy + 4}" rx="9" ry="16" fill="${skinD}"/><ellipse cx="52" cy="${hy + 4}" rx="9" ry="16" fill="${skinD}"/>
      <path d="M-50,${hy - 20} C-54,${hy - 72} 54,${hy - 72} 50,${hy - 20} C52,${hy + 20} 40,${hy + 58} 0,${hy + 66} C-40,${hy + 58} -52,${hy + 20} -50,${hy - 20}Z" fill="${skin}"/>
      <path d="M22,${hy - 60} C54,${hy - 40} 56,${hy + 20} 40,${hy + 50} C30,${hy + 60} 12,${hy + 66} 0,${hy + 66} C30,${hy + 40} 34,${hy - 10} 22,${hy - 60}Z" fill="#000" opacity=".14"/>
      ${o.beard ? `<path d="M-46,${hy + 14} C-44,${hy + 60} 44,${hy + 60} 46,${hy + 14} C30,${hy + 52} -30,${hy + 52} -46,${hy + 14}Z" fill="${hairCol}" opacity=".55"/>` : ''}
      ${eye(-19)}${eye(19)}${brow(-19, 1)}${brow(19, -1)}
      <path d="M-1,${hy + 2} Q-6,${hy + 22} -8,${hy + 26} Q0,${hy + 31} 8,${hy + 26}" stroke="${shade(skin, -.3)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      ${mouth}
      ${o.sweat ? `<path d="M44,${hy - 30} q7,16 0,22 q-7,-6 0,-22z" fill="#cfe8ff"/>` : ''}
      ${hairFront(o.hair || 'short', hairCol, hy)}`;
  }
  const phoneGlow = o.phoneGlow ? `<ellipse cx="0" cy="${hy}" rx="70" ry="80" fill="url(#phoneLight)"/>` : '';
  const body = o.view === 'back'
    ? `${legs}${torso}${neck}${head}${armsBack}`
    : `${legs}${neck}${torso}${armsFront}${held}${head}${phoneGlow}`;
  const filt = o.lightFilter ? `filter="url(#${o.lightFilter})"` : '';
  return `<g transform="translate(${o.x || 0},${(o.y || 0) - bob * s}) scale(${s * (o.flip ? -1 : 1)},${s})"><g filter="url(#${o.outline || 'softSh'})"><g ${filt}>${body}</g></g></g>`;
}
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function hairFront(style, c, hy) {
  switch (style) {
    case 'long': return `<path d="M-56,${hy + 70} C-66,${hy - 30} -50,${hy - 82} 0,${hy - 82} C50,${hy - 82} 66,${hy - 30} 56,${hy + 70} L44,${hy + 60} C44,${hy} 40,${hy - 40} 20,${hy - 52} C0,${hy - 40} -30,${hy - 46} -44,${hy - 20} C-46,${hy + 20} -44,${hy + 50} -44,${hy + 60}Z" fill="${c}"/>`;
    case 'bun': return `<circle cx="0" cy="${hy - 86}" r="24" fill="${c}"/><path d="M-52,${hy - 10} C-58,${hy - 80} 58,${hy - 80} 52,${hy - 10} C44,${hy - 50} 10,${hy - 58} -10,${hy - 50} C-30,${hy - 48} -46,${hy - 36} -52,${hy - 10}Z" fill="${c}"/>`;
    case 'buzz': return `<path d="M-50,${hy - 22} C-52,${hy - 74} 52,${hy - 74} 50,${hy - 22} C40,${hy - 50} -40,${hy - 50} -50,${hy - 22}Z" fill="${c}" opacity=".8"/>`;
    case 'curly': return `${[-40, -20, 0, 20, 40, -30, 30, -10, 10].map((x, i) => `<circle cx="${x}" cy="${hy - 58 + (i > 4 ? 14 : 0)}" r="20" fill="${c}"/>`).join('')}`;
    case 'policeCap': return `<path d="M-54,${hy - 30} C-54,${hy - 86} 54,${hy - 86} 54,${hy - 30}Z" fill="#14203a"/><rect x="-56" y="${hy - 34}" width="112" height="12" fill="#0c1428"/><path d="M-40,${hy - 24} Q0,${hy - 6} 46,${hy - 24} L50,${hy - 18} Q0,${hy + 4} -44,${hy - 18}Z" fill="#05070c"/><path d="M-8,${hy - 66} l8,-8 8,8 -8,8z" fill="#c9a23a"/>`;
    case 'hood': return `<path d="M-64,${hy + 60} C-80,${hy - 40} -60,${hy - 100} 0,${hy - 100} C60,${hy - 100} 80,${hy - 40} 64,${hy + 60} L50,${hy + 40} C54,${hy - 20} 40,${hy - 60} 0,${hy - 62} C-40,${hy - 60} -54,${hy - 20} -50,${hy + 40}Z" fill="#2a2f3a"/>`;
    default: return `<path d="M-52,${hy - 14} C-58,${hy - 84} 58,${hy - 84} 52,${hy - 14} C48,${hy - 46} 30,${hy - 56} 10,${hy - 52} C-6,${hy - 64} -36,${hy - 54} -52,${hy - 14}Z" fill="${c}"/>`;
  }
}
function hairBack(style, c, hy) {
  if (style === 'long') return `<path d="M-58,${hy + 110} C-70,${hy - 40} -50,${hy - 82} 0,${hy - 82} C50,${hy - 82} 70,${hy - 40} 58,${hy + 110}Z" fill="${c}"/>`;
  if (style === 'policeCap') return hairFront('policeCap', c, hy);
  if (style === 'hood') return `<path d="M-66,${hy + 70} C-80,${hy - 40} -60,${hy - 100} 0,${hy - 100} C60,${hy - 100} 80,${hy - 40} 66,${hy + 70}Z" fill="#2a2f3a"/>`;
  return `<path d="M-52,${hy + 30} C-60,${hy - 84} 60,${hy - 84} 52,${hy + 30} C30,${hy + 44} -30,${hy + 44} -52,${hy + 30}Z" fill="${c}"/>${style === 'bun' ? `<circle cx="0" cy="${hy - 86}" r="24" fill="${c}"/>` : ''}`;
}

// ---------------- VOITURES ----------------
// Berline vue de profil, avant vers la droite (flip pour l'inverse). o: x,y,s,color,t,moving,lights,brake,livery:'FR'|'US'|null,siren,flip,interior(svg à travers vitres)
function sedan(o = {}) {
  const c = o.color || '#9aa3ad', cD = shade(c, -.35), cL = shade(c, .25), t = o.t || 0;
  const rot = o.moving ? (t * 720) % 360 : 0, s = o.s || 1;
  const wheel = (cx) => `<g transform="translate(${cx},-72)"><circle r="74" fill="#0b0b0d"/><circle r="70" fill="#1a1a1c"/><circle r="47" fill="url(#chromeG)"/>
     <g transform="rotate(${rot})">${[0, 72, 144, 216, 288].map(a => `<path d="M-7,-8 L-12,-42 L12,-42 L7,-8Z" fill="#5a5f66" transform="rotate(${a})"/>`).join('')}</g>
     <circle r="12" fill="#3a3d42"/><circle r="47" fill="none" stroke="#2a2c30" stroke-width="4"/></g>`;
  const body = `M-460,-70 L-462,-150 Q-458,-182 -410,-192 L-280,-204 Q-210,-214 -160,-300 Q-138,-330 -96,-334 L118,-334 Q160,-330 194,-300 L282,-212 Q392,-200 440,-180 Q466,-168 466,-130 L466,-74 Q452,-48 410,-48 L-420,-48 Q-456,-48 -460,-70Z`;
  let livery = '';
  if (o.livery === 'FR') livery = `<path d="M-458,-150 L466,-150 L466,-112 L-460,-112Z" fill="#1d3f9a"/><path d="M-458,-112 L466,-112 L466,-100 L-460,-100Z" fill="#fff"/><path d="M-458,-100 L466,-100 L466,-92 L-460,-92Z" fill="#d8263a"/>
     <text x="40" y="-120" text-anchor="middle" font-family="MS" font-weight="900" font-size="44" fill="#fff" letter-spacing="3" transform="${o.flip ? 'translate(80,0) scale(-1,1)' : ''}">POLICE</text>`;
  if (o.livery === 'US') livery = `<path d="M-460,-160 L466,-160 L466,-70 Q452,-48 410,-48 L-420,-48 Q-456,-48 -460,-70Z" fill="#0c0c0e"/><text x="0" y="-180" text-anchor="middle" font-family="MS" font-weight="900" font-size="46" fill="#111" letter-spacing="2" transform="${o.flip ? 'scale(-1,1)' : ''}">POLICE</text>`;
  let bar = '';
  if (o.livery) {
    const ph = Math.floor(t * 6) % 2, cA = o.livery === 'US' ? '#ff2a2a' : '#2a7bff', cB = '#2a7bff';
    const on = o.siren !== false;
    bar = `<rect x="-90" y="-362" width="180" height="26" rx="8" fill="#1a1a1e"/>
      <rect x="-84" y="-358" width="80" height="18" rx="5" fill="${on && ph ? cA : '#3a1e2a'}" ${on && ph ? 'filter="url(#glowS)"' : ''}/><rect x="4" y="-358" width="80" height="18" rx="5" fill="${on && !ph ? cB : '#1e2a3a'}" ${on && !ph ? 'filter="url(#glowS)"' : ''}/>
      ${on ? `<circle cx="${ph ? -44 : 44}" cy="-350" r="${120}" fill="${ph ? cA : cB}" opacity=".22" filter="url(#b20)"/>` : ''}`;
  }
  const L = o.lights ?? 0;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${s * (o.flip ? -1 : 1)},${s})">
    <ellipse cx="0" cy="0" rx="500" ry="22" fill="#000" opacity=".55" filter="url(#b8)"/>
    ${L > 0 ? `<path d="M460,-130 L1500,-260 L1500,60 Z" fill="url(#beamR)" opacity="${L}"/>` : ''}
    <path d="${body}" fill="${c}"/>
    <path d="M-458,-110 L466,-110 L466,-74 Q452,-48 410,-48 L-420,-48 Q-456,-48 -460,-70Z" fill="${cD}" opacity=".55"/>
    ${livery}
    <path d="M-150,-292 Q-132,-318 -96,-320 L-14,-320 L-14,-212 L-232,-212Z" fill="url(#glassG)"/><path d="M0,-320 L116,-320 Q150,-318 178,-292 L254,-214 L0,-212Z" fill="url(#glassG)"/>
    ${o.interior ? `<clipPath id="carWin"><path d="M-150,-292 Q-132,-318 -96,-320 L116,-320 Q150,-318 178,-292 L254,-214 L-232,-212Z"/></clipPath><g clip-path="url(#carWin)">${o.interior}</g>` : ''}
    <path d="M-120,-304 L-60,-316 L-150,-216 L-200,-216Z" fill="#fff" opacity=".1"/>
    <path d="M-14,-322 L-6,-322 L-6,-210 L-14,-210Z" fill="${cD}"/>
    <path d="M-420,-196 Q-300,-206 -250,-212 L270,-212 Q380,-200 440,-182" stroke="${cL}" stroke-width="5" fill="none" opacity=".7"/>
    <path d="M-10,-205 L-10,-60 M262,-205 Q290,-130 270,-60 M-250,-206 Q-270,-130 -250,-60" stroke="${cD}" stroke-width="3" fill="none" opacity=".8"/>
    <rect x="60" y="-178" width="40" height="9" rx="4" fill="${cD}"/><rect x="-200" y="-178" width="40" height="9" rx="4" fill="${cD}"/>
    <path d="M232,-236 l34,-8 l6,22 l-36,4z" fill="${cD}"/>
    <path d="M420,-176 Q456,-170 462,-150 L462,-136 L420,-140Z" fill="${L > 0 ? '#fffbe8' : '#d8dde2'}" ${L > 0 ? 'filter="url(#glowS)"' : ''}/>
    <path d="M-458,-176 L-430,-182 L-428,-140 L-460,-140Z" fill="${o.brake ? '#ff2a1a' : '#8a1a14'}" ${o.brake ? 'filter="url(#glowS)"' : ''}/>
    <path d="M-330,-48 A88,88 0 0 1 -150,-48Z M200,-48 A88,88 0 0 1 380,-48Z" fill="#0b0b0d"/>
    ${wheel(-240)}${wheel(290)}
    ${bar}
  </g>`;
}
// Voiture vue de face (phares qui approchent dans la nuit). o: x,y,s,color,lights(0..1),glare,livery,t
function carFront(o = {}) {
  const c = o.color || '#9aa3ad', cD = shade(c, -.35), s = o.s || 1, L = o.lights ?? 1, t = o.t || 0;
  const ph = Math.floor(t * 6) % 2;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${s})">
    <ellipse cx="0" cy="0" rx="300" ry="24" fill="#000" opacity=".6" filter="url(#b8)"/>
    <path d="M-280,-40 L-290,-170 Q-280,-200 -240,-210 L-190,-330 Q-170,-350 -130,-352 L130,-352 Q170,-350 190,-330 L240,-210 Q280,-200 290,-170 L280,-40Z" fill="${c}"/>
    <path d="M-176,-322 Q-160,-340 -128,-340 L128,-340 Q160,-340 176,-322 L214,-222 L-214,-222Z" fill="url(#glassG)"/>
    <path d="M-150,-330 L-60,-336 L-180,-226 L-212,-226Z" fill="#fff" opacity=".08"/>
    <rect x="-280" y="-150" width="560" height="110" rx="20" fill="${cD}"/>
    <rect x="-110" y="-140" width="220" height="56" rx="10" fill="#0d0d10"/>${[0, 1, 2, 3].map(i => `<rect x="-100" y="${-132 + i * 12}" width="200" height="5" fill="#2a2c30"/>`).join('')}
    <rect x="-60" y="-80" width="120" height="30" rx="4" fill="#f2f2f2"/><rect x="-60" y="-80" width="14" height="30" fill="#1d3f9a"/>
    <path d="M-270,-196 L-150,-200 L-150,-160 L-266,-150Z" fill="#e8ecf0"/><path d="M270,-196 L150,-200 L150,-160 L266,-150Z" fill="#e8ecf0"/>
    <path d="M-300,-40 L300,-40 L300,0 L-300,0Z" fill="#0b0b0d"/><rect x="-290" y="-40" width="90" height="40" fill="#141416"/><rect x="200" y="-40" width="90" height="40" fill="#141416"/>
    ${L > 0 ? `<circle cx="-210" cy="-176" r="${120 + 140 * L}" fill="url(#headGlare)" opacity="${L}"/><circle cx="210" cy="-176" r="${120 + 140 * L}" fill="url(#headGlare)" opacity="${L}"/>
       <path d="M-600,-176 L600,-176" stroke="#fffbe8" stroke-width="3" opacity="${.5 * L}" filter="url(#b3)"/>` : ''}
    ${o.livery ? `<rect x="-100" y="-380" width="200" height="28" rx="8" fill="#1a1a1e"/><rect x="-94" y="-376" width="90" height="20" rx="5" fill="${ph ? '#2a7bff' : '#123'}"/><rect x="4" y="-376" width="90" height="20" rx="5" fill="${!ph ? (o.livery === 'US' ? '#ff2a2a' : '#2a7bff') : '#311'}"/>
       <circle cx="${ph ? -50 : 50}" cy="-366" r="160" fill="${ph ? '#2a7bff' : (o.livery === 'US' ? '#ff2a2a' : '#2a7bff')}" opacity=".25" filter="url(#b20)"/>` : ''}
  </g>`;
}
// Lumière de gyrophare sur toute la scène (à mettre en post) — alternance bleu / rouge (US) ou bleu (FR)
function policeWash(t, livery = 'FR', op = .22) {
  const ph = Math.floor(t * 6) % 2;
  const col = ph ? '#2a6bff' : (livery === 'US' ? '#ff2a2a' : '#0a1a5a');
  return `<rect width="1080" height="1920" fill="${col}" opacity="${op}" style="mix-blend-mode:screen"/>`;
}
// Intérieur de voiture, point de vue conducteur. o: outside (svg 1080 de large vu par le pare-brise), mirror (svg dans le rétro), t, wipers
function carInterior(o = {}) {
  const t = o.t || 0;
  return `<clipPath id="windsh"><path d="M-40,180 Q540,120 1120,180 L1120,1050 Q540,1000 -40,1050Z"/></clipPath>
    <g clip-path="url(#windsh)">${o.outside || rect('#05070c')}</g>
    <path d="M-200,-200 L1280,-200 L1280,180 Q540,120 -200,180Z" fill="#0b0c10"/>
    <path d="M-200,180 L60,180 L-60,1060 L-200,1060Z M1280,180 L1020,180 L1140,1060 L1280,1060Z" fill="#101116"/>
    <path d="M-200,1040 Q540,980 1280,1040 L1280,2200 L-200,2200Z" fill="#121318"/>
    <path d="M-200,1040 Q540,980 1280,1040" stroke="#2a2c34" stroke-width="10" fill="none"/>
    ${[260, 400].map(x => `<circle cx="${x}" cy="1210" r="62" fill="#0a0a0d" stroke="#3a3d48" stroke-width="5"/><circle cx="${x}" cy="1210" r="54" fill="#11131a"/><path d="M${x},1210 L${x + 40 * Math.cos(-2.4 + Math.sin(t) * .1)},${1210 + 40 * Math.sin(-2.4 + Math.sin(t) * .1)}" stroke="#ff5a2a" stroke-width="4"/>`).join('')}
    <g transform="translate(330,1540)"><circle r="290" fill="none" stroke="#08080a" stroke-width="58"/><circle r="290" fill="none" stroke="#1e2028" stroke-width="6"/><path d="M-280,40 Q0,120 280,40 L240,110 Q0,170 -240,110Z" fill="#08080a"/><circle r="70" fill="#0b0b0e"/></g>
    <g transform="translate(560,250)"><rect x="-10" y="-120" width="20" height="90" fill="#0b0c10"/><rect x="-190" y="-40" width="380" height="110" rx="26" fill="#0b0c10"/><rect x="-176" y="-28" width="352" height="86" rx="18" fill="#141a26"/>
      <clipPath id="mirrorC"><rect x="-176" y="-28" width="352" height="86" rx="18"/></clipPath><g clip-path="url(#mirrorC)">${o.mirror || ''}</g>
      <rect x="-176" y="-28" width="352" height="30" rx="14" fill="#fff" opacity=".05"/></g>
    ${o.wipers ? `<path d="M540,1040 L${540 + 520 * Math.cos(Math.PI * (.95 - .7 * Math.abs(Math.sin(t * 2.2))))},${1040 - 520 * Math.sin(Math.PI * (.95 - .7 * Math.abs(Math.sin(t * 2.2))))}" stroke="#050506" stroke-width="12"/>` : ''}`;
}

// ---------------- DÉCORS ----------------
function streetLight(x, y, s = 1, on = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-8" y="-640" width="16" height="640" fill="#1a1c22"/><path d="M0,-640 Q0,-680 60,-680 L110,-680" stroke="#1a1c22" stroke-width="12" fill="none"/>
    <rect x="80" y="-690" width="70" height="20" rx="6" fill="#2a2c34"/>${on > 0 ? `<ellipse cx="115" cy="-668" rx="30" ry="8" fill="#ffe6a8" opacity="${on}" filter="url(#glowS)"/>
    <path d="M90,-668 L140,-668 L330,0 L-100,0Z" fill="#ffd98a" opacity="${.08 * on}" filter="url(#b20)"/><ellipse cx="115" cy="0" rx="260" ry="40" fill="url(#streetLightG)" opacity="${on}"/>` : ''}</g>`;
}
// Rue de nuit (profil). o: t, scroll (px), lights:[on...], houses
function streetNight(t, o = {}) {
  const sc = o.scroll || 0, r = rng(o.seed || 3);
  let bld = '';
  for (let i = -1; i < 8; i++) {
    const w = 220 + r() * 120, h = 300 + r() * 380, x = i * 260 - (sc * .4) % 260;
    bld += `<rect x="${x}" y="${1320 - h}" width="${w}" height="${h}" fill="${['#0d111c', '#10141f', '#0b0f19'][i % 3 + 0 >= 0 ? (i + 3) % 3 : 0]}"/>`;
    for (let k = 0; k < 6; k++) { const lit = r() < .25; bld += `<rect x="${x + 30 + (k % 3) * 60}" y="${1340 - h + 40 + Math.floor(k / 3) * 90}" width="34" height="50" fill="${lit ? '#ffcf7a' : '#151b2a'}" opacity="${lit ? .85 : 1}"/>`; }
  }
  let lights = '';
  for (let i = -1; i < 4; i++) { const x = i * 420 + 120 - (sc % 420); lights += streetLight(x, 1440, 1, o.flicker ? flicker(t + i, 1, i) : 1); }
  let dashes = ''; for (let i = -1; i < 8; i++) dashes += `<rect x="${i * 200 - (sc % 200)}" y="1610" width="110" height="10" fill="#d8d2c0" opacity=".6"/>`;
  return `${rect('url(#rSky)')}${stars(t, 30, 600)}${bld}<rect x="-200" y="1320" width="1480" height="130" fill="#2a2c33"/><rect x="-200" y="1440" width="1480" height="12" fill="#3a3d46"/>
    <rect x="-200" y="1452" width="1480" height="700" fill="url(#rAsphalt)"/>${dashes}${lights}
    <rect x="-200" y="1452" width="1480" height="700" fill="#5a6a90" opacity=".05"/>`;
}
// Maison de banlieue (façade). o: windows: {up:bool, down:bool}, figureWindow: svg dans la fenêtre du haut, porch light
function houseFront(t, o = {}) {
  const win = (x, y, on, inner) => `<rect x="${x}" y="${y}" width="150" height="170" fill="${on ? '#f2c46a' : '#0c1220'}" ${on ? 'filter="url(#glowS)"' : ''}/>${inner ? `<clipPath id="hw${x}${y}"><rect x="${x}" y="${y}" width="150" height="170"/></clipPath><g clip-path="url(#hw${x}${y})">${inner}</g>` : ''}
    <path d="M${x + 75},${y} v170 M${x},${y + 85} h150" stroke="#e8e6e0" stroke-width="8"/><rect x="${x - 6}" y="${y - 6}" width="162" height="182" fill="none" stroke="#e8e6e0" stroke-width="10"/>`;
  return `${rect('url(#rSky)')}${stars(t, 40, 700)}${moon(860, 240, 50)}
    <rect x="-200" y="1480" width="1480" height="700" fill="#101a14"/><path d="M-200,1480 L1280,1480" stroke="#1f2e22" stroke-width="10"/>
    <rect x="140" y="760" width="800" height="720" fill="#3a3f4c"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="140" y1="${780 + i * 58}" x2="940" y2="${780 + i * 58}" stroke="#2e333e" stroke-width="4"/>`).join('')}
    <path d="M90,770 L540,480 L990,770Z" fill="#1c1f27"/><path d="M90,770 L540,480 L990,770" stroke="#11131a" stroke-width="14" fill="none"/>
    ${win(220, 840, o.up1, o.figureWindow)}${win(710, 840, o.up2)}${win(220, 1150, o.down1)}
    <rect x="690" y="1150" width="150" height="330" fill="${o.doorOpen ? '#05060a' : '#5a2e22'}"/><circle cx="820" cy="1320" r="9" fill="#c9a23a"/><rect x="670" y="1130" width="190" height="20" fill="#e8e6e0"/>
    ${o.porch !== false ? `<circle cx="880" cy="1120" r="14" fill="#ffe6a8" filter="url(#glowS)" opacity="${o.porchFlicker ? flicker(t, 1.5) : 1}"/><ellipse cx="800" cy="1470" rx="220" ry="40" fill="url(#streetLightG)" opacity=".7"/>` : ''}
    <rect x="300" y="1480" width="120" height="440" fill="#2a2c30"/>`;
}
// Chambre de nuit, vue de face. o: blindsLight, door:'closed'|'ajar'|'open', doorInner (svg dans l'entrebâillement), phone (lueur sur le lit), lamp
function bedroom(t, o = {}) {
  let blinds = ''; for (let i = 0; i < 9; i++) blinds += `<rect x="680" y="${440 + i * 36}" width="300" height="22" fill="#9fb4d8" opacity="${.55 * (o.moon ?? 1)}"/>`;
  let stripes = ''; for (let i = 0; i < 9; i++) stripes += `<path d="M${200 + i * 30},${1120 + i * 40} l420,-40 l0,18 l-420,40z" fill="#9fb4d8" opacity="${.08 * (o.moon ?? 1)}"/>`;
  const doorX = 120, dw = 230;
  const gap = o.door === 'ajar' ? 70 : o.door === 'open' ? 200 : 0;
  return `<rect x="-200" y="-200" width="1480" height="2400" fill="url(#wallN)"/>
    <rect x="-200" y="1360" width="1480" height="900" fill="#171a24"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="-200" y1="${1380 + i * 70}" x2="1280" y2="${1380 + i * 70}" stroke="#12141c" stroke-width="5"/>`).join('')}
    <rect x="660" y="420" width="340" height="360" fill="#0a0e18"/>${blinds}<rect x="650" y="410" width="360" height="380" fill="none" stroke="#2a2f40" stroke-width="16"/>
    ${stripes}
    <rect x="${doorX - 14}" y="760" width="${dw + 28}" height="610" fill="#252a38"/><rect x="${doorX}" y="776" width="${dw}" height="594" fill="#05060a"/>
    ${o.doorInner && gap ? `<clipPath id="dgap"><rect x="${doorX}" y="776" width="${gap}" height="594"/></clipPath><g clip-path="url(#dgap)">${o.doorInner}</g>` : ''}
    <path d="M${doorX + gap},776 L${doorX + dw},776 L${doorX + dw},1370 L${doorX + gap},1370Z" fill="#3a4054"/><circle cx="${doorX + dw - 30}" cy="1080" r="10" fill="#8a8f9a"/>
    <rect x="260" y="560" width="140" height="110" fill="#22283a" stroke="#3a4054" stroke-width="10"/>
    <g transform="translate(560,1360)"><rect x="-420" y="-210" width="840" height="210" rx="20" fill="#2a3046"/><rect x="-440" y="-300" width="60" height="300" rx="14" fill="#232838"/>
      <path d="M-400,-200 Q-200,-260 0,-230 Q240,-200 420,-230 L420,-40 L-400,-40Z" fill="#3a4a6a"/><ellipse cx="-300" cy="-232" rx="90" ry="34" fill="#c9ced8"/>
      ${o.phone ? `<ellipse cx="-150" cy="-230" rx="140" ry="50" fill="url(#phoneLight)"/><rect x="-170" y="-242" width="40" height="18" rx="4" fill="#bfe0ff" filter="url(#glowS)"/>` : ''}</g>
    <g transform="translate(980,1360)"><rect x="-60" y="-160" width="120" height="160" fill="#20242f"/><rect x="-12" y="-230" width="24" height="70" fill="#3a3f4c"/><path d="M-50,-230 L50,-230 L30,-290 L-30,-290Z" fill="${o.lamp ? '#ffd98a' : '#4a4f5c'}" ${o.lamp ? 'filter="url(#glowS)"' : ''}/></g>
    ${o.lamp ? `<circle cx="980" cy="1100" r="500" fill="url(#lampGlow)" opacity=".7"/>` : ''}`;
}
// Couloir en perspective. o: endDoor 'closed'|'open', figure (svg au fond), flick
function hallway(t, o = {}) {
  const f = o.flick ? flicker(t, 1.2) : 1;
  let doors = '';
  for (let i = 0; i < 3; i++) { const k = 1 - i * .25; doors += `<path d="M${130 + i * 110},${700 + i * 60} L${130 + i * 110},${1500 - i * 120} L${190 + i * 90},${1440 - i * 100} L${190 + i * 90},${740 + i * 50}Z" fill="#2a2420" opacity="${k}"/><path d="M${950 - i * 110},${700 + i * 60} L${950 - i * 110},${1500 - i * 120} L${890 - i * 90},${1440 - i * 100} L${890 - i * 90},${740 + i * 50}Z" fill="#2a2420" opacity="${k}"/>`; }
  return `${rect('#0a0b0f')}<path d="M0,0 L440,860 L640,860 L1080,0Z" fill="#1c1d24"/><path d="M0,1920 L440,1160 L640,1160 L1080,1920Z" fill="#18140f"/>
    <path d="M0,0 L440,860 L440,1160 L0,1920Z" fill="#26272f"/><path d="M1080,0 L640,860 L640,1160 L1080,1920Z" fill="#202129"/>
    ${doors}<rect x="440" y="860" width="200" height="300" fill="${o.endDoor === 'open' ? '#020203' : '#3a2e24'}"/>${o.figure ? `<clipPath id="hwend"><rect x="440" y="860" width="200" height="300"/></clipPath><g clip-path="url(#hwend)">${o.figure}</g>` : ''}
    ${lightCone(540, 120, 500, 1400, f)}<rect width="1080" height="1920" fill="#000" opacity="${(1 - f) * .55}"/>`;
}
// Route en forêt de nuit, en perspective (vue conducteur ou à pied). o: headlights (0..1), fog, scroll
function forestRoad(t, o = {}) {
  const sc = o.scroll || 0; let trees = '';
  const r = rng(21);
  for (let i = 0; i < 14; i++) { const side = i % 2 ? 1 : -1, d = ((i * .13 + sc * .002) % 1), y = 900 + d * 700, s = .3 + d * 1.6, x = 540 + side * (120 + d * 700);
    trees += `<path d="M${x},${y - 900 * s} L${x + 90 * s},${y} L${x - 90 * s},${y}Z" fill="#05080a" opacity="${.6 + d * .4}"/><rect x="${x - 10 * s}" y="${y - 40 * s}" width="${20 * s}" height="${60 * s}" fill="#050505"/>`; }
  let dashes = ''; for (let i = 0; i < 8; i++) { const d = ((i / 8 + sc * .003) % 1), y = 920 + d * d * 1000, w = 4 + d * 30, h = 10 + d * 90; dashes += `<rect x="${540 - w / 2}" y="${y}" width="${w}" height="${h}" fill="#d8d2c0" opacity="${.4 + d * .4}"/>`; }
  const hl = o.headlights ?? 1;
  return `${rect('url(#rSky)')}${stars(t, 50, 800)}${o.moon !== false ? moon(780, 380, 40) : ''}
    <path d="M-200,900 L1280,900 L1280,2200 L-200,2200Z" fill="#06080b"/><path d="M500,900 L580,900 L1300,1920 L-220,1920Z" fill="#14161b"/>${dashes}${trees}
    ${hl > 0 ? `<path d="M-100,1920 L470,980 L610,980 L1180,1920Z" fill="url(#beamUp)" opacity="${hl}"/>` : ''}
    ${o.fog ? fogBands(t, 1000, .18) : ''}`;
}

// ---------------- TÉLÉPHONE / THREAD ----------------
// messages: [{from:'me'|'them', text, t}] ; affiche ceux dont t <= temps
function phoneChat(t, x, y, s, msgs, o = {}) {
  let bub = '', yy = 120;
  for (const m of msgs) {
    if (t < m.t) { if (o.typing && t > m.t - 1.2 && m.from === 'them') bub += `<g transform="translate(40,${yy})"><rect width="110" height="56" rx="28" fill="#2a2d36"/>${[0, 1, 2].map(i => `<circle cx="${30 + i * 25}" cy="28" r="7" fill="#9aa" opacity="${.4 + .6 * Math.abs(Math.sin(t * 6 + i))}"/>`).join('')}</g>`; break; }
    const lines = wrapText(m.text, 22), h = 30 + lines.length * 38, me = m.from === 'me', w = Math.min(420, 40 + Math.max(...lines.map(l => l.length)) * 19);
    const bx = me ? 520 - w : 40;
    bub += `<g transform="translate(${bx},${yy})"><rect width="${w}" height="${h}" rx="26" fill="${me ? '#2f7bff' : '#2a2d36'}"/>${lines.map((l, i) => `<text x="20" y="${46 + i * 38}" font-family="MS" font-weight="800" font-size="30" fill="#fff">${esc(l)}</text>`).join('')}</g>`;
    yy += h + 22;
  }
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-20" y="-20" width="600" height="1100" rx="70" fill="#0a0a0c"/><rect x="0" y="0" width="560" height="1060" rx="56" fill="#0f1117"/>
    <rect x="0" y="0" width="560" height="96" rx="56" fill="#161922"/><circle cx="70" cy="50" r="26" fill="#3a3f4c"/><text x="110" y="62" font-family="MS" font-weight="800" font-size="30" fill="#fff">${esc(o.title || 'Inconnu')}</text>
    <clipPath id="chatC"><rect x="0" y="96" width="560" height="960"/></clipPath><g clip-path="url(#chatC)">${bub}</g></g>`;
}
function wrapText(s, n) { const w = s.split(' '), out = []; let cur = ''; for (const x of w) { if ((cur + ' ' + x).trim().length > n) { out.push(cur.trim()); cur = x; } else cur += ' ' + x; } if (cur.trim()) out.push(cur.trim()); return out; }
// Carte « thread » (extrait du témoignage, façon post anonyme)
function threadCard(lt, o = {}) {
  const a = E.out(prog(lt, 0, .35)), lines = wrapText(o.text || '', 26);
  const chars = Math.floor(prog(lt, .2, .2 + (o.text || '').length * .035) * (o.text || '').length);
  let shown = (o.text || '').slice(0, chars), outL = wrapText(shown, 26);
  return `<g transform="translate(540,${960 + (1 - a) * 80})" opacity="${a}"><rect x="-460" y="-${120 + lines.length * 30}" width="920" height="${240 + lines.length * 60}" rx="36" fill="#0f1117" stroke="#2a2d36" stroke-width="3" filter="url(#softSh)"/>
    <circle cx="-380" cy="-${60 + lines.length * 30}" r="38" fill="#3a3f4c"/><text x="-380" y="-${46 + lines.length * 30}" text-anchor="middle" font-family="MS" font-weight="900" font-size="38" fill="#9aa">?</text>
    <text x="-320" y="-${66 + lines.length * 30}" font-family="MS" font-weight="900" font-size="32" fill="#fff">${esc(o.author || 'Anonyme')}</text>
    <text x="-320" y="-${30 + lines.length * 30}" font-family="MS" font-weight="800" font-size="24" fill="#6a7080">${esc(o.meta || 'thread · témoignage')}</text>
    <text x="420" y="-${60 + lines.length * 30}" text-anchor="end" font-family="MS" font-weight="900" font-size="28" fill="#e5452f">${esc(o.num || '')}</text>
    ${outL.map((l, i) => `<text x="-400" y="${-lines.length * 30 + 50 + i * 60}" font-family="SE" font-size="44" fill="#e8e8e8">${esc(l)}</text>`).join('')}</g>`;
}
// Intro de série : texte d'accroche tapé + glitch, puis titre du thread. o: hook (lignes), title, sub
function seriesIntro(t, lt, o = {}) {
  const hook = o.hook || [], tIn = o.tTitle ?? 2.4;
  let g = `<rect width="1080" height="1920" fill="#050507"/>${grain(t)}${grain(t + .5)}`;
  if (lt < tIn) {
    const full = hook.join('\n'), n = Math.floor(clamp(lt / (tIn - .5)) * full.length);
    let shown = full.slice(0, n).split('\n');
    shown.forEach((l, i) => { g += `<text x="540" y="${820 + i * 100}" text-anchor="middle" font-family="AN" font-size="84" fill="${i === shown.length - 1 && o.redLast ? '#e5452f' : '#f2f2f2'}" letter-spacing="2">${esc(l.toUpperCase())}</text>`; });
    if (Math.floor(lt * 4) % 2) g += `<rect x="${540 + 20}" y="${740 + (shown.length - 1) * 100}" width="6" height="90" fill="#e5452f"/>`;
  } else {
    const a = E.back(prog(lt, tIn, tIn + .3)), gl = lt - tIn < .3;
    const title = `<g transform="translate(540,960) scale(${.8 + .2 * a})"><text y="-60" text-anchor="middle" font-family="MS" font-weight="900" font-size="40" fill="#e5452f" letter-spacing="10">${esc(o.kicker || 'THREAD #1')}</text>
      <text y="60" text-anchor="middle" font-family="AN" font-size="${Math.min(150, 1700 / Math.max(6, (o.title || '').length))}" fill="#fff">${esc((o.title || '').toUpperCase())}</text>
      <rect x="-200" y="100" width="400" height="8" fill="#e5452f"/><text y="180" text-anchor="middle" font-family="SE" font-size="38" fill="#9aa0ac">${esc(o.sub || '')}</text></g>`;
    g += gl ? `<g filter="url(#rgbSplit)">${title}</g>` : title;
  }
  return g;
}
// Sous-titres « thread » : MAJUSCULES Montserrat Black, mot en cours en jaune et plus gros, [mot]R rouge
function subtitlesThread(t, chunks, shot) {
  const c = chunks.find(c => t >= c.t0 && t < c.t1);
  if (!c) return '';
  const pop = E.back(prog(t, c.t0, c.t0 + .1)), sc = .9 + .1 * pop;
  let spans = '';
  for (const w of c.words) {
    const cur = t >= w.t0 && t < w.t1 + .05, said = t >= w.t0;
    let col = said ? '#ffffff' : '#ffffff';
    if (w.color === 'R') col = '#ff3b30'; else if (w.color === 'J' || w.color === 'B') col = w.color === 'B' ? '#4aa8ff' : '#ffd400';
    if (cur && !w.color) col = '#ffd400';
    spans += `<tspan fill="${col}" fill-opacity="${said ? 1 : .55}" ${cur ? 'font-size="92"' : ''}>${esc(w.w.toUpperCase())} </tspan>`;
  }
  const italic = c.words[0].style !== 'narr';
  return `<g transform="translate(540,${(shot && shot.subY) || 1380}) scale(${sc})" filter="url(#subsh)"><text text-anchor="middle" font-family="MS" font-weight="900" font-size="80" ${italic ? 'font-style="italic"' : ''}
    stroke="#000" stroke-width="13" stroke-linejoin="round" paint-order="stroke">${spans.trim()}</text></g>`;
}
function buildChunksThread(words) { return buildChunksRoue(words, 3, 15); }
