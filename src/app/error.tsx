"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Shown when a page crashes (docs/rules/ERRORS.md). Next.js requires this to be a client component.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">This page could not load</h1>
      <p className="text-muted-foreground">Something went wrong on our side. Try again, or come back in a minute.</p>
      <div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
