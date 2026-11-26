---
name: legende-horreur-2d
description: Créer un Short TikTok (~70-90 s, 9:16) de légende urbaine / folklore d'horreur en animation 2D vectorielle, narré à la 2e personne ("tu") — hook règle des anciens / monstre / rituel, nom du monstre (affiche RECHERCHÉ, carton noir), preuves, rituel, visite nocturne, saut temporel, twist avec phrase coupée, jumpscare, bouton "Commente FAIS LA LÉGENDE DE MON PAYS". Écrit l'histoire + les textes ElevenLabs par voix, puis monte la vidéo (SVG + Playwright + ffmpeg) sur les MP3 fournis par l'utilisateur. Utiliser pour toute demande de vidéo/légende/histoire d'horreur dans ce style.
---

# Légende d'horreur 2D — format TikTok (skill fusionné)

> Format duel « sauveur vs cauchemar » : voir le skill **`roue-des-legendes`** (prioritaire pour ce type de vidéo). Ce skill-ci reste la référence pour le style des personnages, l'écriture d'horreur, les voix ElevenLabs et les pièges visuels.

Analysé sur **5 vidéos de référence** du même créateur : Charro Negro, Hachishakusama, La Llorona (lot 1) + Teke Teke, Nahual (lot 2).
Scripts et timings : `references/scripts-reference.md` (lot 1), `references/scripts-reference-2.md` (lot 2). Planches : `references/frames/`.
Exemple produit de bout en bout : La Ghoula (Algérie) → `scripts/exemple-ghoula/`.

## 1. Specs techniques

| Paramètre | Valeur |
|---|---|
| Format | 1080×1920, 30 fps, H.264 + AAC 44.1 kHz stéréo, -14 LUFS |
| Durée | 70–78 s de narration + ~2 s de jumpscare (référence) ; avec les voix ElevenLabs de l'utilisateur, ~290 mots = 92 s → **viser 230–260 mots** |
| Débit | ~210–230 mots/min (les voix ElevenLabs sont plus lentes : accélérer le narrateur ×1,15) |
| Plans | un nouveau plan toutes les 2–4 s (≈ 25–35 plans), presque 1 plan par phrase |
| Sortie | **Pas d'outro**, pas de watermark. Bouton CTA « Commente "FAIS LA LÉGENDE DE MON PAYS" » (§6) |

## 2. Structure narrative

Le cœur : **une règle (ou un rituel) posée au début, mise à l'épreuve, puis un twist qui fait revenir le début en écho — et la dernière phrase est coupée net par le jumpscare.**

