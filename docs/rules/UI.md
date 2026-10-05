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
| `danger`, `success` | Something failed / something worked |

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

- **Phone width first.** Check every screen at 375px wide. No sideways scrolling.
- **Reuse before you build.** Look in `src/components/ui/` first.
- **Every input has a label**, visible or `aria-label`.
- **Text is at least 14px** (`text-sm`).

## Known gaps

- `src/components/ui/` holds only a button and the placeholder notice. Inputs and cards are styled in place. Extract them when they are repeated a third time.
- Dark mode follows the device setting. There is no switch.
