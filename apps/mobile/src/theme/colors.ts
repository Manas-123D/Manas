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

export const dark = {
  background: "#0B1220",
  surface: "#121A2B",
  surfaceRaised: "#1B2438",
  border: "#242F47",
  textPrimary: "#F5F7FB",
  textSecondary: "#9AA6C2",
  textMuted: "#5E6A88",
  success: "#3DDC97",
  warning: "#FFC24B",
  danger: "#FF6B6B",
  ...brand,
};

export const light = {
  background: "#F6F7FB",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  border: "#E4E8F1",
  textPrimary: "#12172B",
  textSecondary: "#4B5573",
  textMuted: "#8891AC",
  success: "#1FA97A",
  warning: "#B9790C",
  danger: "#D9483F",
  ...brand,
};

export type ThemeColors = typeof dark;
