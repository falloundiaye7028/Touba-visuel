import { ImageResponse } from "next/og";

export const alt = "IMMOTERA — L’intelligence immobilière";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", padding: 72, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", background: "linear-gradient(135deg, #0d2c27 0%, #0e725a 65%, #7e9b34 100%)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, fontWeight: 800, letterSpacing: 4 }}><div style={{ width: 52, height: 52, borderRadius: 14, background: "#d9f45a", color: "#0d2c27", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 27 }}>I</div>IMMOTERA</div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", color: "#d9f45a", fontSize: 21, letterSpacing: 3, fontWeight: 700 }}>L’INTELLIGENCE IMMOBILIÈRE.</div><div style={{ display: "flex", marginTop: 22, maxWidth: 910, fontSize: 68, lineHeight: 1.06, fontWeight: 750, letterSpacing: -3 }}>Pilotez tout votre immobilier depuis un seul espace.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#c6d9d3" }}><span>Biens · Loyers · CRM · Finance · Maintenance</span><span>Sénégal · Afrique francophone</span></div>
    </div>,
    size,
  );
}
