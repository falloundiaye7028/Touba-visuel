import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ── Palette ────────────────────────────────────────────────────────────────
const VERT = "#07402b";
const VERT2 = "#0a6342";
const OR = "#ffc800";
const ORANGE = "#ff7a2a";
const BLANC = "#ffffff";

const PACK_ITEMS = [
  "1 Banderole 3 m × 0,80 m",
  "1 Kakémono événementiel",
  "50 Badges personnalisés",
  "50 Tee-shirts personnalisés",
  "1 Visuel MAGAL réseaux sociaux",
  "100 Étiquettes bouteilles",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function spr(frame: number, delay = 0, fps = 30) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
}

function fadeIn(frame: number, start: number, dur = 20) {
  return interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Motif géométrique islamique (lignes diagonales en SVG)
function IslamicPattern({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="60" y2="60" stroke={OR} strokeWidth="0.8" />
          <line x1="60" y1="0" x2="0" y2="60" stroke={OR} strokeWidth="0.8" />
          <line x1="30" y1="0" x2="30" y2="60" stroke={OR} strokeWidth="0.4" />
          <line x1="0" y1="30" x2="60" y2="30" stroke={OR} strokeWidth="0.4" />
          <circle cx="30" cy="30" r="8" fill="none" stroke={OR} strokeWidth="0.5" />
          <circle cx="0" cy="0" r="6" fill="none" stroke={OR} strokeWidth="0.4" />
          <circle cx="60" cy="0" r="6" fill="none" stroke={OR} strokeWidth="0.4" />
          <circle cx="0" cy="60" r="6" fill="none" stroke={OR} strokeWidth="0.4" />
          <circle cx="60" cy="60" r="6" fill="none" stroke={OR} strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)" />
    </svg>
  );
}

// Halo lumineux doré
function GoldenHalo({ x, y, r, opacity }: { x: string; y: string; r: number; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${OR}55 0%, transparent 70%)`,
        transform: "translate(-50%, -50%)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Scène 1 : Intro (0–105 frames, 3.5 s) ─────────────────────────────────

function Intro() {
  const frame = useCurrentFrame();

  const logoScale = interpolate(spr(frame, 5), [0, 1], [0.4, 1]);
  const logoOp = fadeIn(frame, 0, 15);

  const mosqueOp = fadeIn(frame, 20, 20);
  const mosqueY = interpolate(spr(frame, 20), [0, 1], [40, 0]);

  const tagOp = fadeIn(frame, 35, 20);
  const tagScale = interpolate(spr(frame, 35), [0, 1], [0.7, 1]);

  const titre1Op = fadeIn(frame, 50, 20);
  const titre1Y = interpolate(spr(frame, 50), [0, 1], [30, 0]);

  const titre2Op = fadeIn(frame, 65, 20);
  const titre2Y = interpolate(spr(frame, 65), [0, 1], [25, 0]);

  const dateOp = fadeIn(frame, 80, 20);

  const pulseScale = interpolate(
    frame % 60,
    [0, 30, 60],
    [1, 1.08, 1],
    { easing: Easing.inOut(Easing.sin), extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${VERT} 0%, #051f15 60%, #000000 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IslamicPattern opacity={0.06} />
      <GoldenHalo x="50%" y="40%" r={380} opacity={0.35} />
      <GoldenHalo x="80%" y="15%" r={200} opacity={0.2} />
      <GoldenHalo x="20%" y="75%" r={180} opacity={0.15} />

      {/* Logo ATV */}
      <div
        style={{
          opacity: logoOp,
          transform: `scale(${logoScale})`,
          marginBottom: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${OR}66`,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 900, color: "#000", letterSpacing: -2 }}>ATV</span>
        </div>
        <span
          style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: 700,
            color: BLANC,
            letterSpacing: 4,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          Agence Touba Visuel
        </span>
      </div>

      {/* Mosquée */}
      <div
        style={{
          opacity: mosqueOp,
          transform: `translateY(${mosqueY}px) scale(${pulseScale})`,
          fontSize: 88,
          lineHeight: 1,
          marginBottom: 20,
          filter: `drop-shadow(0 0 24px ${OR}88)`,
        }}
      >
        🕌
      </div>

      {/* Badge Magal 2026 */}
      <div
        style={{
          opacity: tagOp,
          transform: `scale(${tagScale})`,
          background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
          borderRadius: 50,
          paddingInline: 28,
          paddingBlock: 9,
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 900, color: "#000", letterSpacing: 2, textTransform: "uppercase" }}>
          Magal de Touba 2026
        </span>
      </div>

      {/* Titre principal */}
      <div
        style={{
          opacity: titre1Op,
          transform: `translateY(${titre1Y}px)`,
          textAlign: "center",
          paddingInline: 48,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: BLANC,
            lineHeight: 1.1,
            letterSpacing: -1,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          Votre communication
        </div>
      </div>
      <div
        style={{
          opacity: titre2Op,
          transform: `translateY(${titre2Y}px)`,
          textAlign: "center",
          paddingInline: 48,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -1,
            background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          clé en main.
        </div>
      </div>

      {/* Date */}
      <div style={{ opacity: dateOp, textAlign: "center" }}>
        <span style={{ fontSize: 22, color: `${BLANC}99`, fontWeight: 600, letterSpacing: 1 }}>
          18 Safar 1448 · 2 Août 2026
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ── Scène 2 : Pack Items (105–315 frames, 7 s) ────────────────────────────

function PackItem({ item, index }: { item: string; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 28;

  const s = spr(frame, delay);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-80, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 22,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        borderRadius: 20,
        paddingInline: 28,
        paddingBlock: 20,
        border: `1px solid rgba(255,200,0,0.18)`,
        marginBottom: 16,
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${VERT2}, ${VERT})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 16px ${VERT2}88`,
          border: `2px solid ${OR}44`,
        }}
      >
        <span style={{ fontSize: 22, color: OR, fontWeight: 900 }}>✓</span>
      </div>
      <span style={{ fontSize: 26, fontWeight: 700, color: BLANC, lineHeight: 1.3 }}>{item}</span>
    </div>
  );
}

function PackItems() {
  const frame = useCurrentFrame();

  const titleOp = fadeIn(frame, 0, 20);
  const titleY = interpolate(spr(frame, 0), [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #051f15 0%, ${VERT} 50%, #061a10 100%)`,
        paddingInline: 56,
        paddingTop: 70,
      }}
    >
      <IslamicPattern opacity={0.05} />
      <GoldenHalo x="90%" y="10%" r={250} opacity={0.2} />

      {/* Titre section */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 36,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
            borderRadius: 50,
            paddingInline: 24,
            paddingBlock: 8,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: "#000", letterSpacing: 2, textTransform: "uppercase" }}>
            🔥 Pack Magal 2026
          </span>
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: BLANC, lineHeight: 1.2 }}>
          Ce que vous recevez :
        </div>
      </div>

      {/* Items */}
      {PACK_ITEMS.map((item, i) => (
        <PackItem key={item} item={item} index={i} />
      ))}
    </AbsoluteFill>
  );
}

