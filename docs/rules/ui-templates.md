# UI templates: the level that decides geometry

> Carried over from Hikaru, where these rules were learned. Issue numbers such as #352 refer to `SebiShepherd/hikaru`; "the sponsor" is whoever owns the product applying the rule.

Status: **workspace v1 shipped** (inbox as first consumer). The record page and the wizard are not built.

What this decides: which page shapes the suite has, what a template owns, what a
module is allowed to pass into one, and the numbers the first template ships
with.

What this does not decide: what any individual screen contains (its surface
file), or which module gets built next (the board).

## Why this level has to exist

`docs/specs/context-map.md` names four UI levels and says level 3 is missing:
tokens, primitives, **templates**, surfaces. Today a screen composes primitives
directly, which means every screen decides its own geometry, which means no two
screens agree and nothing can be wrong in a way a test can see.

The evidence is not theoretical. From one evaluator run (`msu2z7yz`) plus the
open issues:

- content starts at x≈100 on the contacts list and the dashboard, and at x≈405
  on the contact detail page, so moving from a list to a record shifts the whole
  page sideways by around 300px
- the contact detail card is 670px in a 1385px area: 85% of the page is empty
- the inbox pane footer overlaps the last row of the list instead of the list
  scrolling clear of it
- the table layout takes the width the thread and the details already occupy,
  which is #163, the issue this work exists to close
- the inbox's own width division is 60 lines of `support-inbox.md`, and every one
  of those decisions applies to every list-detail screen the suite will ever have

Each of these was fixed, or will be fixed, on the screen it appeared on. That is
the failure mode: a geometry decision taken per screen is taken again per screen,
differently, forever.

## The catalogue

Four shapes cover what a business suite is. Three exist implicitly today, drawn
by hand each time; the fourth is not needed yet.

| Template          | Shape                                                       | First consumer   | Then                              |
| ----------------- | ----------------------------------------------------------- | ---------------- | --------------------------------- |
| **Workspace**     | queue or list beside a working area, with a context sidebar | support inbox    | contacts, deals, tasks, any queue |
| **Record page**   | one record, its facts, its related things, its activity     | contact detail   | company, deal, invoice, project   |
| **Settings page** | one scope, sectioned, one save affordance                   | settings (built) | every module's settings           |
| **Wizard**        | steps with a stated end                                     | not yet          | onboarding, imports, migrations   |

## What a template owns, and what a module passes

A template owns **geometry**. A module passes **content**. The split is the whole
point: two modules that pass different content get the same page, and a module
that wants a different page amends this document instead of its own stylesheet.

| Owned by the template                               | Passed by the module                |
| --------------------------------------------------- | ----------------------------------- |
| where content starts, and the gutters               | the rows, the fields, the tabs      |
| pane widths and which pane yields first             | what is in each pane                |
| the fold steps and their order                      | which columns exist at all          |
| scroll containers, and what a footer is attached to | the footer's verbs                  |
| where a contextual bar appears and what it covers   | the verbs in the bar                |
| empty-state geometry                                | the empty-state sentence            |
| the breakpoints                                     | nothing: a module names no viewport |

## Workspace v1: the numbers

The change from today is structural, and it is the thing #163 asks for: **the
thread and the details stop competing with the list for width**. They move into
one right sidebar with two tabs, which is what Intercom does, so the list keeps
the width the table needs and the table stops folding four columns away.

```
 rail   queues     list / table            sidebar
 56px   240px      everything left         360px, tabbed
                                           [ Conversation | Details ]
```

| Decision               | v1, as built                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Rail                   | 56px, icons, tooltips (the shell's, not the template's)                                     |
| Secondary nav (queues) | 240px, from `lg`; from `xl` while the sidebar is open                                       |
| Main pane              | takes what is left; the only pane that grows, and its content fills it                      |
| Sidebar                | 416px, 544px from `xl`, 640px from `2xl`; tabbed; never overlays the main pane              |
| Resting state          | the sidebar's width, so a pick does not shift the list under the pointer that picked it     |
| Who yields first       | the secondary nav below `xl`, then the list itself on a phone, where the pick is the screen |
| Fold                   | keyed to the container, never to the window, in a stated order                              |

The numbers came from measuring, not from taste: at 1024 with the nav still on
screen the table had 264px for 320px of fixed columns, and a list fixed at 384px
inside a pane that grew left 169px of nothing beside it. Both are asserted.

Two things this settles that the inbox settled only for itself: the fold is
keyed to the container (the pane's width, not the viewport's), and the pane that
yields first is stated once rather than argued per screen.

