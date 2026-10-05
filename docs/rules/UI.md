# UI

Colors, wording, and the four states of every screen.

## Colors

**Use the named colors, never raw ones.** Write `bg-card` and `text-muted-foreground`, not `bg-white` or `text-gray-500`. The names are defined once in `src/app/globals.css`, with a light and a dark value each. Dark mode and a rebrand are then a change to one file.

| Name | Use |
| --- | --- |
| `background` / `foreground` | The page and its main text |
| `card` | Panels that sit on the page |
| `muted` / `muted-foreground` | Quiet backgrounds / secondary text |
| `border` | Lines |
| `primary` / `primary-foreground` | The main action on a screen |
| `accent` / `accent-soft` | Wheat gold: the brand mark, small labels, and the soft ground behind them |
| `success` / `success-soft` | Something worked, money collected, a position that is active |
| `danger` / `danger-soft` | Something failed |

## The brand

Harvest the Wheel looks like a field at harvest: a cream page, field green for actions, wheat gold for the brand. The values live only in `src/app/globals.css`; the mark is `src/components/brand/logo.tsx` (a wagon wheel with a gold hub).

- **Field green (`primary`) is for the one action that matters on a screen**, and for the welcome panel on the dashboard. Not for decoration.
- **Wheat gold (`accent`) is for small things:** the mark's hub, section labels, ticker chips. Never for body text on a large area.
- **Statuses are badges** (`src/components/ui/badge.tsx`), and a badge always has words.
- **Every text color passes 4.5:1** against the ground it sits on, in light and in dark mode. Check a new pair before adding it.

**The wording keeps the app on the right side of advice.** Trades are told as what The Harvester did ("The Harvester sold 9 MARA puts"), never as what the reader should do. A screen with positions or funds ends with the disclaimer (`src/components/wheel/disclaimer.tsx`).

**Color is never the only signal.** An error has words, not just red.

## Four states

Every list, panel and page that shows data is designed in four states before it is done. `notes-panel.tsx` shows all four.

| State | What the user sees |
| --- | --- |
| Loading | A grey placeholder shaped like the content |
| Empty | A sentence that says what goes here and how to add the first one |
| Error | What happened and what to do ([ERRORS.md](ERRORS.md)) |
| Ready | The content |

**If the user already has something to look at, leave it alone.** Show the loading placeholder only on the first load, never when data is refreshing in the background.

**A button shows its own busy state.** While saving, the button is disabled and reads "Saving…". The rest of the page stays usable.

## Wording

- **Sentence case.** "Create account", not "Create Account".
- **A button names what it does.** "Add note", "Sign out". Never "Submit" or "OK".
- **Plain words.** No developer terms on screen.
- **Numbers carry units.** "$10 per month".
- **Nothing on screen misstates what is happening.** A simulated feature carries a `PlaceholderNotice` that says so.

## Layout

- **Phone width first.** Check every screen at 375px wide. No sideways scrolling. On a phone the main sections are a tab bar at the bottom, so signed-in pages keep `pb-28` of space below their content.
- **Touch targets are at least 44px tall.** Buttons and inputs use `min-h-11`.
- **Reuse before you build.** Look in `src/components/ui/` first.
- **Every input has a label**, visible or `aria-label`.
- **Text is at least 14px** (`text-sm`).

## Known gaps

- `src/components/ui/` holds a button, a badge and the placeholder notice. Cards are styled in place on several pages now (`rounded-xl border border-border bg-card`); extract a `Card` the next time one is added.
- The wheel screens read sample data from `src/lib/wheel/sample-data.ts`, so they have no loading or error state yet. They get all four states when trade entry moves them onto the path in [DATA_FLOW.md](DATA_FLOW.md).
- Dark mode follows the device setting. There is no switch.
