import { useColorScheme } from "react-native";
import { dark, light, ThemeColors, brand, gradients } from "./colors";
import { spacing, radius, type, shadow } from "./typography";

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
  shadow: typeof shadow;
  isDark: boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme !== "light";
  return { colors: isDark ? dark : light, spacing, radius, type, shadow, isDark };
}

export { brand, gradients };
