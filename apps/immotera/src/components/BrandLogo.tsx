import Image from "next/image";

type BrandLogoProps = {
  variant?: "full" | "wordmark" | "symbol";
  className?: string;
  priority?: boolean;
  light?: boolean;
};

const logoSource = "/brand/intelligence-immobilier-logo.png";

export function BrandLogo({ variant = "wordmark", className = "", priority = false, light = false }: BrandLogoProps) {
  if (variant === "full") {
    return (
      <span className={`brand-logo-full ${className}`.trim()}>
        <Image
          src={logoSource}
          alt="INTELLIGENCE IMMOBILIER — La plateforme intelligente de gestion immobilière"
          width={1254}
          height={1254}
          priority={priority}
          sizes="(max-width: 760px) 220px, 340px"
        />
      </span>
    );
  }

  return (
    <span className={`brand-signature brand-signature-${variant} ${light ? "is-light" : ""} ${className}`.trim()}>
      <span className="brand-symbol-crop" aria-hidden="true">
        <Image src={logoSource} alt="" fill sizes="48px" priority={priority} />
      </span>
      {variant === "wordmark" ? (
        <span className="brand-wordmark">
          <strong>INTELLIGENCE</strong>
          <strong>IMMOBILIER</strong>
          <small>La plateforme intelligente.</small>
        </span>
      ) : null}
    </span>
  );
}
