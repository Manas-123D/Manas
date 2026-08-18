import React, { useEffect, useId, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from "react-native-svg";

interface MyraOrbProps {
  size?: number;
  active?: boolean; // pulses when Myra is "present" (thinking, or just idle-alive on the chat header)
  /** Show the orbit ring + companion sparkles. Off by default at small sizes where the detail would just be noise. */
  detailed?: boolean;
}

// A four-point "sparkle" silhouette (the same family of shape as the ✦ glyph),
// drawn as a single closed cubic-bezier path on a 0-100 viewBox.
const SPARKLE = "M50,4 C54,30 70,46 96,50 C70,54 54,70 50,96 C46,70 30,54 4,50 C30,46 46,30 50,4 Z";

/**
 * Myra's mark: a gradient sparkle with a small "face" band, inspired by the
 * reference logo (friendly glowing eyes, an orbit ring with a companion
 * planet) but on a cool cyan -> violet -> magenta gradient rather than the
 * reference's warm tips, so Myra never reads as "orange" anywhere in the
 * app. Rendered as SVG so it stays crisp from a 16px tab icon up to an 84px
 * profile avatar, and drawn on a transparent background so it composites
 * cleanly on both themes rather than carrying a fixed black backdrop.
 */
export function MyraOrb({ size = 40, active = true, detailed = size >= 32 }: MyraOrbProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const uid = useId();
  const gradientId = `myra-mark-${uid}`;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active]);

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ scale: pulse }] }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id={gradientId} x1="10%" y1="0%" x2="90%" y2="100%">
              <Stop offset="0%" stopColor="#4FD2FF" />
              <Stop offset="50%" stopColor="#8B5CF6" />
              <Stop offset="100%" stopColor="#C061F0" />
            </LinearGradient>
          </Defs>

          {detailed && (
            <>
              <Ellipse cx={50} cy={50} rx={58} ry={17} rotation={-18} origin="50,50" stroke="rgba(255,255,255,0.45)" strokeWidth={2} fill="none" />
              <Circle cx={12} cy={70} r={4.2} fill={`url(#${gradientId})`} />
              <Path d={SPARKLE} transform="translate(16,18) scale(0.22) translate(-50,-50)" fill={`url(#${gradientId})`} opacity={0.85} />
            </>
          )}

          <Path d={SPARKLE} fill={`url(#${gradientId})`} />

          {/* face */}
          <Rect x={27} y={42.5} width={46} height={15} rx={7.5} fill="#0B0B14" opacity={0.88} />
          <Rect x={36.5} y={45} width={7} height={10} rx={3.5} fill="#EAFBFF" />
          <Rect x={56.5} y={45} width={7} height={10} rx={3.5} fill="#EAFBFF" />
        </Svg>
      </View>
    </Animated.View>
  );
}
