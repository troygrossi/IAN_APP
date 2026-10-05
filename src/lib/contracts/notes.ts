import { z } from "zod";

// What crosses the wire for notes, used by both the server and the browser
// (docs/rules/TYPES.md). Dates travel as text, so `createdAt` is a string here.

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
});
export type Note = z.infer<typeof noteSchema>;

export const createNoteInput = z.object({
  title: z.string().trim().min(1, "Give the note a title.").max(120, "Keep the title under 120 characters."),
});
export type CreateNoteInput = z.infer<typeof createNoteInput>;
