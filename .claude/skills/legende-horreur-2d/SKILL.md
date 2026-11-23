---
name: legende-horreur-2d
description: Créer un Short TikTok (~70-90 s, 9:16) de légende urbaine / folklore d'horreur en animation 2D vectorielle, narré à la 2e personne ("tu") — règle des anciens, avis de recherche du monstre, rituel, saut temporel, twist, jumpscare, bouton "Commente FAIS LA LÉGENDE DE MON PAYS". Écrit l'histoire + les textes ElevenLabs par voix, puis monte la vidéo (SVG + Playwright + ffmpeg) sur les MP3 fournis par l'utilisateur. Utiliser pour toute demande de vidéo/légende/histoire d'horreur dans ce style.
---

# Légende d'horreur 2D — format TikTok

Style analysé sur 3 vidéos de référence (Charro Negro, Hachishakusama, La Llorona).
Scripts complets et timings : `references/scripts-reference.md`. Planches d'images : `references/frames/`.

## 1. Specs techniques

| Paramètre | Valeur |
|---|---|
| Format | 1080×1920, 30 fps, H.264 + AAC 44.1 kHz stéréo |
| Durée contenu | 68–72 s de narration + ~2 s de jumpscare figé (total ≈ 72–74 s) |
| Débit de parole | rapide et régulier : ~210–230 mots/min (≈ 250–270 mots au total) |
| Plans | un nouveau plan toutes les 2–4 s (≈ 25–30 plans), presque 1 plan par phrase |
| Loudness | voix devant, musique en drone continu sous la voix, master ≈ -14 LUFS |
| **Pas d'outro**, pas de watermark. À la place : bouton CTA « 💬 Commente "FAIS LA LÉGENDE DE MON PAYS" » (voir §5bis) |

## 2. Structure narrative (gabarit obligatoire)

Le cœur du format : **une règle énoncée au début, que l'histoire met à l'épreuve, puis un twist qui fait revenir le début en écho.**

