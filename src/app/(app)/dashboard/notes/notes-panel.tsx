"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NOTES_KEY, useNotes } from "@/hooks/use-notes";
import { api } from "@/lib/api/client";
import type { Note } from "@/lib/contracts/notes";

// The reference example for a feature that reads and writes data.
// Copy its shape: a hook for reading, api() for writing, and all four states drawn.
export function NotesPanel() {
  const { data: notes, error, isLoading, mutate } = useNotes();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function addNote(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      // Wait for the server to say yes, then refresh the list. Never guess the result.
      await api<Note>(NOTES_KEY, { json: { title } });
      await mutate();
      setTitle("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save the note. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={addNote} className="flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Note title"
          placeholder="Write a note"
          maxLength={120}
          className="min-w-0 flex-1 rounded-md border border-border bg-card px-3 py-2"
        />
        <Button disabled={saving || title.trim() === ""}>{saving ? "Saving…" : "Add note"}</Button>
      </form>
      {saveError && (
        <p role="alert" className="text-sm text-danger">
          {saveError}
        </p>
      )}

      {isLoading && <div className="h-16 animate-pulse rounded-lg bg-muted" aria-busy="true" aria-label="Loading notes" />}

      {error && !notes && (
        <p role="alert" className="rounded-lg border border-border bg-card p-4 text-sm text-danger">
          {error.message}
        </p>
      )}

      {notes?.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          No notes yet. Add your first one above.
        </p>
      )}

      {notes && notes.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
          {notes.map((note) => (
            <li key={note.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <span>{note.title}</span>
              <time dateTime={note.createdAt} className="text-sm text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
