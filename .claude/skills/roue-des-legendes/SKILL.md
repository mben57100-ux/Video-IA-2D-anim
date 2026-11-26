---
name: roue-des-legendes
description: Format TikTok « ROUE DES LÉGENDES » (~70 s, 9:16) — deux roues de ~25 légendes du monde tirent au sort un SAUVEUR (bleu) et un CAUCHEMAR (rouge), VS en diagonale « Vas-tu survivre ? », puis histoire de survie à la 2e personne : le cauchemar attaque, le sauveur surgit, combat court, et le lore du sauveur révèle qu'il est le vrai danger (« Il n'est pas venu te sauver. Il est venu te prendre. »). Sous-titres karaoké MAJUSCULES bleu/rouge/jaune, fin sac qui se referme + yeux dans le noir. Personnages dans le style sticker des skills précédents. Écrit l'épisode + les textes ElevenLabs par voix, puis monte la vidéo sur les MP3 de l'utilisateur. À utiliser pour toute demande de roue des légendes, duel de légendes, sauveur vs cauchemar.
---

# ROUE DES LÉGENDES — format duel

**Modèle par défaut = V2** (vidéo « Krampus contre la Llorona », @what.if.lab…, 70 s), jugée parfaite par l'utilisateur : `references/script-v2-krampus-vs-llorona.md`, images `references/frames-v2/`. La reproduire **exactement** (structure, rythme, intro, VS, sous-titres, fin).
Variante V1 (épisode « La Llorona contre Krampus » de @nerepondspas, 99 s : bandeau d'épisode, fiches de menace, posters vintage, sous-titres en minuscules) → `references/script-llorona-vs-krampus.md`, `references/frames/`. Seulement si l'utilisateur la demande.
**Personnages : notre style sticker** (cf. skill `legende-horreur-2d`), pas ceux des références.
Moteur : `engine/lib.js` + `engine/persos.js` + `engine/roue.js` + `engine/sfx.py`. Démo V2 : `histoires/_demo-roue-v2/scenes.js` (copie : `scripts/demo-roue-v2-scenes.js`).

## 1. Specs (V2)

| Paramètre | Valeur |
|---|---|
| Format | 1080×1920, 30 fps, -14 LUFS |
| Durée | **~70 s** : intro roues + VS ≈ 9 s, histoire ≈ 59 s, écran noir final ≈ 2 s |
| Voix | **~190–200 mots** (dense, rapide ; avec ElevenLabs : narrateur ×1,15, pauses ≤ 0,3 s) |
| Plans | 1 plan / 1,5–3 s ; nombreux plans détail |
| Fin | Pas d'outro. Bouton CTA (§7) |

## 2. Structure d'un épisode (V2)

| # | Bloc | Temps | Texte type | Image |
|---|---|---|---|---|
| 1 | ROUE BLEUE | 0–2,8 s | « La roue **bleue** a choisi ton **sauveur**. » | Écran coupé bleu/rouge, 2 bandes de ~25 cartes teintées qui défilent ; la bleue s'arrête, carte élue en couleurs, « 01 – NOM » |
| 2 | ROUE ROUGE | 2,8–5,8 s | « La roue **rouge** a choisi ton **cauchemar**. » | La rouge s'arrête |
| 3 | DUEL | 5,8–8 s | « [Sauveur]… contre [cauchemar]. » | Transition vers le **VS diagonal** (flash + glitch RGB) |
| 4 | QUESTION | 8–9,4 s | « Vas-tu **survivre** ? » | VS tenu |
| 5 | MISE EN PLACE | ~4 s | Moment + transgression : « C'est le soir de Noël. Tu sors en cachette jusqu'à la rivière gelée. » | Lieu chaleureux (chalet) puis lieu dangereux |
| 6 | CAUCHEMAR (son puis vue) | ~7 s | « Puis tu entends quelqu'un pleurer. Une femme. En robe blanche. » + sa réplique en langue d'origine | Apparition à distance, puis gros plan |
| 7 | DESCRIPTION en 4 phrases courtes | ~6 s | « Ses pieds ne touchent pas la neige. Son visage est pâle. Ses yeux sont vides. Et ses larmes sont noires. » | 1 plan détail par phrase |
| 8 | NOM + LORE | ~6 s | « [Nom]. La légende dit qu'elle… et que maintenant, elle… » | Plan large d'ambiance (pas de fiche) |
| 9 | ATTAQUE | ~5 s | « Elle t'attrape le bras. Sa main est mouillée. Glacée. Elle te tire vers l'eau. » | Main sur le bras, enfant tiré |
| 10 | ARRIVÉE DU SAUVEUR | ~10 s | « Et là. » + 2 sons (« Des cloches. Des chaînes qui traînent sur la glace. ») + « Quelque chose d'énorme sort du noir. » + 3 détails nominaux + « [Nom]. » | Objets sonores en gros plan, silhouette, révélation par morceaux |
| 11 | COMBAT court | ~4 s | « Il la frappe avec ses chaînes. Elle hurle et disparaît dans [lieu]. » | 2–3 plans, secousse + flash |
| 12 | ACCALMIE + doute | ~4 s | « **Silence.** Tu es sauvé. Mais [sauveur] ne part pas. » | Lieu vide, le sauveur reste |
| 13 | LORE DU SAUVEUR = piège | ~5 s | « Dans [région], on dit que [sauveur] ne vient que pour un seul type d'enfant… les méchants. » | Silhouette au-dessus du village, gros plan visage |
| 14 | TWIST | ~6 s | Geste (« Il ouvre son sac. ») + réplique « Tu as été très méchant cette année. » + **antithèse finale** : « Il n'est pas venu te sauver. Il est venu te **prendre**. » | Gros plan enfant terrifié ; `sackClose` ; écran noir `blackEyes` + dernier mot rouge |

**Choix du duel** : le sauveur doit avoir une raison *dans sa propre légende* d'être dangereux pour toi (Krampus punit les enfants méchants ; tu es sorti en cachette). Le cauchemar est le danger « évident ». Lieu et moment tirés des deux légendes (Noël + rivière gelée).

## 3. Écriture

- 2e personne, présent ; phrases de 2–8 mots ; fragments nominaux (« Une femme. En robe blanche. »).
- Rythme ternaire/quaternaire de description (« Ses pieds… Son visage… Ses yeux… Et ses larmes… »).
- Charnières fixes : « Puis tu entends… », « Et là. », « Quelque chose d'énorme sort du noir. », « Silence. », « Mais [X] ne part pas. », « Dans [région], on dit que… ».
- Répliques entre guillemets « » (affichées dans les sous-titres) ; une réplique en langue d'origine pour le cauchemar.
- Fin en antithèse, dernier mot = verbe-choc en rouge.

## 4. Habillage (V2) — `engine/roue.js`

| Élément | Fonction | Notes |
|---|---|---|
| Roster | `rosterV2({Nom: s=>svg})` | ~28 légendes du monde (`LEGENDES`, silhouettes `miniPortrait`) ; passer les **vrais personnages** pour le sauveur et le cauchemar (et ceux qu'on a déjà dessinés). |
| Intro roues | `roueIntroV2(t, {roster, sauveur, cauchemar, tTop:[t0,dur], tBot:[t0,dur], tVs})` | Cartes à sommet arrondi, teintées bleu/rouge sauf l'élue, flou de vitesse, ralentissement, « NN – NOM ». Plan `{noVig:true, subY:1760}` : les sous-titres karaoké de la voix servent de légende. Caler `tTop`/`tBot`/`tVs` sur les mots « sauveur », « cauchemar », « contre ». |
| VS diagonal | (inclus) `vsDiagonal` | Biais rouge/sombre, cartes ×1,9, noms en couleur, flash + `rgbSplit`. |
| Sous-titres | `buildChunks` + `subtitles` de `lib.js` (karaoké MAJUSCULES) | `subY: 1400` sur les plans d'histoire. Balises voix : `[mot]B` bleu (`#4AA8FF`) = sauveur / calme / froid (BLEUE, SAUVEUR, BLANCHE, GLACE, SILENCE, nom du sauveur) ; `[mot]R` rouge = danger (ROUGE, CAUCHEMAR, PLEURER, VIDES, NOIRES, TIRE, MÉCHANTS, PRENDRE, nom du cauchemar) ; `[mot]J` jaune = objets / repères (NOËL, CLOCHES, FRAPPE, SAC). |
| Fin | `sackClose(p)` puis `blackEyes(t)` | Le dernier carton (« IL EST VENU TE PRENDRE. ») s'affiche sur le noir. |
| Décors / effets | `snowForest`, `cabin`, `iceHole`, `fogBands`, `snow`, `rain`, `flicker`, `lightCone`, `ghostArms`, `waterColumn`, `iceRing`, `wallShadow`, `blackCard` | + secousses/flashs de `lib.js`. |
| V1 seulement | `roueIntro`, `roueHeader`, `legendProfile`, `vintagePoster`, `clockBadge`, `subtitlesRoue` | Variante @nerepondspas. |

## 5. Personnages (style sticker)

`engine/persos.js` : `boy` (`scarf`, `shirt`, `run` = **course conservée**, `tall`, `bust`, `expr`), `girl`, `grandma`, `teddy`, `llorona`, `krampus`, `ghoulaBack/ghoulaFace/eyesInDark`, décors (`snowForest`, `pine`, `cabin`, `iceHole`, `dunesNight`, `ksar`, `palm`, `door`, `clock`, `car`, `lamp`, `moon`, `stars`, `flag`).
Pour une nouvelle légende : écrire sa fonction (origine = base du cou, contour `#stk`, variantes « visage caché / révélé / attaque »), l'ajouter au `special` de `rosterV2`. Héros enfant en couleurs franches (doudoune bleue, écharpe rouge).

## 6. Audio

- **Voix** : l'utilisateur la génère sur ElevenLabs (v3). Un bloc de code par clip, numérotés, `### NN · 🎙️ NARRATEUR` / `### NN · 👻 LA LLORONA (change de voix)` / `### NN · 👹 KRAMPUS (change de voix)`. Intro = clip séparé `[dramatic, announcer]`. Balises : `[tense, slower]`, `[whispers]`, `[wailing]`, `[menacing, deep]`, `[scared]`, `[short pause]`. Dans `clips.py`, baliser `[mot]B/R/J` pour les couleurs.
- **Traitement** : `build_audio.py` (modèle Ghoula, balise B prise en charge).
- **Mix** (`engine/sfx.py`) : `trailer_pulse` + `wheel_ticks()` (clic par carte + ding) sur l'intro, `hit` + `whoosh` sur le VS, puis `drone` + `wind`, `bells`/`chains` à l'arrivée du sauveur, `wail` du cauchemar, `hit`/`roar` au combat, vrai silence sur « Silence. », `riser` avant le twist, `hit` grave sur « prendre », sac (whoosh grave) sur `sackClose`. `master()`.

## 7. Bouton CTA

`cta(t,t0,t1)` de `lib.js`, en haut, ~4 s pendant l'accalmie (« Silence. Tu es sauvé. »), jamais pendant le twist. Texte : « COMMENTE « FAIS LA LÉGENDE DE MON PAYS » » (variante : « COMMENTE TON DUEL »).

## 8. Workflow

1. Choisir le duel (ou celui de l'utilisateur) → `histoires/roue-NN-<slug>/script.md` (tableau bloc / texte balisé / image) + clips voix (~190–200 mots).
2. L'utilisateur renvoie les MP3 → `audio/voix/`.
3. `clips.py` + `build_audio.py` (modèle Ghoula), `scenes.js` à partir de `histoires/_demo-roue-v2/scenes.js`, `build_mix.py` avec `engine/sfx.py`.
4. Preview → planche → corriger → `engine/make_video.sh histoires/<slug>` → SendUserFile + push.
5. Contrôles : roues lisibles et élus corrects, VS lisible, sous-titres jamais sur un visage important, pièges du skill `legende-horreur-2d` §8.
