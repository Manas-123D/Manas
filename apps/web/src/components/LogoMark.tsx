import { useId } from "react";

const SPARKLE = "M50,4 C54,30 70,46 96,50 C70,54 54,70 50,96 C46,70 30,54 4,50 C30,46 46,30 50,4 Z";

interface LogoMarkProps {
  size?: number;
}

/** The same gradient sparkle mark used for Myra across the mobile app, reused here so the website and app read as one brand. */
export function LogoMark({ size = 28 }: LogoMarkProps) {
  const uid = useId();
  const gradientId = `logo-mark-${uid}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#4FD2FF" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C061F0" />
        </linearGradient>
      </defs>
      <path d={SPARKLE} fill={`url(#${gradientId})`} />
      <rect x={27} y={42.5} width={46} height={15} rx={7.5} fill="#08060f" opacity={0.88} />
      <rect x={36.5} y={45} width={7} height={10} rx={3.5} fill="#EAFBFF" />
      <rect x={56.5} y={45} width={7} height={10} rx={3.5} fill="#EAFBFF" />
    </svg>
  );
}
