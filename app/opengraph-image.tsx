import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "AKOD – Best Kerala banana chips, made in God's Own Country";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share image for links to the store (WhatsApp, Facebook, Google, X). */
export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public", "products", "logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={220} height={159} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 300, color: "#0a0a0a", letterSpacing: -2, lineHeight: 1.05 }}>
              Best Kerala Banana Chips
            </div>
            <div style={{ fontSize: 38, color: "#6b6b6b", marginTop: 18 }}>Made in God&apos;s Own Country · Pure coconut oil</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#0a0a0a" }}>
            <span>www.akod.in</span>
            <span>Delivered across India · Order on WhatsApp</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
