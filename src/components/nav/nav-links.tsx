"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./nav-items";

/** A row of links with the current page marked. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      {items.map((item) => {
        const current = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
