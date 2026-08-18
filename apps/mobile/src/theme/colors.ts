// NexServ's brand system: deep "night companion" navy as the anchor, a warm
// signal gradient (violet -> coral) reserved for Myra so she always reads as
// distinct from the four service colors.

export const brand = {
  myraStart: "#7C6CF6",
  myraEnd: "#FF7A59",
  ride: "#2FB3A3",
  food: "#FF8A3D",
  meds: "#3D8BFF",
  home: "#9B6BFF",
};

// Two-tone gradients per accent, used on icon glyphs, glows and selected
// states so every surface reads richer than a single flat fill.
export const gradients = {
  myra: [brand.myraStart, brand.myraEnd] as const,
  ride: ["#3BD6C6", "#1D8577"] as const,
  food: ["#FFB25E", "#FF6A3D"] as const,
  meds: ["#5FA8FF", "#3D5FFF"] as const,
  home: ["#B18CFF", "#7C4CFF"] as const,
};

export const dark = {
  background: "#080C16",
  backgroundGlowA: "#241A4A",
  backgroundGlowB: "#2A1220",
  surface: "#121A2B",
  surfaceRaised: "#1B2438",
  border: "#242F47",
  glass: "rgba(255,255,255,0.06)",
  glassRaised: "rgba(255,255,255,0.09)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassHighlight: "rgba(255,255,255,0.22)",
  textPrimary: "#F5F7FB",
  textSecondary: "#9AA6C2",
  textMuted: "#5E6A88",
  success: "#3DDC97",
  warning: "#FFC24B",
  danger: "#FF6B6B",
  ...brand,
};

export const light = {
  background: "#F4F5FB",
  backgroundGlowA: "#E4DEFF",
  backgroundGlowB: "#FFE3D9",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  border: "#E4E8F1",
  glass: "rgba(255,255,255,0.55)",
  glassRaised: "rgba(255,255,255,0.72)",
  glassBorder: "rgba(18,23,43,0.08)",
  glassHighlight: "rgba(255,255,255,0.9)",
  textPrimary: "#12172B",
  textSecondary: "#4B5573",
  textMuted: "#8891AC",
  success: "#1FA97A",
  warning: "#B9790C",
  danger: "#D9483F",
  ...brand,
};

export type ThemeColors = typeof dark;
