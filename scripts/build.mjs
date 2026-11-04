// Builds index.html: src/app.html + inlined mmcal engine + embedded fonts.
// Fonts are embedded so the wall display works offline and renders Burmese
// identically on every device.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { engineSource } from './engine.mjs';

const require = createRequire(import.meta.url);
const fontFile = (pkg, file) => path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files', file);
const fonts = [
  ...[400, 500, 700].map(w => ['Noto Sans Myanmar', w, fontFile('@fontsource/noto-sans-myanmar', `noto-sans-myanmar-myanmar-${w}-normal.woff2`)]),
  ...[400, 500, 600, 800].map(w => ['Inter', w, fontFile('@fontsource/inter', `inter-latin-${w}-normal.woff2`)]),
];
const css = fonts.map(([n, w, p]) =>
  `@font-face{font-family:'${n}';font-weight:${w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${readFileSync(p).toString('base64')}) format('woff2')}`
).join('\n');

let html = readFileSync('src/app.html', 'utf8');
const a = html.indexOf('<link rel="preconnect"');
const b = html.indexOf('rel="stylesheet">') + 'rel="stylesheet">'.length;
html = html.slice(0, a) + `<style>${css}</style>` + html.slice(b);
html = html.replace('/*ENGINE*/', () => engineSource().replaceAll('</script', '<\\/script'));
writeFileSync('index.html', html);
console.log(`index.html written (${(html.length / 1024).toFixed(0)} KB)`);
