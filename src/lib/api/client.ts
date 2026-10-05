import type { ErrorCode } from "@/lib/errors";
import type { ApiResponse } from "@/lib/api/response";

// The browser's one way to call /api/* (docs/rules/DATA_FLOW.md).
// It unwraps the response envelope: you get the data, or an ApiError is thrown.

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, options: { method?: string; json?: unknown } = {}): Promise<T> {
  let body: ApiResponse<T>;
  try {
    const res = await fetch(path, {
      method: options.method ?? (options.json === undefined ? "GET" : "POST"),
      headers: options.json === undefined ? undefined : { "Content-Type": "application/json" },
      body: options.json === undefined ? undefined : JSON.stringify(options.json),
    });
    body = await res.json();
  } catch {
    throw new ApiError("service-down", "Could not reach the server. Check your connection and try again.");
  }
  if (!body.ok) throw new ApiError(body.error.code, body.error.message);
  return body.data;
}
