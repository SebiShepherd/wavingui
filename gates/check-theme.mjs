#!/usr/bin/env node
/**
 * Every colour pair the theme paints, held to the brand's floors.
 *
 * The floors are not kept here. They are `floors` in @wavingeye/brand's role
 * vocabulary, which is the contract every WavingEye theme satisfies, so a floor
 * the brand raises is a floor this kit fails until it complies. Read from both
 * sets in `css/wavingui.css`: the light one in `@theme`, the dark override in
 * `.dark`, with `var()` resolved against the set it appears in.
 *
 * The brand tile is checked too: whatever renders the mark clears 3:1 against
 * the surfaces it sits on, and the mark clears 3:1 against its tile.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { floors } = require('@wavingeye/brand/tokens/vocabulary.json');
const css = readFileSync(new URL('../css/wavingui.css', import.meta.url), 'utf8');

/** The `--color-*` declarations inside the first block that opens with `head`. */
function block(head) {
  const start = css.indexOf(`${head} {`);
  if (start < 0) throw new Error(`no "${head}" block in wavingui.css`);
  let depth = 0;
  let i = css.indexOf('{', start);
  const from = i;
  for (; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}' && --depth === 0) break;
  }
  const body = css.slice(from + 1, i).replace(/\/\*[\s\S]*?\*\//g, '');
  return Object.fromEntries(
    [...body.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

const light = block('@theme');
const dark = { ...light, ...block('.dark') };

function hex(set, name, seen = new Set()) {
  const value = set[name];
  if (!value) throw new Error(`--color-${name} is not defined`);
  const ref = value.match(/^var\(--color-([\w-]+)\)$/);
  if (ref) {
    if (seen.has(name)) throw new Error(`--color-${name} refers to itself`);
    return hex(set, ref[1], seen.add(name));
  }
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`--color-${name} is "${value}", not a hex colour`);
  return value;
}

function luminance(value) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const checks = [];
for (const [rule, floor] of Object.entries(floors)) {
  if (rule.startsWith('$')) continue;
  const pairs = floor.pairs ?? floor.inks.flatMap((ink) => floor.on.map((on) => [ink, on]));
  for (const [ink, on] of pairs) checks.push({ rule, ink, on, ratio: floor.ratio });
}
for (const on of ['bg', 'surface']) checks.push({ rule: 'brand tile', ink: 'brand-tile', on, ratio: 3 });
checks.push({ rule: 'brand mark', ink: 'brand-tile-on', on: 'brand-tile', ratio: 3 });

const failures = [];
for (const [theme, set] of [['light', light], ['dark', dark]]) {
  for (const { rule, ink, on, ratio } of checks) {
    const got = contrast(hex(set, ink), hex(set, on));
    if (got < ratio) failures.push(`${theme}: ${ink} on ${on} is ${got.toFixed(2)}:1, ${rule} needs ${ratio}:1`);
  }
}

if (failures.length) {
  for (const f of failures) console.error(f);
  console.error(`${failures.length} pair(s) under the brand's floors`);
  process.exit(1);
}
console.log(`every painted pair clears the brand's floors: ${checks.length * 2} checked`);
