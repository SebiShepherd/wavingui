# The words on the screen

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

What the product says to a person, and how it is checked. This is about copy in
the product: labels, toasts, dialog bodies, mail. It is not about this
repository's own prose, which Vale lints, or about code comments, which argue at
length on purpose.

## Taken

- **No em dash and no en dash.** Microsoft's guide permits the em dash and warns
  in the same sentence that dashes "can affect readability if they are used
  excessively, by interrupting the flow of the text and making sentences overly
  long and complex". GOV.UK removes the one use Microsoft keeps for the en dash:
  "Use 'to' for time ranges and date ranges, not hyphens, en rules or em
  dashes." A screen has less room than a page and is read in a hurry, so this
  takes GOV.UK's position for both.
- **No spaced hyphen standing in for a dash** (`word - word`). It is the same
  construction in an ASCII coat, and Microsoft names it: "Don't use multiple
  hyphens in place of an em dash." The readability argument does not care which
  character was typed.
- **A range is written with "to".** "9:00 to 17:00", not "9:00 - 17:00".
- **The remedy is never a different dash.** It is two sentences, a comma or a
  colon. A clause that needs a dash to hold it together usually wanted to be its
  own sentence, which is also GOV.UK's rule about length: "Do not use long
  sentences."

Hyphens inside words are untouched: "sign-in", "E-Mail-Adresse", "Azure-supported"
are hyphens doing a hyphen's job.

## How it is enforced

`tools/check-ui-text.mjs`, run in CI before Prettier and available as
`npm run check:ui-text`.

It reads the TypeScript AST rather than the file, because our comments are long
argumentative prose that uses dashes constantly and deliberately. A regular
expression cannot tell a comment from a label, and a rule that fires on comments
is a rule somebody switches off within a day. What it reads: JSX text, the
values of attributes a person hears or sees (`label`, `aria-label`,
`placeholder`, `title`, `alt`, `confirmLabel`, ...), and object properties that
carry copy (`subject`, `message`, `text`, `heading`, `contentHtml`, ...),
including the `[...].join('\n')` form every mail template in this repository
uses.

Vale covers the Markdown side: `Hikaru.EmDash` and `Hikaru.EnDash`.

## Why this exists

The em dash rule was written for this project and then applied to nothing that a
customer reads: `.vale.ini` is scoped to `[*.md]`, so every label and every mail
in the product sat outside it. The gap was found by reading a settings
card, where a refusal from the auth library sat next to a sentence of ours
joined by a dash.

## Sources

- (<https://learn.microsoft.com/en-us/style-guide/punctuation/dashes-hyphens/>,
  read 2026-09-15): em dashes "can affect readability if they are used
  excessively"; "Don't use spaces around em dashes"; en dashes for ranges and
  timestamps; "Don't use multiple hyphens in place of an em dash".
- (<https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/>,
  read 2026-09-15): "Use 'to' for time ranges and date ranges, not hyphens, en
  rules or em dashes"; "Do not use long sentences. Check sentences with more
  than 25 words to see if you can split them to make them clearer"; "All content
  on GOV.UK should be written in plain English."
