"use client";

import useSWR from "swr";
import { api } from "@/lib/api/client";
import type { Note } from "@/lib/contracts/notes";

// One hook per kind of data. The key is the URL, so every component
// that calls useNotes() shares one copy (docs/rules/DATA_FLOW.md).
export const NOTES_KEY = "/api/notes";

export function useNotes() {
  return useSWR<Note[], Error>(NOTES_KEY, (url: string) => api<Note[]>(url));
}
