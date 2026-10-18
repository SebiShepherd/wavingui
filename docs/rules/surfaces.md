# Surface files

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

One file per screen, written **before** the screen is built or restructured.

## Why this exists

The UI got worse over a dozen slices without any single slice being wrong. Every
slice was judged on its own terms - does the filter work, does the save write, do
the tests pass - and adding a control always satisfies that test while removing
one belongs to no slice at all. After twelve slices the support inbox carried
three stacked toolbars, six identical dropdowns, eight columns and a page heading
that restated the navigation entry the person had just clicked.

The second half of the same failure: the code argued carefully about individual
components ("Gmail, Drive, Linear and Asana all land on the same shape") and
nothing ever required opening the reference product and comparing the **whole
screen**. Components were reasoned about; the screen was never composed. A
gallery of correct components is exactly what produces an overloaded screen.

A surface file is the smallest thing that fixes both: it names the reference, it
fixes a budget, and it makes removal somebody's job.

## The file

Five lines of decision, not an essay. Anything longer is a spec, and specs live
in `docs/specs/`.

```markdown
# Surface: <name>

Reference: <product> (primary), <product> (secondary)
Taken: <the patterns adopted, concretely>
Rejected: <what was looked at and deliberately not taken, and why>
Deviation: <where we differ from the reference, and why>
Budget: <the counted limits for this surface>
```

## The budgets

A budget limits **what competes for attention at one moment**: elements in a row,
verbs in a bar, rows above the fold. It is counted in review, like a test.

| Surface       | Budget                                                       |
| ------------- | ------------------------------------------------------------ |
| List row      | 3 information elements, plus at most 1 exception marker      |
| Action bar    | 5 verbs, then an overflow menu                               |
| Chrome bar    | one bar per surface, 44-52px, no second bar of page titles   |
| Detail pane   | sections collapse; at most 2 always-open rows above the fold |
| Settings page | one scope, one save affordance                               |

### What a budget is not

**It is not a cap on what the product can do.** It applies **per state of a
surface**, not to the surface's whole capability. A second layout behind a
toggle, a menu that opens, a pane that unfolds - none of those spend the budget
of the state they are not in. Each mode is measured on its own, and the control
that switches between them is one control.

Reading it the other way turns a rule against clutter into a rule against
configurability, which is the opposite of the point. "We do not have the budget
for two layouts" is never an argument when the two are never on screen together:
that is a decision to drop a capability, and rule 4 below applies.

### What to do when something exceeds a budget

Being over budget starts a decision. It never silently ends one. In order of
preference:

1. **Replace** - the new element does the job of one that is already there.
2. **Move** - into an overflow menu, a folded section, or another state of the
   surface. This is where a second mode belongs.
3. **Raise the budget, in writing** - amend the surface file and say why. A
   budget is a default, not a law.
4. **Ask the sponsor** - whenever the honest answer is "this costs a capability
   the reference product has, and I am not sure the density is worth it". A
   capability that exists in the reference is evidence that somebody's workflow
   needs it; dropping it is his call, not a tidiness decision.

What is forbidden is exactly one thing: **appending without a decision**. That is
the failure this whole file exists to stop, and it is not the same as saying no.

## Definition of done for a UI slice

1. The surface file exists and is current.
2. A screenshot of the finished surface sits beside the reference screenshot in
   the pull request.
3. Every element on the surface traces to the file: to the reference, to the
   budget, or to a written deviation. Anything untraceable comes out.

`apps/web/src/app/routes/the gallery.tsx` stays: it reviews component _states_.
It does not replace the screen review, for the reason in the first section.
