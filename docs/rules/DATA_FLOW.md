# Data flow

How data travels between the screen and the database. The Notes feature is the reference example; copy its shape.

## The path

```
component  →  hook  →  api()  →  API route  →  service  →  database
(screen)     (reads)   (caller)   (thin)       (the work)
```

| Layer | File in the Notes example | Its one job |
| --- | --- | --- |
| Component | `src/app/(app)/dashboard/notes/notes-panel.tsx` | Draw the screen |
| Hook | `src/hooks/use-notes.ts` | Read data and keep one shared copy |
| API caller | `src/lib/api/client.ts` | Call `/api/*` and unwrap the answer |
| API route | `src/app/api/notes/route.ts` | Check who is asking, check the input, call one service |
| Service | `src/lib/services/notes.ts` | Do the work. The only layer that touches the database |

Each layer talks only to the one next to it.

## Rules

**Components never call `fetch`.** They read through a hook and write through `api()`.

**Only services touch the database.** Nothing else imports `@/lib/db`.

**Routes are thin.** A route checks the session, parses the input with its contract, calls one service function with the user's id, and returns. Logic belongs in the service.

**Every route answers in one shape.** `{ ok: true, data }` or `{ ok: false, error: { code, message } }`. Use `ok()` and `fail()` from `src/lib/api/response.ts`; never build the response by hand.

**Wait for the server before changing the screen.** After a write, call `mutate()` to re-read the list. Do not guess the result and draw it early. It is slightly slower and never shows something that did not happen.

**Server data lives in hooks, not in component state.** `useState` is for things only the screen knows: what is typed in a box, whether a menu is open.

**A form that ends by sending the user to another page uses a server action.** Sign in, sign out and checkout live in an `actions.ts` file and finish with `redirect()`. Everything else uses the path above. Why there are two ways: [decision 03](../decisions/03-api-routes-and-server-actions.md).

## Adding a feature that stores data

1. Table in `src/lib/db/schema.ts`, then migrate ([DATABASE.md](DATABASE.md)).
2. Contract in `src/lib/contracts/` ([TYPES.md](TYPES.md)).
3. Service in `src/lib/services/`.
4. Route in `src/app/api/`.
5. Hook in `src/hooks/`.
6. Component, with all four states ([UI.md](UI.md)).

## Known gaps

None.
