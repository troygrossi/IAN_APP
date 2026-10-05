// The app's one error type (docs/rules/ERRORS.md).
// Throw it anywhere on the server; the route's `fail()` turns it into a response.

export const ERROR_STATUS = {
  "bad-input": 400,
  "signed-out": 401,
  "not-found": 404,
  "too-many-tries": 429,
  "service-down": 503,
  unexpected: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_STATUS;

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    /** Shown to the user: say what happened and what to do. */
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
