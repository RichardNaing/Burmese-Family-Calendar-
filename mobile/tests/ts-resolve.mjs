// Lets Node's test runner import the app's extensionless TypeScript modules.
import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  if (spec.startsWith('.') && !/\\.[cm]?[jt]sx?$/.test(spec)) {
    for (const ext of ['.ts', '.tsx', '.js']) {
      try { return await next(spec + ext, ctx); } catch {}
    }
  }
  return next(spec, ctx);
}`));
