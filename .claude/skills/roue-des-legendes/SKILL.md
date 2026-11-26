---
name: roue-des-legendes
description: Format TikTok « ROUE DES LÉGENDES N°X » (~90-100 s, 9:16) — deux roues tirent au sort un SAUVEUR (bleu) et un CAUCHEMAR (rouge) parmi les légendes du monde, écran VS « Vas-tu survivre ? », puis histoire de survie à la 2e personne où le cauchemar attaque, le sauveur intervient (combat surnaturel) et un twist final rend le sauveur ambigu. Fiches « niveau de menace », posters vintage « la légende », bandeau d'épisode permanent, sous-titres phrase. Personnages dans le style sticker des skills précédents. Écrit l'épisode + les textes ElevenLabs par voix, puis monte la vidéo sur les MP3 de l'utilisateur. À utiliser pour toute demande de « roue des légendes », duel de légendes, sauveur vs cauchemar.
---

# ROUE DES LÉGENDES — format duel (skill principal pour ce type de vidéo)

Référence analysée : épisode N°1 *La Llorona contre Krampus* (99 s) → `references/script-llorona-vs-krampus.md`, images `references/frames/`.
**Graphismes des personnages : on garde notre style « sticker »** (têtes rondes, contour blanc, cf. skill `legende-horreur-2d`) — PAS le style de la référence (bonhommes à capuche). Tout le reste (structure, intro, fiches, posters, rythme, sous-titres, bandeau) suit la référence.
Moteur partagé : `engine/` (`lib.js` + `persos.js` + `roue.js` + `sfx.py`). Démo : `histoires/_demo-roue/scenes.js`.

## 1. Specs

| Paramètre | Valeur |
|---|---|
| Format | 1080×1920, 30 fps, -14 LUFS |
| Durée | 90–100 s : intro roues ~8 s + histoire ~85 s + regard final ~2 s |
| Voix | ~300–330 mots (avec voix ElevenLabs lentes : viser ~280 mots, narrateur ×1,15) |
| Plans | 1 plan / 2–3 s, beaucoup de gros plans détail |
| Série | Numéroter : « ROUE DES LÉGENDES · N°1, N°2… » (garder un registre des épisodes dans `histoires/roue-XX-*/`) |
| Fin | Pas d'outro. Bouton CTA « Commente » (§7) |

## 2. Structure d'un épisode

