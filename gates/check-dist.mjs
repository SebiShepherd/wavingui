#!/usr/bin/env node
/**
 * `dist/` is what a product installs, and it is committed, because a git
 * dependency should not have to compile on install. So it must be exactly what
 * the source builds: this rebuilds into a scratch directory and fails on any
 * difference, which catches a stale build and a hand edit alike.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const scratch = mkdtempSync(join(tmpdir(), 'wavingui-dist-'));
try {
  execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json', '--outDir', scratch], { stdio: 'inherit' });
  const files = (dir) => readdirSync(dir).sort();
  const [built, committed] = [files(scratch), files('dist')];
  const differ = [...new Set([...built, ...committed])].filter(
    (name) =>
      !built.includes(name) ||
      !committed.includes(name) ||
      !readFileSync(join(scratch, name)).equals(readFileSync(join('dist', name))),
  );
  if (differ.length) {
    console.error(`dist/ differs from a fresh build: ${differ.join(', ')}`);
    console.error('run `npm run build` and commit dist/');
    process.exit(1);
  }
  console.log(`dist/ matches a fresh build: ${built.length} files`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
