# Clips de la vidéo : fichier audio, voix, texte balisé pour les sous-titres.
# Balises : [mot]J = jaune, [mot]R = rouge. style: "narr" | "dlg_y" (italique jaune) | "dlg_p" (italique rose)
# Les fichiers regroupés (01-05, 17-20) sont découpés en sous-clips par l'alignement.

FILES = [
    ("01-05_NARRATEUR.mp3", "narr", [
        ("01", "En [Algérie]J, les grands-mères apprennent une seule [règle]J aux enfants."),
        ("02", "Si tu croises une femme seule dans les [dunes]J, la [nuit]R... tu lui dis [salam]J avant qu'elle parle. Parce que si elle parle la première... elle a le droit de te [manger]R."),
        ("03", "Elle s'appelle... la [Ghoula]R."),
        ("04", "Cet [été]J, tu es chez ta grand-mère, au [bled]J. Un soir, ta [chèvre]J s'échappe dans les dunes. Tu pars la chercher, avec une lampe."),
        ("05", "Le vent s'arrête, d'un [coup]R. Sur une dune, une femme en [abaya]R noire est assise, de dos. Elle se [coiffe]R. Elle se retourne, lentement. Elle ouvre la bouche..."),
    ]),
    ("06_ENFANT.mp3", "dlg_y", [("06", "[Salam]J !")]),
    ("07_NARRATEUR.mp3", "narr", [("07", "Son [sourire]R disparaît.")]),
    ("08_GHOULA.mp3", "dlg_y", [("08", "Si ton salam n'était pas venu avant tes mots... j'aurais mangé ta [chair]R. Va. Pour ce soir.")]),
    ("09_NARRATEUR.mp3", "narr", [("09", "Tu cours jusqu'à la [maison]J. Derrière toi, quelqu'un [rit]R dans le noir.")]),
    ("10_GHOULA.mp3", "dlg_y", [("10", "Héhéhé... [hahaha]R...")]),
    ("11_NARRATEUR.mp3", "narr", [("11", "Ta grand-mère devient toute [pâle]R. Elle glisse un [couteau]J sous ton oreiller, et ferme la porte à double tour.")]),
    ("12_GRAND-MERE.mp3", "dlg_y", [("12", "Cette nuit, si quelqu'un t'appelle... tu ne réponds pas. Pas un [mot]R.")]),
    ("13_NARRATEUR.mp3", "narr", [("13", "À [trois heures]J du matin... on [frappe]R à la porte.")]),
    ("14_PAPA.mp3", "dlg_p", [("14", "Mon fils... c'est papa. Je suis rentré de France. Ouvre-moi.")]),
    ("15_NARRATEUR.mp3", "narr", [("15", "Ton père est à [Marseille]J. Tu ne réponds pas. Alors on [gratte]R le bois. Puis on [renifle]R sous la porte.")]),
    ("16_GHOULA.mp3", "dlg_y", [("16", "Rihat bnadem... ça sent l'[humain]R, ici...")]),
    ("17-20_NARRATEUR.mp3", "narr", [
        ("17", "Le matin, devant la porte, il y a ta [chèvre]J. Enfin... ce qu'il en [reste]R."),
        ("18", "Dix [ans]J plus tard, tu reviens au bled, en voiture, de nuit. Le moteur s'arrête, d'un [coup]R."),
        ("19", "Sur une dune, une femme en [abaya]R noire est assise, de dos. Elle se coiffe. Tu ouvres la bouche pour dire [salam]J..."),
        ("20", "Mais sur la banquette [arrière]R... une voix murmure."),
    ]),
    ("21_GHOULA.mp3", "dlg_y", [("21", "Salam, mon fils. Cette fois... c'est moi qui ai parlé la [première]R.")]),
]

# Pause ajoutée AVANT chaque fichier (secondes)
GAP_BEFORE = {"06_ENFANT.mp3": 0.05, "07_NARRATEUR.mp3": 0.15, "10_GHOULA.mp3": 0.0,
              "17-20_NARRATEUR.mp3": 0.45, "21_GHOULA.mp3": 0.35}
DEFAULT_GAP = 0.22
TEMPO = {"narr": 1.15, "dlg_y": 1.05, "dlg_p": 1.05}
MAX_PAUSE = 0.30   # pauses internes raccourcies à ce maximum

# Effets par fichier (filtres ffmpeg appliqués avant assemblage)
FX = {"08_GHOULA.mp3": "aecho=0.8:0.6:70|140:0.28|0.16", "10_GHOULA.mp3": "aecho=0.8:0.6:90|180:0.35|0.2",
      "16_GHOULA.mp3": "aecho=0.8:0.6:70|140:0.28|0.16", "21_GHOULA.mp3": "aecho=0.8:0.5:50|110:0.22|0.12",
      "14_PAPA.mp3": "lowpass=f=3200,aecho=0.8:0.5:40:0.25"}
