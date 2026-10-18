# Surface: Component gallery (the gallery)

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

**Reference:** Storybook (primary, for what a component workshop is and why it
is separate from the app). Sources at the foot; read 2026-08-25.

Every shared component, in every state it can be in, on one page, with no server
data behind it. It is a review surface: not linked from the navigation, and not
something a customer ever sees.

**Taken**

- **States are reached by declaring them, not by driving the app to them.**
  Storybook's argument is the whole reason this page exists: "you can render a
  specific variation in isolation by passing in props, mocking data, or faking
  events", and "verify hard-to-reach edge cases of UI". A screenshot pass over
  app screens catches one state of each component; this catches all of them.
- **No session, no database, no upload.** A face is a 2×2 inline WebP so the
  picture state renders with nothing behind it. The gallery must render for
  somebody who has just cloned the repository.
- **Grouped by component, with a note per group** saying what the group is for,
  so a reviewer knows what they are looking at without reading the source.
- **It is screenshotted at several widths.** The two defects that produced this
  page - a colour picker nobody could read, a bulk bar that reflowed at every
  width - were both invisible in a single-viewport pass.

**Rejected**

- Storybook itself. It is a second build, a second dev server and a second
  dependency tree for a product with one design system and one team; the page is
  a route in the app that already exists, so a component and its gallery entry
  cannot drift apart across builds. The trade recorded here so that adopting
  Storybook later is a decision with a reason rather than a default.
- A link in the navigation. This is a development surface; a customer meeting it
  is a leak, not a feature.
- Prose documentation per component. What the component does belongs in its
  surface file or its source; this page answers "what does it look like in that
  state".

**Deviation**

- **No controls, no knobs.** Storybook lets a reviewer change props live; here
  every state is a fixed instance on the page. The reason is the screenshot
  pass: a state that only exists after somebody clicks a control is exactly the
  state a picture misses. Everything worth seeing is already on screen.
- No isolation boundary either: components render inside the app's own shell and
  tokens, which is the point - the gallery grades them in the frame they ship in.

**Budget**

- **Renders with no network.** Any component whose gallery entry needs a request
  gets a fixture instead.
- **Every state of a shared component appears here.** A component gaining a
  state and not gaining a gallery entry is the gap this page exists to close.
- The page is allowed to be long. It is not allowed to be slow: no animation
  that runs forever, nothing that polls.

**States**

The page has one state - rendered - and that is deliberate. What varies is the
viewport it is photographed at.

## Frames

- **1280x720** - the desktop the component sheet is approved at (`gallery`
  baseline); the sheet exists to compare components in one frame, not to be
  responsive

## Sources

- <https://storybook.js.org/docs/get-started/why-storybook> - components rendered
  in isolation by passing props and mock data, stories as "a declarative syntax
  for supplying props and mock data to simulate component variations", and
  verifying "hard-to-reach edge cases of UI".
