# Structure

Where files go and how they are named.

## The map

| Folder | Holds | Example |
| --- | --- | --- |
| `src/app/` | Pages and API routes. The folder path is the address. | `src/app/(marketing)/pricing/page.tsx` is `/pricing` |
| `src/app/(marketing)/` | Public pages | Home, pricing |
| `src/app/(auth)/` | Sign-in and sign-up pages | `/login` |
| `src/app/(app)/` | Pages that need a signed-in user | `/dashboard` |
| `src/app/api/` | API routes: addresses that return data | `/api/notes` |
| `src/components/ui/` | Small building blocks used everywhere | `button.tsx` |
| `src/components/<area>/` | Components for one area | `components/nav/` |
| `src/hooks/` | Hooks that read data for components | `use-notes.ts` |
| `src/lib/api/` | The response shape and the browser's API caller | `client.ts` |
| `src/lib/contracts/` | The shapes of data that cross between browser and server | `notes.ts` |
| `src/lib/services/` | What the server does with data. The only code that touches the database | `notes.ts` |
| `src/lib/db/` | The database connection and schema | `schema.ts` |
| `src/lib/auth/`, `src/lib/billing/` | Login and payments | `session.ts`, `plans.ts` |
| `src/lib/wheel/` | The wheel strategy: its words, the sample data, and number formatting | `sample-data.ts` |
| The top of the project, `*.cmd` and `*.command` | Double-click files for everyday commands, for Windows and for a Mac. Each only starts an `npm run` command | `Start App.cmd`, `Start App.command` |
| `scripts/` | The commands behind `npm run doctor`, `help`, `sync`, `publish`, `deploy` and `check:docs` | `doctor.mjs` |
| `.github/workflows/` | What GitHub runs by itself after a Publish (save to GitHub) or a Deploy (deploy to Vercel) | `ci.yml` |
| `drizzle/` | Migration files. Generated; never edited by hand | |
| `docs/` | These documents | |

## Rules

**One home per file.** If a new file does not fit a row in the map, add the row to this document first, then add the file.

**A component used by one page lives next to that page.** `notes-panel.tsx` sits in the notes folder. Move a component to `src/components/` when a second page needs it.

**Import with `@/`.** Write `@/lib/errors`, not `../../../lib/errors`. A file in the same folder may use `./`.

## Names

| Thing | Style | Example |
| --- | --- | --- |
| Files and folders | kebab-case | `sign-in-form.tsx` |
| Components | PascalCase | `SignInForm` |
| Hooks | `use` + thing | `useNotes` |
| Service functions | verb + thing | `listNotes`, `createNote` |
| Database tables and columns | snake_case in the database, camelCase in code | `created_at` / `createdAt` |
| Environment variables | SCREAMING_SNAKE | `DATABASE_URL` |
| Yes/no values | Stated positively | `isOpen`, never `isNotClosed` |

Put the unit in the name when a number has one: `pricePerMonthUsd`, `timeoutMs`.

## Known gaps

None.