// ── Scène 3 : Prix (315–405 frames, 3 s) ──────────────────────────────────

function Prix() {
  const frame = useCurrentFrame();

  const bgOp = fadeIn(frame, 0, 15);

  const fireOp = fadeIn(frame, 5, 15);
  const fireScale = interpolate(spr(frame, 5), [0, 1], [0.5, 1]);

  const prixScale = interpolate(spr(frame, 15), [0, 1], [0.3, 1]);
  const prixOp = fadeIn(frame, 15, 20);

  const fcfaOp = fadeIn(frame, 35, 15);
  const fcfaY = interpolate(spr(frame, 35), [0, 1], [20, 0]);

  const subOp = fadeIn(frame, 50, 15);

  // Pulsation du prix
  const pulse = interpolate(
    frame % 45,
    [0, 22, 45],
    [1, 1.04, 1],
    { easing: Easing.inOut(Easing.sin), extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #000000 0%, #0d0d00 50%, #1a0f00 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: bgOp,
      }}
    >
      <IslamicPattern opacity={0.04} />
      <GoldenHalo x="50%" y="50%" r={500} opacity={0.25} />

      {/* Fire + label */}
      <div
        style={{
          opacity: fireOp,
          transform: `scale(${fireScale})`,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 80, lineHeight: 1 }}>🔥</span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
            borderRadius: 50,
            paddingInline: 28,
            paddingBlock: 10,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: "#000", letterSpacing: 2 }}>
            OFFRE SPÉCIALE · PACK COMPLET
          </span>
        </div>
      </div>

      {/* Prix */}
      <div
        style={{
          opacity: prixOp,
          transform: `scale(${prixScale * pulse})`,
          textAlign: "center",
          lineHeight: 0.9,
        }}
      >
        <span
          style={{
            fontSize: 170,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${OR} 0%, ${ORANGE} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -6,
            filter: `drop-shadow(0 0 40px ${OR}66)`,
          }}
        >
          199 999
        </span>
      </div>

      {/* FCFA */}
      <div
        style={{
          opacity: fcfaOp,
          transform: `translateY(${fcfaY}px)`,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: BLANC,
            letterSpacing: 4,
          }}
        >
          FCFA
        </span>
      </div>

      {/* Sous-titre */}
      <div style={{ opacity: subOp, textAlign: "center" }}>
        <span
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: `${BLANC}88`,
            letterSpacing: 2,
          }}
        >
          Tout inclus · Design professionnel · Livraison rapide
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ── Scène 4 : CTA (405–510 frames, 3.5 s) ────────────────────────────────

