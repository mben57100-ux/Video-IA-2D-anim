---
name: thread-horreur
description: Série TikTok « Et si les threads horreur… étaient les tiens ? » — adaptation en 1–2 min (9:16) d'un thread horreur viral (témoignage Reddit / Twitter, type ceux racontés par Squeezie), narré à la 2e personne pour mettre le spectateur dans la peau du témoin, en animation 2D RÉALISTE (personnages proportionnés, voitures détaillées, police FR/US, décors de nuit, téléphone/messages) + screamers et scènes très flippantes. Écrit le script + les textes ElevenLabs par voix, puis monte la vidéo sur les MP3 de l'utilisateur. À utiliser pour toute demande de thread horreur, histoire vraie flippante, creepypasta témoignage.
---

# THREAD HORREUR — « et si c'était le tien ? »

Concept de la série : une accroche de 2–3 s (« Et si les threads horreur que tu as entendus… étaient les tiens ? »), puis on entre **directement** dans le thread, raconté à la **2e personne**, au présent, en 60–120 s.
Moteur : `engine/lib.js` + `persos.js` + `roue.js` + **`realiste.js`** + **`screamers.js`** + `sfx.py`. Démo : `histoires/_demo-thread/scenes.js` (copie `scripts/demo-thread-scenes.js`), rendu `references/demo-thread.jpg`.

## 0. Règles sur la source (à respecter)

