# Errors

What happens when something fails.

## On the server

There is one error type, `AppError`, in `src/lib/errors.ts`. It has a code and a message written for the user.

| Code | Means | Status |
| --- | --- | --- |
| `bad-input` | What was sent is not valid | 400 |
| `signed-out` | Sign in first | 401 |
| `not-found` | That thing does not exist | 404 |
| `too-many-tries` | Slow down and try again later | 429 |
| `service-down` | Something we depend on is not available | 503 |
| `unexpected` | A bug | 500 |

**Throw `AppError` where the problem is found.** Services throw; they do not return error values.

**A route has one `try` and one `catch`.** The catch is `return fail(err, "POST /api/notes")`. `fail()` turns an `AppError` or a zod error into the right response.

**Unknown errors show a generic message.** Their detail may hold secrets, so it goes to the server log and the user sees "Something went wrong on our side."

**Never write an empty `catch`.** If an error is ignored on purpose, the reason is a comment on the same line.

**Add a code only when the screen would act differently.** Six is enough for now.

## On the screen

**Each failure is shown once, next to what failed.** A failed save shows under the form. A failed load shows where the list would be.

**A message says what happened and what to do.** "That does not look like an email address. Check it and try again." Never "Error", never a code, never a stack trace.

**A failed load must not erase what is already on screen.** Show the error only when there is nothing else to show: `error && !data`.

**A crashed page is caught by `src/app/error.tsx`.** It offers "Try again". An address that does not exist shows `src/app/not-found.tsx`.

## Known gaps

- There is no toast (pop-up message) component. All errors are shown inline.
- Errors are logged to the server console only. The live site will want an error tracker.