function CTA() {
  const frame = useCurrentFrame();

  const bg1Op = fadeIn(frame, 0, 20);

  const titleOp = fadeIn(frame, 10, 20);
  const titleY = interpolate(spr(frame, 10), [0, 1], [30, 0]);

  const waOp = fadeIn(frame, 25, 20);
  const waScale = interpolate(spr(frame, 25), [0, 1], [0.7, 1]);

  const tel1Op = fadeIn(frame, 40, 15);
  const tel2Op = fadeIn(frame, 50, 15);

  const footerOp = fadeIn(frame, 65, 20);

  // Pulsation bouton WhatsApp
  const waPulse = interpolate(
    frame % 50,
    [0, 25, 50],
    [1, 1.05, 1],
    { easing: Easing.inOut(Easing.sin), extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${VERT} 0%, #051f15 60%, #000000 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: 60,
        opacity: bg1Op,
      }}
    >
      <IslamicPattern opacity={0.06} />
      <GoldenHalo x="50%" y="30%" r={400} opacity={0.3} />
      <GoldenHalo x="20%" y="80%" r={220} opacity={0.15} />

      {/* Icône mosquée + titre */}
      <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 70, marginBottom: 16, filter: `drop-shadow(0 0 20px ${OR}66)` }}>🕌</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: BLANC, lineHeight: 1.2, marginBottom: 10 }}>
          Préparez votre Magal
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${OR}, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          Commander maintenant
        </div>
      </div>

      {/* Bouton WhatsApp */}
      <div
        style={{
          opacity: waOp,
          transform: `scale(${waScale * waPulse})`,
          width: "100%",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            borderRadius: 24,
            paddingBlock: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            boxShadow: "0 8px 40px rgba(37,211,102,0.4)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill={BLANC}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L0 24l6.335-1.648A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.49-5.17-1.348l-.37-.22-3.762.977.998-3.652-.24-.38A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          <span style={{ fontSize: 32, fontWeight: 900, color: BLANC, letterSpacing: 1 }}>
            Commander sur WhatsApp
          </span>
        </div>
      </div>

      {/* Numéros */}
      <div style={{ width: "100%", marginBottom: 20 }}>
        <div
          style={{
            opacity: tel1Op,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 18,
            paddingBlock: 18,
            textAlign: "center",
            marginBottom: 12,
            border: `1px solid rgba(255,200,0,0.2)`,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: OR, letterSpacing: 2 }}>
            📞 77 800 17 17
          </span>
        </div>
        <div
          style={{
            opacity: tel2Op,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 18,
            paddingBlock: 18,
            textAlign: "center",
            border: `1px solid rgba(255,200,0,0.15)`,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: `${OR}cc`, letterSpacing: 2 }}>
            📞 76 800 17 17
          </span>
        </div>
      </div>

      {/* Footer agence */}
      <div style={{ opacity: footerOp, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid rgba(255,200,0,0.2)`,
            borderRadius: 16,
            paddingInline: 28,
            paddingBlock: 12,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: `${BLANC}80`, letterSpacing: 2 }}>
            📍 Agence Touba Visuel · ATV · Touba, Sénégal
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Composition principale ─────────────────────────────────────────────────

export const MagalPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scène 1 : Intro 0–105 */}
      <Sequence from={0} durationInFrames={105}>
        <Intro />
      </Sequence>

      {/* Scène 2 : Pack Items 105–315 */}
      <Sequence from={105} durationInFrames={210}>
        <PackItems />
      </Sequence>

      {/* Scène 3 : Prix 315–405 */}
      <Sequence from={315} durationInFrames={90}>
        <Prix />
      </Sequence>

      {/* Scène 4 : CTA 405–510 */}
      <Sequence from={405} durationInFrames={105}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
