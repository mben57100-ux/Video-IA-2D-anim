// Usage:
//   node render.js <storyDir> preview t1,t2,...  -> <storyDir>/build/preview/*.png
//   node render.js <storyDir> video [workers]    -> <storyDir>/build/video_noaudio.mp4
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');

const storyDir = path.resolve(process.argv[2]);
const mode = process.argv[3] || 'preview';
const FPS = 30;
const fontDir = path.join(__dirname, 'node_modules/@fontsource');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:RC;font-weight:800;font-style:normal;src:url(file://${fontDir}/roboto-condensed/files/roboto-condensed-latin-800-normal.woff2)}
@font-face{font-family:RC;font-weight:800;font-style:italic;src:url(file://${fontDir}/roboto-condensed/files/roboto-condensed-latin-800-italic.woff2)}
@font-face{font-family:RC;font-weight:900;font-style:normal;src:url(file://${fontDir}/roboto-condensed/files/roboto-condensed-latin-900-normal.woff2)}
@font-face{font-family:NU;font-weight:900;src:url(file://${fontDir}/nunito/files/nunito-latin-900-normal.woff2)}
@font-face{font-family:NU;font-weight:800;src:url(file://${fontDir}/nunito/files/nunito-latin-800-normal.woff2)}
@font-face{font-family:PF;font-weight:900;font-style:normal;src:url(file://${fontDir}/playfair-display/files/playfair-display-latin-900-normal.woff2)}
@font-face{font-family:PF;font-weight:700;font-style:italic;src:url(file://${fontDir}/playfair-display/files/playfair-display-latin-700-italic.woff2)}
@font-face{font-family:AR;font-weight:700;src:url(file://${fontDir}/noto-naskh-arabic/files/noto-naskh-arabic-arabic-700-normal.woff2)}
html,body{margin:0;background:#000;overflow:hidden} svg{display:block}
</style></head><body><svg id="root" xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg>
<div style="font-family:RC;font-weight:800;position:absolute;opacity:0">a<i>a</i></div><div style="font-family:AR;position:absolute;opacity:0">مطلوبة</div><div style="font-family:NU;font-weight:900;position:absolute;opacity:0">a</div><div style="font-family:PF;font-weight:900;position:absolute;opacity:0">a<i style="font-weight:700">a</i></div>
</body></html>`;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const tmp = path.join(storyDir, 'build', 'page.html'); fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  const tl = JSON.parse(fs.readFileSync(path.join(storyDir, 'build', 'timeline.json')));
  await page.addScriptTag({ path: path.join(__dirname, 'lib.js') });
  for (const m of ['persos.js', 'roue.js']) if (fs.existsSync(path.join(__dirname, m))) await page.addScriptTag({ path: path.join(__dirname, m) });
  await page.addScriptTag({ path: path.join(storyDir, 'scenes.js') });
  await page.evaluate(tl => { window.STORY = buildStory(tl); }, tl);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return { page, tl };
}
async function draw(page, t) {
  await page.evaluate(t => { document.getElementById('root').innerHTML = makeFrame(t, window.STORY); }, t);
}

(async () => {
  const browser = await chromium.launch();
  if (mode === 'preview') {
    const times = (process.argv[4] || '1').split(',').map(Number);
    const out = path.join(storyDir, 'build', 'preview'); fs.mkdirSync(out, { recursive: true });
    const { page } = await openPage(browser);
    for (const t of times) {
      await draw(page, t);
      await page.screenshot({ path: path.join(out, `t${t.toFixed(2).padStart(6, '0')}.png`) });
    }
    console.log('preview done', times.length);
  } else {
    const workers = Number(process.argv[4] || 4);
    const tl = JSON.parse(fs.readFileSync(path.join(storyDir, 'build', 'timeline.json')));
    const N = Math.ceil(tl.duration * FPS);
    const per = Math.ceil(N / workers);
    const segs = [];
    const t0 = Date.now();
    await Promise.all([...Array(workers).keys()].map(async k => {
      const a = k * per, b = Math.min(N, a + per);
      const seg = path.join(storyDir, 'build', `seg${k}.mp4`); segs[k] = seg;
      const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', seg]);
      const { page } = await openPage(browser);
      for (let f = a; f < b; f++) {
        await draw(page, f / FPS);
        const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (k === 0 && f % 60 === 0) console.log(`frame ${f}/${b} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      }
      ff.stdin.end(); await new Promise(r => ff.on('close', r));
    }));
    const list = path.join(storyDir, 'build', 'segs.txt');
    fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', path.join(storyDir, 'build', 'video_noaudio.mp4')]);
    console.log('video done', N, 'frames', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await browser.close();
})();
