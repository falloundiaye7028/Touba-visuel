import Image from "next/image";
import { BRAND_NAME, BRAND_SIGNATURE, BRAND_TITLE } from "@/lib/brand";

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
          alt={BRAND_TITLE}
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
          <strong>{BRAND_NAME.split(" ")[0]}</strong>
          <strong>{BRAND_NAME.split(" ")[1]}</strong>
          <small>{BRAND_SIGNATURE}</small>
        </span>
      ) : null}
    </span>
  );
}
