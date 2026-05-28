import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  random,
} from "remotion";

// ─── Particle config (deterministic, computed once) ──────────────────────────
const PARTICLE_COUNT = 28;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: random(`px-${i}`) * 100,
  size: 1.5 + random(`ps-${i}`) * 3,
  speed: 0.12 + random(`psp-${i}`) * 0.22,
  phaseOffset: random(`pph-${i}`) * 500,
  wobbleAmp: (random(`pw-${i}`) - 0.5) * 4,
  color: (["#FFD700", "#C9A227", "#FFF8DC", "#FFD700", "#FFFACD"] as const)[
    Math.floor(random(`pc-${i}`) * 5)
  ],
}));

// ─── Lantern positions (overlay on the poster) ───────────────────────────────
const LANTERNS = [
  { x: 78, y: 2, size: 28, delay: 0 },
  { x: 86, y: 0, size: 22, delay: 15 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const EidMoubarakPoster: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fade in from black
  const fadeIn = clamp01(frame / 30);

  // Ken Burns: slow zoom + gentle pan over full duration
  const kbProgress = frame / durationInFrames;
  const scale = 1 + kbProgress * 0.10;
  const panX = -kbProgress * 1.5;
  const panY = -kbProgress * 0.8;

  // Diagonal shine sweep (cycles every 8 s)
  const shinePeriod = fps * 8;
  const shinePhase = (frame % shinePeriod) / shinePeriod;
  const shinePos = interpolate(shinePhase, [0, 1], [-30, 130]);
  const shineAlpha =
    shinePhase < 0.15
      ? shinePhase / 0.15
      : shinePhase > 0.65
      ? 1 - (shinePhase - 0.65) / 0.35
      : 1;

  // Pulse glow on borders
  const glowPulse = (Math.sin(frame * 0.07) + 1) / 2;

  // Lantern sway (pendulum)
  const lanternSway = Math.sin(frame * 0.045) * 6;
  const lanternSway2 = Math.sin(frame * 0.055 + 1.2) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#040d2e", overflow: "hidden" }}>
      {/* ── Poster with Ken Burns ──────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("eid-poster.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* ── Lantern glow overlays (top-right area) ────────────────────── */}
      {LANTERNS.map((ln, idx) => {
        const sway = idx === 0 ? lanternSway : lanternSway2;
        return (
          <AbsoluteFill
            key={idx}
            style={{ pointerEvents: "none", opacity: fadeIn }}
          >
            <div
              style={{
                position: "absolute",
                left: `${ln.x}%`,
                top: `${ln.y}%`,
                width: ln.size,
                height: ln.size * 1.6,
                transformOrigin: "top center",
                transform: `rotate(${sway}deg)`,
                borderRadius: "40% 40% 50% 50%",
                background:
                  "radial-gradient(ellipse at 40% 30%, rgba(255,200,50,0.55) 0%, rgba(255,130,0,0.25) 55%, transparent 80%)",
                filter: "blur(4px)",
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* ── Diagonal gold shine ───────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: fadeIn,
          background: `linear-gradient(
            108deg,
            transparent ${shinePos - 12}%,
            rgba(255,215,0,${0.11 * shineAlpha}) ${shinePos - 2}%,
            rgba(255,255,255,${0.09 * shineAlpha}) ${shinePos + 3}%,
            rgba(255,215,0,${0.11 * shineAlpha}) ${shinePos + 8}%,
            transparent ${shinePos + 20}%
          )`,
        }}
      />

      {/* ── Gold sparkle particles ────────────────────────────────────── */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeIn }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PARTICLES.map((p) => {
            const cycleFrames = Math.round((1 / p.speed) * 55);
            const localF = (frame + p.phaseOffset) % cycleFrames;
            const life = localF / cycleFrames; // 0→1

            const y = 105 - life * 125;
            if (y < -15) return null;

            const x =
              p.x + Math.sin(frame * 0.018 * (p.speed + 0.1) + p.id) * Math.abs(p.wobbleAmp);

            const alpha =
              life < 0.1
                ? life / 0.1
                : life > 0.82
                ? (1 - life) / 0.18
                : 0.8;

            return (
              <g key={p.id} opacity={alpha}>
                <circle cx={x} cy={y} r={p.size * 0.9} fill={p.color} />
                <circle
                  cx={x - p.size * 0.25}
                  cy={y - p.size * 0.28}
                  r={p.size * 0.32}
                  fill="white"
                  opacity={0.65}
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* ── Vignette (cinematic depth) ────────────────────────────────── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: fadeIn * 0.85,
          background:
            "radial-gradient(ellipse at 50% 48%, transparent 52%, rgba(2,7,30,0.55) 100%)",
        }}
      />

      {/* ── Pulsing gold frame glow ───────────────────────────────────── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: fadeIn,
          boxShadow: `inset 0 0 ${38 + glowPulse * 22}px rgba(201,162,39,${
            0.09 + glowPulse * 0.09
          })`,
        }}
      />

      {/* ── Crescent moon shimmer (center-right area) ─────────────────── */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeIn * 0.6 }}>
        <div
          style={{
            position: "absolute",
            left: "52%",
            top: "48%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,215,0,${
              0.15 + glowPulse * 0.12
            }) 0%, transparent 70%)`,
            filter: "blur(8px)",
            transform: `scale(${1 + glowPulse * 0.2})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
