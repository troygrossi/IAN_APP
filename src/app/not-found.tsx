import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">That address does not exist. It may have moved, or the link is wrong.</p>
      <div>
        <Link href="/" className={buttonClass()}>
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
