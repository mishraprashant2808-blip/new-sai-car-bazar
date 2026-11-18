import React from "react";

export interface BrandLogoProps {
  className?: string;
}

export function MarutiSuzukiLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="suzukiRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E31837" />
          <stop offset="100%" stopColor="#A30018" />
        </linearGradient>
      </defs>
      {/* Suzuki stylized geometric S badge */}
      <path
        d="M26 15 L74 15 L46 45 L74 45 L74 54 L36 85 L26 85 L54 55 L26 55 Z"
        fill="url(#suzukiRed)"
      />
      <path
        d="M26 15 L66 15 L36 47 L26 47 Z"
        fill="#FF2D4C"
      />
      <path
        d="M74 85 L34 85 L64 53 L74 53 Z"
        fill="#8B0014"
      />
    </svg>
  );
}

export function HyundaiLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="hyundaiBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002C6C" />
          <stop offset="100%" stopColor="#001438" />
        </linearGradient>
      </defs>
      {/* Hyundai slanted ellipse */}
      <ellipse
        cx="50"
        cy="35"
        rx="46"
        ry="30"
        stroke="url(#hyundaiBlue)"
        strokeWidth="6"
        transform="rotate(-5 50 35)"
      />
      {/* Hyundai slanted H bridge */}
      <path
        d="M28 20 C32 20 33 50 33 50 M67 20 C67 20 68 50 72 50 M32 35 C42 32 58 32 68 35"
        stroke="url(#hyundaiBlue)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TataLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="tataBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0072C6" />
          <stop offset="100%" stopColor="#003D7A" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" stroke="url(#tataBlue)" strokeWidth="6" />
      {/* Tata dynamic twin upward curved ribbons */}
      <path
        d="M34 68 C34 40 46 28 50 24 C54 28 66 40 66 68 C62 48 55 38 50 34 C45 38 38 48 34 68 Z"
        fill="url(#tataBlue)"
      />
      <ellipse cx="50" cy="62" rx="10" ry="3.5" fill="url(#tataBlue)" />
    </svg>
  );
}

export function MahindraLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="mahindraChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9142A" />
          <stop offset="100%" stopColor="#800010" />
        </linearGradient>
      </defs>
      {/* Mahindra modern twin peaks / stylized M */}
      <path
        d="M18 72 L38 28 L50 50 L62 28 L82 72 L70 72 L62 48 L50 68 L38 48 L30 72 Z"
        fill="url(#mahindraChrome)"
      />
    </svg>
  );
}

export function KiaLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Kia modern connected wordmark in dark charcoal/black */}
      <path
        d="M10 40 L28 10 M28 40 L18 24 M38 40 L38 10 M50 10 L50 40 L64 40 M64 10 L64 40 M76 40 L86 10 L96 40 M80 28 L92 28"
        stroke="#0F172A"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function ToyotaLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="toyotaRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EB0A1E" />
          <stop offset="100%" stopColor="#A3000E" />
        </linearGradient>
      </defs>
      {/* Outer oval */}
      <ellipse cx="50" cy="35" rx="46" ry="30" stroke="url(#toyotaRed)" strokeWidth="6" />
      {/* Inner horizontal oval */}
      <ellipse cx="50" cy="27" rx="26" ry="11" stroke="url(#toyotaRed)" strokeWidth="5.5" />
      {/* Inner vertical oval */}
      <ellipse cx="50" cy="37" rx="14" ry="24" stroke="url(#toyotaRed)" strokeWidth="5.5" />
    </svg>
  );
}

export function HondaLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="hondaSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
      </defs>
      {/* Framed rounded trapezoid */}
      <path
        d="M12 12 L88 12 C92 12 94 18 92 34 L85 76 C84 82 78 86 72 86 L28 86 C22 86 16 82 15 76 L8 34 C6 18 8 12 12 12 Z"
        stroke="url(#hondaSilver)"
        strokeWidth="6"
      />
      {/* Honda H stylized */}
      <path
        d="M26 24 L35 74 M74 24 L65 74 M32 46 L68 46 M24 24 L36 24 M76 24 L64 24"
        stroke="url(#hondaSilver)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RenaultLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="renaultYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC00" />
          <stop offset="100%" stopColor="#D4A000" />
        </linearGradient>
      </defs>
      {/* Renault iconic geometric diamond */}
      <path
        d="M50 8 L88 50 L50 92 L12 50 Z"
        stroke="url(#renaultYellow)"
        strokeWidth="12"
        strokeLinejoin="miter"
      />
      <path
        d="M50 28 L70 50 L50 72 L30 50 Z"
        fill="#0F172A"
      />
    </svg>
  );
}

export function VolkswagenLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="vwBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001E50" />
          <stop offset="100%" stopColor="#000D26" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" stroke="url(#vwBlue)" strokeWidth="6" />
      {/* V on top */}
      <path
        d="M32 26 L50 62 L68 26 M42 26 L50 44 L58 26"
        stroke="url(#vwBlue)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* W on bottom */}
      <path
        d="M26 50 L42 82 L50 66 L58 82 L74 50"
        stroke="url(#vwBlue)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FordLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="fordBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003478" />
          <stop offset="100%" stopColor="#001C44" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="30" rx="46" ry="26" fill="url(#fordBlue)" stroke="#FFFFFF" strokeWidth="2" />
      <ellipse cx="50" cy="30" rx="43" ry="23" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
      <text
        x="50"
        y="37"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontWeight="bold"
        fontSize="21"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        Ford
      </text>
    </svg>
  );
}

export function getBrandLogoComponent(slug: string): React.ComponentType<BrandLogoProps> {
  const s = slug.toLowerCase().trim();
  if (s.includes("maruti") || s.includes("suzuki")) return MarutiSuzukiLogo;
  if (s.includes("hyundai")) return HyundaiLogo;
  if (s.includes("tata")) return TataLogo;
  if (s.includes("mahindra")) return MahindraLogo;
  if (s.includes("kia")) return KiaLogo;
  if (s.includes("toyota")) return ToyotaLogo;
  if (s.includes("honda")) return HondaLogo;
  if (s.includes("renault")) return RenaultLogo;
  if (s.includes("volkswagen") || s.includes("vw")) return VolkswagenLogo;
  if (s.includes("ford")) return FordLogo;
  return MarutiSuzukiLogo;
}
