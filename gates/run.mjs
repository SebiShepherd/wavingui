#!/usr/bin/env node
/** Every gate, in order; the first failure fails the run. */
import { execFileSync } from 'node:child_process';

const GATES = [
  ['node', ['gates/check-theme.mjs']],
  ['node', ['gates/check-palette.mjs']],
  ['node', ['gates/check-dist.mjs']],
  ['node', ['tools/check-ui-text.mjs']],
];

for (const [command, args] of GATES) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit' });
}
