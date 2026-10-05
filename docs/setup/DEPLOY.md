# Setting up GitHub and Vercel

How to connect the project to GitHub and Vercel. You do this once. After that, two commands do everything:

- **Publish (save to GitHub):** `npm run publish -- "what changed"`
- **Deploy (deploy to Vercel):** `npm run deploy`

What those words mean, and the daily routine, are in [WORKFLOW.md](../rules/WORKFLOW.md).

| Service | Its job | Cost to start |
| --- | --- | --- |
| GitHub | Keeps the code and its history | Free |
| Supabase | Hosts the database | Free tier |
| Vercel | Hosts the live site | Free tier |

## Before you start

- `npm run check` passes.
- `npm run build` finishes without errors.
- The database is connected on your computer ([HELP.md](../../HELP.md), section 5).

## 1. Connect GitHub (once)

1. Create an account at https://github.com and make a **new repository**. Make it **Private**. Leave it empty: no README, no .gitignore.
2. Copy the repository address. It looks like `https://github.com/your-name/your-app.git`.
3. In the terminal, give the project that address:
   ```
   git remote add origin https://github.com/your-name/your-app.git
   ```
4. Publish (save to GitHub) for the first time:
   ```
   npm run publish -- "first version"
   ```
   The first publish creates both branches on GitHub: `develop`, where you work, and `main`, which the live site is built from.
5. Look at the repository on GitHub. The files are there, `CLAUDE.md` and `HELP.md` included, and `.env.local` is **not**.
6. On GitHub, open **Settings → General → Default branch** and make sure it is `main`.

## 2. Connect Vercel (once)

1. Create an account at https://vercel.com using **Continue with GitHub**.
2. **Add New → Project**, then choose the repository.
3. Open **Environment Variables** and add each setting from your `.env.local`:
   - `DATABASE_URL`: the same Supabase address.
   - `NEXT_PUBLIC_APP_URL`: the address Vercel gives the site, for example `https://your-app.vercel.app`.
4. Press Vercel's **Deploy** button. This first build takes about two minutes.
5. In the Vercel project, open **Settings → Environments → Production** and check that the branch is `main`.
6. Open the address Vercel shows. Then open `/api/health` on it; it should say the database is connected.

## 3. Give GitHub the database address (once)

After a deploy, GitHub applies database changes to the live database. It needs the address to do that.

1. On GitHub, open the repository, then **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `DATABASE_URL`. Value: the same address as in your `.env.local`.
3. Press **Add secret**. GitHub hides the value from then on, even from you.

Until this is done, the "Update the live database" job fails after every deploy and says so.

## 4. From then on

| You want to… | Run | What happens |
| --- | --- | --- |
| Save your work | `npm run publish -- "what changed"` | Publish (save to GitHub). The `develop` branch on GitHub gets your work. Vercel builds a private preview address for it. The live site does not change. |
| Update the live site | `npm run deploy` | Deploy (deploy to Vercel). `main` moves up to `develop`, and Vercel rebuilds the live site from it. |

- A new setting in `.env.local` must also be added in Vercel, under **Settings → Environment Variables**, before you deploy the code that needs it.
- A new migration is applied to the live database by GitHub after each deploy. See the runs at https://github.com/troygrossi/IAN_APP/actions.

## A second person joining

They get the project with one command, which also puts them on `develop`:

```
git clone -b develop https://github.com/your-name/your-app.git
```

Their full checklist, from a brand-new computer, is [ONBOARDING.md](../../ONBOARDING.md). They need their own `.env.local`; send them the values privately, never through GitHub.

## Before real users

The placeholders must be replaced first. See [AUTH.md](../rules/AUTH.md) and [PAYMENTS.md](../rules/PAYMENTS.md). Also create a second Supabase project so that testing never touches live data.

## Where Railway fits

Railway is not used today ([decision 01](../decisions/01-stack.md)). It becomes useful if the app needs a program that runs all the time, such as a background worker. It would run next to Vercel, not replace it.

## When a deploy fails

`npm run deploy` only hands the work to Vercel. If the live site does not update:

1. Open the project on Vercel and open the newest deployment. Read the **Build Logs**. The first red line is usually the cause.
2. Run `npm run build` on your computer. The same error appears there, where it is easier to fix.
3. Fix it, Publish (save to GitHub), then Deploy (deploy to Vercel) again.
4. A deploy that builds but shows errors on the site is usually a missing environment variable in Vercel.
5. The log ends with **No Output Directory named "public" found**: Vercel does not know this is a Next.js app. In the Vercel project, open **Settings → Build and Deployment** and set **Framework Preset** to **Next.js**. This happens when the project is created on Vercel before the code is on GitHub.
6. The live site asks visitors to log in to Vercel: **Settings → Deployment Protection → Vercel Authentication** is on. Turn it off when the site is meant to be public.
