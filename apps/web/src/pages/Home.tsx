import { motion } from "framer-motion";
import { Reveal } from "../components/Reveal";
import { GlowOrb } from "../components/GlowOrb";
import { OrbitalServices, type OrbitalService } from "../components/OrbitalServices";
import { TiltCard } from "../components/TiltCard";
import "./Home.css";

const SERVICES: OrbitalService[] = [
  {
    key: "ride",
    name: "NexRide",
    icon: "🚗",
    color: "#2FB3A3",
    colors: ["#1D8577", "#3BD6C6"] as const,
    desc: "Bikes, autos, cabs and pooled rides — matched and priced the moment you open the app.",
    features: ["Live GPS tracking, pickup to drop", "Bike, auto, cab or pooled — you choose", "Fare shown before you book, no surprises"],
    stat: { value: "~3 min", label: "avg match time" },
  },
  {
    key: "food",
    name: "NexFood",
    icon: "🍜",
    color: "#FF8A3D",
    colors: ["#FF6A3D", "#FFB25E"] as const,
    desc: "Restaurants near you, trending picks and reorders Myra already knows you'll like.",
    features: ["Real restaurants, live menus & prices", "Myra remembers your usual order", "Live kitchen-to-door tracking"],
    stat: { value: "40+", label: "restaurants nearby" },
  },
  {
    key: "meds",
    name: "NexMeds",
    icon: "💊",
    color: "#3D8BFF",
    colors: ["#3D5FFF", "#5FA8FF"] as const,
    desc: "Prescription refills and pharmacy delivery, tracked door to door in real time.",
    features: ["Refills without repeating yourself", "Licensed pharmacy partners only", "Delivery tracked door to door"],
    stat: { value: "24/7", label: "refill requests" },
  },
  {
    key: "home",
    name: "NexHome",
    icon: "🛠️",
    color: "#9B6BFF",
    colors: ["#7C4CFF", "#B18CFF"] as const,
    desc: "Vetted electricians, plumbers, cleaners and technicians, booked in a couple of taps.",
    features: ["Verified electricians, plumbers & cleaners", "Upfront pricing before you confirm", "Rated by real NexServ customers"],
    stat: { value: "4.8★", label: "avg technician rating" },
  },
];

const MYRA_FEATURES = [
  { icon: "✦", title: "Context-aware insights", desc: "Myra reads your calendar, traffic and past orders to suggest the right service before you ask." },
  { icon: "⚡", title: "One tap to act", desc: "Every insight comes with an action attached — book, reorder or refill instantly." },
  { icon: "🔒", title: "Private by design", desc: "Your context stays yours. Used only to personalize — never shared outside NexServ." },
];

const STEPS = [
  { title: "Tell Myra what you need", desc: "Type, tap a suggestion, or let Myra notice — a ride to catch, dinner on a long day, a refill due this week.", glow: "#38BDF8" },
  { title: "Get matched instantly", desc: "Real drivers, restaurants, pharmacies and technicians near you, priced and timed live.", glow: "#7C6CF6" },
  { title: "Track it end to end", desc: "One consistent live-tracking view for every service, from request to arrival.", glow: "#B565F0" },
];

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="grid-texture" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="eyebrow">AI-orchestrated everyday services</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
              Life, orchestrated.
            </motion.h1>
            <motion.p className="lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}>
              Rides, food, meds and home help — one app, one AI companion. Myra learns your routines and gets things
              done before you have to ask.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }}>
              <a href="#get-app" className="pill-btn primary">
                Get the app
              </a>
              <a href="#services" className="pill-btn">
                Explore services
              </a>
            </motion.div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">4</div>
                <div className="hero-stat-label">SERVICES, ONE APP</div>
              </div>
              <div>
                <div className="hero-stat-value">1</div>
                <div className="hero-stat-label">AI COMPANION</div>
              </div>
              <div>
                <div className="hero-stat-value">24/7</div>
                <div className="hero-stat-label">ALWAYS ORCHESTRATING</div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
            <TiltCard className="hero-visual" maxTilt={7} lift={0}>
              <GlowOrb size={380} colors={["#38BDF8", "#7C6CF6", "#B565F0"]} variant="ripple" />
              <div className="hero-visual-badge" style={{ top: "8%", left: "4%" }}>
                <span className="dot" style={{ background: "#2FB3A3" }} />
                Ride matched · 3 min
              </div>
              <div className="hero-visual-badge" style={{ bottom: "14%", right: "4%" }}>
                <span className="dot" style={{ background: "#FF8A3D" }} />
                Dinner reorder ready
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Everything, in one place</span>
            <h2>Four services. One consistent experience.</h2>
            <p>Every NexServ service shares the same live tracking, the same trust and the same Myra — hover or tap a service to see what it does.</p>
          </Reveal>

          <Reveal delay={0.1}>
            <OrbitalServices services={SERVICES} />
          </Reveal>
        </div>
      </section>

      <section className="myra-section">
        <div className="container myra-inner">
          <Reveal className="myra-visual">
            <GlowOrb size={340} colors={["#38BDF8", "#7C6CF6", "#B565F0"]} variant="orbit" />
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow">Your AI companion</span>
            <h2 style={{ fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 800, marginTop: 16, lineHeight: 1.15 }}>
              Meet Myra — she doesn't wait to be asked.
            </h2>
            <p style={{ marginTop: 16, color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, maxWidth: 480 }}>
              Myra watches for the moments that matter — a meeting running long, a prescription running low, a
              Friday night pattern — and surfaces the right service, already set up, right when it's useful.
            </p>

            <div className="myra-features">
              {MYRA_FEATURES.map((f) => (
                <TiltCard key={f.title} className="myra-feature glass-panel" maxTilt={6} lift={2} glow="#7C6CF633">
                  <div className="myra-feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">How it works</span>
            <h2>From a thought to it being handled.</h2>
          </Reveal>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <TiltCard className="step-card glass-panel" glow={`${s.glow}33`}>
                  <div className="step-number">STEP {String(i + 1).padStart(2, "0")}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <TiltCard className="cta-band" id="get-app" maxTilt={3} lift={0} glow="#7C6CF622">
          <span className="eyebrow">Available now</span>
          <h2>Bring your everyday services under one roof.</h2>
          <p>Download NexServ and let Myra start learning your routines from day one.</p>
          <div className="cta-actions">
            <a href="#" className="pill-btn primary">
              Download for iOS
            </a>
            <a href="#" className="pill-btn">
              Download for Android
            </a>
          </div>
        </TiltCard>
      </Reveal>
    </>
  );
}
