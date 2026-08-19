import { useRef, useState } from "react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  lift?: number;
  glow?: string;
}

/** Generic pointer-tracked 3D tilt wrapper: rotates toward the cursor and lifts slightly on hover, with an optional cursor-follow glow. Visual styling (glass, border, radius) comes from whatever classes the call site passes in — this only supplies the motion. Inert on touch (see the `(hover: none)` rule in global.css). */
export function TiltCard({ children, className = "", style, maxTilt = 10, lift = 6, glow, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * maxTilt * 2, y: (px - 0.5) * maxTilt * 2 });
    setGlowPos({ x: px * 100, y: py * 100 });
  }

  function onLeave() {
    setTilt({ x: 0, y: 0 });
    setHovering(false);
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={`tilt-card ${className}`}
      style={{
        ...style,
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovering ? -lift : 0}px)`,
        ...(glow
          ? ({
              "--tilt-glow-x": `${glowPos.x}%`,
              "--tilt-glow-y": `${glowPos.y}%`,
              "--tilt-glow-color": glow,
            } as React.CSSProperties)
          : {}),
      }}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={onLeave}
    >
      {glow && <div className="tilt-card-glow" />}
      <div className="tilt-card-content">{children}</div>
    </div>
  );
}
