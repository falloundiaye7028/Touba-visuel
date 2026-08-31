import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_SIGNATURE, BRAND_TITLE } from "@/lib/brand";

export const alt = BRAND_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", padding: 70, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", background: "radial-gradient(circle at 85% 15%, #0b4b54 0%, #061426 38%, #020b18 100%)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 25, fontWeight: 800, letterSpacing: 3 }}><div style={{ width: 54, height: 54, border: "1px solid #25d6ca", borderRadius: 15, background: "#08243a", color: "#6be9df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>II</div>{BRAND_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", color: "#6be9df", fontSize: 21, letterSpacing: 1.2, fontWeight: 700 }}>{BRAND_SIGNATURE}</div><div style={{ display: "flex", marginTop: 22, maxWidth: 960, fontSize: 68, lineHeight: 1.04, fontWeight: 750, letterSpacing: -3 }}>Gérez votre immobilier. L’intelligence fait le reste.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: "#93aab8" }}><span>Biens · Loyers · CRM · Finance · Maintenance · IA</span><span>intelligenceimmobilier.com</span></div>
    </div>,
    size,
  );
}