| # | Bloc | Temps | Contenu |
|---|---|---|---|
| 1 | **ROUE BLEUE** | 0–3 s | Écran coupé bleu (haut) / rouge (bas), bandes de cartes qui défilent (cartes numérotées = niveau de menace /10). La bleue s'arrête. Voix + légende : « La roue **bleue** a choisi ton **sauveur**. » |
| 2 | **ROUE ROUGE** | 3–6 s | « La roue **rouge** a choisi ton **cauchemar**. » |
| 3 | **DUEL** | 6–7,5 s | « [Sauveur] contre [Cauchemar]. » |
| 4 | **VS** | 7,5–8,5 s | Les deux cartes face à face, « Vas-tu **survivre** ? » |
| 5 | **MISE EN PLACE** | 8–17 s | Heure précise en horloge (« 2h19 du matin. »), toi + un être fragile (petite sœur, petit frère, bébé, grand-mère…), lieu isolé lié à la légende du cauchemar (route enneigée, désert, forêt), météo qui empire |
| 6 | **PANNE / ISOLEMENT** | 16–20 s | « Et puis… le moteur s'arrête. Les phares s'éteignent. **Silence.** » |
| 7 | **APPROCHE DU CAUCHEMAR** | 20–28 s | D'abord un son (chaînes, pas, pleurs), puis **révélation par morceaux** en phrases nominales : « Une immense silhouette à cornes. Des sabots de bouc. Une longue langue rouge. Et sur son dos, un grand sac. » |
| 8 | **FICHE CAUCHEMAR + POSTER** | 28–35 s | « [Nom]. » (fiche rouge, menace qui monte → EXTRÊME) + « Dans [région], on dit qu'il… » (poster vintage « la légende — [CE QU'IL FAIT] ») + conséquence (« et qu'on ne les revoit jamais. ») |
| 9 | **MENACE CIBLÉE** | 35–37 s | Le cauchemar désigne l'être fragile (« Il pointe ta sœur du doigt… ») |
| 10 | **FUITE** | 37–44 s | « Tu attrapes sa main, et tu cours dans [lieu]. » + difficulté physique (« La neige aux genoux. ») + le son du cauchemar qui se rapproche |
| 11 | **APPARITION DU SAUVEUR** | 44–54 s | « Et puis, tu entends autre chose. » Signe sensoriel du sauveur (pleurs, chant, odeur…) + sa réplique signature en langue d'origine + description (visage caché) |
| 12 | **FICHE SAUVEUR + POSTER** | 54–60 s | Fiche bleue, menace basse, étiquette « **ALLIÉ… ?** » (le doute est planté) + poster « la légende — [CE QU'ELLE FAIT] » |
| 13 | **CLIMAX DE MENACE** | 60–66 s | L'être fragile tremble ; le cauchemar casse tout, tend la main vers lui |
| 14 | **COMBAT** | 66–84 s | « Mais d'un coup, [sauveur] [action]. » Pouvoir spectaculaire lié à SA légende (rivière qui explose, bras fantômes, feu, sable…) ; le cauchemar se débat, rugit ; escalade « et encore… et encore… jusqu'à ce que… » ; il disparaît |
| 15 | **ACCALMIE** | 84–87 s | « Silence. Juste [la neige]. Tu as survécu. » |
| 16 | **TWIST** | 87–96 s | « Mais quand tu te retournes pour la remercier… » le sauveur prend/garde l'être fragile ou révèle sa vraie règle. Réplique finale glaçante en italique (« Je ne sauve que les enfants. »). Fin sur son visage, regard caméra, figé ~2 s |

**Choix du duel** : le cauchemar et le sauveur viennent de pays différents ; le sauveur doit avoir une raison *dans sa propre légende* de protéger la victime (la Llorona → les enfants), et cette même raison crée le twist. Le lieu vient de la légende du cauchemar.

## 3. Écriture

- 2e personne, présent ; phrases très courtes ; **phrases nominales** pour révéler un monstre (« Des sabots de bouc. Une longue langue rouge. »).
- Ponctuation de suspense : « Et puis… », « Mais d'un coup, », « et encore… et encore… jusqu'à ce que… ».
- Un seul « Silence. » isolé après la panne, un autre après la victoire.
- Chiffres/heures précis (« 2h19 du matin »).
- Réplique du sauveur dans sa langue (« Ay… mis hijos. »), dernière réplique en français, courte.
- Personnages par leur rôle (ta petite sœur), jamais de prénom.

## 4. Habillage (composants `engine/roue.js`)

| Élément | Fonction | Notes |
|---|---|---|
| Intro roues | `roueIntro(t, cfg)` + `roueCaption(parts)` | `cfg = {n, roster, sauveur, cauchemar, tTop:[t0,dur], tBot:[t0,dur], tVs}`. `roster` = 4–8 légendes `{name, lvl, draw:s=>svg}` (le même monstre peut être dessiné en couleur différente). Légendes MAJUSCULES, mots « bleue/sauveur » en bleu, « rouge/cauchemar/survivre » en rouge. Plan avec `noSubs, noOverlay, noVig`. |
| Bandeau d'épisode | `roueHeader(n, sauveur, cauchemar)` via `story.overlay` | Pastille blanche « ROUE DES LÉGENDES · N°X » + puces « SAUVEUR · X » (bleu) / « CAUCHEMAR · Y » (rouge), **visible pendant toute l'histoire** (sauf fiches/posters : `noOverlay`). |
| Horloge | `clockBadge('02:19', 420)` | En haut, sous le bandeau, sur le plan d'ouverture. |
| Fiche légende | `legendProfile(lt, {side, name, flag, region, lvl, label, draw})` | `side:'cauchemar'` → rouge, « EXTRÊME » ; `'sauveur'` → bleu, « ALLIÉ… ? ». Drapeaux : `flag('DZ'|'MA'|'TN'|'MX'|'AT'|'JP'|'FR'|'BR'|'PH')`. Plan avec `{noOverlay:true, subY:1730}`. |
| Poster vintage | `vintagePoster(lt, {kicker, title, silhouette, scenery})` | Papier beige, « — la légende — », titre serif = ce que fait la créature (« IL EMPORTE LES ENFANTS »), silhouette noircie du monstre + décor `village|forest|river`. `{noOverlay:true, subY:1730}`. |
| Sous-titres | `buildChunksRoue(words)` + `subtitlesRoue` (`story.subFn`) | **Minuscules / casse normale**, Nunito Black, blanc contour noir épais, 1–3 mots, y ≈ 1450, pop-in, **pas de couleurs** ; répliques en italique. |
| VFX combat | `ghostArms`, `waterColumn`, `iceRing`, `fogBands`, `snow`, `rain`, `flicker`, `lightCone`, `blackCard`, `wallShadow` | + secousses/flashs de `lib.js`. |

## 5. Personnages et décors (style des skills précédents)

`engine/persos.js` : `boy` (enfant ; `tall:true` = ado/adulte ; `run:phase` = **course conservée** de la Ghoula), `girl` (petite sœur), `grandma`, `teddy`, `ghoulaBack/ghoulaFace/eyesInDark`, `llorona({face, cry, arms, scream})`, `krampus({roar, eyes, sack})`, décors `snowForest`, `pine`, `dunesNight`, `ksar`, `palm`, `door`, `clock`, `car`, `lamp`, `moon`, `stars`, `flag`.
Pour une nouvelle légende : dessiner sa fonction dans `persos.js` (même grammaire : origine = base du cou, contour `#stk`, une variante « visage révélé », une variante « attaque »), et l'ajouter au roster.
Règles visuelles : héros en couleur franche (hoodie bleu), être fragile en rose ; cauchemar sombre avec yeux lumineux ; sauveur clair/pâle ; plans détail (sabots, langue, chaînes, mains) pour la révélation ; contre-plongée sur le cauchemar ; le dernier plan est le visage du sauveur qui se tourne vers la caméra.

## 6. Audio

- **Voix** : l'utilisateur la génère sur ElevenLabs (v3). Livrer un bloc de code par clip, numérotés, `### NN · 🎙️ NARRATEUR` / `👹 KRAMPUS (change de voix)` / `👻 LA LLORONA (change de voix)`…, avec balises d'émotion (`[dramatic, announcer]` pour l'intro roue, `[tense, slower]`, `[whispers]`, `[scared]`, `[menacing]`, `[wailing]`, `[short pause]`). L'intro (« La roue bleue a choisi… ») est un clip séparé, ton « présentateur ».
- **Traitement** : `build_audio.py` (comme la Ghoula).
- **Mix** (`engine/sfx.py`) : `wheel_ticks()` synchronisé aux roues (clic par carte + ding), `hit` sur VS, `trailer_pulse` sous l'intro, `drone` + `wind` sous l'histoire, `engine_stop`, silence réel sur « Silence. », `chains`/`bells`/`roar` pour le cauchemar, `wail`/`water_burst`/`whoosh` pour le combat, `riser` avant le twist, coupure du son d'ambiance sur la dernière réplique. `master()` fait ducking + limiteur.

## 7. Bouton CTA

Même pilule que `legende-horreur-2d` (`cta(t,t0,t1)` de `lib.js`), en haut, ~5 s pendant l'accalmie (« Silence. Juste la neige. »), jamais pendant le twist. Texte par défaut : « COMMENTE « FAIS LA LÉGENDE DE MON PAYS » » ; variante possible pour ce format : « COMMENTE TON DUEL : SAUVEUR VS CAUCHEMAR ».

## 8. Workflow

1. Choisir le duel (ou celui de l'utilisateur), écrire `histoires/roue-NN-<slug>/script.md` (tableau bloc / texte / image) + clips voix.
2. L'utilisateur renvoie les MP3 → `audio/voix/`.
3. Copier `scripts/exemple-ghoula/{clips.py,build_audio.py}` du skill `legende-horreur-2d` ; `scenes.js` à partir de `histoires/_demo-roue/scenes.js` ; `build_mix.py` avec `engine/sfx.py`.
4. Preview (`node engine/render.js histoires/<slug> preview …`) → planche → corriger → `engine/make_video.sh histoires/<slug>` → SendUserFile + push.
5. Vérifier : intro lisible, bandeau jamais coupé, sous-titres sous les fiches, pièges du skill `legende-horreur-2d` §8 (index levé, cheveux du monstre, couleurs…).
