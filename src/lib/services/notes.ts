import { desc, eq } from "drizzle-orm";
import type { CreateNoteInput, Note } from "@/lib/contracts/notes";
import { getDb } from "@/lib/db";
import { notes } from "@/lib/db/schema";

type NoteRow = typeof notes.$inferSelect;

const toNote = (row: NoteRow): Note => ({
  id: row.id,
  title: row.title,
  createdAt: row.createdAt.toISOString(),
});

// Every function takes the user's id and filters by it. That filter is what keeps
// one person's notes away from another (docs/rules/AUTH.md, "An id in the address proves nothing").

export async function listNotes(userId: string): Promise<Note[]> {
  const rows = await getDb().select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.createdAt)).limit(100);
  return rows.map(toNote);
}

export async function createNote(userId: string, input: CreateNoteInput): Promise<Note> {
  const [row] = await getDb().insert(notes).values({ userId, title: input.title }).returning();
  return toNote(row);
}
