import Link from "next/link";
import { APP_NAME } from "@/components/nav/nav-items";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <Link href="/" className="font-semibold">
        {APP_NAME}
      </Link>
      {children}
    </main>
  );
}
