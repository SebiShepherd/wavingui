#!/usr/bin/env node
/**
 * A component can only paint a role, never a palette colour.
 *
 * `wavingui.css` resets Tailwind's default palette (`--color-*: initial`), so
 * `bg-red-500` should produce nothing in any product that imports the kit. This
 * compiles the real stylesheet against a palette class and a role class and
 * fails if the palette one generates a rule or the role one does not: the
 * second half is what proves the compile actually ran.
 *
 * Imported Tailwind's way rather than with Tailwind's own default stylesheet,
 * so what is checked is what a product gets.
 */
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@tailwindcss/node';

const file = fileURLToPath(new URL('../css/wavingui.css', import.meta.url));
const compiler = await compile(readFileSync(file, 'utf8'), {
  base: dirname(file),
  onDependency: () => undefined,
});

const PALETTE = ['bg-red-500', 'text-blue-600', 'border-gray-200', 'ring-emerald-400'];
const ROLES = ['bg-accent', 'text-subtle', 'border-border', 'bg-scrim'];
const out = compiler.build([...PALETTE, ...ROLES]);

const rule = (name) => new RegExp(`\\.${name.replace(/[-/]/g, '\\$&')}\\s*\\{`).test(out);
const leaked = PALETTE.filter(rule);
const missing = ROLES.filter((name) => !rule(name));

if (leaked.length || missing.length) {
  if (leaked.length) console.error(`palette utilities still generate: ${leaked.join(', ')}`);
  if (missing.length) console.error(`role utilities do not generate: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`palette utilities produce nothing; role utilities do (${ROLES.length} checked)`);