## Record page v1

The contact page is the case that shows what is missing: it renders one 670px
card in a 1385px area and shows none of the record's related things, which is
also half of #190.

| Region   | v1                                                                  |
| -------- | ------------------------------------------------------------------- |
| Header   | the record's name, its identifying facts, its verbs, one row        |
| Main     | the record's own sections, same origin x as any list                |
| Sidebar  | related things across modules: this contact's tickets, deals, files |
| Activity | one timeline, fed by the audit and event streams                    |

The sidebar is where relations surface, so this template and item 5 of the
context map arrive together or the template ships with an empty column.

## How this stops being prose

Three mechanisms, because a rule with no mechanism is a wish (this is the same
lesson as #167):

1. **A template is a component, and a screen that lays itself out fails review.**
   Route components compose `<Workspace>` / `<RecordPage>`; a fitness test fails
   a route file that reaches for pane geometry itself.
2. **Every template is in the gallery**, in every state: both tabs, sidebar
   collapsed, empty, loading, phone. A component not in the gallery is not
   reviewed.
3. **The shared numbers are asserted**, not described: one content origin across
   list and record at 1024/1440/1920, no footer overlapping a row, no pane
   scrolling sideways, the sidebar never over the composer.

## Decided

1. **Tabs, where the list is the whole width.** The conversation and the details
   share one right sidebar with two tabs, `Thread` and `Details`. Stacking was
   rejected for the reason the tabs exist: the details would go under the
   thread, and reading an attribute would become a scroll.

   **Columns, where it is not.** A template that owns geometry has to answer per
   width, not per product. A table is eight columns and needs all of them, so
   the pick has to come out of a shared box. A chat list is three lines a row and
   is finished at 22rem, so on a screen of 1440 or more the pick opens beside it:
   list, conversation, attributes, which is what the references show and what
   this product had before the template arrived. Below 1440 there is no room for
   four columns and the tabs come back (#208).

   The consumer says which of the two its list is (`columns`), because only the
   module knows whether its list is a table or a card; the template decides
   whether there is room. In columns the list holds a fixed width in both
   states, so picking a row moves nothing.

2. **The sidebar opens on a row.** It is closed while the queue is a queue, and
   opens when a row is picked, in both layouts. That is what gives the table its
   width back, which is what #163 is about.
3. **One pane on a phone.** Below `md` the workspace is the list alone, the
   sidebar becomes the whole screen once a row is opened, and no layout switch is
   offered, because only one layout fits. Already shipped for the inbox: at 390
   the table gave requester 160px, status 112px and the subject column, the one
   that identifies a ticket, 13px.

## Answered from the framework

**Contacts is the second consumer, in the same increment, geometry only.** The
map's own lesson is that a thing shaped by one module and never used by a second
stays module-shaped: teams looked like a platform concept for months and was
not one. A template built against one screen is a description of that screen. So
contacts consumes the workspace as part of this work, and its content is not
redesigned while that happens. It also fixes what the run already measured
there: content starting 300px further right than on a list, and 85% of the page
empty.

**A stream opens beside its list; a record opens on its own page (#233).** The
question was whether one detail-view pattern should hold across modules, since
a ticket opens in a split pane and a contact navigates away. It should not, and
the references say so with one voice: Intercom, Front and Gmail all open a
conversation beside the queue, while Zendesk, HubSpot and Salesforce all give a
contact or a company a page. The reason is not habit. A conversation is a
**stream** - it is worked one at a time out of a queue you keep your place in,
so the queue has to stay on screen and picking the next one must not be a
navigation. A contact is a **record** - it is arrived at, inspected, and left
from, it has related things from other modules hanging off it, and the list it
came from is a directory rather than a work queue.

So the rule is not "one pattern", it is one **test**: does the person come back
to the list to do the next one? Yes means `Workspace` and a sidebar; no means
`RecordPage` and a route. A module picks by that sentence, and a screen that
picks differently has to say which side of it its objects fall on.

**The record page waits for relations (#190).** The surface files already carry
the rule this follows: Intercom's company details and user notes were rejected
because "an empty section is worse than no section". A record page whose reason
for existing is the related-things column would ship with that column empty.
Order: workspace with two consumers, then relations, then the record page as
their first real consumer.

## See also

- `docs/specs/context-map.md`, UI plane and item 4 of the change list
- `docs/design/surfaces/support-inbox.md`, the width division this generalises
- #163 (the table's horizontal overflow), #190 (relations), #167 (mechanism)
