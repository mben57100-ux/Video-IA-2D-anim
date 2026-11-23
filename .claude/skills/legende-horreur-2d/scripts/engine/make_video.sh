#!/usr/bin/env bash
# Usage : engine/make_video.sh histoires/<slug> [nom_sortie]
# Enchaîne : audio+alignement -> rendu images -> musique/SFX -> mux final (-14 LUFS)
set -euo pipefail
STORY="$(cd "$1" && pwd)"; NAME="${2:-$(basename "$STORY")}"
ENGINE="$(cd "$(dirname "$0")" && pwd)"
[ -d "$ENGINE/node_modules/@fontsource" ] || (cd "$ENGINE" && npm i --silent)
python3 "$STORY/build_audio.py"
(cd "$ENGINE" && node render.js "$STORY" video "${WORKERS:-4}")
python3 "$STORY/build_mix.py"
mkdir -p "$STORY/rendu"
ffmpeg -v error -y -i "$STORY/build/video_noaudio.mp4" -i "$STORY/build/mix.wav" \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart \
  "$STORY/rendu/$NAME.mp4"
echo "OK -> $STORY/rendu/$NAME.mp4"
