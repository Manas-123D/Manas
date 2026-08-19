import { useEffect, useRef, useState } from "react";
import { GlowOrb } from "./GlowOrb";
import "./OrbitalServices.css";

export interface OrbitalService {
  key: string;
  name: string;
  icon: string;
  color: string;
  colors: readonly [string, string];
  desc: string;
  features: string[];
  stat: { value: string; label: string };
}

interface OrbitalServicesProps {
  services: OrbitalService[];
}

function useNarrowViewport(breakpoint = 760): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return narrow;
}

function ServiceDetailBody({ service }: { service: OrbitalService }) {
  return (
    <>
      <ul className="orbital-card-features">
        {service.features.map((f) => (
          <li key={f}>
            <span className="orbital-card-check" style={{ color: service.color }}>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="orbital-card-stat" style={{ borderColor: `${service.color}33` }}>
        <span className="orbital-card-stat-value" style={{ color: service.color }}>
          {service.stat.value}
        </span>
        <span className="orbital-card-stat-label">{service.stat.label}</span>
      </div>
    </>
  );
}

/** Services arranged on a slowly-rotating orbit around a Myra hub, with a mouse-driven 3D tilt on the whole scene. Hover (or tap) a node to pause the orbit and raise a glass detail card. Below the breakpoint, where hover doesn't apply and the orbit has no room to breathe, this renders a stacked tap-to-expand glass list instead. */
export function OrbitalServices({ services }: OrbitalServicesProps) {
  const isNarrow = useNarrowViewport();
  return isNarrow ? <MobileServiceList services={services} /> : <OrbitalScene services={services} />;
}

function MobileServiceList({ services }: OrbitalServicesProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="orbital-mobile-list">
      {services.map((s) => {
        const isOpen = openKey === s.key;
        return (
          <div key={s.key} className={`orbital-mobile-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="orbital-mobile-head"
              onClick={() => setOpenKey((k) => (k === s.key ? null : s.key))}
              aria-expanded={isOpen}
            >
              <span className="orbital-card-badge" style={{ background: `linear-gradient(145deg, ${s.colors[0]}, ${s.colors[1]})` }}>
                {s.icon}
              </span>
              <span className="orbital-mobile-head-text">
                <span className="orbital-mobile-name">{s.name}</span>
                <span className="orbital-mobile-desc">{s.desc}</span>
              </span>
              <span className="orbital-mobile-chevron" style={{ color: s.color }}>
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="orbital-mobile-body">
                <ServiceDetailBody service={s} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrbitalScene({ services }: OrbitalServicesProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [angle, setAngle] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [radius, setRadius] = useState(200);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardBelow, setCardBelow] = useState(true);

  const focusedKey = activeKey ?? hoveredKey;
  const autoRotate = activeKey === null && hoveredKey === null;

  useEffect(() => {
    if (!focusedKey) return;
    const el = nodeRefs.current[focusedKey];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cardHeight = 320; // rough estimate incl. connector + margin
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setCardBelow(spaceBelow >= cardHeight || spaceBelow >= spaceAbove);
  }, [focusedKey]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setRadius(Math.max(150, Math.min(210, el.clientWidth * 0.34)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setAngle((a) => (a + dt * 0.012) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoRotate]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  }

  function handlePointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      className="orbital-stage"
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => {
        if (e.target === stageRef.current) setActiveKey(null);
      }}
    >
      <div className="orbital-scene" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="orbital-hub">
          <GlowOrb size={128} colors={["#38BDF8", "#7C6CF6", "#B565F0"]} variant="ripple" />
        </div>

        <div className="orbital-ring" />

        {services.map((s, i) => {
          const a = ((i / services.length) * 360 + angle) % 360;
          const rad = (a * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * 0.42 * Math.sin(rad);
          const depth = Math.sin(rad); // -1 (back) .. 1 (front)
          const scale = 0.82 + ((depth + 1) / 2) * 0.36;
          const opacity = 0.55 + ((depth + 1) / 2) * 0.45;
          const zIndex = Math.round(100 + depth * 50);
          const isFocused = focusedKey === s.key;

          return (
            <div
              key={s.key}
              ref={(el) => {
                nodeRefs.current[s.key] = el;
              }}
              className={`orbital-node ${isFocused ? "focused" : ""}`}
              style={{
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${depth * 40}px) scale(${isFocused ? scale * 1.12 : scale})`,
                opacity: isFocused ? 1 : opacity,
                zIndex: isFocused ? 300 : zIndex,
              }}
              onPointerEnter={() => setHoveredKey(s.key)}
              onPointerLeave={() => setHoveredKey((k) => (k === s.key ? null : k))}
              onClick={(e) => {
                e.stopPropagation();
                setActiveKey((k) => (k === s.key ? null : s.key));
              }}
              tabIndex={0}
              onFocus={() => setHoveredKey(s.key)}
              onBlur={() => setHoveredKey((k) => (k === s.key ? null : k))}
            >
              <div
                className="orbital-node-badge"
                style={{
                  background: `linear-gradient(145deg, ${s.colors[0]}, ${s.colors[1]})`,
                  boxShadow: isFocused ? `0 0 0 4px ${s.color}33, 0 18px 40px ${s.color}44` : `0 8px 24px ${s.color}33`,
                }}
              >
                {s.icon}
              </div>
              <div className="orbital-node-label">{s.name}</div>

              {isFocused && (
                <div className={`orbital-card ${cardBelow ? "below" : "above"}`} onClick={(e) => e.stopPropagation()}>
                  <div className="orbital-card-connector" />
                  <div className="orbital-card-head">
                    <span className="orbital-card-badge" style={{ background: `linear-gradient(145deg, ${s.colors[0]}, ${s.colors[1]})` }}>
                      {s.icon}
                    </span>
                    <div>
                      <h3>{s.name}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>

                  <ServiceDetailBody service={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