- Ne jamais inventer qu'un thread a été « raconté par Squeezie » ou qu'il a « fait X vues » : partir d'un thread que l'utilisateur fournit (lien, titre de l'épisode, texte, résumé) ou d'un thread public dont on a vérifié la source. Sinon proposer une histoire originale **présentée comme telle**.
- **Réécrire avec nos mots** (résumé dramatisé, 2e personne) — ne pas recopier le texte original. Mention discrète en carton : « d'après un témoignage Reddit » (ou la plateforme réelle).
- Le nom « Squeezie » peut apparaître dans le titre / la description si l'utilisateur le veut, mais **jamais** son visage, son logo, sa voix imitée, ni rien qui fasse croire à une collaboration.
- Pas de vrais noms de personnes privées ; changer les prénoms, garder les lieux génériques sauf si le thread est public et célèbre.

## 1. Specs

| Paramètre | Valeur |
|---|---|
| Format | 1080×1920, 30 fps, -14 LUFS |
| Durée | 60–120 s (viser 75–90 s) ; ~180–300 mots de voix |
| Plans | 1 plan / 1,5–3 s ; un **screamer** ou une scène-choc toutes les 15–20 s, gros screamer final |
| Fin | Pas d'outro. Bouton CTA (`cta` de `lib.js`) pendant un moment calme : « COMMENTE « LE PROCHAIN THREAD » » ou « FAIS LA LÉGENDE DE MON PAYS » si l'utilisateur le demande |

## 2. Structure

| # | Bloc | Temps | Contenu |
|---|---|---|---|
| 1 | **ACCROCHE SÉRIE** | 0–2,5 s | `seriesIntro` : texte tapé « ET SI LES THREADS HORREUR / QUE TU AS ENTENDUS / **ÉTAIENT LES TIENS ?** » (dernière ligne rouge) — voix off identique |
| 2 | **TITRE DU THREAD** | 2,5–3,5 s | « THREAD #N — [TITRE COURT] » + « d'après un témoignage Reddit » (glitch d'entrée) |
| 3 | **SITUATION NORMALE** | ~8 s | « Tu as 17 ans. Ce soir, tu gardes… / Tu rentres de soirée… » — détails concrets qui ancrent le réel (heure, lieu, météo, objet) |
| 4 | **PREMIER DÉTAIL QUI CLOCHE** | ~8 s | Petite anomalie (un message, une voiture garée, un bruit) ; montrer l'objet (téléphone, rétro, fenêtre) |
| 5 | **ESCALADE ×2–3** | ~30–50 s | Chaque palier plus proche (« il était plus près », la porte qui n'était pas fermée, la silhouette au fond du couloir) ; une scène flippante par palier |
| 6 | **CLIMAX** | ~10 s | Confrontation / fuite / cachette, son coupé, screamer |
| 7 | **FIN DU THREAD** | ~10 s | Ce qui s'est « vraiment » passé (police, voisin, caméra) : la **révélation glaçante** du thread (« Les policiers n'ont trouvé personne. Mais sur ton téléphone, il y avait une nouvelle photo. ») |
| 8 | **DERNIÈRE PHRASE + SCREAMER** | 2–3 s | Phrase courte en 2e personne, puis `screamer()` ou noir |

## 3. Écriture (voix off)

- 2e personne, présent ; phrases de 3–10 mots ; ton calme qui se tend.
- Garder **les détails vérifiables du thread** (heure exacte, objet, phrase entendue) : c'est ce qui rend réaliste.
- Les messages / répliques citées exactement comme dans le thread (traduits) entre « ».
- Une phrase-chute isolée par palier (« Tu n'avais jamais donné ton adresse. »).
- Fin : la révélation + une phrase directe au spectateur.

## 4. Direction artistique RÉALISTE (`engine/realiste.js`)

| Élément | Fonction | Notes |
|---|---|---|
| Personnages | `human({x,y,s, view, skin, hair, hairCol, top, topCol, pants, arms, expr, walk/run, talk, phoneGlow, sweat, beard, flip, lightFilter})` | Proportions réelles (~7 têtes), ombrage, origine = pieds. `hair`: short, long, bun, buzz, curly, hood, policeCap. `top`: hoodie, jacket, coat, tshirt, **police** (FR), **policeUS**. `arms`: down, phone, phoneLook (lueur bleue sur le visage), point, raise, flashlight, hands, cross. `expr`: neutral, worried, fear, scream, sleep. Course/marche : `run: phase` / `walk: phase`. |
| Voitures | `sedan({x,y,s,color,t,moving,lights,brake,livery:'FR'|'US',siren,flip,interior})`, `carFront({...lights,livery})`, `carInterior({t,outside,mirror,wipers})` | Berline de profil détaillée (vitres teintées, jantes qui tournent, phares + faisceau, feux stop), vue de face avec éblouissement des phares, intérieur conducteur avec **rétroviseur** (insert svg). |
| Police | `sedan({livery:'FR'})` (bandes bleu-blanc-rouge, « POLICE », rampe bleue), `livery:'US'` (noir/blanc, rouge/bleu), `human({top:'police', hair:'policeCap'})`, `policeWash(t, livery)` en `post` | Gyrophare qui balaie toute la scène. Choisir FR ou US selon le pays du thread. |
| Décors | `streetNight(t,{scroll,seed,flicker})`, `houseFront(t,{up1,up2,down1,doorOpen,figureWindow,porchFlicker})`, `bedroom(t,{door:'closed'|'ajar'|'open', doorInner, phone, lamp})`, `hallway(t,{flick,endDoor,figure})`, `forestRoad(t,{scroll,headlights,fog})` | + `snowForest`, `cabin`, `rain`, `snow`, `fogBands`, `lightCone`, `flicker` des autres modules. |
| Téléphone | `phoneChat(lt, x,y,s, [{from:'me'|'them', text, t}], {title, typing})` | Messages qui arrivent (bulle « … » avant). |
| Carton thread | `threadCard(lt,{num:'3/12', text, author, meta})` | Extrait façon post anonyme, police machine à écrire. |
| Intro | `seriesIntro(t, lt, {hook:[…], redLast, tTitle, kicker:'THREAD #1', title, sub})` | |
| Sous-titres | `buildChunksThread` + `subtitlesThread` (`story.subFn`) | **Montserrat Black MAJUSCULES**, contour noir épais, mot en cours en **jaune** et plus gros, `[mot]R` rouge (danger), `[mot]J` jaune, y ≈ 1380 (`subY` par plan). |

**Lumière** : tout est de nuit → `lightFilter:'night'` sur les personnages éloignés, lueurs (`phoneGlow`, lampadaires, phares), `policeWash`. Garder des noirs profonds et une vignette.

## 5. Screamers & scènes flippantes (`engine/screamers.js`)

Repris des vidéos de référence analysées (légendes, roue des légendes) et adaptés au réaliste :
- `screamer(t, lt, kind)` — plan plein écran : zoom-choc, secousse, séparation RGB, flash rouge, bandes glitch. `kind`: `pale` (entité humanoïde), `ghoula`, `llorona`, `krampus`, `silhouette`. 0,8–1,5 s, avec `hit`+`scream` du mix, **précédé d'un silence**.
- `paleEntity({smile, eyes:'black'|'white'|'glow', tilt, arms:'reach', jitter})` — grande créature pâle, sourire trop large.
- `figureSilhouette(x,y,s,{eyes})` + `closerEachCut(n)` — la silhouette **plus proche à chaque plan**.
- `faceInWindow(t,x,y,w,h,p,inner)` — visage derrière une vitre mouillée.
- `peekDoor(x,y,s,p)` — visage qui se penche dans l'encadrement ; `bedroom({door:'ajar', doorInner})`.
- `handOnShoulder(x,y,s,p,side)` — main pâle qui entre dans le cadre sur l'épaule.
- `feetUnderDoor(x,y,w,t,step)` — ombres de pieds sous la porte.
- `camRec(t,label,date)` — overlay caméra de surveillance (preuve « found footage »).
- Et : `eyesInDark`, `blackEyes`, `blackCard`, `sackClose`, rétroviseur de `carInterior({mirror})`, néons `flicker`, `wallShadow` (ombre qui ne correspond pas).

Règle : chaque screamer est **annoncé par le son** (silence ou drone qui monte), dure < 1,5 s, et n'est jamais sous un sous-titre important.

## 6. Audio

- **Voix** : l'utilisateur la génère sur ElevenLabs (v3). Livrer un bloc de code par clip, numérotés, `### NN · 🎙️ NARRATEUR` / `### NN · 📱 MESSAGE (voix chuchotée)` / `### NN · 👮 POLICIER (change de voix)`… Balises : `[calm, intimate]`, `[tense, slower]`, `[whispers]`, `[scared, breathless]`, `[short pause]`. Intro série = clip séparé `[mysterious]`.
- **Traitement** : `build_audio.py` (modèle Ghoula : tempo, pauses, alignement, effets par voix — passe-bas « téléphone » / « derrière la porte »).
- **Mix** (`engine/sfx.py`) : drone + `wind`, bruits du thread (pas, porte, moteur, vibreur de téléphone = `click` rapides, sirène = deux `ding` alternés), `riser` avant chaque screamer, **silence total 0,4 s** puis `hit` + `scream`. `master()`.

## 7. Workflow

1. L'utilisateur donne le thread (lien / titre / texte) ou demande une proposition → vérifier la source, écrire `histoires/thread-NN-<slug>/script.md` (bloc / texte balisé / image / screamer) + clips voix.
2. MP3 → `audio/voix/` ; `clips.py`, `build_audio.py` (modèle Ghoula), `scenes.js` à partir de `histoires/_demo-thread/scenes.js`, `build_mix.py` avec `engine/sfx.py`.
3. Preview (planche) → corriger → `engine/make_video.sh histoires/<slug>` → SendUserFile + push.
4. Contrôles : personnages assez grands dans le cadre (pas de figurants minuscules), textes « POLICE » lisibles, screamers bien cadrés (visage entier), sous-titres jamais sur un visage, pièges du skill `legende-horreur-2d` §8.
