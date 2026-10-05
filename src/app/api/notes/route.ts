import { fail, ok } from "@/lib/api/response";
import { requireSession } from "@/lib/auth/session";
import { createNoteInput } from "@/lib/contracts/notes";
import { createNote, listNotes } from "@/lib/services/notes";

// A route does three things: check who is asking, check the input, call one service.

export async function GET() {
  try {
    const { user } = await requireSession();
    return ok(await listNotes(user.id));
  } catch (err) {
    return fail(err, "GET /api/notes");
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireSession();
    const input = createNoteInput.parse(await request.json());
    return ok(await createNote(user.id, input), 201);
  } catch (err) {
    return fail(err, "POST /api/notes");
  }
}
