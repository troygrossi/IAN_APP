import { requirePageSession } from "@/lib/auth/session";
import { NotesPanel } from "./notes-panel";

export const metadata = { title: "Notes" };

export default async function NotesPage() {
  await requirePageSession();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      <NotesPanel />
    </div>
  );
}
