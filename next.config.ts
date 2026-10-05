import type { NextConfig } from "next";

// Sent with every response (docs/rules/AUTH.md, "Every page is sent with a few protective headers").
const securityHeaders = [
  // No other site may show our pages inside a frame, so a visitor cannot be tricked into clicking through one.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // The browser must not guess a file's type; it uses the one we state.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites learn only our address, never the page a visitor came from.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  // Do not announce which framework runs the site.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
