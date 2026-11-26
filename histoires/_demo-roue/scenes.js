// Démo du format « Roue des légendes » avec les personnages style sticker
function buildStory(tl) {
  setTimeline(tl);
  const roster = [
    { name: 'La Llorona', lvl: 2, draw: s => llorona({ y: -40, s: s * 1.15, face: 1 }) },
    { name: 'Krampus', lvl: 10, draw: s => krampus({ y: 40, s: s * .8 }) },
    { name: 'La Ghoula', lvl: 8, draw: s => ghoulaFace({ y: 30, s: s * 1.5, smile: .8 }) },
    { name: 'Teke Teke', lvl: 9, draw: s => ghoulaFace({ y: 30, s: s * 1.5, smile: 1, red: true }) },
  ];
  const shots = [], S = (t0, t1, draw, cam, extra = {}) => shots.push(Object.assign({ t0, t1, draw, cam }, extra));
  const cfg = { n: 1, roster, sauveur: 0, cauchemar: 1, tTop: [0, 2.6], tBot: [3, 2.8], tVs: 7 };
  S(0, 9, (t) => roueIntro(t, cfg) + (t < 3 ? roueCaption([['LA ROUE ', ''], ['BLEUE', 'b'], [' A CHOISI TON ', ''], ['SAUVEUR.', 'b']]) :
     t < 6 ? roueCaption([['LA ROUE ', ''], ['ROUGE', 'r'], [' A CHOISI TON ', ''], ['CAUCHEMAR.', 'r']]) :
     t < 7 ? roueCaption([['LA LLORONA', 'b'], [' CONTRE ', ''], ['KRAMPUS.', 'r']]) : roueCaption([['VAS-TU ', ''], ['SURVIVRE', 'r'], [' ?', '']], 1800, 70)),
     { s: [1, 1] }, { noSubs: true, noOverlay: true, noVig: true });
  S(9, 12, (t) => `${snowForest(t)}${car(560, 1330, 1.1, t, false, .9)}${snow(t)}${clockBadge('02:19', 420)}`, { s: [1, 1.06] });
  S(12, 15, (t) => `${snowForest(t, 7)}${fogBands(t, 1250, .3)}${krampus({ x: 540, y: 800, s: 1.1, roar: .3 }, t)}${snow(t)}`, { s: [1, 1.1] });
  S(15, 18, (t, lt) => legendProfile(lt, { side: 'cauchemar', name: 'Krampus', flag: 'AT', region: 'Les Alpes · Autriche', lvl: 10, label: 'EXTRÊME', draw: s => krampus({ x: 0, y: -60, s: s * .85 }) }), { s: [1, 1.03] }, { noOverlay: true, subY: 1730 });
  S(18, 21, (t, lt) => vintagePoster(lt, { kicker: 'la légende', title: 'Il emporte les enfants', scenery: 'village', silhouette: krampus({ x: 0, y: -40, s: .75, noStk: true }) }), { s: [1, 1.03] }, { noOverlay: true, subY: 1730 });
  S(21, 24, (t) => `${snowForest(t, 9)}${boy({ x: 420, y: 1000, s: 1, run: t * 11, expr: 'scared', shirt: '#2f6fe0' })}${girl({ x: 650, y: 1080, s: .8, run: t * 11 + 1, expr: 'scared' })}${snow(t)}`, { s: [1, 1.05] });
  S(24, 27, (t, lt) => `${snowForest(t, 11)}${waterColumn(700, 1350, prog(lt, 0, 1.2), t)}${krampus({ x: 330, y: 820, s: .9, roar: 1 }, t)}${ghostArms(t, 760, 1100, 380, 900, prog(lt, .3, 1.6))}${llorona({ x: 780, y: 950, s: .7, arms: 'reach', face: 1, scream: .8 }, t)}${iceRing(540, 1450, (lt % 1.5) / 1.5)}${snow(t)}`, { s: [1, 1.05] });
  S(27, 30, (t, lt) => `${snowForest(t, 3)}${llorona({ x: 540, y: 820, s: 2.2, face: E.inOut(prog(lt, .3, 1.5)) }, t)}`, { s: [1, 1.12] });
  shots.forEach((s, i) => { if (i < shots.length - 1) s.t1 = shots[i + 1].t0; });
  return { defs: PERSO_DEFS + PERSO_POSTER_DEFS + ROUE_DEFS, shots, shakes: [{ t: 24.6, d: .5, a: 18 }], flashes: [{ t: 24.4, d: .3 }],
    chunks: buildChunksRoue(tl.words), subFn: subtitlesRoue, overlay: (t) => roueHeader(1, 'La Llorona', 'Krampus'), cta: null };
}
