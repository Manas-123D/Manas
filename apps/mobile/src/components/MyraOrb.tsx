import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { brand } from "../theme";

interface MyraOrbProps {
  size?: number;
  active?: boolean; // pulses when Myra is "present" (thinking, or just idle-alive on the chat header)
}

/** Myra's visual presence - a living gradient orb instead of a static icon, so she reads as someone in the room rather than a chatbot logo. */
export function MyraOrb({ size = 40, active = true }: MyraOrbProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active]);

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ scale: pulse }] }}>
      <LinearGradient
        colors={[brand.myraStart, brand.myraEnd]}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.orb, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Animated.View style={[styles.shine, { width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, top: size * 0.12, left: size * 0.14 }]} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: { alignItems: "center", justifyContent: "center" },
  shine: { position: "absolute", backgroundColor: "rgba(255,255,255,0.35)" },
});
