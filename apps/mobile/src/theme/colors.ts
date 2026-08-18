// NexServ's brand system: deep "night companion" navy as the anchor. Myra's
// identity is a cool cyan -> violet -> magenta gradient (no warm tones -
// those are reserved for the food service color so Myra never reads as
// "orange"), matching her mark (see MyraOrb.tsx). brand.myraStart/myraMid/
// myraEnd are the 3 stops; gradients.myra is the same 3 colors as an array
// for LinearGradient call sites.
export const brand = {
  myraStart: "#38BDF8",
  myraMid: "#7C6CF6",
  myraEnd: "#B565F0",
  ride: "#2FB3A3",
  food: "#FF8A3D",
  meds: "#3D8BFF",
  home: "#9B6BFF",
};

// Two-tone (or three-tone, for Myra) gradients per accent, used on icon
// glyphs, glows and selected states so every surface reads richer than a
// single flat fill.
export const gradients = {
  myra: [brand.myraStart, brand.myraMid, brand.myraEnd] as const,
  ride: ["#3BD6C6", "#1D8577"] as const,
  food: ["#FFB25E", "#FF6A3D"] as const,
  meds: ["#5FA8FF", "#3D5FFF"] as const,
  home: ["#B18CFF", "#7C4CFF"] as const,
};

// Tuned toward a quieter, "system UI" feel - true near-black in dark (like
// OLED system chrome), neutral greys rather than tinted navy, and glass/glow
// dialed back so accent color reads from content (icons, gradients, brand
// moments) rather than from ambient effects layered on every surface.
export const dark = {
  background: "#050506",
  backgroundGlowA: "#1B2A6B",
  backgroundGlowB: "#3A1740",
  surface: "#161618",
  surfaceRaised: "#1E1E21",
  border: "#2A2A2E",
  glass: "rgba(255,255,255,0.05)",
  glassRaised: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.10)",
  glassHighlight: "rgba(255,255,255,0.18)",
  textPrimary: "#F5F5F7",
  textSecondary: "#98989F",
  textMuted: "#636368",
  success: "#32D67A",
  warning: "#FFB340",
  danger: "#FF5C5C",
  ...brand,
};

export const light = {
  background: "#F2F2F6",
  backgroundGlowA: "#E7E1FB",
  backgroundGlowB: "#FDE6DE",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  border: "#E5E5EA",
  glass: "rgba(255,255,255,0.62)",
  glassRaised: "rgba(255,255,255,0.78)",
  glassBorder: "rgba(60,60,67,0.09)",
  glassHighlight: "rgba(255,255,255,0.9)",
  textPrimary: "#1C1C1E",
  textSecondary: "#5C5C63",
  textMuted: "#8E8E93",
  success: "#1EA55B",
  warning: "#B9790C",
  danger: "#D9483F",
  ...brand,
};

export type ThemeColors = typeof dark;
