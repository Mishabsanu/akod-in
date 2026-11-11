import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** Web app manifest: "Add to Home screen" on phones, name and colours in the browser. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Kerala Banana Chips`,
    short_name: "AKOD",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "en-IN",
    categories: ["food", "shopping"],
    icons: [{ src: "/icon.jpg", sizes: "any", type: "image/jpeg" }],
  };
}
