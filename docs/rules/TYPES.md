# Types

A **type** describes the shape of a piece of data, so the editor can catch mistakes before the app runs.

## Rules

**The database schema is the source of truth.** Row types come from it: `typeof notes.$inferSelect`. Do not write the same shape again by hand.

**Check data where it enters the app. Trust it after that.** Anything from outside (a request body, a form, an environment variable) is parsed with a zod schema before use. Inside the app, plain TypeScript types are enough.

**What crosses between browser and server has a contract.** One file per kind of data in `src/lib/contracts/`. It holds the zod schemas and the types made from them with `z.infer`. Both sides import the same file, so they cannot disagree.

**Dates cross as text.** A date becomes a string when it is sent to the browser. The contract says `createdAt: z.string()`, and the service converts with `toISOString()`.

**Types live next to their data.** There is no `types/` folder.

**No `any`.** If the shape really is unknown, use `unknown` and check it.

**Environment variables are read in one place.** `src/lib/env.ts` parses them. Other files import `env` and never read `process.env` themselves.

**Messages in a contract are for the user.** `min(1, "Give the note a title.")` is shown on screen as written ([ERRORS.md](ERRORS.md)).

## Known gaps

None.
