import Image from "next/image";

const LOGO_PATH = "/assets/svg/flip40-text.svg";

const LOGO_DIMENSIONS = { width: 448, height: 110 } as const;

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Image
      src={LOGO_PATH}
      alt="FLIP40"
      width={LOGO_DIMENSIONS.width}
      height={LOGO_DIMENSIONS.height}
      sizes="180px"
      priority
      unoptimized
      className={`brand-logo block object-contain transition-opacity duration-150 hover:opacity-90 ${className}`.trim()}
    />
  );
}
