// Démo « thread horreur » réaliste : un plan par élément (1,5 s chacun)
function buildStory(tl) {
  setTimeline(tl);
  const shots = [], S = (t0, t1, draw, cam, extra = {}) => shots.push(Object.assign({ t0, t1, draw, cam }, extra));
  let T = 0; const nx = (d, draw, cam = { s: [1, 1.05] }, ex = {}) => { S(T, T + d, draw, cam, ex); T += d; };
  nx(3, (t, lt) => seriesIntro(t, lt, { hook: ['Et si les threads horreur', 'que tu as entendus', 'étaient les tiens ?'], redLast: true, tTitle: 2.2, kicker: 'THREAD #1', title: 'La baby-sitter', sub: "d'après un témoignage Reddit" }), { s: [1, 1] }, { noSubs: true, noVig: true });
  nx(2, (t) => `${streetNight(t, { scroll: t * 300 })}${sedan({ x: 540, y: 1700, s: .95, color: '#6a7a8a', t, moving: true, lights: 1 })}`);
  nx(2, (t) => `${streetNight(t, { seed: 5 })}${sedan({ x: 600, y: 1700, s: .95, color: '#f2f2f2', t, livery: 'FR' })}${human({ x: 160, y: 1660, s: .85, top: 'police', hair: 'policeCap', arms: 'flashlight', expr: 'worried' })}`, { s: [1, 1.05] }, { post: (t) => policeWash(t, 'FR', .12) });
  nx(2, (t) => `${streetNight(t, { seed: 8 })}${sedan({ x: 500, y: 1700, s: .95, color: '#f4f4f4', t, livery: 'US', flip: true })}${human({ x: 900, y: 1660, s: .85, top: 'policeUS', hair: 'policeCap', skin: '#8a5a3c', arms: 'down', talk: .5 })}`, { s: [1, 1.05] }, { post: (t) => policeWash(t, 'US', .14) });
  nx(2, (t) => `${forestRoad(t, { headlights: 0, fog: true })}${carFront({ x: 540, y: 1250, s: .6, color: '#2a2d33', lights: 1, t })}`);
  nx(2, (t) => carInterior({ t, outside: forestRoad(t, { scroll: t * 300 }), mirror: `<g transform="translate(40,140)">${paleEntity({ s: .14, smile: .9, eyes: 'white' })}</g>` }), { s: [1, 1.03] });
  nx(2, (t) => `${bedroom(t, { door: 'ajar', phone: true, doorInner: `<g transform="translate(200,1700)">${paleEntity({ s: .95, smile: .8, tilt: -20 })}</g>` })}${human({ x: 600, y: 1500, s: .95, arms: 'phoneLook', phoneGlow: true, expr: 'fear', hair: 'long', hairCol: '#5a3a22', top: 'tshirt', topCol: '#6a4a8a' })}`);
  nx(2, (t, lt) => `${rect('#0a0b10')}${phoneChat(lt, 260, 360, 1, [{ from: 'them', text: "Tu es seule ce soir ?", t: .2 }, { from: 'me', text: 'Qui est-ce ?', t: .8 }, { from: 'them', text: 'Regarde derrière toi.', t: 1.4 }], { title: 'Numéro inconnu', typing: true })}`);
  nx(2, (t, lt) => `${rect('#07080c')}${threadCard(lt, { num: '3/12', text: "Il était 3h12 quand j'ai entendu la porte d'entrée se refermer." })}`, { s: [1, 1] }, { noSubs: true });
  nx(2, (t) => hallway(t, { flick: true, endDoor: 'open', figure: figureSilhouette(540, 1160, .3, { eyes: '#fff' }) }));
  nx(2, (t) => `${houseFront(t, { up1: false, up2: true, down1: true, figureWindow: figureSilhouette(295, 1010, .17, { eyes: '#fff' }) })}${human({ x: 540, y: 1700, s: .6, view: 'back', hair: 'hood', top: 'hoodie' })}`);
  nx(1.2, (t, lt) => screamer(t, lt, 'pale'), { s: [1, 1] }, { noSubs: true, noVig: true });
  nx(2, (t, lt) => `${rect('#06070a')}${human({ x: 540, y: 2300, s: 2.1, expr: 'fear', hair: 'short', top: 'hoodie', topCol: '#2d4a6a', sweat: true })}${handOnShoulder(860, 1150, 1.4, prog(lt, .3, .9), 'r')}`);
  shots.forEach((s, i) => { if (i < shots.length - 1) s.t1 = shots[i + 1].t0; });
  return { defs: PERSO_DEFS + PERSO_POSTER_DEFS + ROUE_DEFS + ROUE2_DEFS + REAL_DEFS, shots, shakes: [], flashes: [], chunks: buildChunksThread(tl.words), subFn: subtitlesThread, cta: null };
}