| # | Bloc | Temps | Formule type |
|---|------|-------|--------------|
| 1 | **HOOK — la règle des anciens** | 0–3 s | « Dans les villages du/au [PAYS], les [grands-pères / grands-mères / mères] apprennent une seule règle aux enfants. » |
| 2 | **LA RÈGLE** | 3–8 s | « Si [signe sensoriel précis], tu [action simple]. » (ou règle paradoxale : « Si tu l'entends loin… c'est qu'elle est déjà à côté de toi. ») |
| 3 | **CONSÉQUENCE / LORE** | 8–11 s | « Parce que ceux qui [ont désobéi]… [conséquence mystérieuse]. » / « Elle s'appelle [NOM]. » |
| 4 | **AVIS DE RECHERCHE** (visuel) | 10–13 s | Affiche du monstre pendant que la narration finit la phrase (voir §4) |
| 5 | **MISE EN PLACE** | 13–17 s | « Cet été, tu es chez ton grand-père / ta grand-mère, [lieu]. » — scène de jour lumineuse (contraste) |
| 6 | **INCIDENT** | 17–30 s | « Un soir, / Un après-midi, / À minuit, » + rencontre décrite par détails sensoriels (son, froid soudain, yeux, taille anormale) |
| 7 | **RÉPLIQUE DU MONSTRE** | ~30 s | 1–3 phrases très courtes, en italique ; souvent un mot de la langue d'origine (« Mis hijos », « Po… ») ou une phrase qui imite un proche |
| 8 | **PREMIER RETOURNEMENT** | 35–45 s | Le détail qui cloche (« Tu ne l'as jamais prise. » / « Ta mère est en France. Et ta chambre est au premier étage. ») |
| 9 | **RITUEL DE PROTECTION** de l'ancien | 30–49 s | « [L'ancien] devient tout blanc / toute pâle. » + rituel concret (sel aux 4 coins, prière devant la porte, volets fermés) + consigne en italique |
| 10 | **VISITE NOCTURNE** | 45–55 s | Heure précise (« À trois heures du matin, ») + ça frappe / tapote + voix |
| 11 | **ISSUE** | 50–60 s | Fuite, sacrifice ou sauvetage ; « Le matin, … » + preuve physique (lit vide, traces de deux chevaux) |
| 12 | **SAUT TEMPOREL** | ~60 s | « Dix ans plus tard, / Une semaine plus tard, / Trois nuits plus tard, » |
| 13 | **ÉCHO + TWIST** | 60–70 s | On rejoue la phrase-signal du début mot pour mot, puis révélation finale en une phrase courte. Dernière ligne = réplique du monstre (souvent qui reprend sa réplique d'avant). |
| 14 | **JUMPSCARE** | 70–72 s | Gros plan frontal du monstre (sourire géant, yeux vides/rouges), figé, puis coupe sèche. Pas de conclusion, pas de morale, pas de « abonne-toi ». |

## 3. Règles d'écriture

- **2e personne du singulier, présent de l'indicatif** tout du long. Le spectateur EST l'enfant.
- **Phrases très courtes** (3–10 mots). Une idée par phrase. Beaucoup de points.
- Vocabulaire simple, concret, zéro adjectif décoratif. La peur vient des **faits**, pas des qualificatifs (« la haie fait deux mètres » > « elle était terriblement grande »).
- **Détails sensoriels** précis : un son (éperons, « Po… », pleurs), un froid soudain, une couleur (robe blanche, yeux comme des braises).
- **Chiffres et heures précis** : « trois petits coups », « à une heure du matin », « avant sept heures », « 2,40 m ».
- **Structures en écho** : la règle du début est appliquée au milieu (« Tu baisses les yeux, et tu continues à marcher. ») puis le signal du début revient à la fin.
- Rythme binaire « X. Puis Y. » pour escalader (« L'eau te monte aux genoux. Puis à la taille. »).
- Une phrase-chute courte isolée pour chaque révélation (« Tu ne l'as jamais prise. »).
- Personnages : toujours désignés par leur rôle (ton grand-père, ta mère, ton petit frère), jamais de prénom.
- Garder 1 à 3 mots dans la langue du folklore (nom du monstre, réplique).

## 4. Direction artistique

**Style** : 2D vectoriel flat, formes simples, dégradés doux, légère texture/grain, ombres portées douces, bloom sur les sources de lumière (lune, lanterne, bougies, fenêtres).

**Personnages** :
- Tête ronde surdimensionnée, yeux = points noirs, sourcils expressifs, bouche minimale (« o » de surprise), petit nez/oreilles.
- **Contour blanc épais type sticker** autour des personnages principaux (signature visuelle forte, surtout de nuit).
- Corps simples, vêtements à aplats + 1 ombre. Anciens : cheveux gris, rides, vêtements traditionnels du pays.
- Le monstre : silhouette noire ou blanche très contrastée, visage caché (chapeau, cheveux) jusqu'à la révélation ; révélation = sourire anormalement large plein de dents, yeux blancs vides ou rouges lumineux, cernes noires.

**Palettes par séquence** :
- Hook : coucher de soleil orange/rose/violet, paysage du pays flouté (rizières, champs d'agave), ancien face caméra, **index levé**.
- Jour (« Cet été ») : ciel bleu, couleurs saturées, éléments culturels (papel picado, maisons colorées / maison japonaise, poteaux électriques).
- Nuit : bleu nuit profond (#0b1226 → #1d2b4a), **pleine lune** presque toujours visible, brume, reflets d'eau.
- Intérieurs : lumière chaude de lampe/bougie (ambre) contre ombres bleues. Inserts d'horloge (analogique ou réveil digital rouge) pour les heures.

**Avis de recherche** (bloc 4) : affiche papier vieilli sur fond noir avec vignette ; en-tête dans la langue d'origine (« SE BUSCA », « 指名手配 ») + bandeau rouge « RECHERCHÉ(E) » ; portrait du monstre ; NOM en gros (texte qui s'écrit lettre par lettre) + nom en écriture d'origine ; une ligne de stats (« Taille : 2,40 m » / « Signe : ses éperons ») + « ● PAYS » ; « DANGER » avec 5 cases qui se remplissent en rouge une à une. Durée ≈ 2–3 s, léger zoom.

**Caméra & animation** :
- Chaque plan bouge : push-in lent (Ken Burns 100→108 %), parallaxe sur 2–3 couches (fond/milieu/avant-plan d'herbes).
- Personnages : respiration (squash léger), clignement, mouvement de tête, marche en boucle.
- Moments de peur : zoom brutal + tremblement de caméra, flash, aberration, onde circulaire (anneau qui s'étend = son entendu), vignette qui se resserre.
- Inserts gros plan pour les objets-clés : pièce d'or dans la main, sel qui noircit, doigt qui tapote la vitre, goutte d'eau.
- Transitions : coupes franches surtout, quelques fondus au noir sur les sauts temporels.
- Les répliques du monstre ont souvent un effet sur l'image (yeux qui s'allument, sourire qui s'élargit).

## 5. Sous-titres (très important)

- **Police** : sans-serif condensée grasse (Roboto Condensed Bold / Oswald SemiBold), **TOUT EN MAJUSCULES**.
- **Position** : centrée horizontalement, ~66 % de la hauteur (y ≈ 1270 px sur 1920), une seule ligne.
- **Découpage** : 1 à 4 mots par carton (≈ 12–20 caractères), coupe aux virgules/fins de groupe.
- **Karaoké** : le carton entier apparaît, les mots pas encore prononcés sont gris (≈ 55 % d'opacité), chaque mot devient blanc pile quand il est dit.
- **Style** : blanc, contour noir 4–5 px, ombre portée douce.
- **Couleurs de mots-clés** (≈ 1 mot coloré tous les 2–3 cartons) :
  - **Jaune/orange `#F7B733`** : lieux, temps, objets-clés neutres (JAPON, RÈGLE, ÉTÉ, ANS, POCHE, NOM).
  - **Rouge `#E5452F`** : danger, monstre, sensations inquiétantes (NOIR, FROID, BRAISES, JAMAIS, GLACÉE, PLEURE, SOURIRE).
- **Répliques** de personnages en *italique* : jaune italique (monstre/ancien), rose italique `#F59BB5` (voix imitant un proche, ex. « MON CHÉRI, »).
- Petit pop-in (scale 90→100 % en 80 ms) à chaque nouveau carton.

## 5bis. Bouton CTA (remplace l'outro)

- Pilule arrondie (fond noir 85 %, contour blanc, icône bulle de commentaire), placée en haut de l'écran (y ≈ 300 px) pour ne pas gêner les sous-titres.
- Texte : `COMMENTE « FAIS LA LÉGENDE DE MON PAYS » 🌍` (mot-clé en jaune).
- Apparition slide + pop, légère pulsation, ~5 s, **dans la dernière partie mais à un moment peu important** (lendemain / saut temporel), **jamais** pendant le twist ou le jumpscare.

## 6. Audio

**La voix n'est JAMAIS générée ici** : l'utilisateur la génère sur ElevenLabs (Eleven v3) et renvoie les MP3.

**Livrable voix** (dans le chat ET dans `histoires/<slug>/voix/`) :
- Un bloc par clip, **chaque bloc dans son propre bloc de code** pour copier-coller, titré `### 06 · 👦 ENFANT (change de voix)`.
- Un changement de personnage = un nouveau clip. Les clips sont numérotés dans l'ordre du récit.
- Balises d'émotion v3 adaptées à l'image : `[calm, storytelling]`, `[serious]`, `[ominous]`, `[tense, slower]`, `[whispers]`, `[nervously]`, `[scared, breathless]`, `[gasps]`, `[menacing, raspy]`, `[laughs creepily]`, `[sniffs]`, `[sighs]`, `[softly]`, `[short pause]`. Si une balise est lue à voix haute : la remplacer par « … ».
- Fichiers texte `NN_VOIX.txt` + `00_LISTE_DES_CLIPS.md`, et un casting conseillé (narrateur homme grave conteur, enfant ~10 ans, monstre rauque/soufflé, ancien chaud mais ferme…).
- Hook : formuler simplement le pays (« En Algérie, les grands-mères… »), pas de région alambiquée.
- L'utilisateur peut regrouper plusieurs clips d'une même voix dans un MP3 (`01-05_NARRATEUR.mp3`) : `clips.py` gère les groupes.

**Traitement** : pauses internes raccourcies (≤ 0,30 s), narrateur accéléré ×1,15 (atempo, hauteur conservée), dialogues ×1,05 ; écho sur le monstre, passe-bas « derrière la porte » sur une voix imitée.
Attention : les voix ElevenLabs sont lentes — un texte de ~290 mots donne ~92 s même resserré. **Viser 230–260 mots** pour tenir ~75 s.

**Musique/SFX (synthétisés, aucun fichier externe)** : drone grave continu (plus discret sur hook/jour), vent filtré coupé net quand « le vent s'arrête », quelques notes de luth Karplus-Strong dans une gamme du pays (hijaz pour le Maghreb), ducking sous la voix. Bruitages calés sur les mots : onde/whoosh, hit grave sur les mots rouges forts, tampon + frappe + bips sur l'affiche, pas de course, battements de cœur, coups à la porte (×3 synchronisés aux secousses), griffures, reniflements, moteur qui cale, riser avant le twist, hit + cri sur le jumpscare. Soft-limit (tanh) puis loudnorm -14 LUFS.

## 6bis. Pièges visuels déjà rencontrés (à vérifier sur chaque planche)

- **Index levé** : poing fermé bien visible (phalanges + pouce replié), index sur le BORD du poing — sinon ça ressemble à un doigt d'honneur.
- **Tatouages berbères** (menton/front) : trait vertical + chevrons + points ; jamais une forme de croix.
- Monstre : toujours une **calotte de cheveux** sur le haut du visage, sinon il a l'air chauve / crâne d'œuf. Yeux pas trop gros (sinon « hibou »).
- T-shirt d'une couleur franche (rouge) : un jaune devient couleur peau sous le filtre nuit.
- Pas de sous-titres sur l'avis de recherche (texte de l'affiche déjà à l'écran).
- Bouton CTA : en haut, jamais pendant le twist/jumpscare.
- Toujours faire une **planche de vignettes** (preview) avant le rendu complet et la regarder.

## 7. Pipeline de production

1. **Recherche** de la légende (origine, nom local, attributs visuels, règle traditionnelle).
2. **Script** selon le gabarit §2, ~250–270 mots, relu à voix haute ; marquer les mots-clés J/R et les répliques.
3. **Découpage plan par plan** : tableau (phrase → plan → décor → personnages → mouvement caméra → SFX).
4. **Voix** (TTS) → timestamps mot par mot (alignement forcé) → durées des plans calées sur la voix.
5. **Assets** : décors et personnages en SVG (calques séparés pour parallaxe et animation).
6. **Animation** : rendu image par image (HTML/SVG + Playwright, ou canvas) à 30 fps, 1080×1920.
7. **Sous-titres karaoké** générés depuis les timestamps.
8. **Mix** voix + drone + SFX, normalisation -14 LUFS, mux ffmpeg.
9. **Contrôle** : planche de vignettes toutes les 2 s + vérification de la synchro sous-titres.

## 8. Workflow avec l'utilisateur

1. Proposer une légende (ou prendre la sienne) → script + découpage visuel (`script.md`) + textes ElevenLabs par clip.
2. L'utilisateur envoie les MP3 → copier dans `histoires/<slug>/audio/voix/` avec des noms propres.
3. Adapter `clips.py`, `scenes.js` (décors, personnages, plans), `build_mix.py` (ancres SFX) à partir de l'exemple.
4. Preview → corriger → rendu complet → envoyer le MP4 (SendUserFile) + le pousser sur la branche.
5. Si l'utilisateur veut « les mêmes voix, autres plans/personnages » : ne toucher qu'à `scenes.js` (+ SFX), garder `clips.py`/audio.

## 9. Fichiers embarqués dans ce skill

- `scripts/engine/` : `lib.js` (caméra, sous-titres karaoké, CTA, flashs, secousses, grain, vignette), `render.js` (Playwright → ffmpeg, preview/vidéo multi-workers), `make_video.sh` (tout en une commande), `package.json` (polices Roboto Condensed + Noto Naskh Arabic via @fontsource).
- `scripts/exemple-ghoula/` : exemple complet (La Ghoula, Algérie) — `clips.py`, `build_audio.py`, `build_mix.py`, `scenes.js` (grand-mère, garçon/homme, Ghoula de dos/visage/yeux, désert nuit/coucher de soleil/jour, ksar, palmiers, chèvre, porte bleue, horloge, couteau, lampe, voiture, affiche RECHERCHÉE en arabe), `script.md`, textes ElevenLabs.
- Si le repo n'a pas `engine/`, copier `scripts/engine/` vers `engine/` ; pour une nouvelle histoire, copier `scripts/exemple-ghoula/` vers `histoires/<slug>/`.

## 10. Outils du repo (pipeline réel)

Exemple complet : `histoires/ghoula-sahara/`.

1. MP3 de l'utilisateur → `histoires/<slug>/audio/voix/` (un fichier par clip ou par groupe de clips, ex. `01-05_NARRATEUR.mp3`).
2. `clips.py` : liste des fichiers, texte balisé (`[mot]J` jaune, `[mot]R` rouge), style (`narr`, `dlg_y`, `dlg_p`), tempo, pauses, effets voix (écho Ghoula, filtre « derrière la porte »).
3. `python3 build_audio.py` → `build/voice.wav` + `build/timeline.json` (pauses resserrées, alignement mot par mot heuristique : régions de parole ↔ ponctuation).
4. `scenes.js` : décors/personnages SVG + liste des plans ancrés sur les mots (`wordT(clip, mot)`), secousses, flashs, fenêtre du bouton CTA.
5. `cd engine && npm i` (une fois) puis `node render.js ../histoires/<slug> preview 1,5,12` (vignettes) / `node render.js ../histoires/<slug> video 4` (rendu complet 1080×1920 30 fps via Playwright).
6. `python3 build_mix.py` → `build/mix.wav` (drone, luth hijaz Karplus-Strong, bruitages synthétisés, ducking).
7. Ou tout d'un coup : `engine/make_video.sh histoires/<slug>`.
8. Mux manuel : `ffmpeg -i build/video_noaudio.mp4 -i build/mix.wav -af loudnorm=I=-14:TP=-1.5 -c:v copy -c:a aac -b:a 192k -shortest final.mp4`.
