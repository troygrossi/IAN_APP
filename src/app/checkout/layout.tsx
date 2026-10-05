import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <Link href="/" aria-label="Harvest the Wheel home">
        <Logo />
      </Link>
      {children}
    </main>
  );
}
