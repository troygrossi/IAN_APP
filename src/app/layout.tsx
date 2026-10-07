import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Harvest the Wheel", template: "%s · Harvest the Wheel" },
  description:
    "Follow The Harvester's options wheel trades on the Core Four, as they happen. Learn how the wheel works. For education, not financial advice.",
  // Added to an iPhone home screen, the site opens full screen under this name (see src/app/manifest.ts).
  appleWebApp: { capable: true, title: "Harvest", statusBarStyle: "default" },
};

// viewportFit "cover" lets the phone tab bar sit above the home indicator (docs/rules/UI.md).
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#131512" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
