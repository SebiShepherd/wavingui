/**
 * This repository, as kagami sees it.
 *
 * The kit has one surface a person looks at: the gallery, where every component
 * stands in every state. So every change that reaches a component or the theme
 * owes a run against the gallery, and a change to docs or to the checks owes
 * none. There are no personas, accounts or API here; the products that consume
 * the kit are where people walk.
 */
export default {
  surfaces: [[/^gallery\//, 'gallery']],

  /** Everything the gallery renders. A change here can move any of it. */
  shared: [/^src\//, /^css\//, /^theme-init\.js$/, /^package(-lock)?\.json$/],

  /** Appearance without structure. */
  tokensOnly: [/^css\/wavingui\.css$/],

  ignored: [
    /^docs\//,
    /^skills\//,
    /^\.github\//,
    /\.md$/,
    /\.spec\.tsx?$/,
    /^e2e\//,
    /^gates\//,
    /^tools\//,
    /^dist\//,
    /^kagami\.config\.mjs$/,
  ],

  normative: [/^gates\//, /^tools\//, /^docs\/rules\//, /^kagami\.config\.mjs$/],

  visual: {
    command: ['npx', 'playwright', 'test', '--grep', '@visual'],
    baselinesDir: 'e2e/gallery.spec.ts-snapshots',
    updateHint: 'npm run baselines, and commit the result in the same change',
  },

  catalogueRoots: [],
};
