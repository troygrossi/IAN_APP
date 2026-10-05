import { desc } from "drizzle-orm";
import type { CreateNoteInput, Note } from "@/lib/contracts/notes";
import { getDb } from "@/lib/db";
import { notes } from "@/lib/db/schema";

type NoteRow = typeof notes.$inferSelect;

const toNote = (row: NoteRow): Note => ({
  id: row.id,
  title: row.title,
  createdAt: row.createdAt.toISOString(),
});

export async function listNotes(): Promise<Note[]> {
  const rows = await getDb().select().from(notes).orderBy(desc(notes.createdAt)).limit(100);
  return rows.map(toNote);
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const [row] = await getDb().insert(notes).values({ title: input.title }).returning();
  return toNote(row);
}
