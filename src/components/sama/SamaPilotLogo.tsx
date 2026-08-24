import { useId } from "react";

type SamaPilotLogoProps = {
  variant?: "full" | "compact";
  className?: string;
};

export default function SamaPilotLogo({ variant = "full", className = "" }: SamaPilotLogoProps) {
  const compact = variant === "compact";
  const id = useId().replace(/:/g, "");
  const titleId = `sama-pilot-logo-title-${id}`;
  const descriptionId = `sama-pilot-logo-description-${id}`;
  const blueGradientId = `sama-blue-${id}`;
  const greenGradientId = `sama-green-${id}`;
  const goldGradientId = `sama-gold-${id}`;

  return (
    <svg
      viewBox={compact ? "0 0 260 72" : "0 0 760 390"}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>SAMA PILOT</title>
      <desc id={descriptionId}>Votre entreprise dans votre poche</desc>
      <defs>
        <linearGradient id={blueGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#124c9b" />
          <stop offset="1" stopColor="#061c4f" />
        </linearGradient>
        <linearGradient id={greenGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#15b83d" />
          <stop offset="1" stopColor="#006b2e" />
        </linearGradient>
        <linearGradient id={goldGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#ffd428" />
          <stop offset="1" stopColor="#ef8200" />
        </linearGradient>
      </defs>

      {compact ? (
        <>
          <path d="M20 15h44c16 0 27 9 27 21 0 8-5 14-13 17l-25 9h36v-8h18v17H42c-15 0-26-9-26-21 0-8 5-14 14-17l25-9H20z" fill={`url(#${blueGradientId})`} />
          <path d="M74 15h47c20 0 35 12 35 28 0 14-10 24-27 27l-24 4V57l22-3c7-1 11-5 11-11 0-7-6-12-15-12H96z" fill={`url(#${greenGradientId})`} />
          <path d="m83 8 17 17-9 2-10 18-3-18-13-3z" fill={`url(#${greenGradientId})`} />
          <text x="166" y="38" fill="#09285b" fontFamily="Arial, Helvetica, sans-serif" fontSize="27" fontWeight="800">SAMA</text>
          <text x="166" y="64" fill="#078530" fontFamily="Arial, Helvetica, sans-serif" fontSize="23" fontWeight="800">PILOT</text>
        </>
      ) : (
        <>
          <g transform="translate(172 24)">
            <path d="M0 78h142c49 0 83 30 83 70 0 27-17 49-46 59l-81 29h123v-30h57v61H78c-48 0-81-30-81-70 0-27 17-49 47-59l81-29H0z" fill={`url(#${blueGradientId})`} />
            <path d="M177 78h143c65 0 112 39 112 92 0 47-35 81-94 89l-83 12v-58l76-11c23-4 36-17 36-37 0-24-19-40-49-40H243z" fill={`url(#${greenGradientId})`} />
            <path d="m190 0 70 72-39 9-42 76-13-77-55-13z" fill={`url(#${greenGradientId})`} />
            <rect x="315" y="139" width="20" height="55" rx="5" fill="#0f9f38" />
            <rect x="345" y="114" width="20" height="80" rx="5" fill="#8bd000" />
            <rect x="375" y="84" width="20" height="110" rx="5" fill="#ffd200" />
            <rect x="405" y="52" width="20" height="142" rx="5" fill={`url(#${goldGradientId})`} />
          </g>
          <text x="74" y="310" fill="#09285b" fontFamily="Arial, Helvetica, sans-serif" fontSize="92" fontWeight="800" letterSpacing="-4">SAMA</text>
          <text x="358" y="310" fill="#078530" fontFamily="Arial, Helvetica, sans-serif" fontSize="92" fontWeight="800" letterSpacing="-4">PILOT</text>
          <path d="M76 334h100M584 334h100" stroke="#078530" strokeWidth="4" strokeLinecap="round" />
          <text x="380" y="348" fill="#09285b" fontFamily="Arial, Helvetica, sans-serif" fontSize="25" fontWeight="700" letterSpacing="4" textAnchor="middle">VOTRE ENTREPRISE DANS VOTRE POCHE.</text>
          <g transform="translate(90 365)">
            <text x="0" y="0" fill="#078530" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="800">VENDEZ</text>
            <text x="158" y="0" fill="#09285b" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="800">GÉREZ</text>
            <text x="286" y="0" fill="#e88600" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="800">ENCAISSEZ</text>
            <text x="480" y="0" fill="#7020a8" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="800">DÉCIDEZ AVEC L’IA</text>
          </g>
        </>
      )}
    </svg>
  );
}
