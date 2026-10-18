#!/usr/bin/env node
/**
 * The house style for words a person reads on screen, enforced where they live.
 *
 * A prose linter configured for Markdown never reads a product's labels,
 * toasts or mails, so the rule has to be checked in the source that renders them.
 * Shipped with the kit so every product runs the same check:
 *
 *   node node_modules/@wavingeye/ui/tools/check-ui-text.mjs [files...]
 *
 * With no arguments it reads every tracked `.ts`/`.tsx` file outside specs.
 *
 * Why this is a parser and not a grep: our comments are long, argumentative
 * prose and they use dashes constantly, deliberately. A regular expression over
 * the file cannot tell a comment from a label, and a rule that fires on
 * comments would be turned off within a day. The TypeScript AST can: JSX text
 * is a node, a label is a string in an attribute, a mail subject is a property
 * with a known name. Nothing else is read.
 *
 * What it refuses, and why, from the style guides the product follows:
 *
 * - **Em dash (U+2014) and en dash (U+2013)**: Microsoft's guide allows them
 *   and warns in the same breath that they "can affect readability if they are
 *   used excessively, by interrupting the flow of the text and making sentences
 *   overly long and complex"
 *   (https://learn.microsoft.com/en-us/style-guide/punctuation/dashes-hyphens/,
 *   read 2026-09-15). GOV.UK removes the one use Microsoft keeps: "Use 'to' for
 *   time ranges and date ranges, not hyphens, en rules or em dashes", under a
 *   plain-English rule that also says "Do not use long sentences"
 *   (https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/,
 *   read 2026-09-15). A screen has less room than a page and is read in a
 *   hurry, so this takes GOV.UK's position.
 * - **A spaced hyphen used as a dash** (` - `): the same construction wearing
 *   an ASCII coat. Microsoft's guide names it directly - "Don't use multiple
 *   hyphens in place of an em dash" - and the readability argument does not
 *   care which character was typed.
 *
 * The remedy is never a different dash. It is two sentences, or a comma, or a
 * colon; a clause that needed a dash to hold it together is usually a clause
 * that wanted to be its own sentence.
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

/** Attributes whose value is read by a person, not by a machine. */
const SPOKEN_ATTRIBUTES = new Set([
  'label',
  'aria-label',
  'placeholder',
  'title',
  'alt',
  'confirmLabel',
  'cancelLabel',
  'body',
  'message',
  'heading',
  'description',
  'hint',
  'emptyMessage',
  'subject',
]);

/**
 * Object properties that carry copy. Mail templates are plain objects rather
 * than JSX, so the subject and the body of a message are reached this way.
 */
const SPOKEN_PROPERTIES = new Set([
  'subject',
  'message',
  'text',
  'heading',
  'body',
  'said',
  'contentHtml',
]);

const OFFENCES = [
  { pattern: /—/, what: 'an em dash' },
  { pattern: /–/, what: 'an en dash' },
  { pattern: /\S \- \S|\S - \S/, what: 'a spaced hyphen used as a dash' },
];

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : execFileSync('git', ['ls-files', '*.tsx', '*.ts'], {
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
      .filter((file) => !/\.spec\.tsx?$|\.d\.ts$|(^|\/)(e2e|dist|node_modules)\//.test(file));

const found = [];

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  ts.forEachChild(source, function visit(node) {
    for (const text of spokenText(node)) judge(file, source, node, text);
    ts.forEachChild(node, visit);
  });
}

if (found.length > 0) {
  console.error('\nWords a person will read, written with a dash the house style refuses:\n');
  for (const { file, line, what, text } of found) {
    console.error(`  ${file}:${line}  ${what}`);
    console.error(`    ${text}`);
  }
  console.error(
    [
      '',
      'The remedy is not a different dash. Split the sentence, or use a comma or',
      'a colon: a clause that needs a dash to hold it together usually wanted to',
      'be its own sentence. For ranges write "to" ("9:00 to 17:00").',
      '',
      'Why, and the sources: docs/rules/ui-text.md in @wavingeye/ui.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

console.log(`Screen text is dash-free: ${files.length} file(s) read.`);

/** Every string in this node that somebody will read on a screen. */
function spokenText(node) {
  if (ts.isJsxText(node)) return [node.text];
  if (ts.isJsxAttribute(node) && SPOKEN_ATTRIBUTES.has(node.name.getText())) {
    return literalsIn(node.initializer);
  }
  if (ts.isPropertyAssignment(node) && SPOKEN_PROPERTIES.has(nameOf(node.name))) {
    return literalsIn(node.initializer);
  }
  return [];
}

function nameOf(name) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : '';
}

/** String and template literals inside a value, including a ternary's arms. */
function literalsIn(value) {
  if (!value) return [];
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return [value.text];
  if (ts.isJsxExpression(value) || ts.isParenthesizedExpression(value))
    return literalsIn(value.expression);
  if (ts.isConditionalExpression(value))
    return [...literalsIn(value.whenTrue), ...literalsIn(value.whenFalse)];
  if (ts.isTemplateExpression(value))
    return [value.head.text, ...value.templateSpans.map((span) => span.literal.text)];
  if (ts.isBinaryExpression(value)) return [...literalsIn(value.left), ...literalsIn(value.right)];
  if (ts.isArrayLiteralExpression(value)) return value.elements.flatMap(literalsIn);
  // `[...lines].join('\n')`, which is how every mail body in this repository is
  // written. Without this the templates - the one place the product speaks in
  // whole paragraphs - were the only copy the check could not see.
  if (
    ts.isCallExpression(value) &&
    ts.isPropertyAccessExpression(value.expression) &&
    value.expression.name.text === 'join'
  ) {
    return literalsIn(value.expression.expression);
  }
  return [];
}

function judge(file, source, node, text) {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat === '') return;
  for (const { pattern, what } of OFFENCES) {
    if (!pattern.test(flat)) continue;
    const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
    found.push({ file, line: line + 1, what, text: flat.slice(0, 110) });
    return;
  }
}
