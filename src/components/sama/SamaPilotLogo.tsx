type SamaPilotLogoProps = {
  variant?: "full" | "compact";
  className?: string;
};

/** Renders the supplied official SAMA PILOT artwork without redrawing it in CSS or SVG. */
export default function SamaPilotLogo({ variant = "full", className = "" }: SamaPilotLogoProps) {
  return (
    <img
      src="/api/sama/official-logo?v=1"
      alt="SAMA PILOT — Votre entreprise dans votre poche"
      className={`object-contain ${className}`}
      data-variant={variant}
    />
  );
}
