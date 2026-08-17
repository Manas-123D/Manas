import { useColorScheme } from "react-native";
import { dark, light, ThemeColors, brand } from "./colors";
import { spacing, radius, type } from "./typography";

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
  isDark: boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme !== "light";
  return { colors: isDark ? dark : light, spacing, radius, type, isDark };
}

export { brand };
