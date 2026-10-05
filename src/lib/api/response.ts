import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, ERROR_STATUS, type ErrorCode } from "@/lib/errors";

// Every API route answers in this shape (docs/rules/DATA_FLOW.md).
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string } };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ ok: true, data }, { status });
}

/** The only catch a route needs. `where` names the route for the server log. */
export function fail(err: unknown, where: string) {
  let code: ErrorCode = "unexpected";
  let message = "Something went wrong on our side. Please try again.";

  if (err instanceof AppError) {
    code = err.code;
    message = err.message;
  } else if (err instanceof ZodError) {
    code = "bad-input";
    message = err.issues[0]?.message ?? "That input is not valid.";
  } else {
    // Unknown errors may hold secrets, so the user gets the generic message
    // and the detail stays in the server log.
    console.error(`[${where}]`, err);
  }

  return NextResponse.json<ApiResponse<never>>(
    { ok: false, error: { code, message } },
    { status: ERROR_STATUS[code] },
  );
}
