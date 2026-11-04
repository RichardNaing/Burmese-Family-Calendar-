// Loads the vendored mmcal engine (browser script) for Node: strips the
// chronicle-data loader, which needs `document`, and returns the classes.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const ENGINE_PATH = fileURLToPath(new URL('../vendor/mmcal/ceMmDateTime.js', import.meta.url));

export function engineSource() {
  let s = readFileSync(ENGINE_PATH, 'utf8');
  const a = s.indexOf('(() => {');
  const b = s.indexOf('})();', a) + '})();'.length;
  s = s.slice(0, a) + s.slice(b);
  return s.slice(0, s.indexOf('class ceMmChronicle {'));
}

export function loadEngine() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(engineSource() + '\n;globalThis.E={ceDateTime,ceMmDateTime,ceMmTranslate};', ctx);
  return ctx.E;
}
