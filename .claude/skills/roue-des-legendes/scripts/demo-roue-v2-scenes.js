// Démo format ROUE DES LÉGENDES v2 (référence what.if.lab) avec nos personnages
function buildStory(tl) {
  setTimeline(tl);
  const roster = rosterV2({ 'Krampus': s => krampus({ y: 30, s: s * .62, sack: false, twigs: false }), 'La Llorona': s => llorona({ y: -30, s: s * .9, face: 1 }), 'La Ghoula': s => ghoulaFace({ y: 10, s: s * 1.1, smile: .8 }) });
  const iS = roster.findIndex(r => r.name === 'Krampus'), iC = roster.findIndex(r => r.name === 'La Llorona');
  const shots = [], S = (t0, t1, draw, cam, extra = {}) => shots.push(Object.assign({ t0, t1, draw, cam }, extra));
  const night = (t, seed) => `${rect('url(#skyN)')}${stars(t, 60, 700)}${moon(860, 260, 55)}${snowForest(t, seed, 1300)}`;
  S(0, 9.5, (t) => roueIntroV2(t, { roster, sauveur: iS, cauchemar: iC, tTop: [0, 2.6], tBot: [3, 2.8], tVs: 7.2 }), { s: [1, 1] }, { noVig: true, subY: 1760 });
  S(9.5, 12, (t) => `${night(t, 4)}${cabin(380, 1330, 1.1, t)}${boy({ x: 800, y: 1180, s: .8, shirt: '#2f5fd0', scarf: '#d8263a', expr: 'neutral' })}${snow(t)}`, { s: [1, 1.06] }, { subY: 1400 });
  S(12, 14.5, (t) => `${night(t, 6)}${llorona({ x: 540, y: 820 + Math.sin(t * 2) * 15, s: 1, face: 1, arms: 'down' }, t)}${fogBands(t, 1350, .25)}${snow(t)}`, { s: [1, 1.08] }, { subY: 1400 });
  S(14.5, 17, (t, lt) => `${night(t, 8)}${llorona({ x: 540, y: 860, s: 2.6, face: 1, scream: E.out(prog(lt, .4, 1.2)) }, t)}${snow(t)}`, { s: [1, 1.1] }, { subY: 1400 });
  S(17, 19.5, (t, lt) => `${night(t, 2)}${iceHole(540, 1500, 1.2, t)}${boy({ x: 560, y: 1160, s: .85, shirt: '#2f5fd0', scarf: '#d8263a', expr: 'scared', rot: -8 * prog(lt, 0, 2) })}
     <path d="M1000,800 Q760,980 640,1060" stroke="#efeee8" stroke-width="34" stroke-linecap="round" fill="none"/>${snow(t)}`, { s: [1, 1.05] }, { subY: 1400 });
  S(19.5, 22, (t) => `${night(t, 5)}${fogBands(t, 1300, .3)}${krampus({ x: 540, y: 860, s: .95, roar: .4 }, t)}${snow(t)}`, { s: [1.05, 1.12] }, { subY: 1400 });
  S(22, 24, (t, lt) => `${night(t, 9)}${iceHole(700, 1460, 1, t)}${llorona({ x: 760, y: 980, s: .75, face: 1, scream: 1, arms: 'up' }, t)}${krampus({ x: 290, y: 920, s: .8, roar: 1 }, t)}
     <path d="M440,980 Q600,${900 + Math.sin(t * 20) * 60} 700,960" stroke="#d8d8d0" stroke-width="10" stroke-dasharray="20 10" fill="none"/>${snow(t)}`, { s: [1, 1.05] }, { subY: 1400 });
  S(24, 26, (t) => `${rect('#160a0a')}${krampus({ x: 540, y: 900, s: 1.9, roar: .6, sack: false }, t)}${snow(t, .6)}`, { s: [1, 1.1] }, { subY: 1400, post: (t) => `<rect width="1080" height="1920" fill="#c00" opacity=".18"/>` });
  S(26, 28, (t, lt) => `${night(t, 7)}${boy({ x: 540, y: 1150, s: 2.4, bust: true, shirt: '#2f5fd0', scarf: '#d8263a', expr: 'scared', sweat: true, tint: 'night' })}${snow(t)}${sackClose(prog(lt, 1, 2))}`, { s: [1, 1.08] }, { subY: 1400 });
  S(28, 30, (t) => blackEyes(t), { s: [1, 1] }, { subY: 1400, noVig: true });
  shots.forEach((s, i) => { if (i < shots.length - 1) s.t1 = shots[i + 1].t0; });
  return { defs: PERSO_DEFS + PERSO_POSTER_DEFS + ROUE_DEFS + ROUE2_DEFS, shots, shakes: [{ t: 22.3, d: .4, a: 16 }], flashes: [{ t: 22.2, d: .2 }], chunks: buildChunks(tl.words), cta: null };
}
