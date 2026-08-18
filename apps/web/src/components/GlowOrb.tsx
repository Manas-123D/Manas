import type { ReactNode } from "react";
import "./GlowOrb.css";

interface GlowOrbProps {
  size?: number;
  colors: readonly [string, string, ...string[]];
  variant?: "ripple" | "orbit" | "burst";
  children?: ReactNode;
}

/** A large glowing gradient sphere with an animated ring effect behind it — the recurring "product render" visual from the reference video, restyled per-section with each service's brand color. */
export function GlowOrb({ size = 280, colors, variant = "ripple", children }: GlowOrbProps) {
  const coreSize = size * 0.56;
  const gradient = `radial-gradient(circle at 32% 28%, ${colors[colors.length - 1]}, ${colors[0]} 70%)`;

  return (
    <div className={`glow-orb ${variant}`} style={{ width: size, height: size }}>
      <div
        className="glow-orb-core"
        style={{
          width: coreSize,
          height: coreSize,
          background: gradient,
          boxShadow: `0 0 120px ${colors[0]}55, 0 0 60px ${colors[colors.length - 1]}44 inset`,
        }}
      />
      {variant !== "burst" && (
        <>
          <div className="glow-orb-ring r1" style={{ width: coreSize * 1.25, height: coreSize * 1.25 }} />
          <div className="glow-orb-ring r2" style={{ width: coreSize * 1.6, height: coreSize * 1.6 }} />
          <div className="glow-orb-ring r3" style={{ width: coreSize * 1.95, height: coreSize * 1.95 }} />
        </>
      )}
      {variant === "burst" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle, ${colors[0]}33, transparent 65%)`,
            filter: "blur(4px)",
          }}
        />
      )}
      {children}
    </div>
  );
}