| # | Bloc | Temps | Formule type |
|---|------|-------|--------------|
| 1 | **HOOK** (3 variantes, §2.1) | 0–5 s | Ancien index levé / monstre + règle directe / ancien qui fait le rituel |
| 2 | **RÈGLE / MENACE** | 3–10 s | « Si [signe sensoriel], tu [action]. » ; ou « Ne cours pas. Elle va plus vite que toi. » ; ou règle paradoxale |
| 3 | **CONSÉQUENCE** | 8–11 s | « Parce que… » / « Si tu te trompes, elle te coupe en… » → **carton noir « DEUX. »** |
| 4 | **NOM** (3 variantes, §2.2) | 10–13 s | « Elle s'appelle… / On l'appelle / Là-bas, on l'appelle [NOM]. » |
| 5 | **LORE** (optionnel, 6–10 s) | 12–22 s | Origine en flashback (« Un soir d'hiver, à Hokkaido… ») ou fonctionnement (« Le jour, c'est quelqu'un du village. La nuit… ») + **règle de malédiction** (« ceux qui entendent son histoire… dans les trois jours ») |
| 6 | **MISE EN PLACE** | ~13–25 s | « Cet été, tu es chez [proche], [lieu]. » / « Ce soir, dans le dernier train… » — scène lumineuse ou quotidienne (contraste) |
| 7 | **OBJET-CLÉ / DÉTAIL QUI CLOCHE** | | Un objet transmis (papier plié « la réponse »), une absence (la seule porte sans croix), une réplique ambiguë (« Chez nous, on n'en a pas besoin. ») |
| 8 | **INCIDENT** | 17–35 s | « Un soir, / À minuit, » + rencontre décrite par les sens (son, froid soudain, yeux, taille anormale) |
| 9 | **RÉPLIQUE DU MONSTRE** | | 1–3 phrases courtes, italique ; mot de la langue d'origine, imitation d'un proche, ou **question** (« Où sont mes jambes ? ») |
| 10 | **PREUVES** | 30–45 s | Faits concrets montrés en inserts : place vide en classe, infos TV, bande de police, sang sur la porte, blessure identique (« manches longues en plein mois d'août… il grimace ») |
| 11 | **RITUEL / PROTECTION** | 30–50 s | L'ancien devient tout pâle + rituel concret (sel, croix, couteau sous l'oreiller, volets) + consigne en italique |
| 12 | **VISITE NOCTURNE** | 45–60 s | Heure précise (« À deux heures, ») + ça gratte / frappe / renifle / imite une voix |
| 13 | **ISSUE + PREUVE DU MATIN** | 50–60 s | Fuite, sacrifice, sauvetage ; « Le matin… » + trace physique |
| 14 | **SAUT TEMPOREL** | ~60 s | « Dix ans plus tard, / Une semaine plus tard, / Le troisième soir, » + l'habitude prise (« tu peins toujours une croix… chaque soir ») |
| 15 | **ÉCHO + TWIST** | 60–72 s | La phrase-signal du début revient mot pour mot ; la protection échoue (pluie qui efface la croix, la réponse « fausse », le monstre parle en premier) |
| 16 | **PHRASE COUPÉE + JUMPSCARE** | fin | Dernière réplique **interrompue avant le dernier mot** (« Tu as oublié ta… », « Elle aussi, elle avait la… ») → gros plan monstre figé ~2 s → coupe. Aucune morale. |

### 2.1 Trois hooks possibles
- **A. L'ancien index levé** (Charro Negro, Hachishakusama, Llorona, Ghoula) : « Au [PAYS], les grands-mères apprennent une seule règle aux enfants. » — ancien face caméra, coucher de soleil.
- **B. Le monstre d'abord** (Teke Teke) : « Au [PAYS], si tu entends [ONOMATOPÉE] [lieu], la nuit… ne [verbe] pas. » — le monstre avance vers la caméra dès la 1re seconde, visage révélé sur l'onomatopée. Le plus percutant pour la rétention.
- **C. Le rituel en action** (Nahual) : « Au [PAYS], dans certains villages, on [rituel] avant la nuit. Et si on oublie… quelque chose entre. » — l'ancien fait le geste (peindre la croix), on voit le résultat.
- Toujours : pays simple au début (« Au Mexique, », « En Algérie, »).

### 2.2 Trois façons de nommer le monstre
- **Affiche RECHERCHÉ(E)** (lot 1, Ghoula) : en-tête langue d'origine, portrait, nom qui s'écrit, stats, DANGER 5 cases. Pas de sous-titres dessus.
- **« On l'appelle [NOM]. »** sur un plan du monstre en mouvement (Nahual, Teke Teke).
- **Carton noir** avec un seul mot rouge pour une chute (« DEUX. ») juste avant le nom.

## 3. Règles d'écriture

- **2e personne, présent**. Le spectateur EST l'enfant / l'ado.
- **Phrases très courtes** (3–10 mots), une idée par phrase.
- La peur vient des **faits** et des **chiffres** (« la haie fait deux mètres », « dans les trois jours », « à deux heures »), pas des adjectifs.
- **Détails sensoriels** : un son répété en onomatopée (« Teke… teke… », « Po… »), un froid soudain, des mains glacées, une odeur, une couleur.
- **Rythme d'escalade** : « Le bruit se rapproche. De plus en plus vite. Puis il s'arrête, juste derrière toi. » / « X. Puis Y. »
- **Faux soulagement** avant le twist : « Elle s'arrête. Une seconde, tu crois que c'est fini. Puis elle relève la tête… »
- **Échos** : la règle du début est appliquée au milieu, le signal du début revient à la fin, le rituel du hook est refait par le héros adulte.
- **Détail qui trahit** : un indice discret glissé tôt qui explique le twist (la place vide, la chemise à manches longues en août, « Je suis rentré de France »).
- Personnages désignés par leur rôle (ton oncle, une fille de ta classe), jamais de prénom.
- 1 à 3 mots dans la langue du folklore.

## 4. Direction artistique

**Style** : 2D vectoriel flat, dégradés doux, grain léger, ombres douces, bloom sur les lumières (lune, lampes, néons, braises).

**Personnages** (deux gabarits) :
- *Enfant chibi* (lot 1, Ghoula) : grosse tête ronde, yeux points, **contour blanc épais type sticker**.
- *Ado / adulte élancé* (Teke Teke, Nahual) : petite tête, corps long et fin, uniforme / pantalon (`boy({tall:true})`).
- En scène sombre, remplacer le contour blanc par un **contour coloré de la lumière ambiante** : rouge quand le danger est proche, orange près d'une lampe, cyan/lune la nuit (`filter="url(#rimRed|rimOrange|rimCyan|rimMoon)"`).
- Monstre : silhouette très contrastée, visage caché (cheveux, chapeau, ombre) jusqu'à la révélation ; sourire trop large, yeux vides/brillants ; souvent **en bas du cadre ou caché derrière le héros** pendant qu'il ne le voit pas.

**Palettes** : hook coucher de soleil ; jour saturé (éléments culturels : papel picado, maisons ocre, portes bleues…) ; nuit bleu profond + pleine lune ; intérieurs ambre vs ombres bleues ; tunnels/quais gris-vert avec néons ; flashback désaturé / neige.

**Procédés de mise en scène (boîte à outils)** :
- Push-in lent sur chaque plan (100→108 %), parallaxe 2–3 couches.
- **Ombre révélatrice** : un humain projette sur le mur l'ombre de la bête (`wallShadow`).
- **Monstre dans le dos** : plan bas sur les pieds du héros, mains qui se posent, givre/craquelures ; ou monstre accroché derrière ses jambes pendant qu'il lit.
- **Avant-plan flou** (épaule/dos du héros au premier plan, sujet net au fond) : `shot.fg` + `#fgBlur`.
- **Carton noir** un mot (`blackCard`).
- **Inserts de preuve** : pupitre vide, télé « infos » (`tvNews`), bande de police (`policeTape`), sang sur la croix, bras blessé.
- **Météo / lumière** : pluie (`rain`), gouttes sur vitre (`windowDrops`), neige (`snow`), néons qui grésillent (`flicker` + `lightCone`), braises.
- **Silhouette derrière une vitre dépolie mouillée** pour la voix finale, puis jumpscare derrière la vitre.
- Horloges (murale, de quai, réveil) pour chaque heure annoncée.
- Moments de peur : zoom + secousse, flash, onde circulaire (son entendu), vignette rouge.
- Course : garder la course de la Ghoula (bras ±40°, rebond) pour l'enfant ; version `tall` bras vers l'extérieur.

## 5. Sous-titres

- Roboto Condensed ExtraBold, **MAJUSCULES**, centrés à y ≈ 1290/1920, une ligne, 1–4 mots (≤ 18 caractères), coupe à la ponctuation.
- **Karaoké** : carton entier affiché, mots non dits à ~42 % d'opacité, deviennent pleins quand ils sont dits ; pop-in.
- Blanc, contour noir épais, ombre portée.
- **Jaune `#F7B733`** : lieux, temps, objets-clés (JAPON, ÉTÉ, PAPIER, CROIX). **Rouge `#E5452F`** : danger, monstre, sensations (NOIR, COURS, GLACÉES, DERRIÈRE, EFFACÉE).
- Répliques en *italique* : jaune (monstre/ancien), rose `#F59BB5` (voix imitée d'un proche). Onomatopées du monstre en rouge italique.
- Pas de sous-titres sur l'affiche ni sur un carton noir.

## 6. Bouton CTA (remplace l'outro)

Pilule noire en haut (y ≈ 230), contour blanc, icône bulle jaune : `COMMENTE` / `« FAIS LA LÉGENDE DE MON PAYS »` (jaune italique). Slide + pop + pulsation, ~5–6 s, **à un moment calme de la fin** (lendemain / saut temporel), **jamais** pendant le twist ni le jumpscare.

## 7. Audio

**La voix n'est JAMAIS générée ici** : l'utilisateur la génère sur ElevenLabs (Eleven v3) et renvoie les MP3.

**Livrable voix** (dans le chat ET dans `histoires/<slug>/voix/`) :
- Un clip par prise de parole, numérotés ; **chaque texte dans son propre bloc de code** pour copier-coller, titre `### 06 · 👦 ENFANT (change de voix)`.
- Balises d'émotion v3 adaptées à l'image : `[calm, storytelling]`, `[serious]`, `[ominous]`, `[tense, slower]`, `[whispers]`, `[nervously]`, `[scared, breathless]`, `[gasps]`, `[menacing, raspy]`, `[laughs creepily]`, `[sniffs]`, `[sighs]`, `[softly]`, `[short pause]`. Si une balise est lue à voix haute → la remplacer par « … ».
- Casting conseillé (narrateur homme grave conteur, enfant/ado, monstre rauque/soufflé, ancien chaud mais ferme, proche imité).
- Fichiers `NN_VOIX.txt` + `00_LISTE_DES_CLIPS.md`. L'utilisateur peut regrouper des clips d'une même voix (`01-05_NARRATEUR.mp3`).
- Pour la phrase coupée finale : écrire le clip jusqu'au mot coupé (« Tu as oublié ta… ») ; le montage coupe sur le jumpscare.

**Traitement** (`build_audio.py`) : pauses ≤ 0,30 s, narrateur ×1,15, dialogues ×1,05 (hauteur conservée), écho sur le monstre, passe-bas « derrière la porte » sur une voix imitée, alignement mot par mot heuristique (pauses ↔ ponctuation).

**Musique / SFX** (`build_mix.py`, tout synthétisé) : drone grave continu, vent/ambiance coupés net au moment du silence, quelques notes de luth Karplus-Strong dans une gamme du pays (hijaz Maghreb, etc.), ducking sous la voix. SFX calés sur les mots : onde/whoosh, hit grave sur les mots rouges forts, tampon + frappe + bips sur l'affiche, pas/course, battements de cœur, coups (×3, synchronisés aux secousses), griffures, reniflements, grésillement de néon, pluie, moteur, coup de feu, riser avant le twist, **silence juste avant la phrase coupée**, hit + cri sur le jumpscare. Soft-limit (tanh) puis loudnorm -14 LUFS.

## 8. Pièges déjà rencontrés (vérifier sur chaque planche de preview)

- **Index levé** : poing fermé visible (phalanges + pouce), index sur le bord — sinon doigt d'honneur.
- **Tatouages berbères** : trait vertical + chevrons + points, jamais une croix (sauf si la croix est le sujet, ex. Nahual).
- Monstre : **calotte de cheveux** sur le haut du visage (sinon crâne d'œuf) ; yeux pas trop gros.
- Couleurs de vêtements franches (un jaune devient couleur peau sous le filtre nuit).
- Ado/adulte : pantalon, pas de jambes nues.
- Rien d'important sous la zone des sous-titres (y 1200–1350) ni sous le CTA.
- Toujours une **planche de vignettes** avant le rendu complet, et la regarder.

## 9. Workflow avec l'utilisateur

1. Proposer une légende (ou prendre la sienne). Choisir le hook (A/B/C) et la façon de nommer le monstre. Écrire `script.md` (texte balisé + visuel par bloc) et les clips voix.
2. L'utilisateur envoie les MP3 → `histoires/<slug>/audio/voix/` (noms propres).
3. Copier `scripts/exemple-ghoula/` → `histoires/<slug>/`, adapter `clips.py`, `scenes.js` (décors, personnages, plans), `build_mix.py` (ancres SFX).
4. `node render.js … preview` → corriger → `engine/make_video.sh histoires/<slug>` → envoyer le MP4 (SendUserFile) + pousser sur la branche.
5. « Mêmes voix, autres plans/personnages » : ne toucher qu'à `scenes.js` (+ SFX), garder `clips.py`/audio.

## 10. Outils (moteur)

- `scripts/engine/` (à copier en `engine/` si absent) : `lib.js` (caméra, sous-titres karaoké, CTA, flashs, secousses, grain, vignette + effets : `blackCard`, `rain`, `windowDrops`, `snow`, `flicker`, `lightCone`, `wallShadow`, `policeTape`, `tvNews`, filtres `rim*`, `fgBlur`, `shot.fg`), `render.js` (Playwright → ffmpeg, preview / vidéo multi-workers), `make_video.sh`, `package.json` (polices via @fontsource).
- `scripts/exemple-ghoula/` : `clips.py`, `build_audio.py`, `build_mix.py`, `scenes.js` (grand-mère, enfant/ado/adulte avec course, Ghoula de dos/visage/yeux, désert, ksar, palmiers, chèvre, porte, horloge, couteau, lampe, voiture, affiche en arabe), `script.md`, textes ElevenLabs.
- `scripts/demo-effets.js` : démo des nouveaux effets (carton noir, néons + contour rouge + monstre aux pieds, ombre révélatrice, pluie/TV/police, neige + avant-plan flou).

Commandes :
```
cd engine && npm i                                   # une fois
node render.js ../histoires/<slug> preview 1,5,12    # vignettes -> build/preview/
engine/make_video.sh histoires/<slug>                # audio -> rendu -> mix -> rendu/<slug>.mp4
```
