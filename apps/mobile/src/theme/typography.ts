export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };

export const type = {
  hero: { fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.7 },
  display: { fontSize: 30, fontWeight: "700" as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
  micro: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.4 },
};

// Soft, layered elevation - premium apps lean on diffuse shadows rather than
// hard drop shadows. `glow` takes a hex color and returns a tinted shadow for
// brand-colored elements (buttons, selected cards, the Myra orb).
export const shadow = {
  soft: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  raised: { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 28, shadowOffset: { width: 0, height: 14 }, elevation: 10 },
  glow: (color: string, opacity = 0.45) => ({
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  }),
};
