import { SiteHeader } from "@/components/nav/site-header";
import { APP_NAME } from "@/components/nav/nav-items";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">{children}</main>
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        {APP_NAME} shows one trader&rsquo;s personal positions for education. Not financial advice.
      </footer>
    </>
  );
}
