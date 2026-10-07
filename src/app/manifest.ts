import type { MetadataRoute } from "next";

// Lets the site be added to a phone's home screen and open full screen, like an app.
// The iPhone home-screen icon is src/app/apple-icon.png; Android uses the icons below.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harvest the Wheel",
    short_name: "Harvest",
    description: "Follow The Harvester's options wheel trades on the Core Four, as they happen.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#2f5233",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
